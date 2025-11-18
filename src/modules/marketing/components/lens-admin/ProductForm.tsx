import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { LensProduct } from '../../types/lens';
import { lensApi } from '../../services/lensApi';
import { toast } from 'sonner';
import { Upload, X, Check, Search, GripVertical } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { MediaLibraryDialog } from './MediaLibraryDialog';
import { SupplyTiersManager } from './SupplyTiersManager';
import { UseCaseScoringManager } from './UseCaseScoringManager';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Types for image management
type ImageItem = {
  id: string;
  url: string;
  file?: File;
  isNew: boolean;
};

// Sortable Image Component
interface SortableImageProps {
  image: ImageItem;
  index: number;
  onRemove: (id: string) => void;
}

function SortableImage({ image, index, onRemove }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(image.id);
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <img
        src={image.url}
        alt={`Product ${index + 1}`}
        className="w-full h-24 object-cover rounded border"
      />
      {index === 0 && (
        <Badge className="absolute top-1 left-1 text-xs z-10">Chính</Badge>
      )}
      {image.isNew && (
        <Badge className="absolute bottom-1 left-1 text-xs bg-primary z-10">Mới</Badge>
      )}
      <div
        className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
      </div>
      <button
        type="button"
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 h-6 w-6 p-0 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 flex items-center justify-center transition-opacity z-20"
        onClick={handleRemoveClick}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

const schema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên sản phẩm'),
  sku: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'Giá niêm yết phải lớn hơn 0'),
  sale_price: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number().positive("Giá giảm phải lớn hơn 0").optional()
  ),
  is_promotion: z.boolean(),
  promotion_text: z.string().optional(),
  is_active: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface ProductFormProps {
  open: boolean;
  product: LensProduct | null;
  onClose: (success?: boolean) => void;
}

