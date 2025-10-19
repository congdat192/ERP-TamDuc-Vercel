import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Award, DollarSign, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/usePermissions';
import { RewardsService } from '../../services/rewardsService';
import { RewardsTable } from './RewardsTable';
import { RewardsFilters } from './RewardsFilters';
import { CreateRewardModal } from './CreateRewardModal';
import { EditRewardModal } from './EditRewardModal';
import { ApproveRewardDialog } from './ApproveRewardDialog';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import type { Reward, RewardFilters as RewardFiltersType, RewardStats } from '../../types/benefits';

interface Props {
  employeeId?: string;
  readOnly?: boolean;
}

export function RewardsTabContent({ employeeId, readOnly = false }: Props = {}) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [stats, setStats] = useState<RewardStats | null>(null);
  const [filters, setFilters] = useState<RewardFiltersType>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const { toast } = useToast();
  const { hasFeatureAccess } = usePermissions();

  const canCreate = !readOnly && hasFeatureAccess('create_rewards');
  const canEdit = !readOnly && hasFeatureAccess('edit_rewards');
  const canDelete = !readOnly && hasFeatureAccess('delete_rewards');
  const canApprove = !readOnly && hasFeatureAccess('approve_rewards');

  useEffect(() => {
    loadRewards();
    loadStats();
  }, [filters]);

  const loadRewards = async () => {
    try {
      setIsLoading(true);
      const data = await RewardsService.getRewards(filters);
      setRewards(data);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await RewardsService.getRewardStats();
      setStats(data);
    } catch (error: any) {
      console.error('Error loading stats:', error);
    }
  };

  const handleEdit = (reward: Reward) => {
    setSelectedReward(reward);
    setShowEditModal(true);
  };

  const handleApprove = (reward: Reward) => {
    setSelectedReward(reward);
    setShowApproveDialog(true);
  };

  const handleDelete = async (reward: Reward) => {
    if (!confirm(`Bạn có chắc muốn xóa khen thưởng "${reward.reward_title}"?`)) return;

    try {
      await RewardsService.deleteReward(reward.id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa khen thưởng',
      });
      loadRewards();
      loadStats();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSuccess = () => {
    loadRewards();
    loadStats();
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowApproveDialog(false);
    setSelectedReward(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Khen Thưởng</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chờ Phê Duyệt</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã Phê Duyệt</CardTitle>
              <Award className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Giá Trị</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-blue-600">
                {formatCurrency(stats.total_amount)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <RewardsFilters filters={filters} onFiltersChange={setFilters} />
        
        {!readOnly && (
          <PermissionGuard requiredPermission="create_rewards" showError={false}>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo Khen Thưởng
            </Button>
          </PermissionGuard>
        )}
      </div>

      {/* Table */}
      <RewardsTable
        rewards={rewards}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onApprove={handleApprove}
        canEdit={canEdit}
        canDelete={canDelete}
        canApprove={canApprove}
      />

      {/* Modals */}
      {showCreateModal && (
        <CreateRewardModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleSuccess}
        />
      )}

      {showEditModal && selectedReward && (
        <EditRewardModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedReward(null);
          }}
          reward={selectedReward}
          onSuccess={handleSuccess}
        />
      )}

      {showApproveDialog && selectedReward && (
        <ApproveRewardDialog
          isOpen={showApproveDialog}
          onClose={() => {
            setShowApproveDialog(false);
            setSelectedReward(null);
          }}
          reward={selectedReward}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
