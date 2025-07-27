
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
  const response = await apiClient.post('/login', credentials);
  
  // Save token to localStorage
  localStorage.setItem('auth_token', response.data.token);
  
  return response.data;
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
  return response.data;
};

export const updateUserProfile = async (userData: {
  name: string;
  email: string;
  phone?: string;
  avatar_path?: string;
}): Promise<any> => {
  const response = await apiClient.put('/me', userData);
  return response.data;
};
