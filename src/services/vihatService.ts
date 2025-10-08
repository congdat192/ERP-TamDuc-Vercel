// Mock ViHat Service - No real API calls
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

export const testVihatConnection = async (config: TestVihatConnectionRequest): Promise<TestVihatConnectionResponse> => {
  console.log('🔄 [mockVihatService] Mock test connection');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    message: 'Kết nối ViHat thành công (Mock)'
  };
};

export const createVihatPipeline = async (data: CreatePipelineRequest): Promise<Pipeline> => {
  console.log('🏗️ [mockVihatService] Mock create pipeline');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: '1',
    type: 'VIHAT' as any,
    status: data.status,
    config: data.config,
    access_token: data.access_token,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export const updateVihatPipeline = async (
  pipelineId: string, 
  data: UpdatePipelineRequest
): Promise<Pipeline> => {
  console.log('📝 [mockVihatService] Mock update pipeline');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: pipelineId,
    type: 'VIHAT' as any,
    status: data.status || 'ACTIVE',
    config: data.config || {} as any,
    access_token: data.access_token || { token: '', refresh_token: '' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};
