import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Eye, CheckCircle, Lock, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PayrollMonthDetail } from './PayrollMonthDetail';

interface MonthlyPayroll {
  month: string;
  count: number;
  totalNetPayment: number;
  status: string;
}

interface ConfirmDialog {
  isOpen: boolean;
  month: string;
  count: number;
  action: 'issue' | 'lock' | 'delete';
  title: string;
  description: string;
}

export function PayrollListTable() {
  const [payrolls, setPayrolls] = useState<MonthlyPayroll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [filters, setFilters] = useState({ month: '', status: 'all' });
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>({
    isOpen: false,
    month: '',
    count: 0,
    action: 'issue',
    title: '',
    description: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPayrolls();
  }, [filters]);

  const fetchPayrolls = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('employee_payrolls')
        .select('month, status, net_payment');

      if (filters.month) {
        query = query.eq('month', `${filters.month}-01`);
      }
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;

      const grouped = (data || []).reduce((acc: any, item) => {
        if (!acc[item.month]) {
          acc[item.month] = {
            month: item.month,
            count: 0,
            totalNetPayment: 0,
            status: item.status,
          };
        }
        acc[item.month].count += 1;
        acc[item.month].totalNetPayment += Number(item.net_payment || 0);
        return acc;
      }, {});

      setPayrolls(Object.values(grouped).sort((a: any, b: any) => 
        new Date(b.month).getTime() - new Date(a.month).getTime()
      ) as MonthlyPayroll[]);
    } catch (error: any) {
      console.error('Error fetching payrolls:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể tải danh sách phiếu lương',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatMonth = (dateString: string) => {
    const date = new Date(dateString);
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary',
      issued: 'default',
      locked: 'outline',
    } as const;
    const labels = {
      draft: 'Nháp',
      issued: 'Đã Phát Hành',
      locked: 'Đã Khóa',
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{labels[status as keyof typeof labels] || status}</Badge>;
  };

  const handleIssue = (month: string, count: number) => {
    setConfirmDialog({
      isOpen: true,
      month,
      count,
      action: 'issue',
      title: 'Xác Nhận Phát Hành',
      description: `Bạn có chắc muốn phát hành ${count} phiếu lương tháng ${formatMonth(month)}? Sau khi phát hành, email thông báo sẽ được gửi đến tất cả nhân viên.`,
    });
  };

  const handleLock = (month: string, count: number) => {
    setConfirmDialog({
      isOpen: true,
      month,
      count,
      action: 'lock',
      title: 'Xác Nhận Khóa Phiếu Lương',
      description: `Bạn có chắc muốn khóa ${count} phiếu lương tháng ${formatMonth(month)}? Sau khi khóa, không thể chỉnh sửa nữa.`,
    });
  };

  const handleDelete = (month: string, count: number) => {
    setConfirmDialog({
      isOpen: true,
      month,
      count,
      action: 'delete',
      title: 'Xác Nhận Xóa',
      description: `Bạn có chắc muốn xóa ${count} phiếu lương tháng ${formatMonth(month)}? Hành động này không thể hoàn tác.`,
    });
  };

  const executeAction = async () => {
    const { action, month } = confirmDialog;
    
    try {
      if (action === 'issue') {
        const { error } = await supabase
          .from('employee_payrolls')
          .update({ status: 'issued', issued_at: new Date().toISOString() })
          .eq('month', month)
          .eq('status', 'draft');

        if (error) throw error;

        const { error: emailError } = await supabase.functions.invoke('send-payroll-notification', {
          body: { month },
        });

        if (emailError) {
          console.error('Email notification error:', emailError);
          toast({
            title: 'Phát hành thành công',
            description: 'Phiếu lương đã được phát hành, nhưng có lỗi khi gửi email thông báo.',
          });
        } else {
          toast({
            title: 'Phát hành thành công',
            description: `Đã phát hành ${confirmDialog.count} phiếu lương và gửi email thông báo.`,
          });
        }
      } else if (action === 'lock') {
        const { error } = await supabase
          .from('employee_payrolls')
          .update({ status: 'locked' })
          .eq('month', month)
          .eq('status', 'issued');

        if (error) throw error;

        toast({
          title: 'Khóa thành công',
          description: `Đã khóa ${confirmDialog.count} phiếu lương.`,
        });
      } else if (action === 'delete') {
        const { error } = await supabase
          .from('employee_payrolls')
          .delete()
          .eq('month', month)
          .eq('status', 'draft');

        if (error) throw error;

        toast({
          title: 'Xóa thành công',
          description: `Đã xóa ${confirmDialog.count} phiếu lương.`,
        });
      }

      fetchPayrolls();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.message || 'Không thể thực hiện thao tác',
      });
    } finally {
      setConfirmDialog({ ...confirmDialog, isOpen: false });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex gap-4">
          <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="draft">Nháp</SelectItem>
              <SelectItem value="issued">Đã Phát Hành</SelectItem>
              <SelectItem value="locked">Đã Khóa</SelectItem>
            </SelectContent>
          </Select>
          
          <Input 
            type="month" 
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
            className="w-48"
            placeholder="Chọn tháng"
          />
        </div>

        {payrolls.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Chưa có dữ liệu phiếu lương.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Tháng</TableHead>
                  <TableHead className="text-right">Số NV</TableHead>
                  <TableHead className="text-right">Tổng Thực Nhận</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrolls.map((payroll) => (
                  <>
                    <TableRow 
                      key={payroll.month}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setExpandedMonth(expandedMonth === payroll.month ? null : payroll.month)}
                    >
                      <TableCell>
                        {expandedMonth === payroll.month ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{formatMonth(payroll.month)}</TableCell>
                      <TableCell className="text-right">{payroll.count}</TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(payroll.totalNetPayment)}</TableCell>
                      <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setExpandedMonth(expandedMonth === payroll.month ? null : payroll.month)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {payroll.status === 'draft' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => handleIssue(payroll.month, payroll.count)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Phát Hành
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDelete(payroll.month, payroll.count)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          
                          {payroll.status === 'issued' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleLock(payroll.month, payroll.count)}
                            >
                              <Lock className="w-4 h-4 mr-1" />
                              Khóa
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {expandedMonth === payroll.month && (
                      <TableRow>
                        <TableCell colSpan={6} className="p-0">
                          <PayrollMonthDetail month={payroll.month} onUpdate={fetchPayrolls} />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <AlertDialog open={confirmDialog.isOpen} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, isOpen: open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={executeAction}>Xác Nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
