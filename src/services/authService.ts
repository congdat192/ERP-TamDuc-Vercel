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
  avatar?: string;
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

// Check if error indicates email not found/doesn't exist - MOVED TO FIRST POSITION
const isEmailNotFoundError = (status: number, errorData: any): boolean => {
  console.log('🔍 [authService] Checking if error indicates email not found:', { status, errorData });
  
  // Check both 404 and 422 responses for email not found scenarios
  if (status === 404 || status === 422) {
    if (errorData && errorData.message) {
      const message = errorData.message.toLowerCase();
      
      const notFoundIndicators = [
        'user not found',
        'email not found', 
        'không tìm thấy người dùng',
        'email không tồn tại',
        'user does not exist',
        'email does not exist',
        'no user found',
        'không tồn tại',
        'these credentials do not match our records'  // Common Laravel message for user not found
      ];
      
      const hasNotFoundIndicator = notFoundIndicators.some(indicator => 
        message.includes(indicator)
      );
      
      console.log('🔍 [authService] Email not found check result:', hasNotFoundIndicator);
      return hasNotFoundIndicator;
    }
  }
  
  return false;
};

// Check if error indicates unverified email - MOVED TO SECOND POSITION  
const isUnverifiedEmailError = (status: number, errorData: any): boolean => {
  console.log('🔍 [authService] Checking if error indicates unverified email:', { status, errorData });
  
  // Check for unverified email - typically 403 status with specific message
  if (status === 403 || status === 422) {
    if (errorData && errorData.message) {
      const message = errorData.message.toLowerCase();
      
      // Specific indicators for unverified email
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
  }
  
  return false;
};

// Check if error is due to incorrect password (but user exists) - MOVED TO THIRD POSITION
const isIncorrectPasswordError = (status: number, errorData: any): boolean => {
  console.log('🔍 [authService] Checking if error indicates incorrect password:', { status, errorData });
  
  // Typically 401 or 422 with credential-related messages
  if (status === 401 || status === 422) {
    if (errorData && errorData.message) {
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
  }
  
  return false;
};

// Login API call with improved error handling - REORDERED LOGIC
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
    
    // REORDERED ERROR HANDLING - CHECK SPECIFIC CASES FIRST
    
    // 1. FIRST: Check for email not found (highest priority)
    if (isEmailNotFoundError(response.status, errorData)) {
      throw new Error('Email không tồn tại trong hệ thống. Vui lòng đăng ký tài khoản mới.');
    }
    
    // 2. SECOND: Check for unverified email
    if (isUnverifiedEmailError(response.status, errorData)) {
      throw new Error('Email chưa được xác thực. Vui lòng kiểm tra email và xác thực tài khoản trước khi đăng nhập.');
    }
    
    // 3. THIRD: Check for incorrect password (user exists but wrong password)
    if (isIncorrectPasswordError(response.status, errorData)) {
      throw new Error('Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại email và mật khẩu.');
    }
    
    // 4. FOURTH: Handle 401 - Generic authentication failure (if not caught above)
    if (response.status === 401) {
      throw new Error('Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại email và mật khẩu.');
    }
    
    // 5. FIFTH: Handle validation errors (422) ONLY for actual format issues
    if (response.status === 422 && errorData.errors) {
      // Check if this is actually a format validation error (not credential error)
      if (errorData.errors.email) {
        const emailErrorMessage = Array.isArray(errorData.errors.email) 
          ? errorData.errors.email[0].toLowerCase() 
          : errorData.errors.email.toLowerCase();
        
        // Only treat as format error if message indicates actual format issues
        const formatErrorIndicators = [
          'invalid email format',
          'email must be valid',
          'email không đúng định dạng',
          'định dạng email',
          'format email',
          'email address is invalid',
          'please enter a valid email'
        ];
        
        const isActualFormatError = formatErrorIndicators.some(indicator => 
          emailErrorMessage.includes(indicator)
        );
        
        if (isActualFormatError) {
          console.log('🔍 [authService] Actual email format validation error detected');
          throw new Error('Email không đúng định dạng.');
        }
      }
      
      if (errorData.errors.password) {
        const passwordErrorMessage = Array.isArray(errorData.errors.password) 
          ? errorData.errors.password[0].toLowerCase() 
          : errorData.errors.password.toLowerCase();
        
        // Only treat as format error if message indicates actual format issues
        const formatErrorIndicators = [
          'password must be',
          'password should be',
          'mật khẩu phải',
          'độ dài mật khẩu',
          'password length',
          'password format'
        ];
        
        const isActualFormatError = formatErrorIndicators.some(indicator => 
          passwordErrorMessage.includes(indicator)
        );
        
        if (isActualFormatError) {
          console.log('🔍 [authService] Actual password format validation error detected');
          throw new Error('Mật khẩu không hợp lệ.');
        }
      }
    }
    
    // 6. Handle server errors
    if (response.status >= 500) {
      throw new Error('Lỗi server. Vui lòng thử lại sau.');
    }
    
    // 7. Default error message with more details for debugging
    const defaultMessage = errorData.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
    console.error('❌ [authService] Unhandled error case:', { status: response.status, message: defaultMessage });
    throw new Error(defaultMessage);
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
      console.error('❌ [authService] Authentication failed during password update');
      removeToken();
      throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
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
      console.error('❌ [authService] Authentication failed during profile request');
      removeToken();
      throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
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
      console.error('❌ [authService] Authentication failed during profile update');
      removeToken();
      throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
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

// Reset Password API
export const resetPassword = async (
  email: string, 
  password: string, 
  password_confirmation: string, 
  token: string
): Promise<ResetPasswordResponse> => {
  console.log('🔒 [authService] Resetting password for:', email);
  
  const response = await fetch(`${API_BASE_URL}/password/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      password_confirmation,
      token,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('❌ [authService] Reset password failed:', errorData);
    
    // Handle specific error cases
    if (response.status === 422 && errorData.errors) {
      if (errorData.errors.token) {
        throw new Error('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');
      }
      if (errorData.errors.email) {
        throw new Error('Email không hợp lệ');
      }
      if (errorData.errors.password) {
        throw new Error(errorData.errors.password[0] || 'Mật khẩu không hợp lệ');
      }
    }
    
    throw new Error(errorData.message || 'Không thể đặt lại mật khẩu');
  }

  console.log('✅ [authService] Password reset successfully');
  return response.json();
};

// Get token for other API calls
export const getAuthToken = (): string | null => {
  const token = getStoredToken();
  console.log('🔑 [authService] Getting auth token for API call:', token ? 'Token available' : 'No token');
  return token;
};
