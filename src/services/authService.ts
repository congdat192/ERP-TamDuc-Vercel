
import { apiCall } from './apiService';
import { User, LoginCredentials, AuthState, CreateUserData, UpdateUserData } from '@/types/auth';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
  avatar_path?: string;
}

export const register = async (data: CreateUserData): Promise<User> => {
  try {
    const response = await apiCall<User>('/register', {
      method: 'POST',
      body: data,
      requiresBusinessId: false,
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
      body: credentials,
      requiresBusinessId: false,
    });
    localStorage.setItem('auth_token', response.token);
    return response;
  } catch (error) {
    throw error;
  }
};

// Alias for compatibility with AuthContext
export const loginUser = login;

export const logout = async (): Promise<void> => {
  try {
    await apiCall('/logout', { 
      method: 'POST',
      requiresBusinessId: false,
    });
    localStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

// Alias for compatibility with AuthContext
export const logoutUser = logout;

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiCall<User>('/me', {
      method: 'GET',
      requiresBusinessId: false,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Alias for compatibility with AuthContext
export const getUserProfile = getCurrentUser;

export const updateUserProfile = async (data: UpdateProfileRequest): Promise<User> => {
  console.log('👤 [authService] Updating user profile:', data);
  
  try {
    const response = await apiCall<User>('/me', {
      method: 'PUT',
      body: {
        name: data.name,
        email: data.email,
        ...(data.avatar_path && { avatar_path: data.avatar_path })
      },
      requiresBusinessId: false,
    });

    console.log('✅ [authService] Profile updated successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ [authService] Profile update failed:', error);
    throw error;
  }
};

export const verifyEmail = async (id: string, hash: string): Promise<void> => {
  try {
    await apiCall(`/email/verify/${id}/${hash}`, { 
      method: 'GET',
      requiresBusinessId: false,
    });
  } catch (error) {
    throw error;
  }
};

export const resendVerificationEmail = async (email: string): Promise<void> => {
  try {
    await apiCall('/email/resend', {
      method: 'POST',
      body: { email },
      requiresBusinessId: false,
    });
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await apiCall('/password/email', {
      method: 'POST',
      body: { email },
      requiresBusinessId: false,
    });
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email: string, password: string, password_confirmation: string, token: string): Promise<void> => {
  try {
    await apiCall('/password/reset', {
      method: 'POST',
      body: { 
        email, 
        password, 
        password_confirmation, 
        token 
      },
      requiresBusinessId: false,
    });
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (data: { currentPassword?: string; password?: string }): Promise<void> => {
  try {
    await apiCall('/change-password', {
      method: 'PUT',
      body: data,
      requiresBusinessId: false,
    });
  } catch (error) {
    throw error;
  }
};

// Add updatePassword function for compatibility
export const updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    await apiCall('/change-password', {
      method: 'PUT',
      body: {
        currentPassword,
        password: newPassword,
      },
      requiresBusinessId: false,
    });
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id: string, data: UpdateUserData): Promise<User> => {
  try {
    const response = await apiCall<User>(`/users/${id}`, {
      method: 'PUT',
      body: data,
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
      body: data,
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
