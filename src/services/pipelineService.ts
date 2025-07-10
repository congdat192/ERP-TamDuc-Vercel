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

// Test KiotViet connection using multiple methods
export const testKiotVietConnection = async (config: KiotVietConfig): Promise<TestConnectionResponse> => {
  console.log('🔄 [pipelineService] Testing KiotViet connection for retailer:', config.retailer);
  
  // Method 1: Try direct API call to KiotViet (bypass proxy)
  try {
    console.log('🔧 [pipelineService] Method 1: Direct API call to KiotViet');
    console.log('🔧 [pipelineService] Config:', { retailer: config.retailer, client_id: config.client_id });
    
    const directResponse = await fetch('https://public.kiotapi.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'ERP-System/1.0'
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: config.client_id,
        client_secret: config.client_secret,
        retailer: config.retailer
      })
    });

    console.log('📡 [pipelineService] Direct response status:', directResponse.status);
    console.log('📡 [pipelineService] Direct response headers:', Object.fromEntries(directResponse.headers.entries()));

    if (directResponse.ok) {
      const directData = await directResponse.json();
      if (directData.access_token) {
        console.log('✅ [pipelineService] Direct KiotViet connection successful');
        return {
          success: true,
          message: 'Kết nối KiotViet thành công! (phương thức trực tiếp)',
          data: directData
        };
      }
    }
  } catch (directError) {
    console.log('⚠️ [pipelineService] Direct method failed, trying proxy...', directError);
  }

  // Method 2: Try via proxy (fallback)
  try {
    console.log('🔧 [pipelineService] Method 2: Via proxy');
    
    const response = await fetch('/api/kiotviet/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: config.client_id,
        client_secret: config.client_secret,
        retailer: config.retailer
      })
    });

    console.log('📡 [pipelineService] Proxy response status:', response.status);
    console.log('📡 [pipelineService] Proxy response headers:', Object.fromEntries(response.headers.entries()));
    console.log('📡 [pipelineService] Content-Type:', response.headers.get('content-type'));

    const rawResponse = await response.text();
    console.log('📡 [pipelineService] Raw response:', rawResponse.substring(0, 200) + '...');

    // Check if response is HTML (indicates proxy issue)
    if (rawResponse.trim().startsWith('<!DOCTYPE') || rawResponse.trim().startsWith('<html')) {
      console.log('❌ [pipelineService] Received HTML instead of JSON - proxy configuration issue');
      return {
        success: false,
        message: 'Lỗi cấu hình proxy: KiotViet API endpoint có thể không chính xác hoặc dịch vụ không khả dụng. Vui lòng kiểm tra tên retailer và thông tin xác thực.'
      };
    }

    if (!response.ok) {
      console.log('❌ [pipelineService] Error response:', rawResponse);
      return {
        success: false,
        message: `HTTP ${response.status}: ${response.statusText}`,
        data: rawResponse
      };
    }

    let data;
    try {
      data = JSON.parse(rawResponse);
    } catch (parseError) {
      console.log('❌ [pipelineService] JSON parsing failed:', parseError);
      return {
        success: false,
        message: 'Phản hồi JSON không hợp lệ từ KiotViet API. Vui lòng xác minh thông tin xác thực và tên retailer.'
      };
    }

    if (data.access_token) {
      console.log('✅ [pipelineService] KiotViet proxy connection successful');
      return {
        success: true,
        message: 'Kết nối KiotViet thành công! (phương thức proxy)',
        data: data
      };
    } else {
      console.log('❌ [pipelineService] No access token in response:', data);
      return {
        success: false,
        message: data.error_description || data.message || 'Xác thực thất bại. Vui lòng kiểm tra Client ID, Client Secret và tên Retailer.',
        data: data
      };
    }
    
  } catch (error: any) {
    console.log('❌ [pipelineService] Network error:', error);
    return {
      success: false,
      message: `Lỗi mạng: ${error.message}. Vui lòng kiểm tra kết nối internet và thử lại.`
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
