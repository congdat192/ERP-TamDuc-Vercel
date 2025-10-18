import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Benefit } from '../../types/benefits';

interface BenefitsTableProps {
  benefits: Benefit[];
  isLoading: boolean;
  onEdit: (benefit: Benefit) => void;
  onDelete: (benefit: Benefit) => void;
  canEdit: boolean;
  canDelete: boolean;
}

const getBenefitTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    insurance: 'Bảo Hiểm',
    allowance: 'Phụ Cấp',
    bonus: 'Thưởng',
    leave: 'Nghỉ Phép',
    other: 'Khác',
  };
  return labels[type] || type;
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
    active: { variant: 'default', label: 'Hoạt Động' },
    inactive: { variant: 'secondary', label: 'Tạm Ngưng' },
    expired: { variant: 'destructive', label: 'Hết Hạn' },
  };
  const config = variants[status] || { variant: 'secondary' as const, label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const formatCurrency = (value?: number) => {
  if (!value) return '-';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

export function BenefitsTable({
  benefits,
  isLoading,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: BenefitsTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  if (benefits.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Chưa có phúc lợi nào</p>
          <p className="text-sm text-muted-foreground">Thêm phúc lợi đầu tiên để bắt đầu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã Phúc Lợi</TableHead>
            <TableHead>Tên Phúc Lợi</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Giá Trị</TableHead>
            <TableHead>Trạng Thái</TableHead>
            <TableHead>Ngày Hiệu Lực</TableHead>
            {(canEdit || canDelete) && <TableHead className="text-right">Thao Tác</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {benefits.map((benefit) => (
            <TableRow key={benefit.id}>
              <TableCell className="font-medium">{benefit.benefit_code}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{benefit.benefit_name}</div>
                  {benefit.description && (
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {benefit.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>{getBenefitTypeLabel(benefit.benefit_type)}</TableCell>
              <TableCell>{formatCurrency(benefit.value)}</TableCell>
              <TableCell>{getStatusBadge(benefit.status)}</TableCell>
              <TableCell>
                {benefit.effective_from
                  ? format(new Date(benefit.effective_from), 'dd/MM/yyyy')
                  : '-'}
              </TableCell>
              {(canEdit || canDelete) && (
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(benefit)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(benefit)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
