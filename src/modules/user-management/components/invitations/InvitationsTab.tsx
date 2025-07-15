
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Plus } from 'lucide-react';
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
  }, [filters]);

  const loadInvitations = async () => {
    try {
      setIsLoading(true);
      const response = await InvitationService.getInvitations({
        ...filters,
        page: pagination.page,
        perPage: pagination.perPage
      });
      
      setInvitations(response.data);
      setPagination({
        page: response.page,
        perPage: response.perPage,
        total: response.total,
        totalPages: response.totalPages
      });
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
