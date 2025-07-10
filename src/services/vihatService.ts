
import { api } from './apiService';
import type { CreatePipelineRequest, UpdatePipelineRequest, Pipeline } from '@/types/pipeline';

export interface VihatConfig {
  api_key: string;
  secret_key: string;
}

export interface TestVihatConnectionRequest {
  api_key: string;
  secret_key: string;
}

export interface TestVihatConnectionResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Test ViHat connection through backend
export const testVihatConnection = async (config: TestVihatConnectionRequest): Promise<TestVihatConnectionResponse> => {
  console.log('🔄 [vihatService] Testing ViHat connection');
  
  try {
    const response = await api.post<TestVihatConnectionResponse>('/integrations/vihat/test', config, {
      requiresBusinessId: true,
    });
    
    console.log('✅ [vihatService] ViHat connection test successful');
    return response;
    
  } catch (error: any) {
    console.error('❌ [vihatService] ViHat connection test failed:', error);
    
    // Handle specific error scenarios
    if (error.response?.status === 401) {
      return {
        success: false,
        message: 'API Key hoặc Secret Key không hợp lệ'
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
        message: error.response?.data?.message || 'Không thể kết nối đến ViHat. Vui lòng kiểm tra lại thông tin.'
      };
    }
  }
};

// Create new ViHat pipeline
export const createVihatPipeline = async (data: CreatePipelineRequest): Promise<Pipeline> => {
  console.log('🏗️ [vihatService] Creating ViHat pipeline');
  
  // Ensure we're sending the correct type
  const payload = {
    ...data,
    type: 'VIHAT' as const // Explicitly set type to ensure consistency
  };
  
  console.log('📤 [vihatService] Create payload:', {
    type: payload.type,
    status: payload.status,
    hasConfig: !!payload.config,
    configKeys: payload.config ? Object.keys(payload.config) : []
  });
  
  try {
    const pipeline = await api.post<Pipeline>('/pipelines', payload, {
      requiresBusinessId: true,
    });
    
    console.log('✅ [vihatService] Created ViHat pipeline:', pipeline.id);
    return pipeline;
  } catch (error: any) {
    console.error('❌ [vihatService] Failed to create ViHat pipeline:', error);
    
    // Log detailed error information for debugging
    console.error('🔍 [vihatService] Error details:', {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      message: error?.message,
      url: error?.config?.url,
      method: error?.config?.method
    });
    
    throw error;
  }
};

// Update ViHat pipeline
export const updateVihatPipeline = async (
  pipelineId: string, 
  data: UpdatePipelineRequest
): Promise<Pipeline> => {
  console.log('📝 [vihatService] Updating ViHat pipeline:', pipelineId);
  
  console.log('📤 [vihatService] Update payload:', {
    pipelineId,
    status: data.status,
    hasConfig: !!data.config,
    configKeys: data.config ? Object.keys(data.config) : []
  });
  
  try {
    const pipeline = await api.put<Pipeline>(`/pipelines/${pipelineId}`, data, {
      requiresBusinessId: true,
    });
    
    console.log('✅ [vihatService] Updated ViHat pipeline:', pipeline.id);
    return pipeline;
  } catch (error: any) {
    console.error('❌ [vihatService] Failed to update ViHat pipeline:', error);
    
    // Log detailed error information for debugging
    console.error('🔍 [vihatService] Error details:', {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      message: error?.message,
      url: error?.config?.url,
      method: error?.config?.method
    });
    
    throw error;
  }
};
