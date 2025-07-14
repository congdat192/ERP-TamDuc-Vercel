
export interface RegisterRequest {
  name: string;
  email: string;
  phone: string; // Required field now
  password: string;
  password_confirmation: string;
}

export interface RegisterResponse {
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export const registerUser = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await fetch('https://api.matkinhtamduc.xyz/api/v1/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Đăng ký thất bại');
  }

  return response.json();
};

// Validation functions
export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Mật khẩu phải có ít nhất 8 ký tự');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất 1 chữ hoa');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất 1 số');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất 1 ký tự đặc biệt');
  }
  
  return errors;
};

export const validatePhone = (phone: string): boolean => {
  // Format: +84xxxxxxxxx (10-11 digits after +84)
  const phoneRegex = /^\+84[0-9]{9,10}$/;
  return phoneRegex.test(phone);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getPasswordStrength = (password: string): { strength: number; color: string; text: string } => {
  const errors = validatePassword(password);
  const strength = Math.max(0, 4 - errors.length);
  
  switch (strength) {
    case 0:
    case 1:
      return { strength: 25, color: 'bg-red-500', text: 'Yếu' };
    case 2:
      return { strength: 50, color: 'bg-yellow-500', text: 'Trung bình' };
    case 3:
      return { strength: 75, color: 'bg-blue-500', text: 'Khá' };
    case 4:
      return { strength: 100, color: 'bg-green-500', text: 'Mạnh' };
    default:
      return { strength: 0, color: 'bg-gray-300', text: '' };
  }
};