export function ProductForm({ open, product, onClose }: ProductFormProps) {
  const [attributeValues, setAttributeValues] = useState<Record<string, string[]>>({});
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRelatedIds, setSelectedRelatedIds] = useState<string[]>([]);
  const [relatedProductsSearch, setRelatedProductsSearch] = useState('');
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: attributes = [] } = useQuery({
    queryKey: ['lens-attributes'],
    queryFn: () => lensApi.getAttributes(),
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ['all-lens-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lens_products')
        .select('id, name, image_urls, price, sale_price, attributes')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data || [];
    },
  });

  const availableProducts = useMemo(() => {
    return allProducts.filter(p => {
      if (product && p.id === product.id) return false;
      if (relatedProductsSearch) {
        return p.name.toLowerCase().includes(relatedProductsSearch.toLowerCase());
      }
      return true;
    });
  }, [allProducts, product, relatedProductsSearch]);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      is_promotion: false,
      is_active: true,
      price: 0,
    },
  });

  const isPromotion = watch('is_promotion');
  const price = watch('price');
  const salePrice = watch('sale_price');
  
  const discountPercent = useMemo(() => {
    if (!salePrice || !price || salePrice >= price) return null;
    return Math.round((1 - salePrice / price) * 100);
  }, [price, salePrice]);

  useEffect(() => {
    if (product && product.id) {
      // Edit mode: Load existing product data
      reset({
        name: product.name,
        sku: product.sku || '',
        description: product.description || '',
        price: product.price,
        sale_price: product.sale_price || undefined,
        is_promotion: product.is_promotion,
        promotion_text: product.promotion_text || '',
        is_active: product.is_active,
      });
      const existingImageItems: ImageItem[] = (product.image_urls || []).map((url, index) => ({
        id: `existing-${index}-${Date.now()}`,
        url,
        isNew: false,
      }));
      setImages(existingImageItems);
      setAttributeValues(product.attributes || {});
      setSelectedRelatedIds(product.related_product_ids || []);
    } else if (product && !product.id) {
      // Clone mode: Load data from cloned product
      reset({
        name: product.name,
        sku: product.sku || '',
        description: product.description || '',
        price: product.price,
        sale_price: product.sale_price || undefined,
        is_promotion: product.is_promotion,
        promotion_text: product.promotion_text || '',
        is_active: product.is_active,
      });
      const existingImageItems: ImageItem[] = (product.image_urls || []).map((url, index) => ({
        id: `existing-${index}-${Date.now()}`,
        url,
        isNew: false,
      }));
      setImages(existingImageItems);
      setAttributeValues(product.attributes || {});
      setSelectedRelatedIds(product.related_product_ids || []);
    } else if (open) {
      // Create mode: Reset form
      reset({
        name: '',
        sku: '',
        description: '',
        is_promotion: false,
        is_active: true,
        price: 0,
        sale_price: undefined,
        promotion_text: '',
      });
      setImages([]);
      setAttributeValues({});
      setSelectedRelatedIds([]);
    }
    setRelatedProductsSearch('');
  }, [product, open, reset]);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = images.length + files.length;

    if (totalImages > 10) {
      toast.error('Tối đa 10 ảnh');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage: ImageItem = {
          id: `new-${Date.now()}-${Math.random()}`,
          url: reader.result as string,
          file,
          isNew: true,
        };
        setImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setImages((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const onSubmit = async (data: FormData) => {
    if (data.sale_price && data.sale_price >= data.price) {
      toast.error('Giá giảm phải nhỏ hơn giá niêm yết');
      return;
    }

    // Clean empty attributes
    const cleanedAttributes: Record<string, string[]> = {};
    Object.entries(attributeValues).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        cleanedAttributes[key] = value;
      }
    });

    setIsSubmitting(true);
    try {
      // Separate existing and new images
      const existingImageUrls = images.filter(img => !img.isNew).map(img => img.url);
      const newImageFiles = images.filter(img => img.isNew && img.file).map(img => img.file!);

      // Upload new images
      let uploadedUrls: string[] = [];
      if (newImageFiles.length > 0) {
        uploadedUrls = await lensApi.uploadImages(newImageFiles);
      }

      // Build final image URLs array in the correct order
      const allImageUrls: string[] = [];
      let uploadedIndex = 0;

      images.forEach(img => {
        if (img.isNew) {
          // Replace preview URL with uploaded URL
          if (uploadedUrls[uploadedIndex]) {
            allImageUrls.push(uploadedUrls[uploadedIndex]);
            uploadedIndex++;
          }
        } else {
          // Keep existing URL
          allImageUrls.push(img.url);
        }
      });

      const productData = {
        name: data.name,
        sku: data.sku?.trim() || null,
        description: data.description?.trim() || null,
        price: data.price,
        sale_price: data.sale_price || null,
        discount_percent: discountPercent,
        is_promotion: data.is_promotion,
        promotion_text: data.promotion_text?.trim() || null,
        is_active: data.is_active,
        image_urls: allImageUrls,
        attributes: cleanedAttributes,
        related_product_ids: selectedRelatedIds,
        created_by: product?.created_by || undefined,
      };

      if (product?.id) {
        // Delete removed images
        const removedImages = (product.image_urls || []).filter(url => !existingImageUrls.includes(url));
        await Promise.all(removedImages.map(url => lensApi.deleteImage(url).catch(() => {})));

        await lensApi.updateProduct(product.id, productData as any);
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        await lensApi.createProduct(productData as any);
        toast.success('Tạo sản phẩm thành công');
      }

      onClose(true);
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product?.id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</DialogTitle>
          <DialogDescription>
            {product?.id 
              ? 'Cập nhật thông tin sản phẩm, tầng cung ứng và use cases' 
              : 'Tạo sản phẩm mới với thông tin chi tiết'}
          </DialogDescription>
        </DialogHeader>

        {product?.id ? (
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="tiers">Tầng cung ứng</TabsTrigger>
              <TabsTrigger value="usecases">Use Cases</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Draggable Image Gallery */}
          <div className="space-y-3">
            <Label>Hình ảnh sản phẩm</Label>

            {images.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={images.map(img => img.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  <div className="grid grid-cols-5 gap-2">
                    {images.map((image, index) => (
                      <SortableImage
                        key={image.id}
                        image={image}
                        index={index}
                        onRemove={handleRemoveImage}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMediaLibrary(true)}
                className="flex-1"
              >
                <Search className="w-4 h-4 mr-2" />
                Chọn từ thư viện
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload ảnh mới
              </Button>
            </div>

            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImagesChange}
            />

            <p className="text-xs text-muted-foreground">
              Tối đa 10 ảnh. Kéo thả để sắp xếp thứ tự. Ảnh đầu tiên sẽ là ảnh đại diện.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tên sản phẩm *</Label>
              <Input {...register('name')} />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label>SKU</Label>
              <Input {...register('sku')} placeholder="RODEN-CM-156" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Giá niêm yết * (VD: 1,000,000)</Label>
              <Input type="number" {...register('price', { valueAsNumber: true })} />
              {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <Label>Giá giảm (để trống nếu không KM)</Label>
              <Input 
                type="number" 
                {...register('sale_price', { valueAsNumber: true })} 
                placeholder="VD: 800,000"
              />
              {errors.sale_price && (
                <p className="text-sm text-destructive mt-1">{errors.sale_price.message}</p>
              )}
              {discountPercent && (
                <p className="text-xs text-green-600 mt-1 font-semibold">
                  ⚡ Giảm {discountPercent}%
                </p>
              )}
            </div>
          </div>

          <div>
            <Label>Mô tả</Label>
            <Textarea {...register('description')} rows={3} />
          </div>

          {/* Select Attributes */}
          <div className="grid grid-cols-2 gap-4">
            {attributes
              .filter(attr => attr.type === 'select')
              .map(attr => (
                <div key={attr.id}>
                  <Label>
                    {attr.icon && <span className="mr-2">{attr.icon}</span>}
                    {attr.name}
                  </Label>
                  <Select 
                    onValueChange={(v) => {
                      setAttributeValues(prev => ({
                        ...prev,
                        [attr.slug]: [v]
                      }));
                    }}
                    value={attributeValues[attr.slug]?.[0] || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Chọn ${attr.name.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {attr.options.map(option => {
                        const opt = typeof option === 'string' ? { value: option, label: option } : option;
                        return (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              ))}
          </div>

          {/* Multiselect Attributes */}
          {attributes.filter(attr => attr.type === 'multiselect').length > 0 && (
            <div>
              <Label>Tính năng (chọn nhiều)</Label>
              <div className="mt-2 space-y-4">
                {attributes
                  .filter(attr => attr.type === 'multiselect')
                  .map(attr => (
                    <div key={attr.id}>
                      <Label className="font-semibold mb-2 flex items-center">
                        {attr.icon} {attr.name}
                      </Label>
                      <div className="grid grid-cols-2 gap-2 pl-6">
                        {attr.options.map(option => {
                          const opt = typeof option === 'string' ? { value: option, label: option } : option;
                          const isChecked = (attributeValues[attr.slug] || []).includes(opt.value);
                          
                          return (
                            <div key={opt.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${attr.id}-${opt.value}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  setAttributeValues(prev => {
                                    const currentValues = prev[attr.slug] || [];
                                    return {
                                      ...prev,
                                      [attr.slug]: checked
                                        ? [...currentValues, opt.value]
                                        : currentValues.filter((v: string) => v !== opt.value)
                                    };
                                  });
                                }}
                              />
                              <Label htmlFor={`${attr.id}-${opt.value}`} className="cursor-pointer text-sm">
                                {opt.label}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              checked={isPromotion}
              onCheckedChange={(checked) => {
                const event = { target: { name: 'is_promotion', value: checked } };
                register('is_promotion').onChange(event);
              }}
            />
            <Label>Đang khuyến mãi</Label>
          </div>

          {isPromotion && (
            <div>
              <Label>Nội dung khuyến mãi</Label>
              <Input {...register('promotion_text')} placeholder="VD: Tặng kèm khăn lau kính" />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              defaultChecked={true}
              checked={watch('is_active')}
              onCheckedChange={(checked) => {
                const event = { target: { name: 'is_active', value: checked } };
                register('is_active').onChange(event);
              }}
            />
            <Label>Hiển thị sản phẩm</Label>
          </div>

          {/* Related Products */}
          <div>
            <Label>Sản phẩm liên quan (tối đa 4)</Label>
            <ScrollArea className="h-64 border rounded-lg p-4 mt-2">
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={relatedProductsSearch}
                onChange={(e) => setRelatedProductsSearch(e.target.value)}
                className="mb-4"
              />
              <div className="space-y-2">
                {availableProducts.map((p: any) => {
                  const isSelected = selectedRelatedIds.includes(p.id);
                  const canSelect = selectedRelatedIds.length < 4 || isSelected;

                  return (
                    <div
                      key={p.id}
                      className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                        isSelected ? 'bg-green-50' : canSelect ? 'hover:bg-accent' : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => {
                        if (!canSelect && !isSelected) return;
                        setSelectedRelatedIds(prev =>
                          prev.includes(p.id)
                            ? prev.filter(id => id !== p.id)
                            : [...prev, p.id]
                        );
                      }}
                    >
                      <div className="w-4 h-4 flex items-center justify-center">
                        {isSelected && <Check className="w-4 h-4 text-green-600" />}
                      </div>
                      {p.image_urls?.[0] && (
                        <img src={p.image_urls[0]} alt={p.name} className="w-12 h-12 object-cover rounded" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.sale_price 
                            ? `${p.sale_price.toLocaleString()}₫` 
                            : `${p.price.toLocaleString()}₫`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <p className="text-xs text-muted-foreground mt-1">
              Đã chọn: {selectedRelatedIds.length}/4
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onClose()} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Đang lưu...' : 'Cập nhật'}
            </Button>
          </div>
        </form>
            </TabsContent>

            <TabsContent value="tiers" className="mt-4">
              <SupplyTiersManager productId={product.id} />
            </TabsContent>

            <TabsContent value="usecases" className="mt-4">
              <UseCaseScoringManager productId={product.id} />
            </TabsContent>
          </Tabs>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Draggable Image Gallery */}
          <div className="space-y-3">
            <Label>Hình ảnh sản phẩm</Label>

            {images.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={images.map(img => img.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  <div className="grid grid-cols-5 gap-2">
                    {images.map((image, index) => (
                      <SortableImage
                        key={image.id}
                        image={image}
                        index={index}
                        onRemove={handleRemoveImage}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMediaLibrary(true)}
                className="flex-1"
              >
                <Search className="w-4 h-4 mr-2" />
                Chọn từ thư viện
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload ảnh mới
              </Button>
            </div>

            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImagesChange}
            />

            <p className="text-xs text-muted-foreground">
              Tối đa 10 ảnh. Kéo thả để sắp xếp thứ tự. Ảnh đầu tiên sẽ là ảnh đại diện.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tên sản phẩm *</Label>
              <Input {...register('name')} />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label>SKU</Label>
              <Input {...register('sku')} placeholder="RODEN-CM-156" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Giá niêm yết * (VD: 1,000,000)</Label>
              <Input type="number" {...register('price', { valueAsNumber: true })} />
              {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <Label>Giá giảm (để trống nếu không KM)</Label>
              <Input 
                type="number" 
                {...register('sale_price', { valueAsNumber: true })} 
                placeholder="VD: 800,000"
              />
              {errors.sale_price && (
                <p className="text-sm text-destructive mt-1">{errors.sale_price.message}</p>
              )}
              {discountPercent && (
                <p className="text-xs text-green-600 mt-1 font-semibold">
                  ⚡ Giảm {discountPercent}%
                </p>
              )}
            </div>
          </div>

          <div>
            <Label>Mô tả</Label>
            <Textarea {...register('description')} rows={3} />
          </div>

          {/* Select Attributes */}
          <div className="grid grid-cols-2 gap-4">
            {attributes
              .filter(attr => attr.type === 'select')
              .map(attr => (
                <div key={attr.id}>
                  <Label>
                    {attr.icon && <span className="mr-2">{attr.icon}</span>}
                    {attr.name}
                  </Label>
                  <Select 
                    onValueChange={(v) => {
                      setAttributeValues(prev => ({
                        ...prev,
                        [attr.slug]: [v]
                      }));
                    }}
                    value={attributeValues[attr.slug]?.[0] || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Chọn ${attr.name.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {attr.options.map(option => {
                        const opt = typeof option === 'string' ? { value: option, label: option } : option;
                        return (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              ))}
          </div>

          {/* Multiselect Attributes */}
          {attributes.filter(attr => attr.type === 'multiselect').length > 0 && (
            <div>
              <Label>Tính năng (chọn nhiều)</Label>
              <div className="mt-2 space-y-4">
                {attributes
                  .filter(attr => attr.type === 'multiselect')
                  .map(attr => (
                    <div key={attr.id}>
                      <Label className="font-semibold mb-2 flex items-center">
                        {attr.icon} {attr.name}
                      </Label>
                      <div className="grid grid-cols-2 gap-2 pl-6">
                        {attr.options.map(option => {
                          const opt = typeof option === 'string' ? { value: option, label: option } : option;
                          const isChecked = (attributeValues[attr.slug] || []).includes(opt.value);
                          
                          return (
                            <div key={opt.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${attr.id}-${opt.value}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  setAttributeValues(prev => {
                                    const currentValues = prev[attr.slug] || [];
                                    return {
                                      ...prev,
                                      [attr.slug]: checked
                                        ? [...currentValues, opt.value]
                                        : currentValues.filter((v: string) => v !== opt.value)
                                    };
                                  });
                                }}
                              />
                              <Label htmlFor={`${attr.id}-${opt.value}`} className="cursor-pointer text-sm">
                                {opt.label}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Promotion Settings */}
          <div className="space-y-4 p-4 border rounded-lg bg-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold">Đánh dấu khuyến mãi</Label>
                <p className="text-sm text-muted-foreground">Hiển thị badge HOT trên sản phẩm</p>
              </div>
              <Switch
                checked={isPromotion}
                onCheckedChange={(checked) => {
                  const event = {
                    target: { name: 'is_promotion', value: checked }
                  } as any;
                  register('is_promotion').onChange(event);
                }}
              />
            </div>

            {isPromotion && (
              <div>
                <Label>Text khuyến mãi (tùy chọn)</Label>
                <Input
                  {...register('promotion_text')}
                  placeholder="VD: Giảm 20% cuối tuần"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Nếu để trống sẽ hiện badge HOT
                </p>
              </div>
            )}
          </div>

          {/* Related Products Section */}
          <div className="space-y-3 p-4 border rounded-lg">
            <Label className="text-base font-semibold">Sản phẩm liên quan (tùy chọn)</Label>
            
            <div className="flex items-center gap-2">
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={relatedProductsSearch}
                onChange={(e) => setRelatedProductsSearch(e.target.value)}
              />
            </div>

            {selectedRelatedIds.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-accent/20 rounded">
                {allProducts
                  .filter(p => selectedRelatedIds.includes(p.id))
                  .map(product => (
                    <Badge key={product.id} variant="secondary" className="gap-2">
                      {product.name}
                      <button
                        type="button"
                        onClick={() => setSelectedRelatedIds(prev => prev.filter(id => id !== product.id))}
                        className="hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
              </div>
            )}

            <ScrollArea className="h-48 border rounded">
              <div className="p-2 space-y-1">
                {availableProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Không tìm thấy sản phẩm
                  </p>
                ) : (
                  availableProducts.map(p => {
                    const isSelected = selectedRelatedIds.includes(p.id);
                    const brand = (p.attributes as any)?.lens_brand?.[0];
                    
                    return (
                      <div
                        key={p.id}
                        className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-accent ${
                          isSelected ? 'bg-accent' : ''
                        }`}
                        onClick={() => {
                          setSelectedRelatedIds(prev =>
                            isSelected
                              ? prev.filter(id => id !== p.id)
                              : [...prev, p.id]
                          );
                        }}
                      >
                        {p.image_urls?.[0] && (
                          <img
                            src={p.image_urls[0]}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {brand || 'Không có thương hiệu'} • {p.price.toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Status Switch */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="text-base font-semibold">Trạng thái hoạt động</Label>
              <p className="text-sm text-muted-foreground">Cho phép hiển thị sản phẩm trên website</p>
            </div>
            <Switch
              checked={watch('is_active')}
              onCheckedChange={(checked) => {
                const event = {
                  target: { name: 'is_active', value: checked }
                } as any;
                register('is_active').onChange(event);
              }}
            />
          </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onClose()} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Đang lưu...' : 'Tạo mới'}
              </Button>
            </div>
          </form>
        )}

        <MediaLibraryDialog
          open={showMediaLibrary}
          onClose={() => setShowMediaLibrary(false)}
          onSelect={(urls) => {
            const newImageItems: ImageItem[] = urls.map((url, index) => ({
              id: `library-${Date.now()}-${index}`,
              url,
              isNew: false,
            }));
            setImages(prev => [...prev, ...newImageItems]);
            setShowMediaLibrary(false);
          }}
          maxSelection={10 - images.length}
          currentImages={images.map(img => img.url)}
        />
      </DialogContent>
    </Dialog>
  );
}
