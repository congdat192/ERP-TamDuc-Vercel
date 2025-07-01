
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
  SELECTED_BUSINESS_ID: 'selected_business_id',
};

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
    console.log('🏢 [apiService] Getting selected business ID:', businessId);
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
    console.log('💾 [apiService] Stored selected business ID:', businessId);
  } catch (error) {
    console.error('❌ [apiService] Failed to store selected business ID:', error);
  }
};

// Clear selected business ID
export const clearSelectedBusinessId = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.SELECTED_BUSINESS_ID);
    console.log('🗑️ [apiService] Cleared selected business ID');
  } catch (error) {
    console.error('❌ [apiService] Failed to clear selected business ID:', error);
  }
};

// Build headers with automatic injection
const buildHeaders = (config: ApiRequestConfig): Record<string, string> => {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...config.headers,
  };

  // Add Content-Type for requests with body
  if (config.body && config.method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }

  // Add Authorization header if required
  if (config.requiresAuth !== false) { // default to true
    const token = getStoredToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('🔑 [apiService] Added Authorization header');
    } else {
      console.warn('⚠️ [apiService] No auth token found for API request');
    }
  }

  // Add Business ID header if required
  if (config.requiresBusinessId) {
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

// Main API call function
export const apiCall = async <T>(
  endpoint: string,
  config: ApiRequestConfig = {}
): Promise<T> => {
  const {
    method = 'GET',
    body,
    requiresAuth = true,
    requiresBusinessId = false,
  } = config;

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = buildHeaders(config);

  console.log(`🚀 [apiService] ${method} ${url}`);
  console.log('📋 [apiService] Headers:', Object.keys(headers));

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log(`📨 [apiService] Response status: ${response.status}`);

    if (!response.ok) {
      if (response.status === 401) {
        console.error('❌ [apiService] Unauthorized - token may be expired');
        throw new Error('Token hết hạn, vui lòng đăng nhập lại');
      }

      const errorData = await response.json().catch(() => ({ message: 'API request failed' }));
      console.error('❌ [apiService] API Error:', errorData);
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ [apiService] API call successful');
    return data;
  } catch (error) {
    console.error('❌ [apiService] API call failed:', error);
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
