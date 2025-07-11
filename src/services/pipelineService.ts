
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

// Test KiotViet connection via backend API
export const testKiotVietConnection = async (config: PipelineConfig): Promise<TestConnectionResponse> => {
  console.log('🔄 [pipelineService] Testing KiotViet connection via backend for retailer:', config.retailer);
  
  try {
    // Call backend API to test KiotViet connection
    const response = await api.post<TestConnectionResponse>('/integrations/kiotviet/test', {
      type: 'KIOT_VIET',
      config: {
        client_id: config.client_id,
        client_secret: config.client_secret,
        retailer: config.retailer
      }
    }, {
      requiresBusinessId: true,
      requiresAuth: true
    });

    console.log('✅ [pipelineService] KiotViet connection test successful via backend');
    
    return {
      success: true,
      message: response.message || 'Kết nối KiotViet thành công! Thông tin xác thực hợp lệ.',
      data: response.data
    };
    
  } catch (error: any) {
    console.error('❌ [pipelineService] KiotViet connection test failed:', error);
    
    // Handle different error scenarios based on backend API responses
    let errorMessage = 'Không thể kết nối đến KiotViet. Vui lòng kiểm tra lại thông tin.';
    
    if (error.message) {
      const message = error.message.toLowerCase();
      
      if (message.includes('client id') || message.includes('client secret')) {
        errorMessage = 'Client ID hoặc Client Secret không hợp lệ';
      } else if (message.includes('retailer') || message.includes('cửa hàng')) {
        errorMessage = 'Không tìm thấy cửa hàng với tên này';
      } else if (message.includes('unauthorized') || message.includes('401')) {
        errorMessage = 'Thông tin xác thực không hợp lệ';
      } else if (message.includes('server') || message.includes('500')) {
        errorMessage = 'Lỗi máy chủ, vui lòng thử lại sau';
      } else {
        errorMessage = error.message;
      }
    }
    
    return {
      success: false,
      message: errorMessage
    };
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
