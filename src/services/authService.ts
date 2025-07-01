
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

// Simplified storage keys - removed session timestamp
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'erp_current_user',
};

// Get stored token
const getStoredToken = (): string | null => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    console.log('🔍 [authService] Getting stored token:', token ? `Token exists (${token.substring(0, 20)}...)` : 'No token found');
    return token;
  } catch (error) {
    console.error('❌ [authService] Failed to get stored token:', error);
    return null;
  }
};

// Simplified token storage
const storeToken = (token: string): void => {
  try {
    console.log('💾 [authService] Storing token:', token.substring(0, 20) + '...');
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    console.log('✅ [authService] Token stored successfully');
  } catch (error) {
    console.error('❌ [authService] Failed to store token:', error);
    throw new Error('Token storage failed');
  }
};

// Remove token
const removeToken = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    console.log('🗑️ [authService] Token removed successfully');
  } catch (error) {
    console.error('❌ [authService] Failed to remove token:', error);
  }
};

// Check localStorage availability
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__test_localStorage__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.error('❌ [authService] localStorage not available:', error);
    return false;
  }
};

// Login API call
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  console.log('🚀 [authService] Starting login process for:', credentials.email);
  
  // Check localStorage availability
  if (!isLocalStorageAvailable()) {
    throw new Error('Trình duyệt không hỗ trợ lưu trữ dữ liệu. Vui lòng kiểm tra cài đặt trình duyệt.');
  }
  
  console.log('📡 [authService] Making API request to:', `${API_BASE_URL}/login`);
  console.log('📋 [authService] Request payload:', { email: credentials.email, password: '***' });
  
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  console.log('📨 [authService] Response status:', response.status);
  console.log('📨 [authService] Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorData = await response.json();
    console.error('❌ [authService] Login failed with status:', response.status);
    console.error('❌ [authService] Error response:', errorData);
    throw new Error(errorData.message || 'Đăng nhập thất bại');
  }

  const data = await response.json();
  console.log('📦 [authService] Raw API response:', data);
  
  // Check for different possible token field names
  const possibleTokenFields = ['access_token', 'token', 'accessToken', 'authToken'];
  let token = null;
  
  for (const field of possibleTokenFields) {
    if (data[field]) {
      token = data[field];
      console.log(`✅ [authService] Found token in field: ${field}`);
      break;
    }
  }
  
  if (!token) {
    console.error('❌ [authService] No token found in API response');
    console.error('❌ [authService] Available fields:', Object.keys(data));
    throw new Error('Không nhận được token từ server');
  }
  
  // Store token with simplified logic
  console.log('💾 [authService] Attempting to store token...');
  try {
    storeToken(token);
    console.log('✅ [authService] Token stored successfully');
  } catch (error) {
    console.error('❌ [authService] Token storage failed:', error);
    throw new Error('Lỗi lưu trữ token');
  }
  
  // Ensure we return the expected format
  const loginResponse: LoginResponse = {
    access_token: token,
    token_type: data.token_type || 'Bearer',
    expires_in: data.expires_in || 3600,
    user: data.user || {
      id: data.id || 'unknown',
      name: data.name || credentials.email,
      email: data.email || credentials.email,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    }
  };
  
  console.log('✅ [authService] Login successful, returning formatted response');
  return loginResponse;
};

// Logout API call
export const logoutUser = async (): Promise<void> => {
  const token = getStoredToken();
  console.log('🚪 [authService] Starting logout process');
  
  if (!token) {
    console.log('⚠️ [authService] No token found during logout, cleaning up local storage');
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
      console.warn('⚠️ [authService] Logout API call failed, but continuing with local cleanup');
    } else {
      console.log('✅ [authService] Logout API call successful');
    }
  } catch (error) {
    console.warn('⚠️ [authService] Logout API call failed:', error);
  } finally {
    // Always remove token locally
    removeToken();
    console.log('🧹 [authService] Local cleanup completed');
  }
};

// Get user profile API call
export const getUserProfile = async (): Promise<UserProfile> => {
  const token = getStoredToken();
  console.log('👤 [authService] Getting user profile');
  
  if (!token) {
    console.error('❌ [authService] No authentication token found for profile request');
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
      console.error('❌ [authService] Token expired during profile request');
      removeToken();
      throw new Error('Token hết hạn, vui lòng đăng nhập lại');
    }
    const errorData = await response.json();
    console.error('❌ [authService] Profile request failed:', errorData);
    throw new Error(errorData.message || 'Không thể lấy thông tin người dùng');
  }

  console.log('✅ [authService] Profile retrieved successfully');
  return response.json();
};

// Update user profile API call
export const updateUserProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
  const token = getStoredToken();
  console.log('📝 [authService] Updating user profile');
  
  if (!token) {
    console.error('❌ [authService] No authentication token found for profile update');
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
      console.error('❌ [authService] Token expired during profile update');
      removeToken();
      throw new Error('Token hết hạn, vui lòng đăng nhập lại');
    }
    const errorData = await response.json();
    console.error('❌ [authService] Profile update failed:', errorData);
    throw new Error(errorData.message || 'Cập nhật thông tin thất bại');
  }

  console.log('✅ [authService] Profile updated successfully');
  return response.json();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const hasToken = !!getStoredToken();
  console.log('🔐 [authService] Authentication check:', hasToken ? 'Authenticated' : 'Not authenticated');
  return hasToken;
};

// Get token for other API calls
export const getAuthToken = (): string | null => {
  const token = getStoredToken();
  console.log('🔑 [authService] Getting auth token for API call:', token ? 'Token available' : 'No token');
  return token;
};
