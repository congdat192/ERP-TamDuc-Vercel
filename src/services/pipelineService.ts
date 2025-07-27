
import { apiClient } from '@/lib/api-client';
import { Pipeline } from '@/types/pipeline';

export interface PipelineConfig {
  client_id: string;
  client_secret: string;
  retailer: string;
}

export interface CreatePipelineRequest {
  type: 'KIOT_VIET';
  config: PipelineConfig;
}

export interface UpdatePipelineRequest {
  status?: 'ACTIVE' | 'INACTIVE';
  config?: PipelineConfig;
}

export interface PipelineResponse {
  id: string;
  type: string;
  status: 'ACTIVE' | 'INACTIVE';
  config: PipelineConfig;
  business_id: string;
  created_at: string;
  updated_at: string;
  access_token: {
    token: string;
    refresh_token: string;
  };
}

export const getPipelines = async (): Promise<PipelineResponse[]> => {
  try {
    console.log('🔄 [pipelineService] Fetching pipelines');
    
    const response = await apiClient.get<PipelineResponse[]>('/pipelines');
    
    console.log('✅ [pipelineService] Fetched pipelines:', response);
    return response;
  } catch (error) {
    console.error('❌ [pipelineService] Error fetching pipelines:', error);
    throw error;
  }
};

export const getPipeline = async (pipelineId: string): Promise<PipelineResponse> => {
  try {
    console.log('🔄 [pipelineService] Fetching pipeline:', pipelineId);
    
    const response = await apiClient.get<PipelineResponse>(`/pipelines/${pipelineId}`);
    
    console.log('✅ [pipelineService] Fetched pipeline:', response);
    return response;
  } catch (error) {
    console.error('❌ [pipelineService] Error fetching pipeline:', error);
    throw error;
  }
};

export const createPipeline = async (data: CreatePipelineRequest): Promise<PipelineResponse> => {
  try {
    console.log('🔄 [pipelineService] Creating pipeline:', data);
    
    const response = await apiClient.post<PipelineResponse>('/pipelines', data);
    
    console.log('✅ [pipelineService] Created pipeline:', response);
    return response;
  } catch (error) {
    console.error('❌ [pipelineService] Error creating pipeline:', error);
    throw error;
  }
};

export const updatePipeline = async (pipelineId: string, data: UpdatePipelineRequest): Promise<PipelineResponse> => {
  try {
    console.log('🔄 [pipelineService] Updating pipeline:', pipelineId, data);
    
    const requestData = {
      status: data.status,
      config: data.config
    };
    
    const response = await apiClient.put<PipelineResponse>(`/pipelines/${pipelineId}`, requestData);
    
    console.log('✅ [pipelineService] Updated pipeline:', response);
    return response;
  } catch (error) {
    console.error('❌ [pipelineService] Error updating pipeline:', error);
    throw error;
  }
};

export const syncPipeline = async (pipelineId: string): Promise<{ message: string }> => {
  try {
    console.log('🔄 [pipelineService] Syncing pipeline:', pipelineId);
    
    const response = await apiClient.post<{ message: string }>(`/pipelines/${pipelineId}/sync`);
    
    console.log('✅ [pipelineService] Synced pipeline:', response);
    return response;
  } catch (error) {
    console.error('❌ [pipelineService] Error syncing pipeline:', error);
    throw error;
  }
};

export const deletePipeline = async (pipelineId: string): Promise<void> => {
  try {
    console.log('🔄 [pipelineService] Deleting pipeline:', pipelineId);
    
    await apiClient.delete(`/pipelines/${pipelineId}`);
    
    console.log('✅ [pipelineService] Deleted pipeline:', pipelineId);
  } catch (error) {
    console.error('❌ [pipelineService] Error deleting pipeline:', error);
    throw error;
  }
};

// Test pipeline connection
export const testPipelineConnection = async (config: PipelineConfig): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> => {
  try {
    console.log('🔄 [pipelineService] Testing pipeline connection');
    
    const response = await apiClient.post<{
      success: boolean;
      message?: string;
      error?: string;
    }>('/pipelines/test-connection', { config });
    
    console.log('✅ [pipelineService] Pipeline connection test result:', response);
    return response;
  } catch (error) {
    console.error('❌ [pipelineService] Error testing pipeline connection:', error);
    throw error;
  }
};
