
import React, { useState, useEffect } from 'react';
import { MembersTab } from '../components/members/MembersTab';
import { api } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import { useBusiness } from '@/contexts/BusinessContext';
import { RoleService } from '../services/roleService';

// Define a simpler interface for the UI that matches what MembersTable expects
interface UIMember {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: string;
  isActive: boolean;
  isOwner: boolean;
  createdAt: string;
  lastLogin?: string | null;
  role: { name: string };
  department?: { name: string; description?: string } | null;
}

interface Member {
  id: number;
  name: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  is_owner: boolean;
  roles?: Array<{ id: number; name: string; description?: string }>;
  created_at: string;
  updated_at: string;
}

interface MembersResponse {
  total: number;
  per_page: number;
  current_page: number;
  data: Member[];
}

interface Role {
  id: number;
  name: string;
  description?: string;
}

interface MemberFilters {
  perPage?: number;
  page?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    perPage: 20,
    currentPage: 1
  });
  
  const { toast } = useToast();
  const { currentBusiness } = useBusiness();

  const fetchRoles = async () => {
    try {
      setIsLoadingRoles(true);
      console.log('🔍 [MembersPage] Fetching roles...');
      const rolesData = await RoleService.getRoles();
      console.log('✅ [MembersPage] Roles loaded:', rolesData);
      setRoles(rolesData);
    } catch (err: any) {
      console.error('❌ [MembersPage] Error fetching roles:', err);
      // Don't show toast for role loading errors, just log them
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const fetchMembers = async (filters: MemberFilters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      
      if (filters.perPage) params.append('perPage', filters.perPage.toString());
      else params.append('perPage', pagination.perPage.toString());
      
      if (filters.page) params.append('page', filters.page.toString());
      else params.append('page', pagination.currentPage.toString());
      
      if (filters.orderBy) params.append('orderBy', filters.orderBy);
      else params.append('orderBy', 'created_at');
      
      if (filters.orderDirection) params.append('orderDirection', filters.orderDirection);
      else params.append('orderDirection', 'asc');

      console.log('🔍 [MembersPage] Fetching members with params:', params.toString());
      const response = await api.get<MembersResponse>(`/members?${params.toString()}`);
      
      console.log('📊 [MembersPage] Raw API response:', response);
      console.log('👥 [MembersPage] Members data:', response.data);

      setMembers(response.data);
      setPagination({
        total: response.total,
        perPage: response.per_page,
        currentPage: response.current_page
      });
      
      // Log chi tiết từng member để debug role
      response.data.forEach((member, index) => {
        console.log(`👤 [Member ${index + 1}]:`, {
          id: member.id,
          name: member.name,
          email: member.email,
          status: member.status,
          is_owner: member.is_owner,
          roles: member.roles,
          created_at: member.created_at
        });
      });
    } catch (err: any) {
      console.error('❌ [MembersPage] Error fetching members:', err);
      
      if (err.message?.includes('not a member of this business')) {
        setError('Bạn không có quyền xem danh sách thành viên của doanh nghiệp này.');
        toast({
          title: "Không có quyền truy cập",
          description: "Bạn không phải là thành viên của doanh nghiệp này",
          variant: "destructive",
        });
      } else {
        setError(err.message || 'Có lỗi xảy ra khi tải danh sách thành viên');
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách thành viên",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMember = async (memberId: string, data: any) => {
    try {
      console.log('🔧 [MembersPage] Updating member:', memberId, data);
      
      // Convert UI action to API status format
      const updateData = {
        status: data.isActive ? 'ACTIVE' as const : 'INACTIVE' as const
      };

      await api.put(`/members/${memberId}`, updateData);
      
      toast({
        title: "Thành công",
        description: "Cập nhật trạng thái thành viên thành công",
      });
      
      // Refresh the members list
      await fetchMembers();
    } catch (err: any) {
      console.error('❌ [MembersPage] Error updating member:', err);
      toast({
        title: "Lỗi",
        description: err.message || "Không thể cập nhật trạng thái thành viên",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMemberRole = async (memberId: string, roleId: number) => {
    try {
      console.log('👤 [MembersPage] Updating member role:', memberId, 'to role ID:', roleId);
      
      // Use the correct API payload format
      await api.put(`/members/${memberId}`, {
        role_ids: [roleId] // API expects array format
      });
      
      toast({
        title: "Thành công",
        description: "Cập nhật vai trò thành viên thành công",
      });
      
      // Refresh the members list to get updated role information
      console.log('🔄 [MembersPage] Refreshing members list after role update...');
      await fetchMembers();
    } catch (err: any) {
      console.error('❌ [MembersPage] Error updating member role:', err);
      toast({
        title: "Lỗi",
        description: err.message || "Không thể cập nhật vai trò thành viên",
        variant: "destructive",
      });
      throw err; // Re-throw to let modal handle the error
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      console.log('🗑️ [MembersPage] Deleting member:', memberId);
      await api.delete(`/members/${memberId}`);
      
      toast({
        title: "Thành công",
        description: "Xóa thành viên thành công",
      });
      
      // Refresh the members list
      await fetchMembers();
    } catch (err: any) {
      console.error('❌ [MembersPage] Error deleting member:', err);
      toast({
        title: "Lỗi",
        description: err.message || "Không thể xóa thành viên",
        variant: "destructive",
      });
    }
  };

  const handleFiltersChange = (filters: any) => {
    console.log('🔍 [MembersPage] Filters changed:', filters);
    fetchMembers(filters);
  };

  const handleBulkOperation = async (operation: any) => {
    console.log('📦 [MembersPage] Bulk operation:', operation);
    // Handle bulk operations here if needed
  };

  useEffect(() => {
    if (currentBusiness) {
      console.log('🏢 [MembersPage] Current business:', currentBusiness);
      fetchMembers();
      fetchRoles();
    }
  }, [currentBusiness]);

  // Transform API data to match UI expectations với role chính xác
  const transformedMembers: UIMember[] = members.map(member => {
    // Get role name from roles array if available, otherwise fallback
    let roleName = 'Thành Viên'; // Default role name
    
    if (member.is_owner) {
      roleName = 'Chủ Sở Hữu';
    } else if (member.roles && member.roles.length > 0) {
      // Use the first role if multiple roles exist
      roleName = member.roles[0].name;
    }
    
    const transformedMember = {
      id: member.id.toString(),
      fullName: member.name || 'N/A',
      username: member.email?.split('@')[0] || 'N/A',
      email: member.email || 'N/A',
      phone: undefined, // API doesn't provide this
      avatar: undefined, // API doesn't provide this
      status: member.status === 'ACTIVE' ? 'active' : 'inactive',
      isActive: member.status === 'ACTIVE',
      isOwner: member.is_owner,
      createdAt: member.created_at,
      lastLogin: null, // API doesn't provide this
      role: { 
        name: roleName 
      },
      department: null // API doesn't provide this
    };
    
    console.log(`🔄 [MembersPage] Transformed member ${member.id}:`, transformedMember);
    return transformedMember;
  });

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => fetchMembers()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <MembersTab
      users={transformedMembers}
      roles={roles}
      isLoading={isLoading}
      onUserUpdate={handleUpdateMember}
      onUserDelete={handleDeleteMember}
      onUpdateMemberRole={handleUpdateMemberRole}
      onBulkOperation={handleBulkOperation}
      onFiltersChange={handleFiltersChange}
    />
  );
}
