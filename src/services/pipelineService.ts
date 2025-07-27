
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
  status: 'ACTIVE' | 'INACTIVE' | 'TESTING';
  config: PipelineConfig;
  access_token: PipelineAccessToken;
  created_at: string;
  updated_at: string;
}

export interface CreatePipelineRequest {
  type: 'KIOT_VIET';
  status: 'ACTIVE' | 'INACTIVE' | 'TESTING';
  config: PipelineConfig;
  access_token: PipelineAccessToken;
}

export interface UpdatePipelineRequest {
  status?: 'ACTIVE' | 'INACTIVE' | 'TESTING';
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
  details?: {
    connection_status: string;
    api_access: boolean;
    permissions: string[];
    error_code?: string;
  };
}

// Test KiotViet connection by calling backend test endpoint
export const testKiotVietConnection = async (config: PipelineConfig): Promise<TestConnectionResponse> => {
  console.log('🔄 [pipelineService] Testing KiotViet connection via backend for retailer:', config.retailer);
  
  try {
    const testPayload: TestConnectionRequest = {
      type: 'KIOT_VIET',
      config: {
        client_id: config.client_id,
        client_secret: config.client_secret,
        retailer: config.retailer
      }
    };

    console.log('🚀 [pipelineService] Sending test request to backend:', {
      type: testPayload.type,
      retailer: config.retailer,
      client_id: config.client_id
    });

    const response = await api.post<TestConnectionResponse>('/pipelines/test-connection', testPayload, {
      requiresBusinessId: true,
      requiresAuth: true
    });

    console.log('✅ [pipelineService] Test connection successful:', response);
    
    return {
      success: true,
      message: response.message || 'Kết nối KiotViet thành công! Thông tin xác thực hợp lệ.',
      details: response.details
    };
    
  } catch (error: any) {
    console.error('❌ [pipelineService] Test connection failed:', error);
    
    let errorMessage = 'Không thể kết nối với KiotViet. Vui lòng kiểm tra thông tin và thử lại.';
    let errorDetails = undefined;
    
    if (error.response?.data) {
      errorMessage = error.response.data.message || errorMessage;
      errorDetails = error.response.data.details;
    } else if (error.message) {
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        errorMessage = 'Thông tin Client ID hoặc Client Secret không chính xác.';
      } else if (error.message.includes('404')) {
        errorMessage = 'Tên cửa hàng (Retailer) không tồn tại trong hệ thống KiotViet.';
      } else if (error.message.includes('403')) {
        errorMessage = 'Tài khoản không có quyền truy cập hoặc đã bị khóa.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Lỗi máy chủ KiotViet. Vui lòng thử lại sau.';
      } else if (error.message.includes('network') || error.message.includes('timeout')) {
        errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.';
      }
    }
    
    return {
      success: false,
      message: errorMessage,
      details: errorDetails
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
