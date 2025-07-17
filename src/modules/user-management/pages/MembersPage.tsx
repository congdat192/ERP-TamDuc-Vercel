
import React, { useState, useEffect } from 'react';
import { MembersTab } from '../components/members/MembersTab';
import { membersService, Member, MemberFilters } from '../services/membersService';
import { useToast } from '@/hooks/use-toast';

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

export function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    perPage: 20,
    currentPage: 1
  });
  
  const { toast } = useToast();

  const fetchMembers = async (filters: MemberFilters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await membersService.getMembers({
        perPage: pagination.perPage,
        page: pagination.currentPage,
        orderBy: 'created_at',
        orderDirection: 'asc',
        ...filters
      });

      setMembers(response.data);
      setPagination({
        total: response.total,
        perPage: response.per_page,
        currentPage: response.current_page
      });
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tải danh sách thành viên');
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách thành viên",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMember = async (memberId: string, data: any) => {
    try {
      // Convert status to API format (0 or 1) with proper typing
      const updateData = {
        status: data.isActive ? 1 as const : 0 as const
      };

      await membersService.updateMember(memberId, updateData);
      
      toast({
        title: "Thành công",
        description: "Cập nhật thông tin thành viên thành công",
      });
      
      // Refresh the members list
      await fetchMembers();
    } catch (err: any) {
      toast({
        title: "Lỗi",
        description: err.message || "Không thể cập nhật thông tin thành viên",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      await membersService.deleteMember(memberId);
      
      toast({
        title: "Thành công",
        description: "Xóa thành viên thành công",
      });
      
      // Refresh the members list
      await fetchMembers();
    } catch (err: any) {
      toast({
        title: "Lỗi",
        description: err.message || "Không thể xóa thành viên",
        variant: "destructive",
      });
    }
  };

  const handleFiltersChange = (filters: any) => {
    fetchMembers(filters);
  };

  const handleBulkOperation = async (operation: any) => {
    // Handle bulk operations here if needed
    console.log('Bulk operation:', operation);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Transform API data to match UI expectations
  const transformedMembers: UIMember[] = members.map(member => ({
    id: member.id,
    fullName: member.user?.name || 'N/A',
    username: member.user?.email?.split('@')[0] || 'N/A',
    email: member.user?.email || 'N/A',
    phone: member.user?.phone,
    avatar: member.user?.avatar,
    status: member.status === 'ACTIVE' ? 'active' : 'inactive',
    isActive: member.status === 'ACTIVE',
    isOwner: member.is_owner,
    createdAt: member.created_at,
    lastLogin: null, // API doesn't provide this
    role: { name: member.is_owner ? 'Owner' : 'Member' },
    department: null // API doesn't provide this
  }));

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
      isLoading={isLoading}
      onUserUpdate={handleUpdateMember}
      onUserDelete={handleDeleteMember}
      onBulkOperation={handleBulkOperation}
      onFiltersChange={handleFiltersChange}
    />
  );
}
