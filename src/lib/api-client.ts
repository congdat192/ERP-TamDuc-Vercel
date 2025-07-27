
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = 'https://api.matkinhtamduc.xyz/api/v1';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

interface RequestOptions {
  requiresBusinessId?: boolean;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token and business context
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        const businessId = localStorage.getItem('selected_business_id');
        if (businessId) {
          config.headers['X-Business-Id'] = businessId;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle common errors and unwrap data
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // For paginated responses, return the full response
        if (response.data && (response.data.data || response.data.total !== undefined)) {
          return response.data;
        }
        
        // For single item responses, return the data directly
        return response.data;
      },
      (error) => {
        console.error('API Error:', error);
        
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('erp_current_user');
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, options?: RequestOptions): Promise<T> {
    const response = await this.client.get<T>(url);
    return response as T;
  }

  async post<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response as T;
  }

  async put<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response as T;
  }

  async delete<T>(url: string, options?: RequestOptions): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response as T;
  }
}

export const apiClient = new ApiClient();
