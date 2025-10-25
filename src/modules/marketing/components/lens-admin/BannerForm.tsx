import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { lensApi } from '@/modules/marketing/services/lensApi';
import { LensBanner } from '@/modules/marketing/types/lens';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

const bannerSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc').max(100, 'Tiêu đề tối đa 100 ký tự'),
  subtitle: z.string().max(200, 'Mô tả tối đa 200 ký tự').nullable().or(z.literal('')),
  image_url: z.string().url('URL ảnh không hợp lệ').min(1, 'Ảnh là bắt buộc'),
  link_url: z.string().url('URL link không hợp lệ').nullable().or(z.literal('')),
  display_order: z.coerce.number().int().min(0, 'Thứ tự phải >= 0'),
});

type BannerFormData = z.infer<typeof bannerSchema>;

interface BannerFormProps {
  open: boolean;
  banner: LensBanner | null;
  onClose: (success?: boolean) => void;
}

export function BannerForm({ open, banner, onClose }: BannerFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(banner?.image_url || null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: banner?.title || '',
      subtitle: banner?.subtitle || '',
      image_url: banner?.image_url || '',
      link_url: banner?.link_url || '',
      display_order: banner?.display_order || 0,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await lensApi.uploadImage(file, 'banners');
      setValue('image_url', url);
      setPreviewUrl(url);
      toast.success('Upload ảnh thành công');
    } catch (error) {
      toast.error('Lỗi khi upload ảnh');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: BannerFormData) => {
    try {
      const bannerData = {
        title: data.title,
        subtitle: data.subtitle || null,
        image_url: data.image_url,
        link_url: data.link_url || null,
        display_order: data.display_order,
        is_active: true,
      };

      if (banner) {
        await lensApi.updateBanner(banner.id, bannerData);
        toast.success('Cập nhật banner thành công');
      } else {
        await lensApi.createBanner(bannerData);
        toast.success('Tạo banner thành công');
      }
      
      reset();
      setPreviewUrl(null);
      onClose(true);
    } catch (error) {
      toast.error(banner ? 'Lỗi khi cập nhật banner' : 'Lỗi khi tạo banner');
      console.error(error);
    }
  };

  const handleClose = () => {
    reset();
    setPreviewUrl(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{banner ? 'Chỉnh sửa Banner' : 'Thêm Banner'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Tiêu đề *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Nhập tiêu đề banner"
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="subtitle">Mô tả</Label>
            <Textarea
              id="subtitle"
              {...register('subtitle')}
              placeholder="Nhập mô tả ngắn (tùy chọn)"
              rows={2}
            />
            {errors.subtitle && (
              <p className="text-sm text-destructive mt-1">{errors.subtitle.message}</p>
            )}
          </div>

          <div>
            <Label>Ảnh Banner *</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading}
                  onClick={() => document.getElementById('banner-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? 'Đang upload...' : 'Chọn ảnh'}
                </Button>
                <Input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Input
                  {...register('image_url')}
                  placeholder="hoặc nhập URL ảnh"
                  className="flex-1"
                  onChange={(e) => setPreviewUrl(e.target.value)}
                />
              </div>
              {errors.image_url && (
                <p className="text-sm text-destructive">{errors.image_url.message}</p>
              )}
              {previewUrl && (
                <div className="aspect-[2/1] rounded overflow-hidden border">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={() => setPreviewUrl(null)}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="link_url">Link URL</Label>
            <Input
              id="link_url"
              {...register('link_url')}
              placeholder="https://... (tùy chọn)"
              type="url"
            />
            {errors.link_url && (
              <p className="text-sm text-destructive mt-1">{errors.link_url.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="display_order">Thứ tự hiển thị</Label>
            <Input
              id="display_order"
              type="number"
              min={0}
              {...register('display_order')}
              placeholder="0"
            />
            {errors.display_order && (
              <p className="text-sm text-destructive mt-1">{errors.display_order.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu banner'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
