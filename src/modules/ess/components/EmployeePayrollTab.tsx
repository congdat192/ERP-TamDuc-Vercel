import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { PayrollDetailModal } from '@/modules/hr/components/payroll/PayrollDetailModal';

export function EmployeePayrollTab() {
  const { currentUser } = useAuth();
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    payrollId: string | null;
  }>({ isOpen: false, payrollId: null });

  useEffect(() => {
    fetchMyPayrolls();
  }, [currentUser]);

  const fetchMyPayrolls = async () => {
    try {
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', currentUser?.id)
        .single();

      if (!employee) {
        console.error('Không tìm thấy thông tin nhân viên');
        return;
      }

      const { data, error } = await supabase
        .from('employee_payrolls')
        .select('*')
        .eq('employee_id', employee.id)
        .in('status', ['issued', 'locked'])
        .order('month', { ascending: false });

      if (error) throw error;

      setPayrolls(data || []);
    } catch (error) {
      console.error('Lỗi tải phiếu lương:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (isLoading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>📊 Phiếu Lương Của Tôi</CardTitle>
        </CardHeader>
        <CardContent>
          {payrolls.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Chưa có phiếu lương nào được phát hành.
            </p>
          ) : (
            <div className="space-y-3">
              {payrolls.map((payroll) => (
                <div 
                  key={payroll.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">
                        Tháng {new Date(payroll.month).getMonth() + 1}/{new Date(payroll.month).getFullYear()}
                      </h4>
                      <Badge variant={payroll.status === 'locked' ? 'outline' : 'default'}>
                        {payroll.status === 'locked' ? 'Đã Khóa' : 'Đã Phát Hành'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Phòng ban: {payroll.department || 'N/A'} | Chức danh: {payroll.position || 'N/A'}
                    </p>
                    <p className="text-lg font-bold text-primary mt-2">
                      Thực nhận: {formatCurrency(payroll.net_payment)}
                    </p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => setDetailModal({ isOpen: true, payrollId: payroll.id })}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Xem Chi Tiết
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <PayrollDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, payrollId: null })}
        payrollId={detailModal.payrollId}
        onUpdate={fetchMyPayrolls}
      />
    </div>
  );
}
