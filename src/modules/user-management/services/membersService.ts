// Mock Members Service - No real API calls
import { Member, MembersResponse } from '../types';

interface MemberFilters {
  perPage?: number;
  page?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

interface ApiRole {
  id: number;
  name: string;
  description: string;
}

export interface MemberWithRoles extends Omit<Member, 'roles'> {
  roles: ApiRole[];
}

const mockMembers: Member[] = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    status: 'ACTIVE',
    is_owner: false,
    roles: [{ id: 1, name: 'Admin', description: 'Quản trị viên', permissions: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    status: 'ACTIVE',
    is_owner: false,
    roles: [{ id: 2, name: 'Manager', description: 'Quản lý', permissions: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const getMembers = async (filters: MemberFilters = {}): Promise<MembersResponse> => {
  console.log('🔍 [mockMembersService] Fetching members');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    data: [...mockMembers],
    total: mockMembers.length,
    per_page: filters.perPage || 20,
    current_page: filters.page || 1
  };
};

export const getMembersWithRoles = async (): Promise<MemberWithRoles[]> => {
  console.log('🔍 [mockMembersService] Fetching members with roles');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockMembers.map(member => ({
    ...member,
    roles: member.roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description || ''
    }))
  }));
};

export const getMember = async (id: number): Promise<Member> => {
  console.log('🔍 [mockMembersService] Fetching member:', id);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const member = mockMembers.find(m => m.id === id);
  if (!member) throw new Error('Member not found');
  return member;
};

export const updateMember = async (id: number, data: { status: 'ACTIVE' | 'INACTIVE' }): Promise<Member> => {
  console.log('📝 [mockMembersService] Updating member:', id);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const member = mockMembers.find(m => m.id === id);
  if (!member) throw new Error('Member not found');
  
  member.status = data.status;
  member.updated_at = new Date().toISOString();
  return member;
};

export const updateMemberRole = async (id: number, roleId: number): Promise<Member> => {
  console.log('👤 [mockMembersService] Updating member role:', id);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const member = mockMembers.find(m => m.id === id);
  if (!member) throw new Error('Member not found');
  
  member.roles = [{ id: roleId, name: 'Role ' + roleId, description: 'Role description', permissions: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() }];
  member.updated_at = new Date().toISOString();
  return member;
};

export const deleteMember = async (id: number): Promise<void> => {
  console.log('🗑️ [mockMembersService] Deleting member:', id);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockMembers.findIndex(m => m.id === id);
  if (index > -1) {
    mockMembers.splice(index, 1);
  }
};

export const membersService = {
  getMembers,
  getMembersWithRoles,
  getMember,
  updateMember,
  updateMemberRole,
  deleteMember
};
