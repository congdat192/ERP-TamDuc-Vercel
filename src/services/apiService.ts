
// Centralized API service with automatic header injection
export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  requiresAuth?: boolean;
  requiresBusinessId?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

const API_BASE_URL = 'https://api.matkinhtamduc.xyz/api/v1';

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  SELECTED_BUSINESS_ID: 'cbi',
};

// Rate limiting and retry configuration
const RATE_LIMIT_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
};

// Request tracking for rate limiting
const requestTracker = {
  lastRequestTime: 0,
  requestCount: 0,
  resetTime: 0,
  minDelay: 100, // Minimum delay between requests
};

// Migration function to move from old keys to new keys
const migrateLegacyBusinessId = (): void => {
  try {
    const legacyKeys = ['selected_business_id', 'selectedBusinessId'];
    
    for (const legacyKey of legacyKeys) {
      const legacyBusinessId = localStorage.getItem(legacyKey);
      
      if (legacyBusinessId && !localStorage.getItem(STORAGE_KEYS.SELECTED_BUSINESS_ID)) {
        localStorage.setItem(STORAGE_KEYS.SELECTED_BUSINESS_ID, legacyBusinessId);
        localStorage.removeItem(legacyKey);
        console.log(`🔄 [apiService] Migrated business ID from ${legacyKey} to cbi`);
        break;
      }
    }
  } catch (error) {
    console.error('❌ [apiService] Failed to migrate legacy business ID:', error);
  }
};

// Run migration on module load
migrateLegacyBusinessId();

// Get stored token
const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('❌ [apiService] Failed to get stored token:', error);
    return null;
  }
};

// Get selected business ID
export const getSelectedBusinessId = (): string | null => {
  try {
    const businessId = localStorage.getItem(STORAGE_KEYS.SELECTED_BUSINESS_ID);
    console.log('🏢 [apiService] Getting selected business ID from cbi:', businessId);
    return businessId;
  } catch (error) {
    console.error('❌ [apiService] Failed to get selected business ID:', error);
    return null;
  }
};

// Set selected business ID
export const setSelectedBusinessId = (businessId: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_BUSINESS_ID, businessId);
    console.log('💾 [apiService] Stored selected business ID to cbi:', businessId);
  } catch (error) {
    console.error('❌ [apiService] Failed to store selected business ID:', error);
  }
};

// Clear selected business ID
export const clearSelectedBusinessId = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.SELECTED_BUSINESS_ID);
    console.log('🗑️ [apiService] Cleared selected business ID (cbi)');
  } catch (error) {
    console.error('❌ [apiService] Failed to clear selected business ID:', error);
  }
};

// Rate limiting function
const waitForRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const timeSinceLastRequest = now - requestTracker.lastRequestTime;
  
  if (timeSinceLastRequest < requestTracker.minDelay) {
    const waitTime = requestTracker.minDelay - timeSinceLastRequest;
    console.log(`⏱️ [apiService] Rate limiting: waiting ${waitTime}ms`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  requestTracker.lastRequestTime = Date.now();
};

// Check if error is business-related
const isBusinessError = (error: any): boolean => {
  if (!error) return false;
  
  const message = error.message?.toLowerCase() || '';
  const errorStr = JSON.stringify(error).toLowerCase();
  
  const businessErrorIndicators = [
    'missing x-business-id',
    'invalid business',
    'business not found',
    'business_not_found',
    'unauthorized business',
    'business access denied'
  ];
  
  return businessErrorIndicators.some(indicator => 
    message.includes(indicator) || errorStr.includes(indicator)
  );
};

// Check if error is rate limit related
const isRateLimitError = (error: any, status?: number): boolean => {
  if (status === 429) return true;
  
  const message = error.message?.toLowerCase() || '';
  const rateLimitIndicators = [
    'too many requests',
    'rate limit',
    'rate exceeded',
    '429'
  ];
  
  return rateLimitIndicators.some(indicator => message.includes(indicator));
};

// Handle business-related errors
const handleBusinessError = (): void => {
  console.log('🚨 [apiService] Business error detected, clearing context and redirecting');
  
  clearSelectedBusinessId();
  
  if (window.clearBusinessContext) {
    window.clearBusinessContext();
  }
  
  window.location.href = '/business-selection';
};

// Build headers with automatic injection
const buildHeaders = (config: ApiRequestConfig): Record<string, string> => {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...config.headers,
  };

  if (config.body && config.method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }

  if (config.requiresAuth !== false) {
    const token = getStoredToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('🔑 [apiService] Added Authorization header');
    } else {
      console.warn('⚠️ [apiService] No auth token found for API request');
    }
  }

  if (config.requiresBusinessId !== false) {
    const businessId = getSelectedBusinessId();
    if (businessId) {
      headers['X-Business-Id'] = businessId;
      console.log('🏢 [apiService] Added X-Business-Id header:', businessId);
    } else {
      console.warn('⚠️ [apiService] No business ID found for API request');
    }
  }

  return headers;
};

