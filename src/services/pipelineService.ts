// Mock Pipeline Service - No real API calls

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

export interface TestConnectionResponse {
  success: boolean;
  message: string;
  details?: any;
}

export const testKiotVietConnection = async (config: PipelineConfig): Promise<TestConnectionResponse> => {
  console.log('🔄 [mockPipelineService] Mock test connection');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    message: 'Kết nối thành công (Mock)'
  };
};

export const getPipelines = async (): Promise<Pipeline[]> => {
  console.log('🔄 [mockPipelineService] Mock get pipelines');
  await new Promise(resolve => setTimeout(resolve, 500));
  return [];
};

export const createPipeline = async (data: CreatePipelineRequest): Promise<Pipeline> => {
  console.log('🏗️ [mockPipelineService] Mock create pipeline');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: '1',
    type: data.type,
    status: data.status,
    config: data.config,
    access_token: data.access_token,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export const getPipeline = async (pipelineId: string): Promise<Pipeline> => {
  console.log('🔍 [mockPipelineService] Mock get pipeline');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: pipelineId,
    type: 'KIOT_VIET',
    status: 'ACTIVE',
    config: { client_id: '', client_secret: '', retailer: '' },
    access_token: { token: '', refresh_token: '' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export const updatePipeline = async (
  pipelineId: string, 
  data: UpdatePipelineRequest
): Promise<Pipeline> => {
  console.log('📝 [mockPipelineService] Mock update pipeline');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: pipelineId,
    type: 'KIOT_VIET',
    status: data.status || 'ACTIVE',
    config: data.config || { client_id: '', client_secret: '', retailer: '' },
    access_token: data.access_token || { token: '', refresh_token: '' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export const syncPipeline = async (pipelineId: string): Promise<void> => {
  console.log('🔄 [mockPipelineService] Mock sync pipeline');
  await new Promise(resolve => setTimeout(resolve, 500));
};
