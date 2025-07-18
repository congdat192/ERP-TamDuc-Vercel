
import { apiCall } from '@/services/apiService';
import { Member, MembersResponse } from '../types';

export const getMembers = async (): Promise<MembersResponse> => {
  console.log('🔍 [MembersService] Fetching members...');
  
  try {
    const response = await apiCall<MembersResponse>('GET', '/members?perPage=20&page=1&orderBy=created_at&orderDirection=asc');
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
    const response = await apiCall<Member>('GET', `/members/${id}`);
    console.log('✅ [MembersService] Member fetched:', response);
    
    return response;
  } catch (error) {
    console.error('❌ [MembersService] Error fetching member:', error);
    throw error;
  }
};

export const updateMember = async (id: number, data: { status: number }): Promise<Member> => {
  console.log('📝 [MembersService] Updating member:', id, data);
  
  try {
    const response = await apiCall<Member>('PUT', `/members/${id}`, data);
    console.log('✅ [MembersService] Member updated:', response);
    
    return response;
  } catch (error) {
    console.error('❌ [MembersService] Error updating member:', error);
    throw error;
  }
};

export const deleteMember = async (id: number): Promise<void> => {
  console.log('🗑️ [MembersService] Deleting member:', id);
  
  try {
    await apiCall<void>('DELETE', `/members/${id}`);
    console.log('✅ [MembersService] Member deleted successfully');
  } catch (error) {
    console.error('❌ [MembersService] Error deleting member:', error);
    throw error;
  }
};
