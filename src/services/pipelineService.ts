
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
  data?: any;
  testPipelineId?: string;
}

// Store test pipeline IDs for cleanup
const testPipelineIds = new Set<string>();

// Test KiotViet connection by creating a temporary pipeline
export const testKiotVietConnection = async (config: PipelineConfig): Promise<TestConnectionResponse> => {
  console.log('🔄 [pipelineService] Testing KiotViet connection by creating temporary pipeline for retailer:', config.retailer);
  
  // Try different type variants that might be accepted by the backend
  const typeVariants = ['KIOT_VIET', 'KIOTVIET', 'KiotViet', 'kiot_viet'];
  
  for (const typeVariant of typeVariants) {
    try {
      // Create a temporary pipeline for testing - API only accepts type and config
      const createPayload = {
        type: typeVariant,
        config: {
          client_id: config.client_id,
          client_secret: config.client_secret,
          retailer: config.retailer
        }
      };

      console.log(`🚀 [pipelineService] Trying type "${typeVariant}" with payload:`, JSON.stringify(createPayload, null, 2));

      const testPipeline = await api.post<Pipeline>('/pipelines', createPayload, {
        requiresBusinessId: true,
        requiresAuth: true
      });

      console.log('✅ [pipelineService] Test pipeline created successfully with type:', typeVariant, 'ID:', testPipeline.id);
      
      // Store the test pipeline ID for potential cleanup
      testPipelineIds.add(testPipeline.id);
      
      return {
        success: true,
        message: 'Kết nối KiotViet thành công! Thông tin xác thực hợp lệ.',
        data: testPipeline,
        testPipelineId: testPipeline.id
      };
      
    } catch (error: any) {
      console.error(`❌ [pipelineService] Type "${typeVariant}" failed:`, error.message);
      
      // If it's not a type validation error, break the loop
      if (!error.message?.includes('selected type is invalid')) {
        console.error('❌ [pipelineService] Non-type error encountered:', error);
        break;
      }
      
      // Continue to next type variant
      continue;
    }
  }
  
  // If all type variants failed, return generic error
  console.error('❌ [pipelineService] All type variants failed');
  
  return {
    success: false,
    message: 'Loại tích hợp không hợp lệ. Vui lòng liên hệ hỗ trợ kỹ thuật.'
  };
};

// Convert test pipeline to active pipeline when user saves configuration
export const convertTestPipelineToActive = async (testPipelineId: string): Promise<Pipeline> => {
  console.log('🔄 [pipelineService] Converting test pipeline to active:', testPipelineId);
  
  const pipeline = await api.put<Pipeline>(`/pipelines/${testPipelineId}`, {
    status: 'ACTIVE'
  }, {
    requiresBusinessId: true,
  });
  
  // Remove from test pipeline tracking
  testPipelineIds.delete(testPipelineId);
  
  console.log('✅ [pipelineService] Test pipeline converted to active:', pipeline.id);
  return pipeline;
};

// Cleanup test pipelines that weren't saved
export const cleanupTestPipelines = async (): Promise<void> => {
  console.log('🧹 [pipelineService] Cleaning up test pipelines:', testPipelineIds.size);
  
  const cleanupPromises = Array.from(testPipelineIds).map(async (pipelineId) => {
    try {
      await api.put(`/pipelines/${pipelineId}`, {
        status: 'INACTIVE'
      }, {
        requiresBusinessId: true,
      });
      console.log('🗑️ [pipelineService] Cleaned up test pipeline:', pipelineId);
    } catch (error) {
      console.error('❌ [pipelineService] Failed to cleanup test pipeline:', pipelineId, error);
    }
  });
  
  await Promise.allSettled(cleanupPromises);
  testPipelineIds.clear();
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
