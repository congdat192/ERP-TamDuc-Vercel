
import { apiClient } from '@/lib/api-client';

export interface Member {
  id: string;
  user_id: string;
  business_id: string;
  status: 'ACTIVE' | 'INACTIVE';
  is_owner: boolean;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
}

export interface MembersResponse {
  total: number;
  per_page: number;
  current_page: number;
  data: Member[];
}

export interface MemberFilters {
  perPage?: number;
  page?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface UpdateMemberData {
  status: 0 | 1; // 0 = inactive, 1 = active
}

class MembersService {
  async getMembers(filters: MemberFilters = {}): Promise<MembersResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.perPage) params.append('perPage', filters.perPage.toString());
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.orderBy) params.append('orderBy', filters.orderBy);
      if (filters.orderDirection) params.append('orderDirection', filters.orderDirection);

      const response = await apiClient.get(`/members?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch members:', error);
      throw error;
    }
  }

  async getMemberById(memberId: string): Promise<Member> {
    try {
      const response = await apiClient.get(`/members/${memberId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch member:', error);
      throw error;
    }
  }

  async updateMember(memberId: string, data: UpdateMemberData): Promise<Member> {
    try {
      const response = await apiClient.put(`/members/${memberId}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update member:', error);
      throw error;
    }
  }

  async deleteMember(memberId: string): Promise<void> {
    try {
      await apiClient.delete(`/members/${memberId}`);
    } catch (error) {
      console.error('Failed to delete member:', error);
      throw error;
    }
  }
}

export const membersService = new MembersService();
