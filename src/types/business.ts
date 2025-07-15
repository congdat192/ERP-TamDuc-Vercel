
export interface Business {
  id: number;
  name: string;
  description: string;
  owner_id: number;
  user_role: 'owner' | 'admin' | 'member';
  is_owner: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessListResponse {
  data: Business[];
}

export interface CreateBusinessRequest {
  name: string;
  description: string;
}

export interface UpdateBusinessRequest {
  name: string;
  description: string;
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
  createBusiness: (data: { name: string; description?: string }) => Promise<Business>;
  updateBusiness: (businessId: number, data: UpdateBusinessRequest) => Promise<Business>;
  refreshBusinesses: () => Promise<void>;
  refreshCurrentBusiness: () => Promise<void>;
  clearCurrentBusiness: () => void;
  clearBusinessData: () => void;
}
