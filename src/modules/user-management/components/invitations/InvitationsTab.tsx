
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { InvitationsTable } from './InvitationsTable';
import { InvitationFilters } from './InvitationFilters';
import { CreateInvitationModal } from '../modals/CreateInvitationModal';
import { InvitationService } from '../../services/invitationService';
import { Invitation, InvitationFilters as IInvitationFilters } from '../../types/invitation';
import { useToast } from '@/hooks/use-toast';

export function InvitationsTab() {
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<IInvitationFilters>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 20,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    loadInvitations();
  }, [filters, pagination.page, pagination.perPage]);

  const loadInvitations = async () => {
    try {
      setIsLoading(true);
      const response = await InvitationService.getInvitations({
        ...filters,
        page: pagination.page,
        perPage: pagination.perPage
      });
      
      setInvitations(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages
      }));
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tải danh sách lời mời",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (invitationId: string) => {
    try {
      await InvitationService.deleteInvitation(invitationId);
      toast({
        title: "Thành công",
        description: "Đã xóa lời mời",
      });
      loadInvitations();
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa lời mời",
        variant: "destructive",
      });
    }
  };

  const handleInvitationSent = () => {
    loadInvitations();
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setPagination(prev => ({ 
      ...prev, 
      perPage: newItemsPerPage, 
      page: 1 // Reset to first page when changing items per page
    }));
  };

  // Calculate pagination display
  const startIndex = (pagination.page - 1) * pagination.perPage + 1;
  const endIndex = Math.min(pagination.page * pagination.perPage, pagination.total);

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1">
              <InvitationFilters 
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Gửi Lời Mời
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invitations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Danh Sách Lời Mời ({pagination.total})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InvitationsTable
            invitations={invitations}
            isLoading={isLoading}
            onDelete={handleDelete}
          />
          
          {/* Pagination */}
          {!isLoading && invitations.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t mt-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">Hiển thị</span>
                <select
                  value={pagination.perPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="px-2 py-1 text-sm border rounded bg-background"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-muted-foreground">
                  {startIndex} – {endIndex} trong {pagination.total.toLocaleString('vi-VN')} lời mời
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.page === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="px-3 py-1 text-sm min-w-[80px] text-center">
                  Trang {pagination.page} / {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.page === pagination.totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Invitation Modal */}
      <CreateInvitationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onInvitationSent={handleInvitationSent}
      />
    </div>
  );
}
