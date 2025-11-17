import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Star, Trash2, Image as ImageIcon, Camera, Loader2 } from 'lucide-react';
import { RelatedCustomer, RelatedAvatar } from '../../types/relatedCustomer.types';
import { FamilyMemberService, APIResponse } from '../../services/familyMemberService';
import { supabase } from '@/integrations/supabase/client';
import { externalStorageClient } from '@/integrations/supabase/externalStorageClient';
import { toast } from '@/components/ui/use-toast';
import { buildFamilyAvatarFilePath } from '../../utils/avatarUpload';

interface RelatedAvatarGalleryProps {
  related: RelatedCustomer;
  onUpdate?: () => void;
  readOnly?: boolean; // ✅ Chế độ READ only - ẩn upload area
}

export function RelatedAvatarGallery({ related, onUpdate, readOnly = false }: RelatedAvatarGalleryProps) {
  const [avatars, setAvatars] = useState<RelatedAvatar[]>(related.avatars || []);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // ✅ Preview state - giống CREATE modal
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

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

  // ✅ Handle file selection - PREVIEW ONLY (giống CREATE modal)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles: File[] = [];
    const validUrls: string[] = [];

    Array.from(files).forEach(file => {
      // Validate
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: '❌ File không hợp lệ',
          description: `${file.name}: Chỉ chấp nhận JPG, PNG, WEBP`,
          variant: 'destructive'
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: '❌ File quá lớn',
          description: `${file.name}: Vượt quá 5MB`,
          variant: 'destructive'
        });
        return;
      }

      validFiles.push(file);
      validUrls.push(URL.createObjectURL(file));
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
    setPreviewUrls(prev => [...prev, ...validUrls]);
    e.target.value = ''; // Reset input
  };

  // ✅ Remove preview file before upload
  const handleRemovePreview = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]); // Cleanup
      return prev.filter((_, i) => i !== index);
    });
  };

  // ✅ Confirm and upload all selected files
  const handleConfirmUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);

    try {
      // 🔐 Set auth token trước khi upload
      await setAuthToken();

      const uploadedUrls: string[] = [];

      for (const file of selectedFiles) {
        // ✅ Build safe filePath (no Unicode, correct extension)
        const filePath = buildFamilyAvatarFilePath(related.customer_phone, related.related_name, file);

        // ✅ Dùng External Storage Client
        const { data: uploadData, error: uploadError } = await externalStorageClient.storage
          .from('avatar_customers')
          .upload(filePath, file);

        if (uploadError) {
          console.error('[RelatedAvatarGallery] Upload error:', uploadError);
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        // Get public URL from External Supabase
        const { data: { publicUrl } } = externalStorageClient.storage
          .from('avatar_customers')
          .getPublicUrl(filePath);

        console.log('[RelatedAvatarGallery] Uploaded:', publicUrl);

        uploadedUrls.push(publicUrl);
      }

      // Call External API to add all images at once
      const response: APIResponse = await FamilyMemberService.addImages(
        related.customer_phone,
        related.id,
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

      // ✅ SUCCESS
      console.log('[RelatedAvatarGallery] Success:', response);
      console.log('[RelatedAvatarGallery] Request ID:', response.meta?.request_id);

      toast({
        title: '✅ Thành công',
        description: response.message
      });

      // Cleanup preview
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      setPreviewUrls([]);

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
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ Cancel all previews
  const handleCancelUpload = () => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
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
      {/* Upload Area + Preview - Chỉ hiển thị khi KHÔNG ở READ mode */}
      {!readOnly && (
        <>
          <div className="grid grid-cols-2 gap-3">
            {/* Upload từ thư viện */}
        <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
          <label className="flex flex-col items-center justify-center p-4 cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
            <div className="text-center text-sm theme-text font-medium">
              📁 Chọn từ thư viện
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
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
            <Camera className="w-8 h-8 mb-2 text-muted-foreground" />
            <div className="text-center text-sm theme-text font-medium">
              📸 Chụp ảnh
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

      {/* ✅ Preview Grid - Ảnh MỚI chưa upload (giống CREATE modal) */}
      {previewUrls.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium theme-text">
              📋 Ảnh mới sẽ thêm ({previewUrls.length})
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelUpload}
                disabled={isUploading}
              >
                Hủy
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmUpload}
                disabled={isUploading}
                className="gap-2"
              >
                {isUploading ? (
                  <>
                    <Upload className="w-4 h-4 animate-pulse" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    💾 Lưu ảnh
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <div
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    index === 0 ? 'border-primary' : 'border-border'
                  }`}
                >
                  <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                </div>
                {index === 0 && (
                  <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                  onClick={() => handleRemovePreview(index)}
                  disabled={isUploading}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
        </>
      )}
      {/* ↑ Đóng block {!readOnly && ( */}

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
                className="aspect-square rounded-lg overflow-hidden border-2 cursor-pointer hover:border-primary hover:shadow-lg transition-all duration-200"
                style={{ borderColor: avatar.is_primary ? 'hsl(var(--primary))' : undefined }}
                onClick={() => setSelectedImage(avatar.public_url)}
              >
                <img
                  src={avatar.public_url}
                  alt={avatar.file_name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Primary Star - Góc trái trên */}
              {avatar.is_primary && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                  <Star className="w-4 h-4 fill-current" />
                </div>
              )}

              {/* Delete Button - Góc phải trên - Chỉ hiển thị khi KHÔNG ở READ mode */}
              {!readOnly && (
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering lightbox
                    handleDelete(avatar.id);
                  }}
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
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
