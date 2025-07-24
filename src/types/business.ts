
import { StoreEntity } from './store';

export interface Business {
  id: number;
  name: string;
  description?: string;
  logo_path?: string;
  created_at: string;
  updated_at: string;
  stores?: StoreEntity[];
}

export interface CreateBusinessRequest {
  name: string;
  description?: string;
}

export interface UpdateBusinessRequest {
  name?: string;
  description?: string;
}

export interface BusinessListResponse {
  data: Business[];
  total: number;
  per_page: number;
  current_page: number;
}

export interface BusinessContextType {
  businesses: Business[];
  currentBusiness: Business | null;
  isLoading: boolean;
  error: string | null;
  
  fetchBusinesses: () => Promise<void>;
  createBusiness: (data: CreateBusinessRequest) => Promise<Business>;
  updateBusiness: (businessId: number, data: UpdateBusinessRequest) => Promise<Business>;
  deleteBusiness: (businessId: number) => Promise<void>;
  setCurrentBusiness: (business: Business | null) => void;
  refreshBusinesses: () => Promise<void>;
  clearBusinessData: () => void;
}
