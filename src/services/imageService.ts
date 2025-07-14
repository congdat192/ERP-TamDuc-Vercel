
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

  // Create FormData with required type field
  const formData = new FormData();
  formData.append('image', file);
  formData.append('type', 'avatar'); // Required field for avatar upload

  try {
    // Use fetch directly for FormData upload
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Không tìm thấy token xác thực');
    }

    console.log('📤 [imageService] Uploading with type=avatar');
    
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
      console.error('❌ [imageService] Upload failed:', errorData);
      throw new Error(errorData.message || 'Upload ảnh thất bại');
    }

    const data = await response.json();
    console.log('✅ [imageService] Upload successful:', data);
    
    // Ensure we return the correct format
    return {
      path: data.path,
      url: data.url
    };
  } catch (error) {
    console.error('❌ [imageService] Upload error:', error);
    throw error;
  }
};

// Generate preview URL for selected file
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

// Clean up preview URL
export const revokeImagePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};
