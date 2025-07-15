
export interface Invitation {
  id: string;
  email: string;
  name: string;
  role?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  created_at: string;
  updated_at?: string;
  expires_at?: string;
  invited_by?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateInvitationRequest {
  email: string;
  name: string;
  role_id?: string;
}

export interface InvitationFilters {
  search?: string;
  status?: string[];
  role?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}

export interface InvitationResponse {
  data: Invitation[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
