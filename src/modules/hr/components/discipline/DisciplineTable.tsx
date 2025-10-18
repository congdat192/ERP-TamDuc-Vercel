import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { DisciplineRecord } from '../../types/benefits';

interface DisciplineTableProps {
  records: DisciplineRecord[];
  isLoading: boolean;
  onEdit: (record: DisciplineRecord) => void;
  onDelete: (record: DisciplineRecord) => void;
  onResolve: (record: DisciplineRecord) => void;
  canManage: boolean;
}

const getViolationTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    late: 'Đi Trễ',
    absent: 'Vắng Mặt',
    'policy-violation': 'Vi Phạm Quy Định',
    misconduct: 'Hành Vi Sai Trái',
    other: 'Khác',
  };
  return labels[type] || type;
};

const getSeverityBadge = (severity: string) => {
  const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string; className?: string }> = {
    warning: { variant: 'outline', label: 'Nhắc Nhở', className: 'border-yellow-500 text-yellow-700' },
    minor: { variant: 'secondary', label: 'Nhẹ' },
    major: { variant: 'default', label: 'Nghiêm Trọng', className: 'bg-orange-500' },
    critical: { variant: 'destructive', label: 'Cực Kỳ Nghiêm Trọng' },
  };
  const config = variants[severity] || { variant: 'secondary' as const, label: severity };
  return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
    pending: { variant: 'secondary', label: 'Chờ Xử Lý' },
    reviewed: { variant: 'outline', label: 'Đã Xem Xét' },
    resolved: { variant: 'default', label: 'Đã Xử Lý' },
    appealed: { variant: 'destructive', label: 'Đang Khiếu Nại' },
  };
  const config = variants[status] || { variant: 'secondary' as const, label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export function DisciplineTable({
  records,
  isLoading,
  onEdit,
  onDelete,
  onResolve,
  canManage,
}: DisciplineTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Chưa có hồ sơ kỷ luật nào</p>
          <p className="text-sm text-muted-foreground">Tạo hồ sơ đầu tiên để bắt đầu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã KL</TableHead>
            <TableHead>Nhân Viên</TableHead>
            <TableHead>Loại Vi Phạm</TableHead>
            <TableHead>Mức Độ</TableHead>
            <TableHead>Ngày Vi Phạm</TableHead>
            <TableHead>Trạng Thái</TableHead>
            {canManage && <TableHead className="text-right">Thao Tác</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.record_code}</TableCell>
              <TableCell>
                {record.employee && (
                  <div>
                    <div className="font-medium">{record.employee.full_name}</div>
                    <div className="text-sm text-muted-foreground">{record.employee.employee_code}</div>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div>
                  <div>{getViolationTypeLabel(record.violation_type)}</div>
                  {record.description && (
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {record.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>{getSeverityBadge(record.severity)}</TableCell>
              <TableCell>{format(new Date(record.violation_date), 'dd/MM/yyyy')}</TableCell>
              <TableCell>{getStatusBadge(record.status)}</TableCell>
              {canManage && (
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {record.status !== 'resolved' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onResolve(record)}
                        title="Xử lý"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(record)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(record)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
