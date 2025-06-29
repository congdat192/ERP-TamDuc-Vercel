
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      name?: string;
      role?: string;
      permissions?: any;
    };
    token?: string;
    refreshToken?: string;
  };
  message?: string;
  error?: string;
}

const API_BASE_URL = 'https://api.matkinhtamduc.xyz/api/v1';
const REQUEST_TIMEOUT = 10000; // 10 seconds

class AuthService {
  private async makeRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Yêu cầu đã hết thời gian chờ');
        }
        throw new Error(`Lỗi kết nối: ${error.message}`);
      }
      
      throw new Error('Đã có lỗi xảy ra khi kết nối tới máy chủ');
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.makeRequest<any>('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      console.log('API login response:', response);

      // Transform API response to match our interface
      return {
        success: true,
        data: {
          user: {
            id: response.user?.id || response.id || '1',
            email: response.user?.email || credentials.email,
            name: response.user?.name || response.user?.full_name || 'User',
            role: response.user?.role || 'user',
            permissions: response.user?.permissions || {}
          },
          token: response.token || response.access_token,
          refreshToken: response.refresh_token
        }
      };
    } catch (error) {
      console.error('Login API error:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Đăng nhập thất bại'
      };
    }
  }

  saveToken(token: string) {
    try {
      localStorage.setItem('api_token', token);
    } catch (error) {
      console.warn('Failed to save token:', error);
    }
  }

  getToken(): string | null {
    try {
      return localStorage.getItem('api_token');
    } catch (error) {
      console.warn('Failed to get token:', error);
      return null;
    }
  }

  removeToken() {
    try {
      localStorage.removeItem('api_token');
    } catch (error) {
      console.warn('Failed to remove token:', error);
    }
  }
}

export const authService = new AuthService();
