
export interface KiotVietConfig {
  client_id: string;
  client_secret: string;
  retailer: string;
}

export interface VihatConfig {
  api_key: string;
  secret_key: string;
}

export type PipelineConfig = KiotVietConfig | VihatConfig;

export interface PipelineAccessToken {
  token: string;
  refresh_token: string;
}

export interface Pipeline {
  id: string;
  type: 'KIOT_VIET' | 'VIHAT';
  status: 'ACTIVE' | 'INACTIVE';
  config: PipelineConfig;
  access_token: PipelineAccessToken;
  created_at: string;
  updated_at: string;
}

export interface CreatePipelineRequest {
  type: 'KIOT_VIET' | 'VIHAT';
  status: 'ACTIVE' | 'INACTIVE';
  config: PipelineConfig;
  access_token: PipelineAccessToken;
}

export interface UpdatePipelineRequest {
  status?: 'ACTIVE' | 'INACTIVE';
  config?: PipelineConfig;
  access_token?: PipelineAccessToken;
}

// Type guards to check config types
export function isKiotVietConfig(config: PipelineConfig): config is KiotVietConfig {
  return 'client_id' in config && 'client_secret' in config && 'retailer' in config;
}

export function isVihatConfig(config: PipelineConfig): config is VihatConfig {
  return 'api_key' in config && 'secret_key' in config;
}
