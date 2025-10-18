import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { DisciplineService } from '../../services/disciplineService';
import type { DisciplineRecord } from '../../types/benefits';

interface EmployeeDisciplineTabProps {
  employeeId: string;
}

export function EmployeeDisciplineTab({ employeeId }: EmployeeDisciplineTabProps) {
  const [records, setRecords] = useState<DisciplineRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, [employeeId]);

  const loadRecords = async () => {
    try {
      setIsLoading(true);
      const data = await DisciplineService.getEmployeeDisciplineHistory(employeeId);
      setRecords(data);
    } catch (err) {
      console.error('❌ Error loading discipline records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      pending: { variant: 'outline', label: 'Chờ Xử Lý' },
      reviewed: { variant: 'secondary', label: 'Đã Xem Xét' },
      resolved: { variant: 'default', label: 'Đã Xử Lý' },
      appealed: { variant: 'destructive', label: 'Khiếu Nại' },
    };
    const config = variants[status] || { variant: 'secondary' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      warning: { variant: 'outline', label: 'Nhắc Nhở' },
      minor: { variant: 'secondary', label: 'Nhẹ' },
      major: { variant: 'default', label: 'Nghiêm Trọng' },
      critical: { variant: 'destructive', label: 'Rất Nghiêm Trọng' },
    };
    const config = variants[severity] || { variant: 'secondary' as const, label: severity };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Đang tải...</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">Hồ Sơ Kỷ Luật</h3>

      {records.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nhân viên chưa có hồ sơ kỷ luật nào
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã KL</TableHead>
                <TableHead>Loại Vi Phạm</TableHead>
                <TableHead>Ngày Vi Phạm</TableHead>
                <TableHead>Mức Độ</TableHead>
                <TableHead>Hình Thức Xử Lý</TableHead>
                <TableHead>Trạng Thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-mono text-sm">
                    {record.record_code}
                  </TableCell>
                  <TableCell className="capitalize">
                    {record.violation_type}
                  </TableCell>
                  <TableCell>
                    {format(new Date(record.violation_date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>{getSeverityBadge(record.severity)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {record.penalty || '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
