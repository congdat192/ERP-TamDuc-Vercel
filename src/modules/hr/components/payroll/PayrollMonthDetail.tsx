import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PayrollDetailModal } from './PayrollDetailModal';

interface PayrollMonthDetailProps {
  month: string;
  onUpdate: () => void;
}

export function PayrollMonthDetail({ month, onUpdate }: PayrollMonthDetailProps) {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detailModal, setDetailModal] = useState<{ isOpen: boolean; payrollId: string | null }>({
    isOpen: false,
    payrollId: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMonthPayrolls();
  }, [month]);

  const fetchMonthPayrolls = async () => {
    const { data } = await supabase
      .from('employee_payrolls')
      .select('*')
      .eq('month', month)
      .order('employee_code');
    setPayrolls(data || []);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatMonth = (dateString: string) => {
    const date = new Date(dateString);
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const getStatusBadge = (status: string) => {
    const variants = { draft: 'secondary', issued: 'default', locked: 'outline' } as const;
    const labels = { draft: 'Nháp', issued: 'Đã Phát Hành', locked: 'Đã Khóa' } as const;
    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{labels[status as keyof typeof labels] || status}</Badge>;
  };

  const handleSelectAll = (checked: boolean) => {
    const draftIds = payrolls.filter(p => p.status === 'draft').map(p => p.id);
    setSelectedIds(checked ? draftIds : []);
  };

  const handleBulkIssue = async () => {
    if (selectedIds.length === 0) return;

    try {
      const { error } = await supabase
        .from('employee_payrolls')
        .update({ status: 'issued', issued_at: new Date().toISOString() })
        .in('id', selectedIds);

      if (error) throw error;

      // Send email notifications
      await supabase.functions.invoke('send-payroll-notification', {
        body: { month },
      });

      toast({
        title: 'Phát hành thành công',
        description: `Đã phát hành ${selectedIds.length} phiếu lương và gửi email thông báo.`,
      });

      setSelectedIds([]);
      fetchMonthPayrolls();
      onUpdate();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.message || 'Không thể phát hành',
      });
    }
  };

  const draftPayrolls = payrolls.filter(p => p.status === 'draft');

  return (
    <div className="p-4 bg-muted/30 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">
          {payrolls.length} nhân viên - Tháng {formatMonth(month)}
        </h3>
        
        {selectedIds.length > 0 && (
          <Button size="sm" onClick={handleBulkIssue}>
            <CheckCircle className="w-4 h-4 mr-1" />
            Phát Hành {selectedIds.length} Phiếu
          </Button>
        )}
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedIds.length === draftPayrolls.length && draftPayrolls.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Mã NV</TableHead>
              <TableHead>Họ Tên</TableHead>
              <TableHead>Phòng Ban</TableHead>
              <TableHead className="text-right">Thực Nhận</TableHead>
              <TableHead>Trạng Thái</TableHead>
              <TableHead className="text-right">Thao Tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrolls.map((payroll) => (
              <TableRow key={payroll.id}>
                <TableCell>
                  {payroll.status === 'draft' && (
                    <Checkbox 
                      checked={selectedIds.includes(payroll.id)}
                      onCheckedChange={(checked) => {
                        setSelectedIds(checked 
                          ? [...selectedIds, payroll.id]
                          : selectedIds.filter(id => id !== payroll.id)
                        );
                      }}
                    />
                  )}
                </TableCell>
                <TableCell className="font-medium">{payroll.employee_code}</TableCell>
                <TableCell>{payroll.employee_name}</TableCell>
                <TableCell>{payroll.department || 'N/A'}</TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(payroll.net_payment)}
                </TableCell>
                <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setDetailModal({ isOpen: true, payrollId: payroll.id })}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PayrollDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, payrollId: null })}
        payrollId={detailModal.payrollId}
        onUpdate={() => {
          fetchMonthPayrolls();
          onUpdate();
        }}
      />
    </div>
  );
}
