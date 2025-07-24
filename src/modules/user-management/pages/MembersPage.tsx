
import React, { useState, useEffect } from 'react';
import { MembersTab } from '../components/members/MembersTab';
import { api } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import { useBusiness } from '@/contexts/BusinessContext';
import { RoleService } from '../services/roleService';
import { getAvatarUrl } from '@/types/auth';
import { UserManagementFilters } from '../types';

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
  avatarPath?: string;
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

// Updated MemberFilters to match UserManagementFilters structure
interface MemberFilters extends UserManagementFilters {
  perPage?: number;
  page?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

// Helper function to generate reliable fallback avatar URL using a working service
const generateFallbackAvatarUrl = (name: string, email: string): string => {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  // Use a more reliable service that doesn't have CORS issues
  // Alternative 1: Using ui-avatars.com (widely used and reliable)
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=3b82f6&color=ffffff&size=40&bold=true`;
};

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
      
      // Basic pagination and ordering
      if (filters.perPage) params.append('perPage', filters.perPage.toString());
      else params.append('perPage', pagination.perPage.toString());
      
      if (filters.page) params.append('page', filters.page.toString());
      else params.append('page', pagination.currentPage.toString());
      
      if (filters.orderBy) params.append('orderBy', filters.orderBy);
      else params.append('orderBy', 'created_at');
      
      if (filters.orderDirection) params.append('orderDirection', filters.orderDirection);
      else params.append('orderDirection', 'asc');

      // Add search filter
      if (filters.search && filters.search.trim()) {
        params.append('search', filters.search.trim());
        console.log('🔍 [MembersPage] Adding search filter:', filters.search.trim());
      }
      
      // Add status filter - convert from UI format to API format
      if (filters.status && filters.status.length > 0) {
        filters.status.forEach(status => {
          // Convert lowercase UI status to uppercase API status
          const apiStatus = status.toUpperCase();
          params.append('status[]', apiStatus);
          console.log('📊 [MembersPage] Adding status filter:', apiStatus);
        });
      }
      
      // Add role filter
      if (filters.roleIds && filters.roleIds.length > 0) {
        filters.roleIds.forEach(roleId => {
          params.append('roleIds[]', roleId.toString());
          console.log('👤 [MembersPage] Adding role filter:', roleId);
        });
      }

      const fullUrl = `/members?${params.toString()}`;
      console.log('🌐 [MembersPage] Full API URL:', fullUrl);
      console.log('🔍 [MembersPage] Fetching members with params:', params.toString());
      console.log('📋 [MembersPage] Applied filters:', {
        search: filters.search,
        status: filters.status,
        roleIds: filters.roleIds,
        hasSearch: !!(filters.search && filters.search.trim()),
        hasStatus: !!(filters.status && filters.status.length > 0),
        hasRoles: !!(filters.roleIds && filters.roleIds.length > 0)
      });
      
      const response = await api.get<MembersResponse>(fullUrl);
      
      console.log('📊 [MembersPage] Raw API response:', response);
      console.log('👥 [MembersPage] Members data:', response.data);
      console.log('📈 [MembersPage] Response stats:', {
        totalMembers: response.total,
        returnedMembers: response.data.length,
        currentPage: response.current_page,
        perPage: response.per_page
      });

      // Debug: Log each member's details for filtering verification
      console.log('🔍 [MembersPage] DEBUGGING FILTER RESULTS:');
      response.data.forEach((member, index) => {
        console.log(`👤 [Member ${index + 1}]:`, {
          id: member.id,
          name: member.name,
          email: member.email,
          status: member.status,
          is_owner: member.is_owner,
          roles: member.roles?.map(r => ({ id: r.id, name: r.name })) || [],
          created_at: member.created_at
        });
      });

      // Additional debugging for filter verification
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchingMembers = response.data.filter(member => 
          member.name?.toLowerCase().includes(searchTerm) || 
          member.email?.toLowerCase().includes(searchTerm)
        );
        console.log(`🔍 [MembersPage] Search "${filters.search}" should match ${matchingMembers.length} members locally`);
      }

      if (filters.status && filters.status.length > 0) {
        const statusFilters = filters.status.map(s => s.toUpperCase());
        const matchingMembers = response.data.filter(member => 
          statusFilters.includes(member.status)
        );
        console.log(`📊 [MembersPage] Status filter ${JSON.stringify(statusFilters)} should match ${matchingMembers.length} members locally`);
      }

      if (filters.roleIds && filters.roleIds.length > 0) {
        const matchingMembers = response.data.filter(member => 
          member.roles?.some(role => filters.roleIds!.includes(role.id))
        );
        console.log(`👤 [MembersPage] Role filter ${JSON.stringify(filters.roleIds)} should match ${matchingMembers.length} members locally`);
      }

      setMembers(response.data);
      setPagination({
        total: response.total,
        perPage: response.per_page,
        currentPage: response.current_page
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

  const handleFiltersChange = (filters: UserManagementFilters) => {
    console.log('🔍 [MembersPage] Filters changed:', filters);
    console.log('🔍 [MembersPage] Filter details:', {
      search: filters.search,
      searchLength: filters.search?.length || 0,
      status: filters.status,
      statusCount: filters.status?.length || 0,
      roleIds: filters.roleIds,
      roleCount: filters.roleIds?.length || 0
    });
    
    // Transform UserManagementFilters to MemberFilters format
    const memberFilters: MemberFilters = {
      ...filters,
      // Reset to page 1 when filters change
      page: 1,
      perPage: pagination.perPage,
      orderBy: 'created_at',
      orderDirection: 'asc'
    };
    
    console.log('🔄 [MembersPage] Transformed filters for API:', memberFilters);
    fetchMembers(memberFilters);
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

  // Transform API data to match UI expectations với avatar logic giống UserProfile
  const transformedMembers: UIMember[] = members.map(member => {
    // Get role name from roles array if available, otherwise fallback
    let roleName = 'Thành Viên'; // Default role name
    
    if (member.is_owner) {
      roleName = 'Chủ Sở Hữu';
    } else if (member.roles && member.roles.length > 0) {
      // Use the first role if multiple roles exist
      roleName = member.roles[0].name;
    }
    
    // Use avatar logic similar to UserProfile
    let avatarUrl: string | undefined;
    
    if (member.avatarPath) {
      // If API provides avatarPath, use getAvatarUrl() like in UserProfile
      avatarUrl = getAvatarUrl(member.avatarPath);
      console.log(`🖼️ [MembersPage] Using real avatar for ${member.name}:`, avatarUrl);
    } else {
      // If no avatarPath, use fallback generator with working service
      avatarUrl = generateFallbackAvatarUrl(member.name || 'User', member.email);
      console.log(`🎨 [MembersPage] Using fallback avatar for ${member.name}:`, avatarUrl);
    }
    
    const transformedMember = {
      id: member.id.toString(),
      fullName: member.name || 'N/A',
      username: member.email?.split('@')[0] || 'N/A',
      email: member.email || 'N/A',
      phone: undefined, // API doesn't provide this
      avatar: avatarUrl,
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
    
    console.log(`🔄 [MembersPage] Transformed member ${member.id}:`, {
      id: transformedMember.id,
      name: transformedMember.fullName,
      hasRealAvatar: !!member.avatarPath,
      avatarUrl: transformedMember.avatar
    });
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
