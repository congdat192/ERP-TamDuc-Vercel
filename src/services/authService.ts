
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

// Sync with AuthContext storage keys
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'erp_current_user',
  SESSION_TIMESTAMP: 'erp_session_timestamp'
};

// Get stored token
const getStoredToken = (): string | null => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    console.log('🔍 Getting stored token:', token ? 'Token exists' : 'No token found');
    return token;
  } catch (error) {
    console.error('❌ Failed to get stored token:', error);
    return null;
  }
};

// Store token
const storeToken = (token: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.SESSION_TIMESTAMP, Date.now().toString());
    console.log('✅ Token stored successfully');
  } catch (error) {
    console.error('❌ Failed to store token:', error);
  }
};

// Remove token
const removeToken = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.SESSION_TIMESTAMP);
    console.log('🗑️ Token removed successfully');
  } catch (error) {
    console.error('❌ Failed to remove token:', error);
  }
};

// Login API call
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  console.log('🚀 Starting login process for:', credentials.email);
  
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
    console.error('❌ Login failed:', errorData);
    throw new Error(errorData.message || 'Đăng nhập thất bại');
  }

  const data = await response.json();
  console.log('✅ Login successful for:', credentials.email);
  
  // Store token immediately after successful login
  if (data.access_token) {
    storeToken(data.access_token);
    console.log('💾 Token stored after login');
  } else {
    console.error('❌ No access token in response');
  }
  
  return data;
};

// Logout API call
export const logoutUser = async (): Promise<void> => {
  const token = getStoredToken();
  console.log('🚪 Starting logout process');
  
  if (!token) {
    console.log('⚠️ No token found during logout, cleaning up local storage');
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
      console.warn('⚠️ Logout API call failed, but continuing with local cleanup');
    } else {
      console.log('✅ Logout API call successful');
    }
  } catch (error) {
    console.warn('⚠️ Logout API call failed:', error);
  } finally {
    // Always remove token locally
    removeToken();
    console.log('🧹 Local cleanup completed');
  }
};

// Get user profile API call
export const getUserProfile = async (): Promise<UserProfile> => {
  const token = getStoredToken();
  console.log('👤 Getting user profile');
  
  if (!token) {
    console.error('❌ No authentication token found for profile request');
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
      console.error('❌ Token expired during profile request');
      removeToken();
      throw new Error('Token hết hạn, vui lòng đăng nhập lại');
    }
    const errorData = await response.json();
    console.error('❌ Profile request failed:', errorData);
    throw new Error(errorData.message || 'Không thể lấy thông tin người dùng');
  }

  console.log('✅ Profile retrieved successfully');
  return response.json();
};

// Update user profile API call
export const updateUserProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
  const token = getStoredToken();
  console.log('📝 Updating user profile');
  
  if (!token) {
    console.error('❌ No authentication token found for profile update');
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
      console.error('❌ Token expired during profile update');
      removeToken();
      throw new Error('Token hết hạn, vui lòng đăng nhập lại');
    }
    const errorData = await response.json();
    console.error('❌ Profile update failed:', errorData);
    throw new Error(errorData.message || 'Cập nhật thông tin thất bại');
  }

  console.log('✅ Profile updated successfully');
  return response.json();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const hasToken = !!getStoredToken();
  console.log('🔐 Authentication check:', hasToken ? 'Authenticated' : 'Not authenticated');
  return hasToken;
};

// Get token for other API calls
export const getAuthToken = (): string | null => {
  return getStoredToken();
};
