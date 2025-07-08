
import { api } from './apiService';

export interface PipelineConfig {
  client_id: string;
  client_secret: string;
  retailer: string;
}

export interface PipelineAccessToken {
  token: string;
  refresh_token: string;
}

export interface Pipeline {
  id: string;
  type: 'KIOT_VIET';
  status: 'ACTIVE' | 'INACTIVE';
  config: PipelineConfig;
  access_token: PipelineAccessToken;
  created_at: string;
  updated_at: string;
}

export interface CreatePipelineRequest {
  type: 'KIOT_VIET';
  status: 'ACTIVE' | 'INACTIVE';
  config: PipelineConfig;
  access_token: PipelineAccessToken;
}

export interface UpdatePipelineRequest {
  status?: 'ACTIVE' | 'INACTIVE';
  config?: PipelineConfig;
  access_token?: PipelineAccessToken;
}

export interface PipelineListResponse {
  data: Pipeline[];
}

export interface TestConnectionRequest {
  type: 'KIOT_VIET';
  config: PipelineConfig;
}

export interface TestConnectionResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Test KiotViet connection by calling KiotViet API directly
export const testKiotVietConnection = async (config: PipelineConfig): Promise<TestConnectionResponse> => {
  console.log('🔄 [pipelineService] Testing KiotViet connection for retailer:', config.retailer);
  
  try {
    // Call KiotViet API directly to validate credentials
    const kiotVietResponse = await fetch('https://public.kiotapi.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        retailer: config.retailer,
        clientId: config.client_id,
        clientSecret: config.client_secret
      })
    });

    if (!kiotVietResponse.ok) {
      const errorData = await kiotVietResponse.json().catch(() => ({}));
      console.error('❌ [pipelineService] KiotViet API error:', kiotVietResponse.status, errorData);
      
      if (kiotVietResponse.status === 401) {
        return {
          success: false,
          message: 'Client ID hoặc Client Secret không hợp lệ'
        };
      } else if (kiotVietResponse.status === 404) {
        return {
          success: false,
          message: 'Không tìm thấy cửa hàng với tên này'
        };
      } else {
        return {
          success: false,
          message: errorData.message || 'Thông tin kết nối không chính xác'
        };
      }
    }

    const responseData = await kiotVietResponse.json();
    console.log('✅ [pipelineService] KiotViet connection test successful');
    
    return {
      success: true,
      message: 'Kết nối KiotViet thành công! Thông tin xác thực hợp lệ.',
      data: responseData
    };
    
  } catch (error: any) {
    console.error('❌ [pipelineService] Connection test failed:', error);
    
    // Handle different error scenarios based on actual API responses
    if (error.response?.status === 401) {
      return {
        success: false,
        message: 'Client ID hoặc Client Secret không hợp lệ'
      };
    } else if (error.response?.status === 404) {
      return {
        success: false,
        message: 'Không tìm thấy cửa hàng với tên này'
      };
    } else if (error.response?.status === 422) {
      return {
        success: false,
        message: error.response.data?.message || 'Thông tin kết nối không hợp lệ'
      };
    } else if (error.response?.status >= 500) {
      return {
        success: false,
        message: 'Lỗi máy chủ, vui lòng thử lại sau'
      };
    } else {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể kết nối đến KiotViet. Vui lòng kiểm tra lại thông tin.'
      };
    }
  }
};

// Get all pipelines for current business
export const getPipelines = async (): Promise<Pipeline[]> => {
  console.log('🔄 [pipelineService] Getting all pipelines');
  
  const response = await api.get<PipelineListResponse>('/pipelines', {
    requiresBusinessId: true,
  });
  
  console.log('✅ [pipelineService] Retrieved pipelines:', response.data.length);
  return response.data;
};

// Create new pipeline
export const createPipeline = async (data: CreatePipelineRequest): Promise<Pipeline> => {
  console.log('🏗️ [pipelineService] Creating pipeline:', data.type);
  
  const pipeline = await api.post<Pipeline>('/pipelines', data, {
    requiresBusinessId: true,
  });
  
  console.log('✅ [pipelineService] Created pipeline:', pipeline.id);
  return pipeline;
};

// Get specific pipeline
export const getPipeline = async (pipelineId: string): Promise<Pipeline> => {
  console.log('🔍 [pipelineService] Getting pipeline:', pipelineId);
  
  const pipeline = await api.get<Pipeline>(`/pipelines/${pipelineId}`, {
    requiresBusinessId: true,
  });
  
  console.log('✅ [pipelineService] Retrieved pipeline:', pipeline.type);
  return pipeline;
};

// Update pipeline
export const updatePipeline = async (
  pipelineId: string, 
  data: UpdatePipelineRequest
): Promise<Pipeline> => {
  console.log('📝 [pipelineService] Updating pipeline:', pipelineId);
  
  const pipeline = await api.put<Pipeline>(`/pipelines/${pipelineId}`, data, {
    requiresBusinessId: true,
  });
  
  console.log('✅ [pipelineService] Updated pipeline:', pipeline.id);
  return pipeline;
};

// Sync pipeline
export const syncPipeline = async (pipelineId: string): Promise<void> => {
  console.log('🔄 [pipelineService] Syncing pipeline:', pipelineId);
  
  await api.post(`/pipelines/${pipelineId}/sync`, undefined, {
    requiresBusinessId: true,
  });
  
  console.log('✅ [pipelineService] Pipeline sync completed');
};
