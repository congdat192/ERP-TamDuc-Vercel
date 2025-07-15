
import { api } from '@/services/apiService';
import { Invitation, CreateInvitationRequest, InvitationFilters, InvitationResponse } from '../types/invitation';

export class InvitationService {
  static async getInvitations(filters: InvitationFilters = {}): Promise<InvitationResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.perPage) params.append('perPage', filters.perPage.toString());
    if (filters.orderBy) params.append('orderBy', filters.orderBy);
    if (filters.orderDirection) params.append('orderDirection', filters.orderDirection);
    if (filters.search) params.append('search', filters.search);
    if (filters.status && filters.status.length > 0) {
      filters.status.forEach(status => params.append('status[]', status));
    }
    if (filters.role) params.append('role', filters.role);

    const queryString = params.toString();
    const endpoint = `/invitations${queryString ? `?${queryString}` : ''}`;
    
    return await api.get<InvitationResponse>(endpoint);
  }

  static async createInvitation(data: CreateInvitationRequest): Promise<Invitation> {
    return await api.post<Invitation>('/invitations', data);
  }

  static async deleteInvitation(invitationId: string): Promise<void> {
    return await api.delete(`/invitations/${invitationId}`);
  }
}
