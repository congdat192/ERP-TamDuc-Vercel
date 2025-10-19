import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, TrendingDown, Package, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/usePermissions';
import { BenefitsService } from '../../services/benefitsService';
import { BenefitsTable } from './BenefitsTable';
import { BenefitsFilters } from './BenefitsFilters';
import { CreateBenefitModal } from './CreateBenefitModal';
import { EditBenefitModal } from './EditBenefitModal';
import { BulkAssignBenefitsModal } from './BulkAssignBenefitsModal';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import type { Benefit, BenefitFilters as BenefitFiltersType, BenefitStats } from '../../types/benefits';

interface Props {
  employeeId?: string;
  readOnly?: boolean;
}

export function BenefitsTabContent({ employeeId, readOnly = false }: Props = {}) {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [stats, setStats] = useState<BenefitStats | null>(null);
  const [filters, setFilters] = useState<BenefitFiltersType>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const { toast } = useToast();
  const { hasFeatureAccess } = usePermissions();

  const canCreate = !readOnly && hasFeatureAccess('create_benefits');
  const canEdit = !readOnly && hasFeatureAccess('edit_benefits');
  const canDelete = !readOnly && hasFeatureAccess('delete_benefits');

  useEffect(() => {
    loadBenefits();
    loadStats();
  }, []);

  const loadBenefits = async () => {
    try {
      setIsLoading(true);
      const data = await BenefitsService.getBenefits();
      setBenefits(data);
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
      const data = await BenefitsService.getBenefitStats();
      setStats(data);
    } catch (error: any) {
      console.error('Error loading stats:', error);
    }
  };

  const handleEdit = (benefit: Benefit) => {
    setSelectedBenefit(benefit);
    setShowEditModal(true);
  };

  const handleDelete = async (benefit: Benefit) => {
    if (!confirm(`Bạn có chắc muốn xóa phúc lợi "${benefit.benefit_name}"?`)) return;

    try {
      await BenefitsService.deleteBenefit(benefit.id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa phúc lợi',
      });
      loadBenefits();
      loadStats();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleBulkAssign = (benefit?: Benefit) => {
    if (!benefit && filteredBenefits.length === 0) {
      toast({
        title: 'Thông báo',
        description: 'Vui lòng tạo phúc lợi trước khi gán hàng loạt',
        variant: 'destructive',
      });
      return;
    }
    setSelectedBenefit(benefit || filteredBenefits[0]);
    setShowBulkAssignModal(true);
  };

  const handleSuccess = () => {
    loadBenefits();
    loadStats();
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowBulkAssignModal(false);
    setSelectedBenefit(null);
  };

  const filteredBenefits = benefits.filter((benefit) => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (!benefit.benefit_name.toLowerCase().includes(search) &&
          !benefit.benefit_code.toLowerCase().includes(search)) {
        return false;
      }
    }
    if (filters.type && benefit.benefit_type !== filters.type) return false;
    if (filters.status && benefit.status !== filters.status) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Phúc Lợi</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang Hoạt Động</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Không Hoạt Động</CardTitle>
              <TrendingDown className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.inactive}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <BenefitsFilters filters={filters} onFiltersChange={setFilters} />
        
        {!readOnly && (
          <div className="flex gap-2">
            <PermissionGuard requiredPermission="create_benefits" showError={false}>
              <Button 
                variant="outline" 
                onClick={() => handleBulkAssign()}
              >
                <Users className="h-4 w-4 mr-2" />
                Gán Hàng Loạt
              </Button>
            </PermissionGuard>

            <PermissionGuard requiredPermission="create_benefits" showError={false}>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm Phúc Lợi
              </Button>
            </PermissionGuard>
          </div>
        )}
      </div>

      {/* Table */}
      <BenefitsTable
        benefits={filteredBenefits}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkAssign={handleBulkAssign}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      {/* Modals */}
      {showCreateModal && (
        <CreateBenefitModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleSuccess}
        />
      )}

      {showEditModal && selectedBenefit && (
        <EditBenefitModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedBenefit(null);
          }}
          benefit={selectedBenefit}
          onSuccess={handleSuccess}
        />
      )}

      {showBulkAssignModal && selectedBenefit && (
        <BulkAssignBenefitsModal
          isOpen={showBulkAssignModal}
          onClose={() => {
            setShowBulkAssignModal(false);
            setSelectedBenefit(null);
          }}
          benefit={selectedBenefit}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