// Retry function with exponential backoff
const retryRequest = async (
  url: string,
  options: RequestInit,
  retryCount: number = 0
): Promise<Response> => {
  try {
    await waitForRateLimit();
    
    console.log(`🚀 [apiService] ${options.method || 'GET'} ${url} (attempt ${retryCount + 1})`);
    const response = await fetch(url, options);
    
    // If rate limited, implement exponential backoff
    if (response.status === 429 && retryCount < RATE_LIMIT_CONFIG.maxRetries) {
      const delay = Math.min(
        RATE_LIMIT_CONFIG.baseDelay * Math.pow(RATE_LIMIT_CONFIG.backoffMultiplier, retryCount),
        RATE_LIMIT_CONFIG.maxDelay
      );
      
      console.log(`🔄 [apiService] Rate limited (429), retrying in ${delay}ms (attempt ${retryCount + 1}/${RATE_LIMIT_CONFIG.maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return retryRequest(url, options, retryCount + 1);
    }
    
    return response;
  } catch (error) {
    // Network errors - retry with exponential backoff
    if (retryCount < RATE_LIMIT_CONFIG.maxRetries) {
      const delay = Math.min(
        RATE_LIMIT_CONFIG.baseDelay * Math.pow(RATE_LIMIT_CONFIG.backoffMultiplier, retryCount),
        RATE_LIMIT_CONFIG.maxDelay
      );
      
      console.log(`🔄 [apiService] Network error, retrying in ${delay}ms (attempt ${retryCount + 1}/${RATE_LIMIT_CONFIG.maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return retryRequest(url, options, retryCount + 1);
    }
    
    throw error;
  }
};

// Main API call function
export const apiCall = async <T>(
  endpoint: string,
  config: ApiRequestConfig = {}
): Promise<T> => {
  const {
    method = 'GET',
    body,
    requiresAuth = true,
    requiresBusinessId = true,
  } = config;

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = buildHeaders(config);

  console.log(`🚀 [apiService] ${method} ${url}`);
  console.log('📋 [apiService] Headers:', Object.keys(headers));

  try {
    const response = await retryRequest(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log(`📨 [apiService] Response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'API request failed' }));
      
      // Handle rate limiting errors
      if (isRateLimitError(errorData, response.status)) {
        console.error('❌ [apiService] Rate limit error:', errorData);
        throw new Error('Quá nhiều yêu cầu. Vui lòng đợi một chút và thử lại.');
      }
      
      // Check for business-related errors
      if (isBusinessError(errorData)) {
        console.error('❌ [apiService] Business error detected:', errorData);
        handleBusinessError();
        throw new Error('Lỗi doanh nghiệp, đang chuyển hướng...');
      }

      console.error('❌ [apiService] API Error:', errorData);
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ [apiService] API call successful');
    return data;
  } catch (error) {
    console.error('❌ [apiService] API call failed:', error);
    
    // Check if the error is business-related
    if (isBusinessError(error)) {
      handleBusinessError();
    }
    
    throw error;
  }
};

// Convenience methods
export const api = {
  get: <T>(endpoint: string, config?: Omit<ApiRequestConfig, 'method'>) =>
    apiCall<T>(endpoint, { ...config, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
    apiCall<T>(endpoint, { ...config, method: 'POST', body }),

  put: <T>(endpoint: string, body?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
    apiCall<T>(endpoint, { ...config, method: 'PUT', body }),

  delete: <T>(endpoint: string, config?: Omit<ApiRequestConfig, 'method'>) =>
    apiCall<T>(endpoint, { ...config, method: 'DELETE' }),
};

// Extend window object for business context cleanup
declare global {
  interface Window {
    clearBusinessContext?: () => void;
  }
}
