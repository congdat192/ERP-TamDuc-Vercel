import React, { useState, useEffect } from 'react';
import { MembersTab } from '../components/members/MembersTab';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthContext';
import { RoleService } from '../services/roleService';
import { MembersService, SupabaseMember } from '../services/membersService';
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

// Client-side filtering function
const applyClientSideFilters = (members: SupabaseMember[], filters: UserManagementFilters): SupabaseMember[] => {
  console.log('🔧 [MembersPage] Applying client-side filters:', filters);
  console.log('🔧 [MembersPage] Before filtering:', members.length, 'members');
  
  let filteredMembers = [...members];

  // Apply search filter
  if (filters.search && filters.search.trim()) {
    const searchTerm = filters.search.toLowerCase().trim();
    filteredMembers = filteredMembers.filter(member => 
      member.profiles?.full_name?.toLowerCase().includes(searchTerm) || 
      member.user_id?.toLowerCase().includes(searchTerm)
    );
    console.log('🔍 [MembersPage] After search filter:', filteredMembers.length, 'members');
  }

  // Apply status filter
  if (filters.status && filters.status.length > 0) {
    const statusFilters = filters.status.map(s => s.toUpperCase());
    filteredMembers = filteredMembers.filter(member => 
      statusFilters.includes(member.status)
    );
    console.log('📊 [MembersPage] After status filter:', filteredMembers.length, 'members');
  }

  // Apply role filter
  if (filters.roleIds && filters.roleIds.length > 0) {
    filteredMembers = filteredMembers.filter(member => 
      filters.roleIds!.includes(member.role_id)
    );
    console.log('👤 [MembersPage] After role filter:', filteredMembers.length, 'members');
  }

  console.log('✅ [MembersPage] Final filtered result:', filteredMembers.length, 'members');
  return filteredMembers;
};

export function MembersPage() {
  const [allMembers, setAllMembers] = useState<SupabaseMember[]>([]); // Store all members from API
  const [filteredMembers, setFilteredMembers] = useState<SupabaseMember[]>([]); // Store filtered members
  const [currentFilters, setCurrentFilters] = useState<UserManagementFilters>({}); // Store current filters
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
  const { currentUser } = useAuth();

  const fetchRoles = async () => {
    try {
      setIsLoadingRoles(true);
      console.log('🔍 [MembersPage] Fetching roles...');
      // Fetch global roles (no business ID needed in single-tenant)
      const rolesData = await RoleService.getRoles('');
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

      console.log('🌐 [MembersPage] Fetching members from Supabase...');
      
      // In single-tenant mode, fetch all members (no business ID needed)
      const response = await MembersService.getMembers('');
      
      console.log('📊 [MembersPage] Raw response:', response);
      console.log('👥 [MembersPage] Members data:', response.data);

      // Store all members from API
      setAllMembers(response.data);
      
      // Apply client-side filtering
      const filtered = applyClientSideFilters(response.data, currentFilters);
      setFilteredMembers(filtered);

      setPagination({
        total: filtered.length,
        perPage: response.per_page,
        currentPage: response.current_page
      });
      
    } catch (err: any) {
      console.error('❌ [MembersPage] Error:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải danh sách thành viên');
      toast({
        title: "Lỗi",
        description: err.message || "Không thể tải danh sách thành viên",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMember = async (memberId: string, data: any) => {
    try {
      console.log('🔧 [MembersPage] Updating member:', memberId, data);
      
      const updateData: any = {};
      if (data.isActive !== undefined) {
        updateData.status = data.isActive ? 'ACTIVE' : 'INACTIVE';
      }

      await MembersService.updateMember(memberId, updateData);
      
      toast({
        title: "Thành công",
        description: "Cập nhật trạng thái thành viên thành công",
      });
      
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
      
      await MembersService.updateMember(memberId, { role_id: roleId });
      
      toast({
        title: "Thành công",
        description: "Cập nhật vai trò thành viên thành công",
      });
      
      await fetchMembers();
    } catch (err: any) {
      console.error('❌ [MembersPage] Error updating member role:', err);
      toast({
        title: "Lỗi",
        description: err.message || "Không thể cập nhật vai trò thành viên",
        variant: "destructive",
      });
      throw err;
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      console.log('🗑️ [MembersPage] Deleting member:', memberId);
      await MembersService.deleteMember(memberId);
      
      toast({
        title: "Thành công",
        description: "Xóa thành viên thành công",
      });
      
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
    
    // Store current filters
    setCurrentFilters(filters);
    
    // Apply client-side filtering to existing data
    const filtered = applyClientSideFilters(allMembers, filters);
    setFilteredMembers(filtered);
    
    // Update pagination total
    setPagination(prev => ({
      ...prev,
      total: filtered.length,
      currentPage: 1 // Reset to first page when filters change
    }));
  };

  const handleBulkOperation = async (operation: any) => {
    console.log('📦 [MembersPage] Bulk operation:', operation);
    // Handle bulk operations here if needed
  };

  useEffect(() => {
    if (currentUser) {
      console.log('👤 [MembersPage] Current user:', currentUser);
      fetchMembers();
      fetchRoles();
    }
  }, [currentUser]);

  // Transform API data to match UI expectations
  const transformedMembers: UIMember[] = filteredMembers.map(member => {
    // In single-tenant, no owner concept
    const isOwner = false;
    
    // Get role name
    let roleName = member.roles?.name || 'Thành Viên';
    if (isOwner) {
      roleName = 'Chủ Sở Hữu';
    }
    
    // Handle avatar
    let avatarUrl: string | undefined;
    if (member.profiles?.avatar_path) {
      avatarUrl = getAvatarUrl(member.profiles.avatar_path);
    } else {
      avatarUrl = generateFallbackAvatarUrl(
        member.profiles?.full_name || 'User',
        member.user_id
      );
    }
    
    return {
      id: member.id,
      fullName: member.profiles?.full_name || 'N/A',
      username: member.profiles?.full_name?.split(' ')[0] || 'N/A',
      email: member.user_id,
      phone: member.profiles?.phone || undefined,
      avatar: avatarUrl,
      status: member.status === 'ACTIVE' ? 'active' : 'inactive',
      isActive: member.status === 'ACTIVE',
      isOwner: isOwner,
      createdAt: member.joined_at,
      lastLogin: null,
      role: { name: roleName },
      department: null
    };
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
