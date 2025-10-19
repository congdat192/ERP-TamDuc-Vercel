import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/usePermissions';
import { DisciplineService } from '../../services/disciplineService';
import { DisciplineTable } from './DisciplineTable';
import { DisciplineFilters } from './DisciplineFilters';
import { CreateDisciplineModal } from './CreateDisciplineModal';
import { EditDisciplineModal } from './EditDisciplineModal';
import { ResolveDisciplineDialog } from './ResolveDisciplineDialog';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import type { DisciplineRecord, DisciplineFilters as DisciplineFiltersType, DisciplineStats } from '../../types/benefits';

interface Props {
  employeeId?: string;
  readOnly?: boolean;
}

export function DisciplineTabContent({ employeeId, readOnly = false }: Props = {}) {
  const [records, setRecords] = useState<DisciplineRecord[]>([]);
  const [stats, setStats] = useState<DisciplineStats | null>(null);
  const [filters, setFilters] = useState<DisciplineFiltersType>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DisciplineRecord | null>(null);
  const { toast } = useToast();
  const { hasFeatureAccess } = usePermissions();

  const canManage = !readOnly && hasFeatureAccess('manage_discipline');

  useEffect(() => {
    loadRecords();
    loadStats();
  }, [filters]);

  const loadRecords = async () => {
    try {
      setIsLoading(true);
      const data = await DisciplineService.getDisciplineRecords(filters);
      setRecords(data);
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
      const data = await DisciplineService.getDisciplineStats();
      setStats(data);
    } catch (error: any) {
      console.error('Error loading stats:', error);
    }
  };

  const handleEdit = (record: DisciplineRecord) => {
    setSelectedRecord(record);
    setShowEditModal(true);
  };

  const handleResolve = (record: DisciplineRecord) => {
    setSelectedRecord(record);
    setShowResolveDialog(true);
  };

  const handleDelete = async (record: DisciplineRecord) => {
    if (!confirm(`Bạn có chắc muốn xóa hồ sơ kỷ luật "${record.record_code}"?`)) return;

    try {
      await DisciplineService.deleteRecord(record.id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa hồ sơ kỷ luật',
      });
      loadRecords();
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
    loadRecords();
    loadStats();
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowResolveDialog(false);
    setSelectedRecord(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Hồ Sơ</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chờ Xử Lý</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã Xử Lý</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vi Phạm Nghiêm Trọng</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.by_severity.critical}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <DisciplineFilters filters={filters} onFiltersChange={setFilters} />
        
        {!readOnly && (
          <PermissionGuard requiredPermission="manage_discipline" showError={false}>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo Hồ Sơ Kỷ Luật
            </Button>
          </PermissionGuard>
        )}
      </div>

      {/* Table */}
      <DisciplineTable
        records={records}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onResolve={handleResolve}
        canManage={canManage}
      />

      {/* Modals */}
      {showCreateModal && (
        <CreateDisciplineModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleSuccess}
        />
      )}

      {showEditModal && selectedRecord && (
        <EditDisciplineModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedRecord(null);
          }}
          record={selectedRecord}
          onSuccess={handleSuccess}
        />
      )}

      {showResolveDialog && selectedRecord && (
        <ResolveDisciplineDialog
          isOpen={showResolveDialog}
          onClose={() => {
            setShowResolveDialog(false);
            setSelectedRecord(null);
          }}
          record={selectedRecord}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
