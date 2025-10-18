// Mock API Service - No real API calls

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  requiresAuth?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Mock API call function - returns mock data
export const apiCall = async <T>(
  endpoint: string,
  config: ApiRequestConfig = {}
): Promise<T> => {
  console.log('📝 [mockApiService] Mock call:', endpoint);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return empty mock data
  return {} as T;
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
