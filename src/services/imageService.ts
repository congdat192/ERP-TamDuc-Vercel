
import { apiCall } from './apiService';

export interface ImageUploadResponse {
  path: string;
  url: string;
}

export interface ImageUploadError {
  message: string;
  errors?: Record<string, string[]>;
}

// Validate file before upload
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Chỉ hỗ trợ file JPG, PNG hoặc GIF'
    };
  }

  // Check file size (2MB limit)
  const maxSize = 2 * 1024 * 1024; // 2MB in bytes
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Kích thước file không được vượt quá 2MB'
    };
  }

  return { isValid: true };
};

// Upload avatar image
export const uploadAvatar = async (file: File): Promise<ImageUploadResponse> => {
  console.log('🖼️ [imageService] Starting avatar upload:', file.name);
  
  // Validate file first
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Try different type values for avatar
  const typeVariants = ['avatar', 'profile', 'user_avatar', 'image'];
  
  for (const typeValue of typeVariants) {
    try {
      console.log(`🔄 [imageService] Trying avatar type: ${typeValue}`);
      
      // Create FormData
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', typeValue);

      // Use fetch directly for FormData upload (don't use apiCall as it adds JSON headers)
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await fetch('https://api.matkinhtamduc.xyz/api/v1/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          // Don't set Content-Type for FormData - browser will set it automatically with boundary
        },
        body: formData,
      });

      console.log('📨 [imageService] Upload response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Upload thất bại' }));
        console.error(`❌ [imageService] Upload failed with type ${typeValue}:`, errorData);
        
        // Continue to next type variant
        if (typeVariants.indexOf(typeValue) < typeVariants.length - 1) {
          continue;
        }
        
        throw new Error(errorData.message || 'Upload ảnh thất bại');
      }

      const data = await response.json();
      console.log(`✅ [imageService] Upload successful with type ${typeValue}:`, data);
      
      // Ensure we return the correct format
      return {
        path: data.path,
        url: data.url
      };
    } catch (error) {
      console.error(`❌ [imageService] Upload error with type ${typeValue}:`, error);
      
      // If this is the last variant, throw the error
      if (typeVariants.indexOf(typeValue) === typeVariants.length - 1) {
        throw error;
      }
    }
  }
  
  throw new Error('Không thể upload avatar với bất kỳ format nào.');
};

// Generate preview URL for selected file
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

// Clean up preview URL
export const revokeImagePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};
