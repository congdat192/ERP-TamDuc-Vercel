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
import { LensProduct, LensBrand, LensFeature } from '../../types/lens';
import { lensApi } from '../../services/lensApi';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

const schema = z.object({
  brand_id: z.string().min(1, 'Vui lòng chọn thương hiệu'),
  name: z.string().min(1, 'Vui lòng nhập tên sản phẩm'),
  sku: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'Giá niêm yết phải lớn hơn 0'),
  sale_price: z.number().optional(),
  material: z.string().optional(),
  refractive_index: z.string().optional(),
  origin: z.string().optional(),
  warranty_months: z.string().optional(),
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

  const { data: attributes = [] } = useQuery({
    queryKey: ['lens-attributes'],
    queryFn: () => lensApi.getAttributes(),
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormData>({
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
    if (product) {
      reset({
        brand_id: product.brand_id,
        name: product.name,
        sku: product.sku || '',
        description: product.description || '',
        price: product.price,
        sale_price: product.sale_price || undefined,
        material: product.material || '',
        refractive_index: product.refractive_index || '',
        origin: product.origin || '',
        warranty_months: product.warranty_months?.toString() || '',
        is_promotion: product.is_promotion,
        promotion_text: product.promotion_text || '',
        is_active: product.is_active,
      });
      setExistingImages(product.image_urls || []);
      setImageFiles([]);
      setImagePreviews([]);
      setSelectedFeatures(product.features?.map(f => f.id) || []);
    } else {
      reset({
        is_promotion: false,
        is_active: true,
        price: 0,
      });
      setExistingImages([]);
      setImageFiles([]);
      setImagePreviews([]);
      setSelectedFeatures([]);
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

  const onSubmit = async (data: FormData) => {
    if (data.sale_price && data.sale_price >= data.price) {
      toast.error('Giá giảm phải nhỏ hơn giá niêm yết');
      return;
    }

    setIsSubmitting(true);
    try {
      let newImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        newImageUrls = await lensApi.uploadImages(imageFiles);
      }
      
      const allImageUrls = [...existingImages, ...newImageUrls];
      
      const sanitizedData = {
        ...data,
        sku: data.sku?.trim() || null,
        description: data.description?.trim() || null,
        material: data.material?.trim() || null,
        refractive_index: data.refractive_index?.trim() || null,
        origin: data.origin?.trim() || null,
        warranty_months: data.warranty_months ? parseInt(data.warranty_months) : null,
        sale_price: data.sale_price || null,
        promotion_text: data.promotion_text?.trim() || null,
      };
      
      const productData = {
        ...sanitizedData,
        image_urls: allImageUrls,
        discount_percent: discountPercent,
        created_by: product?.created_by || undefined,
      };

      if (product) {
        const removedImages = (product.image_urls || []).filter(url => !existingImages.includes(url));
        await Promise.all(removedImages.map(url => lensApi.deleteImage(url).catch(() => {})));
        
        await lensApi.updateProduct(product.id, productData as any);
        await lensApi.linkProductFeatures(product.id, selectedFeatures);
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        const newProduct = await lensApi.createProduct(productData as any);
        await lensApi.linkProductFeatures(newProduct.id, selectedFeatures);
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
          <DialogTitle>{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Multi-Image Upload */}
          <div>
            <Label>Hình ảnh (tối đa 10 ảnh)</Label>
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
              Ảnh đầu tiên sẽ là ảnh đại diện
            </p>
          </div>

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
            <div>
              <Label>SKU</Label>
              <Input {...register('sku')} placeholder="RODEN-CM-156" />
            </div>

            <div>
              <Label>Giá niêm yết * (VD: 1,000,000)</Label>
              <Input type="number" {...register('price', { valueAsNumber: true })} />
              {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              {salePrice && price && salePrice >= price && (
                <p className="text-xs text-destructive mt-1">
                  Giá giảm phải nhỏ hơn giá niêm yết
                </p>
              )}
            </div>

            <div className="flex items-end">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {!salePrice ? (
                    'Chưa có giảm giá'
                  ) : (
                    <>
                      Giá bán: <span className="font-semibold text-foreground">{salePrice.toLocaleString('vi-VN')}₫</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div>
            <Label>Mô tả</Label>
            <Textarea {...register('description')} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {attributes.map(attr => (
              <div key={attr.id}>
                <Label>{attr.name}</Label>
                <Select 
                  onValueChange={(v) => setValue(attr.slug as keyof FormData, v as any)}
                  defaultValue={
                    attr.slug === 'warranty_months'
                      ? product?.warranty_months?.toString()
                      : (product?.[attr.slug as keyof LensProduct] as string) || undefined
                  }
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

          <div className="flex justify-end gap-2 pt-4">
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
