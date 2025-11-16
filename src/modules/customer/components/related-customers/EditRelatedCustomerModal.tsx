import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { RelatedCustomer, UpdateRelatedCustomerData, RELATIONSHIP_LABELS, RelationshipType } from '../../types/relatedCustomer.types';
import { FamilyMemberService, APIResponse } from '../../services/familyMemberService';
import { toast } from '@/components/ui/use-toast';
import { Upload, Trash2, Star, Camera, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { externalStorageClient } from '@/integrations/supabase/externalStorageClient';

interface EditRelatedCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  related: RelatedCustomer;
  onSuccess: () => void;
}

export function EditRelatedCustomerModal({
  open,
  onOpenChange,
  related,
  onSuccess
}: EditRelatedCustomerModalProps) {
  const [formData, setFormData] = useState<UpdateRelatedCustomerData>({
    related_name: related.related_name,
    relationship_type: related.relationship_type,
    gender: related.gender || 'Nam',
    birth_date: related.birth_date || '',
    phone: related.phone || '',
    notes: related.notes || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [originalName] = useState(related.related_name);

  // ✅ Image upload state (giống ADD modal)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  // Reset form when related changes
  useEffect(() => {
    setFormData({
      related_name: related.related_name,
      relationship_type: related.relationship_type,
      gender: related.gender || 'Nam',
      birth_date: related.birth_date || '',
      phone: related.phone || '',
      notes: related.notes || ''
    });
    // Clear preview images
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
  }, [related]);

  // ✅ Handle file selection (giống ADD modal)
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
  };

  // ✅ Handle remove preview file (giống ADD modal)
  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]); // Cleanup
      return prev.filter((_, i) => i !== index);
    });
  };

  // ✅ Handle delete existing image (xóa ảnh cũ trong DB)
  const handleDeleteExistingImage = async (avatarId: string, publicUrl: string) => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa ảnh này?');
    if (!confirmed) return;

    setDeletingImageId(avatarId);

    try {
      // 🔐 Set auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        await externalStorageClient.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token || ''
        });
      }

      // Call API to delete image
      const response: APIResponse = await FamilyMemberService.deleteImage(
        related.customer_phone,
        related.related_name,
        publicUrl
      );

      if (!response.success) {
        console.error('[EditRelatedCustomerModal] Delete image failed:', response);
        console.error('[EditRelatedCustomerModal] Request ID:', response.meta?.request_id);

        toast({
          title: '❌ Lỗi',
          description: response.error_description,
          variant: 'destructive',
          duration: 5000
        });
        return;
      }

      // Delete from External Storage
      const filePath = publicUrl.split('/').slice(-4).join('/');
      await externalStorageClient.storage
        .from('avatar_customers')
        .remove([filePath]);

      toast({
        title: '✅ Thành công',
        description: response.message
      });

      onSuccess(); // Refresh data
    } catch (error: any) {
      console.error('[EditRelatedCustomerModal] Unexpected error:', error);
      toast({
        title: '❌ Lỗi',
        description: 'Không thể kết nối đến server. Vui lòng thử lại.',
        variant: 'destructive',
        duration: 5000
      });
    } finally {
      setDeletingImageId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.related_name?.trim()) {
      toast({
        title: '⚠️ Thiếu thông tin',
        description: 'Vui lòng nhập tên người thân',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const customerPhone = related.customer_phone;
      const newName = formData.related_name.trim();
      let lastResponse: APIResponse | null = null;

      // ✅ Step 0: Upload ảnh mới (nếu có) - GIỐNG ADD MODAL
      const uploadedUrls: string[] = [];

      if (selectedFiles.length > 0) {
        // 🔐 Get auth token and set to External Storage
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.access_token) {
          await externalStorageClient.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token || ''
          });
          console.log('[EditRelatedCustomerModal] ✅ Auth token set for External Storage');
        }

        // Upload each file
        for (const file of selectedFiles) {
          const fileName = `${customerPhone}_${newName}_${Date.now()}.jpg`;
          const year = new Date().getFullYear();
          const month = String(new Date().getMonth() + 1).padStart(2, '0');
          const day = String(new Date().getDate()).padStart(2, '0');
          const filePath = `${year}/${month}/${day}/${fileName}`;

          // ✅ Upload to External Supabase Storage
          const { data: uploadData, error: uploadError } = await externalStorageClient.storage
            .from('avatar_customers')
            .upload(filePath, file);

          if (uploadError) {
            console.error('[EditRelatedCustomerModal] Upload error:', uploadError);
            throw new Error(`Upload failed: ${uploadError.message}`);
          }

          // ✅ Get public URL from External Supabase
          const { data: { publicUrl } } = externalStorageClient.storage
            .from('avatar_customers')
            .getPublicUrl(filePath);

          console.log('[EditRelatedCustomerModal] Uploaded to External Storage:', publicUrl);

          uploadedUrls.push(publicUrl);
        }
      }

      // ✅ Step 1: Cập nhật thông tin (bao gồm cả rename) - API v2
      const updates: any = {};

      // Include name if changed (rename)
      if (newName !== originalName) {
        updates.ten = newName;
      }

      if (formData.relationship_type !== related.relationship_type) {
        updates.moi_quan_he = formData.relationship_type;
      }

      const apiGender = formData.gender === 'Nam' ? 'nam' : 'nu';
      const currentGender = related.gender === 'Nam' ? 'nam' : 'nu';
      if (apiGender !== currentGender) {
        updates.gioi_tinh = apiGender;
      }

      if (formData.birth_date !== related.birth_date) {
        updates.ngay_sinh = formData.birth_date || '';
      }

      if (formData.phone !== related.phone) {
        updates.sdt = formData.phone || '';
      }

      if (formData.notes !== related.notes) {
        updates.ghi_chu = formData.notes || '';
      }

      // Chỉ call UPDATE nếu có thay đổi
      if (Object.keys(updates).length > 0) {
        const updateResponse = await FamilyMemberService.updateFamilyMember(
          customerPhone,
          related.id, // ✅ Use ID instead of name
          updates
        );

        if (!updateResponse.success) {
          console.error('[EditRelatedCustomerModal] Update failed:', updateResponse);
          console.error('[EditRelatedCustomerModal] Request ID:', updateResponse.meta?.request_id);

          toast({
            title: '❌ Lỗi',
            description: updateResponse.error_description,
            variant: 'destructive',
            duration: 5000
          });
          return;
        }

        lastResponse = updateResponse;
      }

      // ✅ Step 2: Thêm ảnh mới vào API (nếu có upload)
      if (uploadedUrls.length > 0) {
        const addImageResponse = await FamilyMemberService.addImages(
          customerPhone,
          related.id, // ✅ Use ID instead of name
          uploadedUrls
        );

        if (!addImageResponse.success) {
          console.error('[EditRelatedCustomerModal] Add images failed:', addImageResponse);
          console.error('[EditRelatedCustomerModal] Request ID:', addImageResponse.meta?.request_id);

          toast({
            title: '❌ Lỗi khi thêm ảnh',
            description: addImageResponse.error_description,
            variant: 'destructive',
            duration: 5000
          });
          return;
        }

        lastResponse = addImageResponse;
      }

      // ✅ SUCCESS
      if (lastResponse) {
        console.log('[EditRelatedCustomerModal] Success:', lastResponse);
        console.log('[EditRelatedCustomerModal] Request ID:', lastResponse.meta?.request_id);

        toast({
          title: '✅ Thành công',
          description: 'Đã cập nhật thông tin người thân thành công'
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      // Network error hoặc unexpected error
      console.error('[EditRelatedCustomerModal] Unexpected error:', error);

      toast({
        title: '❌ Lỗi',
        description: 'Không thể kết nối đến server. Vui lòng thử lại.',
        variant: 'destructive',
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>✏️ Sửa thông tin: {related.related_name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tên người thân */}
          <div className="space-y-2">
            <Label htmlFor="related_name">
              Tên người thân <span className="text-destructive">*</span>
            </Label>
            <Input
              id="related_name"
              value={formData.related_name}
              onChange={(e) => setFormData({ ...formData, related_name: e.target.value })}
              placeholder="VD: Nguyễn Văn An"
              required
            />
          </div>

          {/* Mối quan hệ */}
          <div className="space-y-2">
            <Label>
              Mối quan hệ <span className="text-destructive">*</span>
            </Label>
            <Select 
              value={formData.relationship_type}
              onValueChange={(value) => setFormData({ ...formData, relationship_type: value as RelationshipType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(RELATIONSHIP_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Giới tính */}
          <div className="space-y-2">
            <Label>Giới tính</Label>
            <RadioGroup
              value={formData.gender || 'Nam'}
              onValueChange={(value) => setFormData({ ...formData, gender: value as 'Nam' | 'Nữ' })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Nam" id="male" />
                <Label htmlFor="male" className="cursor-pointer">Nam</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Nữ" id="female" />
                <Label htmlFor="female" className="cursor-pointer">Nữ</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Ngày sinh */}
          <div className="space-y-2">
            <Label htmlFor="birth_date">Ngày sinh</Label>
            <Input
              id="birth_date"
              type="date"
              value={formData.birth_date || ''}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
            />
          </div>

          {/* Số điện thoại */}
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="VD: 0912345678"
            />
          </div>

          {/* Ghi chú */}
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ghi chú về người thân..."
              rows={3}
            />
          </div>

          {/* Separator */}
          <Separator className="my-6" />

          {/* ✅ Image Management Section - GIỐNG ADD MODAL */}
          <div className="space-y-4">
            <h3 className="font-semibold theme-text">📸 HÌNH ẢNH</h3>

            {/* Ảnh đã có trong DB */}
            {related.avatars && related.avatars.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm theme-text-muted">Ảnh hiện tại:</Label>
                <div className="grid grid-cols-4 gap-2">
                  {related.avatars.map((avatar, index) => (
                    <div key={avatar.id} className="relative group">
                      <div
                        className={`aspect-square rounded-lg overflow-hidden border-2 ${
                          avatar.is_primary ? 'border-primary' : 'border-border'
                        }`}
                      >
                        <img
                          src={avatar.public_url}
                          alt={`Ảnh ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {avatar.is_primary && (
                        <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                          <Star className="w-3 h-3 fill-current" />
                        </div>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                        onClick={() => handleDeleteExistingImage(avatar.id, avatar.public_url)}
                        disabled={deletingImageId === avatar.id}
                      >
                        {deletingImageId === avatar.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Area - GIỐNG ADD MODAL */}
            <div className="grid grid-cols-2 gap-3">
              {/* Upload từ thư viện */}
              <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
                <label className="flex flex-col items-center justify-center p-4 cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <div className="text-center text-sm theme-text font-medium">
                    📁 Chọn từ thư viện
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, WEBP
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
                    className="hidden"
                    disabled={isLoading}
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

            {/* Hướng dẫn */}
            <div className="text-xs text-muted-foreground text-center">
              Ảnh đầu tiên sẽ là ảnh đại diện • Max 5MB/ảnh
            </div>

            {/* Preview Grid - Ảnh MỚI sẽ upload */}
            {previewUrls.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm theme-text-muted">Ảnh mới sẽ thêm:</Label>
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
                        onClick={() => handleRemoveFile(index)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  💾 Lưu thay đổi
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
