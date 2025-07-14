
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Upload, Loader2 } from 'lucide-react';
import { User as UserType, getAvatarUrl } from '@/types/auth';
import { updateUserProfile } from '@/services/authService';
import { uploadAvatar, validateImageFile, createImagePreview, revokeImagePreview } from '@/services/imageService';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserProfileFormProps {
  user: UserType;
}

export function UserProfileForm({ user }: UserProfileFormProps) {
  const { refreshUserProfile } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: user.fullName,
    email: user.email,
    phone: user.phone || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: "File không hợp lệ",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const preview = createImagePreview(file);
    setPreviewUrl(preview);

    // Upload avatar and update profile
    setIsUploadingAvatar(true);
    try {
      console.log('🔄 Starting avatar upload process...');
      
      // Step 1: Upload image to get path
      const uploadResult = await uploadAvatar(file);
      console.log('✅ Image uploaded, path:', uploadResult.path);
      
      // Step 2: Update user profile with avatar_path
      const updatedUser = await updateUserProfile({
        name: user.fullName, // Keep current name
        email: user.email,   // Keep current email  
        avatar_path: uploadResult.path // Set new avatar path
      });
      console.log('✅ Profile updated with avatar path:', updatedUser);

      // Step 3: Refresh user profile to get updated data with proper avatar handling
      await refreshUserProfile();

      toast({
        title: "Cập nhật ảnh đại diện thành công",
        description: "Ảnh đại diện đã được cập nhật",
      });

      // Clear preview after successful upload
      if (previewUrl) {
        revokeImagePreview(previewUrl);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error('❌ Avatar upload failed:', error);
      toast({
        title: "Upload thất bại",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi upload ảnh",
        variant: "destructive",
      });
      
      // Revert preview on error  
      if (previewUrl) {
        revokeImagePreview(previewUrl);
        setPreviewUrl(null);
      }
    } finally {
      setIsUploadingAvatar(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Only update name and email, don't touch avatar_path
      await updateUserProfile({
        name: formData.name,
        email: formData.email,
      });

      await refreshUserProfile();

      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được cập nhật",
      });
    } catch (error) {
      console.error('❌ Profile update failed:', error);
      toast({
        title: "Cập nhật thất bại",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật thông tin",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = 
    formData.name !== user.fullName || 
    formData.email !== user.email ||
    formData.phone !== (user.phone || '');

  // Clean up preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        revokeImagePreview(previewUrl);
      }
    };
  }, [previewUrl]);

  // Get current avatar URL
  const currentAvatarUrl = getAvatarUrl(user.avatarPath);
  console.log('🖼️ [UserProfileForm] Current avatar URL:', currentAvatarUrl);
  console.log('🖼️ [UserProfileForm] User avatar path:', user.avatarPath);

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Ảnh Đại Diện</CardTitle>
          <CardDescription>
            Cập nhật ảnh đại diện của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <Avatar className="w-20 h-20 cursor-pointer" onClick={handleAvatarClick}>
              <AvatarImage 
                src={previewUrl || currentAvatarUrl} 
                onError={() => console.log('❌ Avatar image failed to load:', previewUrl || currentAvatarUrl)}
                onLoad={() => console.log('✅ Avatar image loaded successfully:', previewUrl || currentAvatarUrl)}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                {user.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
              >
                {isUploadingAvatar ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>{isUploadingAvatar ? 'Đang tải...' : 'Tải Ảnh Lên'}</span>
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                JPG, PNG hoặc GIF. Tối đa 2MB.
              </p>
              {isUploadingAvatar && (
                <p className="text-sm text-blue-600 mt-1">
                  Đang upload và cập nhật...
                </p>
              )}
            </div>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông Tin Cá Nhân</CardTitle>
          <CardDescription>
            Cập nhật thông tin cá nhân của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và Tên *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Nhập địa chỉ email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số Điện Thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({
                  name: user.fullName,
                  email: user.email,
                  phone: user.phone || '',
                })}
                disabled={!hasChanges || isLoading}
              >
                Hủy Thay Đổi
              </Button>
              <Button
                type="submit"
                disabled={!hasChanges || isLoading}
                className="flex items-center space-x-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Lưu Thay Đổi</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông Tin Tài Khoản</CardTitle>
          <CardDescription>
            Thông tin về tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">ID Người Dùng</Label>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">{user.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Vai Trò</Label>
              <p className="text-sm mt-1">
                {user.role === 'erp-admin' ? 'Quản Trị ERP' : 'Người Dùng'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Ngày Tạo</Label>
              <p className="text-sm mt-1">
                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Lần Đăng Nhập Cuối</Label>
              <p className="text-sm mt-1">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleString('vi-VN') : 'Chưa có'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
