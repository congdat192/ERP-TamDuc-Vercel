
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

// User Invitations (lời mời nhận được)
export interface UserInvitation {
  id: string;
  businessName: string;
  inviterName: string;
  created_at: string;
}

export interface UserInvitationFilters {
  page?: number;
  perPage?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface UserInvitationResponse {
  data: UserInvitation[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
