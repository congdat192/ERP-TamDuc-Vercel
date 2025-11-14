import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Star, Trash2, Image as ImageIcon, Camera } from 'lucide-react';
import { RelatedCustomer, RelatedAvatar } from '../../types/relatedCustomer.types';
import { FamilyMemberService, APIResponse } from '../../services/familyMemberService';
import { supabase } from '@/integrations/supabase/client';
import { externalStorageClient } from '@/integrations/supabase/externalStorageClient';
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

  // 🔐 Phase 4: Helper to set auth token for External Storage
  const setAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      await externalStorageClient.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token || ''
      });
      console.log('[RelatedAvatarGallery] ✅ Auth token set for External Storage');
    }
  };

  const loadAvatars = async () => {
    try {
      setAvatars(related.avatars || []);
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
      // 🔐 Set auth token trước khi upload
      await setAuthToken();

      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        // Validate file
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        
        if (!allowedTypes.includes(file.type)) {
          toast({
            title: '❌ File không hợp lệ',
            description: `${file.name}: Chỉ chấp nhận JPG, PNG, WEBP`,
            variant: 'destructive'
          });
          continue;
        }
        
        if (file.size > maxSize) {
          toast({
            title: '❌ File quá lớn',
            description: `${file.name}: Vượt quá 5MB`,
            variant: 'destructive'
          });
          continue;
        }

        // 1. Upload to External Supabase Storage
        const fileName = `${related.customer_phone}_${related.related_name}_${Date.now()}.jpg`;
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const day = String(new Date().getDate()).padStart(2, '0');
        const filePath = `${year}/${month}/${day}/${fileName}`; // ✅ Fixed: removed 'family/' prefix
        
        // ✅ Dùng External Storage Client
        const { data: uploadData, error: uploadError } = await externalStorageClient.storage
          .from('avatar_customers')
          .upload(filePath, file);

        if (uploadError) {
          console.error('[RelatedAvatarGallery] Upload error:', uploadError);
          toast({
            title: '❌ Upload thất bại',
            description: uploadError.message,
            variant: 'destructive'
          });
          continue;
        }

        // 2. Get public URL from External Supabase
        const { data: { publicUrl } } = externalStorageClient.storage
          .from('avatar_customers')
          .getPublicUrl(filePath);
        
        console.log('[RelatedAvatarGallery] Uploaded:', publicUrl);
        
        uploadedUrls.push(publicUrl);
        successCount++;
      }

      // 3. Call External API to add all images at once
      if (uploadedUrls.length > 0) {
        const response: APIResponse = await FamilyMemberService.addImages(
          related.customer_phone,
          related.id, // ✅ Use ID instead of name
          uploadedUrls
        );

        // ✅ CHECK response.success FIELD FIRST
        if (!response.success) {
          console.error('[RelatedAvatarGallery] Add images failed:', response);
          console.error('[RelatedAvatarGallery] Request ID:', response.meta?.request_id);

          toast({
            title: '❌ Lỗi',
            description: response.error_description,
            variant: 'destructive',
            duration: 5000
          });
          return;
        }

        // ✅ SUCCESS: Display message NGUYÊN VĂN
        console.log('[RelatedAvatarGallery] Success:', response);
        console.log('[RelatedAvatarGallery] Request ID:', response.meta?.request_id);

        toast({
          title: '✅ Thành công',
          description: response.message
        });

        onUpdate?.();
      }
    } catch (error: any) {
      // Network error hoặc unexpected error
      console.error('[RelatedAvatarGallery] Unexpected error:', error);

      toast({
        title: '❌ Lỗi',
        description: 'Không thể kết nối đến server. Vui lòng thử lại.',
        variant: 'destructive',
        duration: 5000
      });
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleDelete = async (avatarId: string) => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa ảnh này?');
    if (!confirmed) return;

    try {
      // 🔐 Set auth token trước khi delete
      await setAuthToken();

      // Find avatar by ID
      const avatar = avatars.find(a => a.id === avatarId);
      if (!avatar) throw new Error('Không tìm thấy ảnh');

      // 1. Call External API to remove image
      const response: APIResponse = await FamilyMemberService.deleteImage(
        related.customer_phone,
        related.id, // ✅ Use ID instead of name
        avatar.public_url
      );

      // ✅ CHECK response.success FIELD FIRST
      if (!response.success) {
        console.error('[RelatedAvatarGallery] Delete image failed:', response);
        console.error('[RelatedAvatarGallery] Request ID:', response.meta?.request_id);

        toast({
          title: '❌ Lỗi',
          description: response.error_description,
          variant: 'destructive',
          duration: 5000
        });
        return;
      }

      // 2. Delete from External Supabase Storage (API đã xóa rồi, nhưng đảm bảo clean up)
      const filePath = avatar.public_url.split('/').slice(-4).join('/');

      // ✅ Dùng External Storage Client để xóa
      const { error: deleteError } = await externalStorageClient.storage
        .from('avatar_customers')
        .remove([filePath]);

      if (deleteError) {
        console.warn('[RelatedAvatarGallery] Storage cleanup warning:', deleteError);
        // Không throw error vì API đã xóa thành công
      }

      console.log('[RelatedAvatarGallery] Deleted from External Storage:', filePath);

      // ✅ SUCCESS: Display message NGUYÊN VĂN
      console.log('[RelatedAvatarGallery] Success:', response);
      console.log('[RelatedAvatarGallery] Request ID:', response.meta?.request_id);

      toast({
        title: '✅ Thành công',
        description: response.message
      });

      onUpdate?.();
    } catch (error: any) {
      // Network error hoặc unexpected error
      console.error('[RelatedAvatarGallery] Unexpected error:', error);

      toast({
        title: '❌ Lỗi',
        description: 'Không thể kết nối đến server. Vui lòng thử lại.',
        variant: 'destructive',
        duration: 5000
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
