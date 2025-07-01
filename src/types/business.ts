
export interface Business {
  id: number;
  name: string;
  description?: string;
  is_owner: boolean;
  user_role: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBusinessRequest {
  name: string;
  description?: string;
}

export interface UpdateBusinessRequest {
  name?: string;
  description?: string;
}

export interface BusinessContextType {
  businesses: Business[];
  currentBusiness: Business | null;
  isLoading: boolean;
  hasOwnBusiness: boolean;
  fetchBusinesses: () => Promise<void>;
  createBusiness: (data: CreateBusinessRequest) => Promise<Business>;
  selectBusiness: (businessId: number) => Promise<void>;
  updateBusiness: (businessId: number, data: UpdateBusinessRequest) => Promise<Business>;
  refreshCurrentBusiness: () => Promise<void>;
}
