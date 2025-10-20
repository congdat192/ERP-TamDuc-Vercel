import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface MonthlyPayroll {
  month: string;
  count: number;
  total_net: number;
  status: string;
}

export function PayrollListTable() {
  const [payrolls, setPayrolls] = useState<MonthlyPayroll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_payrolls')
        .select('month, status, net_payment')
        .order('month', { ascending: false });

      if (error) throw error;

      const grouped = data?.reduce((acc: any, item) => {
        const key = item.month;
        if (!acc[key]) {
          acc[key] = { month: key, count: 0, total_net: 0, status: item.status };
        }
        acc[key].count++;
        acc[key].total_net += item.net_payment || 0;
        return acc;
      }, {});

      setPayrolls(Object.values(grouped || {}));
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Lỗi tải dữ liệu',
        description: error.message,
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
    const variants: Record<string, any> = {
      draft: { label: 'Nháp', variant: 'secondary' },
      issued: { label: 'Đã Phát Hành', variant: 'default' },
      locked: { label: 'Đã Khóa', variant: 'outline' },
    };
    const config = variants[status] || variants.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return <Card><CardContent className="p-8 text-center">Đang tải...</CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh Sách Phiếu Lương Theo Tháng</CardTitle>
      </CardHeader>
      <CardContent>
        {payrolls.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Chưa có phiếu lương nào. Hãy import file Excel để bắt đầu.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tháng</TableHead>
                <TableHead className="text-right">Số Nhân Viên</TableHead>
                <TableHead className="text-right">Tổng Chi Phí</TableHead>
                <TableHead>Trạng Thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrolls.map((payroll) => (
                <TableRow key={payroll.month}>
                  <TableCell className="font-medium">
                    {formatMonth(payroll.month)}
                  </TableCell>
                  <TableCell className="text-right">{payroll.count} NV</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(payroll.total_net)}
                  </TableCell>
                  <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
