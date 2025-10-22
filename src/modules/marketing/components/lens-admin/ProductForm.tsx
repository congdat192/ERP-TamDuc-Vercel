import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LensProduct, LensBrand, LensFeature, LensProductAttribute, LensProductVariant, CreateVariantInput } from '../../types/lens';
import { lensApi } from '../../services/lensApi';
import { toast } from 'sonner';
import { Upload, X, Plus, Trash2, Box, Grid3x3 } from 'lucide-react';
import { VariantsTable } from './VariantsTable';

const schema = z.object({
  brand_id: z.string().min(1, 'Vui lòng chọn thương hiệu'),
  name: z.string().min(1, 'Vui lòng nhập tên sản phẩm'),
  product_type: z.enum(['simple', 'variable']),
  base_sku: z.string().optional(),
  sku: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'Giá phải lớn hơn 0'),
  material: z.string().optional(),
  refractive_index: z.string().optional(),
  origin: z.string().optional(),
  warranty_months: z.number().optional(),
  is_promotion: z.boolean(),
  promotion_text: z.string().optional(),
  is_active: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface ProductFormProps {
  open: boolean;
  product: LensProduct | null;
  brands: LensBrand[];
  features: LensFeature[];
  onClose: (success?: boolean) => void;
}

export function ProductForm({ open, product, brands, features, onClose }: ProductFormProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Variable product states
  const [attributes, setAttributes] = useState<LensProductAttribute[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [variants, setVariants] = useState<(LensProductVariant & { _isNew?: boolean })[]>([]);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      product_type: 'simple',
      is_promotion: false,
      is_active: true,
      price: 0,
    },
  });

  const productType = watch('product_type');
  const isPromotion = watch('is_promotion');

  // Load attributes on mount
  useEffect(() => {
    if (open) {
      lensApi.getAttributes().then(setAttributes).catch(err => {
        toast.error('Lỗi tải attributes: ' + err.message);
      });
    }
  }, [open]);

  // Load product data
  useEffect(() => {
    if (product) {
      reset({
        brand_id: product.brand_id,
        name: product.name,
        product_type: product.product_type || 'simple',
        base_sku: product.base_sku || '',
        sku: product.sku || '',
        description: product.description || '',
        price: product.price,
        material: product.material || '',
        refractive_index: product.refractive_index || '',
        origin: product.origin || '',
        warranty_months: product.warranty_months || undefined,
        is_promotion: product.is_promotion,
        promotion_text: product.promotion_text || '',
        is_active: product.is_active,
      });
      setExistingImages(product.image_urls || []);
      setImageFiles([]);
      setImagePreviews([]);
      setSelectedFeatures(product.features?.map(f => f.id) || []);

      // Load variants if variable product
      if (product.product_type === 'variable') {
        lensApi.getVariantsByProductId(product.id).then(setVariants).catch(err => {
          toast.error('Lỗi tải variants: ' + err.message);
        });
      }
    } else {
      reset({
        product_type: 'simple',
        is_promotion: false,
        is_active: true,
        price: 0,
      });
      setExistingImages([]);
      setImageFiles([]);
      setImagePreviews([]);
      setSelectedFeatures([]);
      setVariants([]);
      setSelectedAttributes([]);
    }
  }, [product, reset]);

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

  // Generate all variant combinations from selected attributes
  const handleGenerateVariants = () => {
    if (selectedAttributes.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 thuộc tính');
      return;
    }

    const selectedAttrs = attributes.filter(a => selectedAttributes.includes(a.id));
    const combinations: Record<string, string>[] = [];

    const generate = (index: number, current: Record<string, string>) => {
      if (index === selectedAttrs.length) {
        combinations.push({ ...current });
        return;
      }
      
      const attr = selectedAttrs[index];
      attr.options.forEach(option => {
        generate(index + 1, { ...current, [attr.slug]: option });
      });
    };

    generate(0, {});

    const newVariants = combinations.map((attrs, idx) => {
      const variantName = Object.values(attrs).join(' - ');
      return {
        id: `temp-${Date.now()}-${idx}`,
        product_id: product?.id || '',
        sku: '',
        variant_name: variantName,
        attributes: attrs,
        price: 0,
        stock_quantity: 0,
        image_urls: [],
        is_active: true,
        display_order: idx,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        _isNew: true,
      };
    });

    setVariants(newVariants);
    toast.success(`Đã tạo ${newVariants.length} biến thể`);
  };

  const handleVariantChange = (index: number, field: keyof LensProductVariant, value: any) => {
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));
  };

  const handleDeleteVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Upload images
      let newImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        newImageUrls = await lensApi.uploadImages(imageFiles);
      }
      
      const allImageUrls = [...existingImages, ...newImageUrls];
      
      const productData = {
        ...data,
        image_urls: allImageUrls,
        created_by: product?.created_by || undefined,
      };

      let productId: string;

      if (product) {
        // Update existing product
        const removedImages = (product.image_urls || []).filter(url => !existingImages.includes(url));
        await Promise.all(removedImages.map(url => lensApi.deleteImage(url).catch(() => {})));
        
        await lensApi.updateProduct(product.id, productData as any);
        await lensApi.linkProductFeatures(product.id, selectedFeatures);
        productId = product.id;
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        // Create new product
        const newProduct = await lensApi.createProduct(productData as any);
        await lensApi.linkProductFeatures(newProduct.id, selectedFeatures);
        productId = newProduct.id;
        toast.success('Tạo sản phẩm thành công');
      }

      // Handle variants for variable products
      if (data.product_type === 'variable' && variants.length > 0) {
        // Delete existing variants if updating
        if (product?.product_type === 'variable') {
          await lensApi.deleteVariantsByProductId(productId);
        }

        // Create all variants
        const variantsToCreate: CreateVariantInput[] = variants.map(v => ({
          sku: v.sku,
          variant_name: v.variant_name,
          attributes: v.attributes,
          price: v.price,
          stock_quantity: v.stock_quantity,
          image_urls: v.image_urls,
          display_order: v.display_order,
        }));

        await lensApi.createVariantsBulk(productId, variantsToCreate);
        toast.success(`Đã lưu ${variants.length} biến thể`);
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
          <DialogTitle>{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Type Toggle */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Label className="text-base font-semibold">Loại sản phẩm:</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={productType === 'simple' ? 'default' : 'outline'}
                onClick={() => setValue('product_type', 'simple')}
                className="gap-2"
              >
                <Box className="w-4 h-4" />
                Sản phẩm đơn giản
              </Button>
              <Button
                type="button"
                variant={productType === 'variable' ? 'default' : 'outline'}
                onClick={() => setValue('product_type', 'variable')}
                className="gap-2"
              >
                <Grid3x3 className="w-4 h-4" />
                Sản phẩm có biến thể
              </Button>
            </div>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">Thông tin chung</TabsTrigger>
              <TabsTrigger value="images">Hình ảnh</TabsTrigger>
              {productType === 'variable' && (
                <TabsTrigger value="variants">Biến thể ({variants.length})</TabsTrigger>
              )}
            </TabsList>

            {/* General Info Tab */}
            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Thương hiệu *</Label>
                  <Select onValueChange={(v) => setValue('brand_id', v)} defaultValue={product?.brand_id}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thương hiệu" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map(brand => (
                        <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.brand_id && <p className="text-sm text-destructive mt-1">{errors.brand_id.message}</p>}
                </div>

                <div>
                  <Label>Tên sản phẩm *</Label>
                  <Input {...register('name')} />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {productType === 'simple' ? (
                  <div>
                    <Label>SKU</Label>
                    <Input {...register('sku')} placeholder="ROD-CLR-156" />
                  </div>
                ) : (
                  <div>
                    <Label>SKU gốc</Label>
                    <Input {...register('base_sku')} placeholder="ROD-CLR" />
                    <p className="text-xs text-muted-foreground mt-1">SKU sẽ được tạo cho từng biến thể</p>
                  </div>
                )}

                <div>
                  <Label>{productType === 'simple' ? 'Giá *' : 'Giá cơ bản *'}</Label>
                  <Input type="number" {...register('price', { valueAsNumber: true })} />
                  {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
                  {productType === 'variable' && (
                    <p className="text-xs text-muted-foreground mt-1">Giá sẽ được thiết lập cho từng biến thể</p>
                  )}
                </div>
              </div>

              <div>
                <Label>Mô tả</Label>
                <Textarea {...register('description')} rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Chất liệu</Label>
                  <Input {...register('material')} placeholder="Nhựa, kính..." />
                </div>

                <div>
                  <Label>Chiết suất</Label>
                  <Input {...register('refractive_index')} placeholder="1.56" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Xuất xứ</Label>
                  <Input {...register('origin')} placeholder="Đức, Nhật Bản..." />
                </div>

                <div>
                  <Label>Bảo hành (tháng)</Label>
                  <Input type="number" {...register('warranty_months', { valueAsNumber: true })} />
                </div>
              </div>

              <div>
                <Label>Tính năng</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {features.map(feature => (
                    <div key={feature.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`feature-${feature.id}`}
                        checked={selectedFeatures.includes(feature.id)}
                        onCheckedChange={(checked) => {
                          setSelectedFeatures(prev =>
                            checked
                              ? [...prev, feature.id]
                              : prev.filter(id => id !== feature.id)
                          );
                        }}
                      />
                      <Label htmlFor={`feature-${feature.id}`} className="cursor-pointer">
                        {feature.icon} {feature.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={isPromotion}
                  onCheckedChange={(checked) => setValue('is_promotion', checked)}
                />
                <Label>Khuyến mãi</Label>
              </div>

              {isPromotion && (
                <div>
                  <Label>Nội dung khuyến mãi</Label>
                  <Input {...register('promotion_text')} placeholder="Giảm 20%" />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  checked={watch('is_active')}
                  onCheckedChange={(checked) => setValue('is_active', checked)}
                />
                <Label>Hiển thị</Label>
              </div>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="mt-4">
              <div>
                <Label>Hình ảnh sản phẩm (tối đa 10 ảnh)</Label>
                <div className="mt-2 space-y-4">
                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {existingImages.map((url, index) => (
                        <div key={url} className="relative w-24 h-24 border rounded-lg overflow-hidden group">
                          <img src={url} alt={`Ảnh ${index + 1}`} className="w-full h-full object-cover" />
                          {index === 0 && (
                            <Badge className="absolute top-1 left-1 text-xs">Chính</Badge>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(url)}
                            className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* New Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={preview} className="relative w-24 h-24 border rounded-lg overflow-hidden group">
                          <img src={preview} alt={`Ảnh mới ${index + 1}`} className="w-full h-full object-cover" />
                          <Badge className="absolute top-1 left-1 text-xs bg-blue-600">Mới</Badge>
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(index)}
                            className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  {(existingImages.length + imagePreviews.length) < 10 && (
                    <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent">
                      <div className="text-center">
                        <Upload className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Thêm ảnh</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        onChange={handleImagesChange} 
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Ảnh đầu tiên sẽ là ảnh đại diện. {productType === 'variable' && 'Mỗi biến thể có thể có ảnh riêng.'}
                </p>
              </div>
            </TabsContent>

            {/* Variants Tab */}
            {productType === 'variable' && (
              <TabsContent value="variants" className="mt-4 space-y-4">
                {/* Attributes Selection */}
                <div className="p-4 border rounded-lg space-y-3">
                  <Label className="text-base font-semibold">1. Chọn thuộc tính</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {attributes.map(attr => (
                      <div key={attr.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`attr-${attr.id}`}
                          checked={selectedAttributes.includes(attr.id)}
                          onCheckedChange={(checked) => {
                            setSelectedAttributes(prev =>
                              checked ? [...prev, attr.id] : prev.filter(id => id !== attr.id)
                            );
                          }}
                        />
                        <Label htmlFor={`attr-${attr.id}`} className="cursor-pointer">
                          {attr.name} ({attr.options.length})
                        </Label>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    onClick={handleGenerateVariants}
                    disabled={selectedAttributes.length === 0}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo biến thể tự động
                  </Button>
                </div>

                {/* Variants Table */}
                {variants.length > 0 && (
                  <div className="border rounded-lg">
                    <div className="p-3 bg-muted flex items-center justify-between">
                      <Label className="text-base font-semibold">2. Chỉnh sửa biến thể ({variants.length})</Label>
                      <Badge variant="secondary">{variants.filter(v => v.sku).length}/{variants.length} có SKU</Badge>
                    </div>
                    <VariantsTable
                      variants={variants}
                      onChange={handleVariantChange}
                      onDelete={handleDeleteVariant}
                    />
                  </div>
                )}

                {variants.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Grid3x3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Chưa có biến thể nào</p>
                    <p className="text-sm">Chọn thuộc tính và nhấn "Tạo biến thể tự động"</p>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onClose()}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
              {isSubmitting ? 'Đang lưu...' : product ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
