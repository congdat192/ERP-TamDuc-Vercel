import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { BenefitsService } from '../../services/benefitsService';
import { AssignBenefitModal } from '../benefits/AssignBenefitModal';
import type { BenefitAssignment, Benefit } from '../../types/benefits';
import { usePermissions } from '@/hooks/usePermissions';

interface EmployeeBenefitsTabProps {
  employeeId: string;
}

export function EmployeeBenefitsTab({ employeeId }: EmployeeBenefitsTabProps) {
  const [benefits, setBenefits] = useState<BenefitAssignment[]>([]);
  const [allBenefits, setAllBenefits] = useState<Benefit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const { hasFeatureAccess } = usePermissions();

  const canAssignBenefits = hasFeatureAccess('create_benefits');

  useEffect(() => {
    loadBenefits();
    loadAllBenefits();
  }, [employeeId]);

  const loadBenefits = async () => {
    try {
      setIsLoading(true);
      const data = await BenefitsService.getEmployeeBenefits(employeeId);
      setBenefits(data);
    } catch (err) {
      console.error('❌ Error loading benefits:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllBenefits = async () => {
    try {
      const data = await BenefitsService.getBenefits();
      setAllBenefits(data.filter(b => b.status === 'active'));
    } catch (err) {
      console.error('❌ Error loading all benefits:', err);
    }
  };

  const handleAssignClick = () => {
    if (allBenefits.length > 0) {
      setSelectedBenefit(allBenefits[0]);
      setShowAssignModal(true);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
      active: { variant: 'default', label: 'Hoạt Động' },
      expired: { variant: 'destructive', label: 'Hết Hạn' },
      cancelled: { variant: 'secondary', label: 'Đã Hủy' },
    };
    const config = variants[status] || { variant: 'secondary' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Đang tải...</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Phúc Lợi Hiện Tại</h3>
        {canAssignBenefits && (
          <Button onClick={handleAssignClick} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Gán Phúc Lợi
          </Button>
        )}
      </div>

      {benefits.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nhân viên chưa có phúc lợi nào
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Phúc Lợi</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Ngày Bắt Đầu</TableHead>
                <TableHead>Ngày Kết Thúc</TableHead>
                <TableHead>Trạng Thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {benefits.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">
                    {assignment.benefit?.benefit_name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {assignment.benefit?.benefit_type || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(assignment.start_date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    {assignment.end_date
                      ? format(new Date(assignment.end_date), 'dd/MM/yyyy')
                      : '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedBenefit && (
        <AssignBenefitModal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          benefit={selectedBenefit}
          onSuccess={() => {
            setShowAssignModal(false);
            loadBenefits();
          }}
        />
      )}
    </div>
  );
}
