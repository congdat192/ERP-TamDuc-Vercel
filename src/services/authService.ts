// Authentication service for API calls
import { User, getAvatarUrl } from '@/types/auth';
import { api } from './apiService';

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

export interface ResetPasswordRequest {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}

export interface ResetPasswordResponse {
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
    phone: apiUser.phone,
    status: 'active',
    createdAt: apiUser.created_at,
    lastLogin: new Date().toISOString(),
    emailVerified: !!apiUser.email_verified_at,
    isActive: true,
    avatarPath: apiUser.avatar_path, // Map avatar_path correctly
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
    },
    activities: [],
  };
};

// Improved token extraction with detailed logging
const extractTokenFromResponse = (data: any): string | null => {
  console.log('🔍 [authService] Extracting token from response data:', JSON.stringify(data, null, 2));
  
  // Check for direct token field in response
  if (data.token) {
    console.log('✅ [authService] Found token in "token" field:', data.token.substring(0, 20) + '...');
    return data.token;
  }
  
  // Check for access_token field
  if (data.access_token) {
    console.log('✅ [authService] Found token in "access_token" field:', data.access_token.substring(0, 20) + '...');
    return data.access_token;
  }
  
  // Check nested data structure
  if (data.data && typeof data.data === 'object') {
    if (data.data.token) {
      console.log('✅ [authService] Found token in nested "data.token" field:', data.data.token.substring(0, 20) + '...');
      return data.data.token;
    }
    
    if (data.data.access_token) {
      console.log('✅ [authService] Found token in nested "data.access_token" field:', data.data.access_token.substring(0, 20) + '...');
      return data.data.access_token;
    }
  }
  
  console.error('❌ [authService] No token found in response. Available fields:', Object.keys(data));
  return null;
};

// Check if error indicates email not found - ONLY for error responses
const isEmailNotFoundError = (status: number, errorData: any): boolean => {
  console.log('🔍 [authService] Checking email not found error:', { status, errorData });
  
  // Only process error responses
  if (status >= 400 && errorData && errorData.message) {
    const message = errorData.message.toLowerCase();
    
    const notFoundIndicators = [
      'user not found',
      'email not found', 
      'không tìm thấy người dùng',
      'email không tồn tại',
      'user does not exist',
      'email does not exist',
      'no user found',
      'these credentials do not match our records'
    ];
    
    const hasNotFoundIndicator = notFoundIndicators.some(indicator => 
      message.includes(indicator)
    );
    
    console.log('🔍 [authService] Email not found check result:', hasNotFoundIndicator);
    return hasNotFoundIndicator;
  }
  
  return false;
};

// Check if error indicates unverified email - ONLY for error responses
const isUnverifiedEmailError = (status: number, errorData: any): boolean => {
  console.log('🔍 [authService] Checking unverified email error:', { status, errorData });
  
  // Only process error responses
  if (status >= 400 && errorData && errorData.message) {
    const message = errorData.message.toLowerCase();
    
    const unverifiedIndicators = [
      'email not verified',
      'email chưa được xác thực',
      'verify your email',
      'email verification required',
      'account not verified',
      'please verify',
      'chưa xác thực',
      'email address is not verified'
    ];
    
    const hasUnverifiedIndicator = unverifiedIndicators.some(indicator => 
      message.includes(indicator)
    );
    
    console.log('🔍 [authService] Unverified email check result:', hasUnverifiedIndicator);
    return hasUnverifiedIndicator;
  }
  
  return false;
};

// Check if error is due to incorrect password - ONLY for error responses
const isIncorrectPasswordError = (status: number, errorData: any): boolean => {
  console.log('🔍 [authService] Checking incorrect password error:', { status, errorData });
  
  // Only process error responses
  if (status >= 400 && errorData && errorData.message) {
    const message = errorData.message.toLowerCase();
    
    const incorrectPasswordIndicators = [
      'invalid credentials',
      'wrong password',
      'incorrect password',
      'mật khẩu không đúng',
      'sai mật khẩu',
      'credentials do not match',
      'authentication failed',
      'login failed'
    ];
    
    const hasIncorrectPasswordIndicator = incorrectPasswordIndicators.some(indicator => 
      message.includes(indicator)
    );
    
    console.log('🔍 [authService] Incorrect password check result:', hasIncorrectPasswordIndicator);
    return hasIncorrectPasswordIndicator;
  }
  
  return false;
};

