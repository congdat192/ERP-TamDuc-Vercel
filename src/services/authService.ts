import { apiCall } from './apiService';
import { User, LoginCredentials, AuthState, CreateUserData, UpdateUserData } from '@/types/auth';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
  avatar_path?: string; // Add avatar_path support
}

export const register = async (data: CreateUserData): Promise<User> => {
  try {
    const response = await apiCall<User>('/register', {
      method: 'POST',
      data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiCall<AuthResponse>('/login', {
      method: 'POST',
      data: credentials,
    });
    localStorage.setItem('auth_token', response.token);
    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiCall('/logout', { method: 'POST' });
    localStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Logout failed:', error);
    // Consider whether to throw the error or just log it.
    throw error; // Or just: console.error(error);
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiCall<User>('/me', {
      method: 'GET',
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (data: UpdateProfileRequest): Promise<User> => {
  console.log('👤 [authService] Updating user profile:', data);
  
  try {
    const response = await apiCall<User>('/me', {
      method: 'PUT',
      data: {
        name: data.name,
        email: data.email,
        ...(data.avatar_path && { avatar_path: data.avatar_path }) // Only include if provided
      }
    });

    console.log('✅ [authService] Profile updated successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ [authService] Profile update failed:', error);
    throw error;
  }
};

export const verifyEmail = async (token: string): Promise<void> => {
  try {
    await apiCall(`/verify-email/${token}`, { method: 'GET' });
  } catch (error) {
    throw error;
  }
};

export const resendVerificationEmail = async (email: string): Promise<void> => {
  try {
    await apiCall('/resend-verification-email', {
      method: 'POST',
      data: { email },
    });
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await apiCall('/forgot-password', {
      method: 'POST',
      data: { email },
    });
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (token: string, password: string): Promise<void> => {
  try {
    await apiCall(`/reset-password/${token}`, {
      method: 'POST',
      data: { password },
    });
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (data: { currentPassword?: string; password?: string }): Promise<void> => {
  try {
    await apiCall('/change-password', {
      method: 'PUT',
      data,
    });
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id: string, data: UpdateUserData): Promise<User> => {
  try {
    const response = await apiCall<User>(`/users/${id}`, {
      method: 'PUT',
      data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (data: CreateUserData): Promise<User> => {
  try {
    const response = await apiCall<User>('/users', {
      method: 'POST',
      data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await apiCall(`/users/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    throw error;
  }
};
