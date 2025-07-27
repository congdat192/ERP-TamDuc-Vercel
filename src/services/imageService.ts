
export const validateImageFile = (file: File) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Chỉ chấp nhận file JPG, PNG hoặc GIF'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File không được vượt quá 2MB'
    };
  }

  return { isValid: true };
};

export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

export const revokeImagePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};

export const uploadAvatar = async (file: File): Promise<{ path: string }> => {
  const formData = new FormData();
  formData.append('image', file);

  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('https://api.matkinhtamduc.xyz/api/v1/images', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Upload failed: ${error}`);
  }

  const result = await response.json();
  return { path: result.path };
};
