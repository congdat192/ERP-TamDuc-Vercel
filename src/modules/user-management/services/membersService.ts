
import { api } from '@/services/apiService';
import { Member, MembersResponse } from '../types';

interface MemberFilters {
  perPage?: number;
  page?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export const getMembers = async (filters: MemberFilters = {}): Promise<MembersResponse> => {
  console.log('🔍 [MembersService] Fetching members...');
  
  try {
    const params = new URLSearchParams();
    
    if (filters.perPage) params.append('perPage', filters.perPage.toString());
    else params.append('perPage', '20');
    
    if (filters.page) params.append('page', filters.page.toString());
    else params.append('page', '1');
    
    if (filters.orderBy) params.append('orderBy', filters.orderBy);
    else params.append('orderBy', 'created_at');
    
    if (filters.orderDirection) params.append('orderDirection', filters.orderDirection);
    else params.append('orderDirection', 'asc');

    const response = await api.get<MembersResponse>(`/members?${params.toString()}`);
    console.log('✅ [MembersService] Raw response:', response);
    
    return response;
  } catch (error) {
    console.error('❌ [MembersService] Error fetching members:', error);
    throw error;
  }
};

export const getMember = async (id: number): Promise<Member> => {
  console.log('🔍 [MembersService] Fetching member:', id);
  
  try {
    const response = await api.get<Member>(`/members/${id}`);
    console.log('✅ [MembersService] Member fetched:', response);
    
    return response;
  } catch (error) {
    console.error('❌ [MembersService] Error fetching member:', error);
    throw error;
  }
};

export const updateMember = async (id: number, data: { status: 'ACTIVE' | 'INACTIVE' }): Promise<Member> => {
  console.log('📝 [MembersService] Updating member:', id, data);
  
  try {
    const response = await api.put<Member>(`/members/${id}`, data);
    console.log('✅ [MembersService] Member updated:', response);
    
    return response;
  } catch (error) {
    console.error('❌ [MembersService] Error updating member:', error);
    throw error;
  }
};

export const updateMemberRole = async (id: number, roleId: number): Promise<Member> => {
  console.log('👤 [MembersService] Updating member role:', id, 'to role:', roleId);
  
  try {
    // Fix: Use correct API payload format with role_ids array
    const response = await api.put<Member>(`/members/${id}`, {
      role_ids: [roleId] // API expects array format
    });
    console.log('✅ [MembersService] Member role updated:', response);
    
    return response;
  } catch (error) {
    console.error('❌ [MembersService] Error updating member role:', error);
    throw error;
  }
};

export const deleteMember = async (id: number): Promise<void> => {
  console.log('🗑️ [MembersService] Deleting member:', id);
  
  try {
    await api.delete<void>(`/members/${id}`);
    console.log('✅ [MembersService] Member deleted successfully');
  } catch (error) {
    console.error('❌ [MembersService] Error deleting member:', error);
    throw error;
  }
};

// Export all functions as a service object for backward compatibility
export const membersService = {
  getMembers,
  getMember,
  updateMember,
  updateMemberRole,
  deleteMember
};
