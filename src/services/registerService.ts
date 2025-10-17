// Real Register Service with Supabase
import { supabase } from '@/integrations/supabase/client';

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
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
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        full_name: data.name,
        phone: data.phone
      }
    }
  });
  
  if (error) throw error;
  
  return {
    message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
    user: {
      id: authData.user?.id || '',
      name: data.name,
      email: data.email,
      phone: data.phone
    }
  };
};

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
