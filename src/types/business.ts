import { Store } from './store';

export interface Business {
  id: number;
  name: string;
  description: string;
  owner_id: number;
  user_role: 'owner' | 'admin' | 'member';
  is_owner: boolean;
  created_at: string;
  updated_at: string;
  logo_path?: string | null;
  address?: string | null;
  phone_number?: string | null;
  email_address?: string | null;
  website_url?: string | null;
  tax_number?: string | null;
  // New store-related fields
  stores?: Store[];
  store_count?: number;
  main_store?: Store;
}

export interface BusinessListResponse {
  data: Business[];
}

export interface CreateBusinessRequest {
  name: string;
  description?: string;
  logo_path?: string;
  address?: string;
  phone_number?: string;
  email_address?: string;
  website_url?: string;
  tax_number?: string;
}

export interface UpdateBusinessRequest {
  name: string;
  description?: string;
  logo_path?: string;
  address?: string;
  phone_number?: string;
  email_address?: string;
  website_url?: string;
  tax_number?: string;
}

export interface BusinessContextType {
  businesses: Business[];
  currentBusiness: Business | null;
  isLoading: boolean;
  hasOwnBusiness: boolean;
  error: string | null;
  setCurrentBusiness: (business: Business) => void;
  fetchBusinesses: () => Promise<void>;
  selectBusiness: (businessId: number) => Promise<void>;
  createBusiness: (data: CreateBusinessRequest) => Promise<Business>;
  updateBusiness: (businessId: number, data: UpdateBusinessRequest) => Promise<Business>;
  refreshBusinesses: () => Promise<void>;
  refreshCurrentBusiness: () => Promise<void>;
  clearCurrentBusiness: () => void;
  clearBusinessData: () => void;
}
