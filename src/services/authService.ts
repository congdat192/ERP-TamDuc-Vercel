
// Authentication service for API calls
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
    created_at: string;
    updated_at: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

const API_BASE_URL = 'https://api.matkinhtamduc.xyz/api/v1';

// Get stored token
const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem('auth_token');
  } catch (error) {
    return null;
  }
};

// Store token
const storeToken = (token: string): void => {
  try {
    localStorage.setItem('auth_token', token);
  } catch (error) {
    console.warn('Failed to store token:', error);
  }
};

// Remove token
const removeToken = (): void => {
  try {
    localStorage.removeItem('auth_token');
  } catch (error) {
    console.warn('Failed to remove token:', error);
  }
};

// Login API call
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Đăng nhập thất bại');
  }

  const data = await response.json();
  
  // Store token after successful login
  if (data.access_token) {
    storeToken(data.access_token);
  }
  
  return data;
};

// Logout API call
export const logoutUser = async (): Promise<void> => {
  const token = getStoredToken();
  
  if (!token) {
    removeToken();
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn('Logout API call failed, but continuing with local cleanup');
    }
  } catch (error) {
    console.warn('Logout API call failed:', error);
  } finally {
    // Always remove token locally
    removeToken();
  }
};

// Get user profile API call
export const getUserProfile = async (): Promise<UserProfile> => {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
      throw new Error('Token hết hạn, vui lòng đăng nhập lại');
    }
    const errorData = await response.json();
    throw new Error(errorData.message || 'Không thể lấy thông tin người dùng');
  }

  return response.json();
};

// Update user profile API call
export const updateUserProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}/me`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
      throw new Error('Token hết hạn, vui lòng đăng nhập lại');
    }
    const errorData = await response.json();
    throw new Error(errorData.message || 'Cập nhật thông tin thất bại');
  }

  return response.json();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getStoredToken();
};

// Get token for other API calls
export const getAuthToken = (): string | null => {
  return getStoredToken();
};
