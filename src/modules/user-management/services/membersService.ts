
import { api } from '@/services/apiService';
import { Member, MembersResponse } from '../types';

interface MemberFilters {
  perPage?: number;
  page?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

// Enhanced Member type with roles information
export interface MemberWithRoles extends Member {
  roles: Array<{
    id: number;
    name: string;
    description: string;
  }>;
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

export const getMembersWithRoles = async (): Promise<MemberWithRoles[]> => {
  console.log('🔍 [MembersService] Fetching all members with role details...');
  
  try {
    // First, get all members
    const membersResponse = await getMembers({
      perPage: 1000, // Get all members
      page: 1
    });
    
    console.log(`📊 [MembersService] Found ${membersResponse.data.length} members, fetching role details...`);
    
    // Then, fetch detailed info for each member to get roles
    const memberDetailsPromises = membersResponse.data.map(async (member): Promise<MemberWithRoles> => {
      try {
        const memberDetail = await getMember(member.id);
        return {
          ...member,
          roles: (memberDetail as any).roles || [] // Cast to access roles property
        };
      } catch (error) {
        console.warn(`⚠️ [MembersService] Failed to fetch details for member ${member.id}:`, error);
        // Return member without roles if detail fetch fails
        return {
          ...member,
          roles: []
        };
      }
    });
    
    // Wait for all member details to be fetched
    const membersWithRoles = await Promise.all(memberDetailsPromises);
    
    console.log('✅ [MembersService] Members with roles fetched:', membersWithRoles);
    
    // Log role distribution for debugging
    const roleDistribution: Record<string, number> = {};
    membersWithRoles.forEach(member => {
      member.roles.forEach(role => {
        roleDistribution[role.name] = (roleDistribution[role.name] || 0) + 1;
      });
    });
    console.log('📈 [MembersService] Role distribution:', roleDistribution);
    
    return membersWithRoles;
  } catch (error) {
    console.error('❌ [MembersService] Error fetching members with roles:', error);
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
  getMembersWithRoles,
  getMember,
  updateMember,
  updateMemberRole,
  deleteMember
};
