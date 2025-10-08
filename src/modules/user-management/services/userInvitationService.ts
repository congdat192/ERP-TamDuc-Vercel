// Mock User Invitation Service - No real API calls

export interface UserInvitation {
  id: string;
  businessName: string;
  businessLogoPath: string | null;
  inviterName: string;
  inviterAvatarPath: string | null;
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

const mockUserInvitations: UserInvitation[] = [
  {
    id: '1',
    businessName: 'Công ty ABC',
    businessLogoPath: null,
    inviterName: 'Nguyễn Văn A',
    inviterAvatarPath: null,
    created_at: new Date().toISOString()
  }
];

export class UserInvitationService {
  static async getUserInvitations(filters: UserInvitationFilters = {}): Promise<UserInvitationResponse> {
    console.log('🔍 [mockUserInvitationService] Fetching user invitations');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      data: [...mockUserInvitations],
      total: mockUserInvitations.length,
      page: filters.page || 1,
      perPage: filters.perPage || 20,
      totalPages: Math.ceil(mockUserInvitations.length / (filters.perPage || 20))
    };
  }

  static async respondToInvitation(invitationId: string, status: 'accept' | 'reject'): Promise<void> {
    console.log('🔧 [mockUserInvitationService] Responding to invitation');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockUserInvitations.findIndex(inv => inv.id === invitationId);
    if (index > -1) {
      mockUserInvitations.splice(index, 1);
    }
  }

  static async acceptInvitation(invitationId: string): Promise<void> {
    return this.respondToInvitation(invitationId, 'accept');
  }

  static async rejectInvitation(invitationId: string): Promise<void> {
    return this.respondToInvitation(invitationId, 'reject');
  }
}
