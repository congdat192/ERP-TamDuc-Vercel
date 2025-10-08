// Mock Authentication Service - No real API calls
import { User } from '@/types/auth';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_path: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
  phone: string;
  avatar_path?: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResendVerificationResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'erp_current_user',
};

const storeToken = (token: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } catch {}
};

const removeToken = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  } catch {}
};

const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch {
    return null;
  }
};

// Mock login - always succeeds
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  console.log('🔐 [mockAuthService] Mock login for:', credentials.email);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockToken = 'mock-token-' + Date.now();
  storeToken(mockToken);
  
  return {
    access_token: mockToken,
    token_type: 'Bearer',
    expires_in: 3600,
    user: {
      id: '1',
      name: 'Mock User',
      email: credentials.email,
      email_verified_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  };
};

export const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { message: 'Email đặt lại mật khẩu đã được gửi' };
};

export const resendVerificationEmail = async (email: string): Promise<ResendVerificationResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { message: 'Email xác thực đã được gửi lại' };
};

export const verifyEmail = async (email: string, hash: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const logoutUser = async (): Promise<void> => {
  removeToken();
};

export const getUserProfile = async (): Promise<UserProfile> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    id: '1',
    name: 'Mock User',
    email: 'mock@example.com',
    phone: '+84901234567',
    avatar_path: null,
    email_verified_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export const updateUserProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    id: '1',
    name: data.name,
    email: data.email,
    phone: data.phone,
    avatar_path: data.avatar_path || null,
    email_verified_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export const isAuthenticated = (): boolean => {
  return !!getStoredToken();
};

export const resetPassword = async (
  email: string, 
  password: string, 
  password_confirmation: string, 
  token: string
): Promise<ResetPasswordResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { message: 'Mật khẩu đã được đặt lại thành công' };
};

export const getAuthToken = (): string | null => {
  return getStoredToken();
};

export function clearSelectedBusinessId(): void {
  try {
    localStorage.removeItem('cbi');
  } catch {}
}
