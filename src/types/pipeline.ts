
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
  type: 'KIOT_VIET' | 'VIHAT';
  status: 'ACTIVE' | 'INACTIVE' | 'TESTING';
  config: PipelineConfig | VihatConfig;
  access_token: PipelineAccessToken;
  created_at: string;
  updated_at: string;
}

export interface VihatConfig {
  api_key: string;
  secret_key: string;
}

export interface CreatePipelineRequest {
  type: 'KIOT_VIET' | 'VIHAT';
  status: 'ACTIVE' | 'INACTIVE' | 'TESTING';
  config: PipelineConfig | VihatConfig;
  access_token: PipelineAccessToken;
}

export interface UpdatePipelineRequest {
  status?: 'ACTIVE' | 'INACTIVE' | 'TESTING';
  config?: PipelineConfig | VihatConfig;
  access_token?: PipelineAccessToken;
}
