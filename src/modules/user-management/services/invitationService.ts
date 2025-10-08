// Mock Invitation Service - No real API calls

export interface CreateInvitationRequest {
  email: string;
  role_id?: number;
}

export interface InvitationFilters {
  page?: number;
  perPage?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  search?: string;
  status?: string[];
}

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

export interface InvitationResponse {
  data: Invitation[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

const mockInvitations: Invitation[] = [
  {
    id: '1',
    email: 'user1@example.com',
    name: '',
    status: 'pending',
    created_at: new Date().toISOString(),
    invited_by: { id: '1', name: 'Admin', email: 'admin@example.com' }
  }
];

export class InvitationService {
  static async getInvitations(filters: InvitationFilters = {}): Promise<InvitationResponse> {
    console.log('🔍 [mockInvitationService] Fetching invitations');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredInvitations = [...mockInvitations];
    
    if (filters.status && filters.status.length > 0) {
      filteredInvitations = filteredInvitations.filter(inv => 
        filters.status!.includes(inv.status)
      );
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredInvitations = filteredInvitations.filter(inv => 
        inv.email.toLowerCase().includes(search)
      );
    }
    
    const page = filters.page || 1;
    const perPage = filters.perPage || 20;
    
    return {
      data: filteredInvitations,
      total: filteredInvitations.length,
      page,
      perPage,
      totalPages: Math.ceil(filteredInvitations.length / perPage)
    };
  }

  static async createInvitation(data: CreateInvitationRequest): Promise<Invitation> {
    console.log('🔧 [mockInvitationService] Creating invitation');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newInvitation: Invitation = {
      id: Date.now().toString(),
      email: data.email,
      name: '',
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    mockInvitations.push(newInvitation);
    return newInvitation;
  }

  static async deleteInvitation(invitationId: string): Promise<void> {
    console.log('🗑️ [mockInvitationService] Deleting invitation');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockInvitations.findIndex(inv => inv.id === invitationId);
    if (index > -1) {
      mockInvitations.splice(index, 1);
    }
  }
}
