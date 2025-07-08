import { api } from './apiService';

export interface VihatConfig {
  api_key: string;
  secret_key: string;
}

export interface VihatAccessToken {
  token: string;
  refresh_token: string;
}

export interface VihatPipeline {
  id: string;
  type: 'VIHAT';
  status: 'ACTIVE' | 'INACTIVE';
  config: VihatConfig;
  access_token: VihatAccessToken;
  created_at: string;
  updated_at: string;
}

export interface CreateVihatPipelineRequest {
  type: 'VIHAT';
  status: 'ACTIVE' | 'INACTIVE';
  config: VihatConfig;
  access_token: VihatAccessToken;
}

export interface UpdateVihatPipelineRequest {
  status?: 'ACTIVE' | 'INACTIVE';
  config?: VihatConfig;
  access_token?: VihatAccessToken;
}

export interface TestVihatConnectionResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Test ViHat connection by calling eSMS.vn API directly
export const testVihatConnection = async (config: VihatConfig): Promise<TestVihatConnectionResponse> => {
  console.log('🔄 [vihatService] Testing ViHat connection with API key:', config.api_key.substring(0, 8) + '...');
  
  try {
    // Call eSMS.vn API to validate credentials using GetBalance endpoint
    const vihatResponse = await fetch(`http://rest.esms.vn/MainService.svc/json/GetBalance/${config.api_key}/${config.secret_key}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!vihatResponse.ok) {
      const errorData = await vihatResponse.json().catch(() => ({}));
      console.error('❌ [vihatService] ViHat API error:', vihatResponse.status, errorData);
      
      if (vihatResponse.status === 401) {
        return {
          success: false,
          message: 'API Key hoặc Secret Key không hợp lệ'
        };
      } else if (vihatResponse.status === 403) {
        return {
          success: false,
          message: 'Không có quyền truy cập với thông tin xác thực này'
        };
      } else {
        return {
          success: false,
          message: errorData.message || 'Thông tin kết nối không chính xác'
        };
      }
    }

    const responseData = await vihatResponse.json();
    console.log('✅ [vihatService] ViHat connection test successful');
    
    // Check if response indicates success (theo tài liệu eSMS.vn)
    if (responseData.CodeResponse === '100') {
      return {
        success: true,
        message: `Kết nối eSMS.vn thành công! Số dư tài khoản: ${responseData.Balance?.toLocaleString('vi-VN')} VND`,
        data: responseData
      };
    } else if (responseData.CodeResponse === '101') {
      return {
        success: false,
        message: 'API Key hoặc Secret Key không đúng'
      };
    } else if (responseData.CodeResponse === '102') {
      return {
        success: false,
        message: 'Tài khoản đã bị khóa'
      };
    } else {
      return {
        success: false,
        message: `Lỗi kết nối (Code: ${responseData.CodeResponse}). Vui lòng kiểm tra lại thông tin.`
      };
    }
    
  } catch (error: any) {
    console.error('❌ [vihatService] Connection test failed:', error);
    
    // Handle different error scenarios
    if (error.response?.status === 401) {
      return {
        success: false,
        message: 'API Key hoặc Secret Key không hợp lệ'
      };
    } else if (error.response?.status === 403) {
      return {
        success: false,
        message: 'Không có quyền truy cập với thông tin xác thực này'
      };
    } else if (error.response?.status === 422) {
      return {
        success: false,
        message: error.response.data?.message || 'Thông tin kết nối không hợp lệ'
      };
    } else if (error.response?.status >= 500) {
      return {
        success: false,
        message: 'Lỗi máy chủ eSMS.vn, vui lòng thử lại sau'
      };
    } else {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể kết nối đến eSMS.vn. Vui lòng kiểm tra lại thông tin.'
      };
    }
  }
};

// Get ViHat pipelines for current business
export const getVihatPipelines = async (): Promise<VihatPipeline[]> => {
  console.log('🔄 [vihatService] Getting ViHat pipelines');
  
  const response = await api.get<{ data: VihatPipeline[] }>('/pipelines', {
    requiresBusinessId: true,
  });
  
  // Filter only ViHat pipelines
  const vihatPipelines = response.data.filter(pipeline => pipeline.type === 'VIHAT');
  console.log('✅ [vihatService] Retrieved ViHat pipelines:', vihatPipelines.length);
  return vihatPipelines;
};

// Create new ViHat pipeline
export const createVihatPipeline = async (data: CreateVihatPipelineRequest): Promise<VihatPipeline> => {
  console.log('🏗️ [vihatService] Creating ViHat pipeline');
  
  const pipeline = await api.post<VihatPipeline>('/pipelines', data, {
    requiresBusinessId: true,
  });
  
  console.log('✅ [vihatService] Created ViHat pipeline:', pipeline.id);
  return pipeline;
};

// Update ViHat pipeline
export const updateVihatPipeline = async (
  pipelineId: string, 
  data: UpdateVihatPipelineRequest
): Promise<VihatPipeline> => {
  console.log('📝 [vihatService] Updating ViHat pipeline:', pipelineId);
  
  const pipeline = await api.put<VihatPipeline>(`/pipelines/${pipelineId}`, data, {
    requiresBusinessId: true,
  });
  
  console.log('✅ [vihatService] Updated ViHat pipeline:', pipeline.id);
  return pipeline;
};

// Get active ViHat configuration
export const getActiveVihatConfig = async (): Promise<VihatConfig | null> => {
  try {
    const pipelines = await getVihatPipelines();
    const activePipeline = pipelines.find(p => p.status === 'ACTIVE');
    return activePipeline?.config || null;
  } catch (error) {
    console.error('❌ [vihatService] Failed to get active ViHat config:', error);
    return null;
  }
};

// ViHat API Functions for actual usage
export const sendSMS = async (phone: string, message: string): Promise<any> => {
  const config = await getActiveVihatConfig();
  if (!config) {
    throw new Error('ViHat chưa được cấu hình');
  }

  const response = await fetch('https://api.esms.vn/MainService.svc/json/SendMultipleMessage_V4_get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ApiKey: config.api_key,
      SecretKey: config.secret_key,
      Phone: phone,
      Content: message,
      SmsType: '2' // SMS Brandname
    })
  });

  return await response.json();
};

export const getZaloTemplates = async (): Promise<any[]> => {
  const config = await getActiveVihatConfig();
  if (!config) {
    throw new Error('ViHat chưa được cấu hình');
  }

  // Call eSMS.vn API to get Zalo templates
  const response = await fetch('https://api.esms.vn/MainService.svc/json/GetListZNSTemplate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ApiKey: config.api_key,
      SecretKey: config.secret_key
    })
  });

  const data = await response.json();
  return data.Data || [];
};