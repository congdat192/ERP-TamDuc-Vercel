import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { Upload, X, Check, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { MediaLibraryDialog } from './MediaLibraryDialog';

const schema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên sản phẩm'),
  sku: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'Giá niêm yết phải lớn hơn 0'),
  sale_price: z.number().optional(),
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRelatedIds, setSelectedRelatedIds] = useState<string[]>([]);
  const [relatedProductsSearch, setRelatedProductsSearch] = useState('');
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

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
      setExistingImages(product.image_urls || []);
      setImageFiles([]);
      setImagePreviews([]);
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
      setExistingImages(product.image_urls || []);
      setImageFiles([]);
      setImagePreviews([]);
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
      setExistingImages([]);
      setImageFiles([]);
      setImagePreviews([]);
      setAttributeValues({});
      setSelectedRelatedIds([]);
    }
    setRelatedProductsSearch('');
  }, [product, open, reset]);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + imagePreviews.length + files.length;
    
    if (totalImages > 10) {
      toast.error('Tối đa 10 ảnh');
      return;
    }
    
    setImageFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (url: string) => {
    setExistingImages(prev => prev.filter(u => u !== url));
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
      let newImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        newImageUrls = await lensApi.uploadImages(imageFiles);
      }
      
      const allImageUrls = [...existingImages, ...newImageUrls];
      
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
        const removedImages = (product.image_urls || []).filter(url => !existingImages.includes(url));
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product?.id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Multi-Image Upload */}
          <div className="space-y-2">
            <Label>Hình ảnh sản phẩm</Label>
            
            {existingImages.length > 0 && (
              <div className="grid grid-cols-5 gap-2">
                {existingImages.map((url, index) => (
                  <div key={url} className="relative group">
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                    {index === 0 && <Badge className="absolute top-1 left-1 text-xs">Chính</Badge>}
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                      onClick={() => handleRemoveExistingImage(url)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-5 gap-2">
                {imagePreviews.map((preview, index) => (
                  <div key={preview} className="relative group">
                    <img
                      src={preview}
                      alt={`New ${index + 1}`}
                      className="w-full h-24 object-cover rounded border border-primary"
                    />
                    <Badge className="absolute top-1 left-1 text-xs">Mới</Badge>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                      onClick={() => handleRemoveNewImage(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
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
              Tối đa 10 ảnh. Ảnh đầu tiên sẽ là ảnh đại diện.
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
                      {attr.options.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
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
                          const isChecked = (attributeValues[attr.slug] || []).includes(option);
                          
                          return (
                            <div key={option} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${attr.id}-${option}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  setAttributeValues(prev => {
                                    const currentValues = prev[attr.slug] || [];
                                    return {
                                      ...prev,
                                      [attr.slug]: checked
                                        ? [...currentValues, option]
                                        : currentValues.filter((v: string) => v !== option)
                                    };
                                  });
                                }}
                              />
                              <Label htmlFor={`${attr.id}-${option}`} className="cursor-pointer text-sm">
                                {option}
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
              {isSubmitting ? 'Đang lưu...' : (product ? 'Cập nhật' : 'Tạo mới')}
            </Button>
          </div>
        </form>

        <MediaLibraryDialog
          open={showMediaLibrary}
          onClose={() => setShowMediaLibrary(false)}
          onSelect={(urls) => {
            setExistingImages(prev => [...prev, ...urls]);
            setShowMediaLibrary(false);
          }}
          maxSelection={10 - existingImages.length - imageFiles.length}
          currentImages={existingImages}
        />
      </DialogContent>
    </Dialog>
  );
}
