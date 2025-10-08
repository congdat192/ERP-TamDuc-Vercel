// Mock Image Service - No real API calls

export interface ImageUploadResponse {
  path: string;
  url: string;
}

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Chỉ hỗ trợ file JPG, PNG hoặc GIF'
    };
  }

  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Kích thước file không được vượt quá 2MB'
    };
  }

  return { isValid: true };
};

export const uploadAvatar = async (file: File): Promise<ImageUploadResponse> => {
  console.log('🖼️ [mockImageService] Mock avatar upload');
  
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    path: 'mock/avatar/path.jpg',
    url: URL.createObjectURL(file)
  };
};

export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

export const revokeImagePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};
