import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Star, Trash2, Image as ImageIcon, Camera } from 'lucide-react';
import { RelatedCustomer, RelatedAvatar } from '../../types/relatedCustomer.types';
import { RelatedCustomerService } from '../../services/relatedCustomerService';
import { toast } from '@/components/ui/use-toast';

interface RelatedAvatarGalleryProps {
  related: RelatedCustomer;
  onUpdate?: () => void;
}

export function RelatedAvatarGallery({ related, onUpdate }: RelatedAvatarGalleryProps) {
  const [avatars, setAvatars] = useState<RelatedAvatar[]>(related.avatars || []);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadAvatars();
  }, [related.id]);

  const loadAvatars = async () => {
    try {
      const data = await RelatedCustomerService.getAvatars(related.id);
      setAvatars(data);
    } catch (error: any) {
      console.error('Load avatars error:', error);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    try {
      for (const file of Array.from(files)) {
        // Validate file
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        
        if (!allowedTypes.includes(file.type)) {
          toast({
            title: '❌ File không hợp lệ',
            description: 'Chỉ chấp nhận file JPG, PNG, WEBP',
            variant: 'destructive'
          });
          continue;
        }
        
        if (file.size > maxSize) {
          toast({
            title: '❌ File quá lớn',
            description: 'Kích thước file không được vượt quá 5MB',
            variant: 'destructive'
          });
          continue;
        }

        // Upload
        await RelatedCustomerService.uploadAvatar(related.id, file, 'current-user-id');
        successCount++;
      }

      if (successCount > 0) {
        toast({
          title: '✅ Thành công',
          description: `Đã upload ${successCount} ảnh`
        });
        loadAvatars();
        onUpdate?.();
      }
    } catch (error: any) {
      toast({
        title: '❌ Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleSetPrimary = async (avatarId: string) => {
    try {
      await RelatedCustomerService.setPrimaryAvatar(related.id, avatarId);
      toast({
        title: '✅ Thành công',
        description: 'Đã đặt làm ảnh chính'
      });
      loadAvatars();
      onUpdate?.();
    } catch (error: any) {
      toast({
        title: '❌ Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (avatarId: string) => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa ảnh này?');
    if (!confirmed) return;

    try {
      await RelatedCustomerService.deleteAvatar(related.id, avatarId);
      toast({
        title: '✅ Thành công',
        description: 'Đã xóa ảnh'
      });
      loadAvatars();
      onUpdate?.();
    } catch (error: any) {
      toast({
        title: '❌ Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="grid grid-cols-2 gap-3">
        {/* Upload từ thư viện */}
        <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
          <label className="flex flex-col items-center justify-center p-4 cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleUpload}
              disabled={isUploading}
              className="hidden"
            />
            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
            <div className="text-center text-sm theme-text font-medium">
              {isUploading ? 'Đang upload...' : '📁 Chọn từ thư viện'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Chọn nhiều ảnh
            </div>
          </label>
        </Card>

        {/* Chụp bằng camera */}
        <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
          <label className="flex flex-col items-center justify-center p-4 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleUpload}
              disabled={isUploading}
              className="hidden"
            />
            <Camera className="w-8 h-8 mb-2 text-muted-foreground" />
            <div className="text-center text-sm theme-text font-medium">
              {isUploading ? 'Đang upload...' : '📸 Chụp ảnh'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Mở camera
            </div>
          </label>
        </Card>
      </div>

      <div className="text-xs text-muted-foreground text-center mt-2">
        Hỗ trợ: JPG, PNG, WEBP (Max 5MB/ảnh)
      </div>

      {/* Avatar Grid */}
      {avatars.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <div className="text-muted-foreground">Chưa có ảnh nào</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {avatars.map((avatar) => (
            <div key={avatar.id} className="relative group">
              <div 
                className="aspect-square rounded-lg overflow-hidden border-2 cursor-pointer hover:border-primary transition-colors"
                style={{ borderColor: avatar.is_primary ? 'hsl(var(--primary))' : undefined }}
                onClick={() => setSelectedImage(avatar.public_url)}
              >
                <img
                  src={avatar.public_url}
                  alt={avatar.file_name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Primary Star */}
              {avatar.is_primary && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Star className="w-4 h-4 fill-current" />
                </div>
              )}

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                {!avatar.is_primary && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleSetPrimary(avatar.id)}
                    className="gap-1"
                  >
                    <Star className="w-3 h-3" />
                    Đặt chính
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(avatar.id)}
                  className="gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt="Preview" 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
