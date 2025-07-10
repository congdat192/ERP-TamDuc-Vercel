import { api } from './apiService';
import type { 
  Pipeline, 
  CreatePipelineRequest, 
  UpdatePipelineRequest, 
  KiotVietConfig 
} from '@/types/pipeline';

export interface PipelineListResponse {
  data: Pipeline[];
}

export interface TestConnectionResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Test KiotViet connection using direct API call via Vite proxy
export const testKiotVietConnection = async (config: KiotVietConfig): Promise<TestConnectionResponse> => {
  console.log('🔄 [pipelineService] Testing KiotViet connection via proxy for retailer:', config.retailer);
  
  try {
    // Call KiotViet API directly through Vite proxy
    const response = await fetch('/api/kiotviet/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        retailer: config.retailer,
        username: config.client_id,
        password: config.client_secret
      })
    });

    console.log('📡 [pipelineService] Response status:', response.status);
    console.log('📡 [pipelineService] Response headers:', Object.fromEntries(response.headers.entries()));
    
    // Check content type before parsing
    const contentType = response.headers.get('content-type');
    console.log('📡 [pipelineService] Content-Type:', contentType);
    
    const responseText = await response.text();
    console.log('📡 [pipelineService] Raw response:', responseText.substring(0, 500));

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ [pipelineService] JSON parsing failed:', parseError);
      return {
        success: false,
        message: `Lỗi phản hồi từ server: ${responseText.substring(0, 100)}...`
      };
    }

    if (response.ok && data.access_token) {
      console.log('✅ [pipelineService] KiotViet connection test successful via proxy');
      
      return {
        success: true,
        message: 'Kết nối KiotViet thành công! Thông tin xác thực hợp lệ.',
        data: data
      };
    } else {
      console.error('❌ [pipelineService] KiotViet connection test failed:', data);
      
      return {
        success: false,
        message: data.message || 'Thông tin đăng nhập không hợp lệ'
      };
    }
    
  } catch (error: any) {
    console.error('❌ [pipelineService] KiotViet connection test failed:', error);
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Không thể kết nối đến KiotViet. Vui lòng kiểm tra kết nối mạng.'
      };
    }
    
    return {
      success: false,
      message: 'Không thể kết nối đến KiotViet. Vui lòng kiểm tra lại thông tin.'
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