// Login API call with improved error handling and success detection
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
  console.log('📨 [authService] Response headers:', Object.fromEntries(response.headers.entries()));

  const data = await response.json();
  console.log('📦 [authService] Full API response:', JSON.stringify(data, null, 2));

  // SUCCESS CASE: Handle successful login (200 OK)
  if (response.ok) {
    console.log('✅ [authService] Login request successful, processing response...');
    
    // Extract token from successful response
    const token = extractTokenFromResponse(data);
    if (!token) {
      console.error('❌ [authService] No token found in successful response');
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
  }

  // ERROR CASE: Handle error responses only
  console.error('❌ [authService] Login failed with status:', response.status);
  console.error('❌ [authService] Full error response:', JSON.stringify(data, null, 2));
  
  // Check for specific error types (only for error responses)
  if (isEmailNotFoundError(response.status, data)) {
    throw new Error('Email không tồn tại trong hệ thống. Vui lòng đăng ký tài khoản mới.');
  }
  
  if (isUnverifiedEmailError(response.status, data)) {
    throw new Error('Email chưa được xác thực. Vui lòng kiểm tra email và xác thực tài khoản trước khi đăng nhập.');
  }
  
  if (isIncorrectPasswordError(response.status, data)) {
    throw new Error('Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại email và mật khẩu.');
  }
  
  // Handle specific HTTP status codes
  if (response.status === 401) {
    throw new Error('Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại email và mật khẩu.');
  }
  
  if (response.status === 422 && data.errors) {
    // Handle validation errors
    const errorMessages = [];
    if (data.errors.email) {
      errorMessages.push('Thông tin đăng nhập chưa chính xác');
    }
    if (data.errors.password) {
      errorMessages.push('Thông tin đăng nhập chưa chính xác');
    }
    if (errorMessages.length > 0) {
      throw new Error(errorMessages[0]);
    }
  }
  
  if (response.status >= 500) {
    throw new Error('Lỗi server. Vui lòng thử lại sau.');
  }
  
  // Default error message
  const defaultMessage = data.message || 'Thông tin đăng nhập không chính xác. Vui lòng thử lại.';
  console.error('❌ [authService] Unhandled error case:', { status: response.status, message: defaultMessage });
  throw new Error(defaultMessage);
};

// Forgot Password API
export const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
  console.log('📧 [authService] Sending forgot password request for:', email);
  
  return api.post('/password/email', { email }, { 
    requiresAuth: false,
    requiresBusinessId: false 
  });
};

// Resend Email Verification API
export const resendVerificationEmail = async (email: string): Promise<ResendVerificationResponse> => {
  console.log('📧 [authService] Resending verification email for:', email);
  
  return api.post('/email/resend', { email }, { 
    requiresAuth: false,
    requiresBusinessId: false 
  });
};

// Email Verification API - UPDATED to use new POST endpoint
export const verifyEmail = async (email: string, hash: string): Promise<void> => {
  console.log('📧 [authService] Verifying email using new POST API:', email);
  
  return api.post('/email/verify', { email, hash }, { 
    requiresAuth: false,
    requiresBusinessId: false 
  });
};

// Update Password (for profile page) - Using /me endpoint with PUT method
export const updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  console.log('🔒 [authService] Updating password via /me endpoint');
  
  return api.put('/me', {
    current_password: currentPassword,
    password: newPassword,
    password_confirmation: newPassword,
  });
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
    await api.post('/logout');
    console.log('✅ [authService] Logout API call successful');
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
  console.log('👤 [authService] Getting user profile');
  
  return api.get('/me');
};

// Update user profile API call
export const updateUserProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
  console.log('📝 [authService] Updating user profile');
  
  return api.put('/me', data);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const hasToken = !!getStoredToken();
  console.log('🔐 [authService] Authentication check:', hasToken ? 'Authenticated' : 'Not authenticated');
  return hasToken;
};

// Reset Password API
export const resetPassword = async (
  email: string, 
  password: string, 
  password_confirmation: string, 
  token: string
): Promise<ResetPasswordResponse> => {
  console.log('🔒 [authService] Resetting password for:', email);
  
  return api.post('/password/reset', {
    email,
    password,
    password_confirmation,
    token,
  }, { 
    requiresAuth: false,
    requiresBusinessId: false 
  });
};

// Get token for other API calls
export const getAuthToken = (): string | null => {
  const token = getStoredToken();
  console.log('🔑 [authService] Getting auth token for API call:', token ? 'Token available' : 'No token');
  return token;
};
