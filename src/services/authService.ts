// Authentication service for API calls
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
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
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

// Convert API user to internal User type
const convertApiUserToUser = (apiUser: any): User => {
  console.log('🔄 [authService] Converting API user to internal User type');
  return {
    id: apiUser.id,
    username: apiUser.email,
    fullName: apiUser.name,
    role: 'erp-admin',
    email: apiUser.email,
    status: 'active',
    createdAt: apiUser.created_at,
    lastLogin: new Date().toISOString(),
    emailVerified: !!apiUser.email_verified_at,
    isActive: true,
    permissions: {
      modules: ['dashboard', 'customers', 'sales', 'inventory', 'accounting', 'hr', 'voucher', 'marketing', 'system-settings', 'user-management'],
      voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
      canManageUsers: true,
      canViewAllVouchers: true,
    },
    securitySettings: {
      twoFactorEnabled: false,
      loginAttemptLimit: 3,
      passwordChangeRequired: false,
      sessionTimeoutMinutes: 60,
    },
    activities: [],
  };
};

// Extract token from API response - handle multiple formats
const extractTokenFromResponse = (data: any): string | null => {
  console.log('🔍 [authService] Extracting token from response data:', JSON.stringify(data, null, 2));
  
  // Try different possible token field names
  const possibleTokenFields = ['access_token', 'token', 'authToken', 'accessToken', 'auth_token'];
  
  for (const field of possibleTokenFields) {
    if (data[field]) {
      console.log('✅ [authService] Found token in field:', field);
      return data[field];
    }
  }
  
  // Check nested structures
  if (data.data && typeof data.data === 'object') {
    for (const field of possibleTokenFields) {
      if (data.data[field]) {
        console.log('✅ [authService] Found token in nested data field:', field);
        return data.data[field];
      }
    }
  }
  
  console.error('❌ [authService] No token found in any expected fields');
  return null;
};

// Check if error indicates unverified email
const isUnverifiedEmailError = (status: number, errorData: any): boolean => {
  console.log('🔍 [authService] Checking if error indicates unverified email:', { status, errorData });
  
  // Check for specific status codes that indicate unverified email
  if (status === 422 || status === 403) {
    console.log('✅ [authService] Status code indicates potential unverified email');
    return true;
  }
  
  // Check for specific error codes or messages
  if (errorData) {
    const message = errorData.message?.toLowerCase() || '';
    const errors = JSON.stringify(errorData.errors || {}).toLowerCase();
    const code = errorData.code?.toLowerCase() || '';
    
    // Check for unverified email indicators
    const unverifiedIndicators = [
      'email_not_verified',
      'unverified',
      'verify',
      'verification',
      'activate',
      'activation',
      'confirm',
      'confirmation'
    ];
    
    const hasUnverifiedIndicator = unverifiedIndicators.some(indicator => 
      message.includes(indicator) || errors.includes(indicator) || code.includes(indicator)
    );
    
    if (hasUnverifiedIndicator) {
      console.log('✅ [authService] Found unverified email indicator in error data');
      return true;
    }
  }
  
  return false;
};

// Login API call
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  console.log('🚀 [authService] Starting login process for:', credentials.email);
  
  // Check localStorage availability
  if (!isLocalStorageAvailable()) {
    throw new Error('Trình duyệt không hỗ trợ lưu trữ dữ liệu. Vui lòng kiểm tra cài đặt trình duyệt.');
  }
  
  console.log('📡 [authService] Making API request to:', `${API_BASE_URL}/login`);
  
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  console.log('📨 [authService] Response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json();
    console.error('❌ [authService] Login failed with status:', response.status);
    console.error('❌ [authService] Full error response:', JSON.stringify(errorData, null, 2));
    
    // Check for unverified email error first
    if (isUnverifiedEmailError(response.status, errorData)) {
      throw new Error('Email chưa được xác thực. Vui lòng kiểm tra email và xác thực tài khoản trước khi đăng nhập.');
    }
    
    // Handle other 401 errors
    if (response.status === 401) {
      throw new Error('Thông tin đăng nhập không chính xác.');
    }
    
    // Handle other status codes
    throw new Error(errorData.message || 'Đăng nhập thất bại');
  }

  const data = await response.json();
  console.log('📦 [authService] Full API response:', JSON.stringify(data, null, 2));
  
  // Extract token using improved method
  const token = extractTokenFromResponse(data);
  if (!token) {
    console.error('❌ [authService] No token found in API response');
    console.error('❌ [authService] Available fields in response:', Object.keys(data));
    throw new Error('Không nhận được token từ server. Vui lòng thử lại.');
  }
  
  console.log('✅ [authService] Token extracted successfully:', token.substring(0, 20) + '...');
  
  // Store token
  storeToken(token);
  
  const loginResponse: LoginResponse = {
    access_token: token,
    token_type: data.token_type || 'Bearer',
    expires_in: data.expires_in || 3600,
    user: data.user
  };
  
  console.log('✅ [authService] Login successful for:', credentials.email);
  return loginResponse;
};

// Forgot Password API
export const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
  console.log('📧 [authService] Sending forgot password request for:', email);
  
  const response = await fetch(`${API_BASE_URL}/password/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('❌ [authService] Forgot password failed:', errorData);
    throw new Error(errorData.message || 'Không thể gửi email đặt lại mật khẩu');
  }

  console.log('✅ [authService] Forgot password request sent successfully');
  return response.json();
};

// Resend Email Verification API
export const resendVerificationEmail = async (email: string): Promise<ResendVerificationResponse> => {
  console.log('📧 [authService] Resending verification email for:', email);
  
  const response = await fetch(`${API_BASE_URL}/email/resend`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('❌ [authService] Resend verification failed:', errorData);
    throw new Error(errorData.message || 'Không thể gửi lại email xác thực');
  }

  console.log('✅ [authService] Verification email resent successfully');
  return response.json();
};

// Email Verification API
export const verifyEmail = async (id: string, hash: string): Promise<void> => {
  console.log('📧 [authService] Verifying email for ID:', id);
  
  const response = await fetch(`${API_BASE_URL}/email/verify/${id}/${hash}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('❌ [authService] Email verification failed:', errorData);
    throw new Error(errorData.message || 'Xác thực email thất bại');
  }

  console.log('✅ [authService] Email verified successfully');
};

// Update Password (for profile page) - Using /me endpoint with PUT method
export const updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  const token = getStoredToken();
  console.log('🔒 [authService] Updating password via /me endpoint');
  
  if (!token) {
    console.error('❌ [authService] No authentication token found for password update');
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}/me`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: newPassword,
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.error('❌ [authService] Token expired during password update');
      removeToken();
      throw new Error('Token hết hạn, vui lòng đăng nhập lại');
    }
    const errorData = await response.json();
    console.error('❌ [authService] Password update failed:', errorData);
    
    // Handle validation errors
    if (response.status === 422 && errorData.errors) {
      if (errorData.errors.current_password) {
        throw new Error('Mật khẩu hiện tại không chính xác');
      }
      if (errorData.errors.password) {
        throw new Error(errorData.errors.password[0] || 'Mật khẩu mới không hợp lệ');
      }
    }
    
    throw new Error(errorData.message || 'Cập nhật mật khẩu thất bại');
  }

  console.log('✅ [authService] Password updated successfully');
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
