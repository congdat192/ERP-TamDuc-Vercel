import { supabase } from '@/integrations/supabase/client';

export class AvatarService {
  /**
   * Validate avatar file (max 2MB, only JPG/PNG)
   */
  static validateFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Chỉ hỗ trợ file JPG hoặc PNG'
      };
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Kích thước file không được vượt quá 2MB'
      };
    }

    return { isValid: true };
  }

  /**
   * Upload avatar to Storage
   */
  static async uploadAvatar(file: File, employeeId: string): Promise<string> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Create unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${employeeId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('employee-avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        throw new Error(`Không thể upload avatar: ${uploadError.message}`);
      }

      console.log('✅ Avatar uploaded successfully:', filePath);
      return filePath;
    } catch (error: any) {
      console.error('❌ Error uploading avatar:', error);
      throw error;
    }
  }

  /**
   * Delete avatar from Storage
   */
  static async deleteAvatar(avatarPath: string): Promise<void> {
    try {
      if (!avatarPath) return;

      const { error } = await supabase.storage
        .from('employee-avatars')
        .remove([avatarPath]);

      if (error) {
        console.error('❌ Delete error:', error);
        throw new Error(`Không thể xóa avatar: ${error.message}`);
      }

      console.log('✅ Avatar deleted successfully:', avatarPath);
    } catch (error: any) {
      console.error('❌ Error deleting avatar:', error);
      throw error;
    }
  }

  /**
   * Get public URL for avatar
   */
  static getAvatarUrl(path: string | null | undefined): string {
    if (!path) return '';

    const { data } = supabase.storage
      .from('employee-avatars')
      .getPublicUrl(path);

    return data.publicUrl;
  }

  /**
   * Create preview URL for file
   */
  static createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * Revoke preview URL
   */
  static revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}
