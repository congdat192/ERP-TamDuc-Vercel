
import { apiClient } from '@/lib/api-client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: any;
  token: string;
}

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/login', credentials);
  
  // Handle the response properly
  if (response && typeof response === 'object' && 'token' in response) {
    // Save token to localStorage
    localStorage.setItem('auth_token', response.token);
    return response as LoginResponse;
  }
  
  throw new Error('Invalid login response');
};

export const logoutUser = async (): Promise<void> => {
  try {
    await apiClient.post('/logout');
  } finally {
    // Always clear token, even if logout fails
    localStorage.removeItem('auth_token');
  }
};

export const getUserProfile = async (): Promise<any> => {
  const response = await apiClient.get('/me');
  return response;
};

export const updateUserProfile = async (userData: {
  name: string;
  email: string;
  phone?: string;
  avatar_path?: string;
}): Promise<any> => {
  const response = await apiClient.put('/me', userData);
  return response;
};

export const verifyEmail = async (email: string, hash: string): Promise<any> => {
  const response = await apiClient.post('/email/verify', { email, hash });
  return response;
};

export const resendVerificationEmail = async (email: string): Promise<any> => {
  const response = await apiClient.post('/email/resend', { email });
  return response;
};

export const forgotPassword = async (email: string): Promise<any> => {
  const response = await apiClient.post('/password/email', { email });
  return response;
};

export const resetPassword = async (data: {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}): Promise<any> => {
  const response = await apiClient.post('/password/reset', data);
  return response;
};

export const updatePassword = async (data: {
  current_password: string;
  password: string;
  password_confirmation: string;
}): Promise<any> => {
  const response = await apiClient.put('/password', data);
  return response;
};
