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
import { LensProduct, LensBrand, LensFeature } from '../../types/lens';
import { lensApi } from '../../services/lensApi';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

const schema = z.object({
  brand_id: z.string().min(1, 'Vui lòng chọn thương hiệu'),
  name: z.string().min(1, 'Vui lòng nhập tên sản phẩm'),
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      is_promotion: false,
      is_active: true,
      price: 0,
    },
  });

  const isPromotion = watch('is_promotion');

  useEffect(() => {
    if (product) {
      reset({
        brand_id: product.brand_id,
        name: product.name,
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
      setImagePreview(product.image_url);
      // Load features for this product
      // Note: We'd need to fetch this separately if needed
      setSelectedFeatures([]);
    } else {
      reset({
        is_promotion: false,
        is_active: true,
        price: 0,
      });
      setImagePreview(null);
      setSelectedFeatures([]);
    }
  }, [product, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      let imageUrl = product?.image_url || null;

      if (imageFile) {
        imageUrl = await lensApi.uploadImage(imageFile, 'products');
      }

      const productData = {
        ...data,
        image_url: imageUrl,
        created_by: product?.created_by || undefined,
      };

      if (product) {
        await lensApi.updateProduct(product.id, productData);
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
          {/* Image Upload */}
          <div>
            <Label>Hình ảnh</Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative w-40 h-40 border rounded-lg overflow-hidden">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-destructive rounded-full text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-40 h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent">
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Tải ảnh lên</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
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
              <Input {...register('sku')} />
            </div>

            <div>
              <Label>Giá *</Label>
              <Input type="number" {...register('price', { valueAsNumber: true })} />
              {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
            </div>
          </div>

          <div>
            <Label>Mô tả</Label>
            <Textarea {...register('description')} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Chất liệu</Label>
              <Input {...register('material')} />
            </div>

            <div>
              <Label>Chiết suất</Label>
              <Input {...register('refractive_index')} placeholder="1.56" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Xuất xứ</Label>
              <Input {...register('origin')} />
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
