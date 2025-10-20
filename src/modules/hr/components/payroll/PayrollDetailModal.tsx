import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { InvoiceCommissionTable } from './InvoiceCommissionTable';

interface PayrollDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payrollId: string | null;
  onUpdate: () => void;
}

export function PayrollDetailModal({ isOpen, onClose, payrollId, onUpdate }: PayrollDetailModalProps) {
  const [payroll, setPayroll] = useState<any>(null);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (payrollId && isOpen) {
      fetchPayrollDetail();
    }
  }, [payrollId, isOpen]);

  const fetchPayrollDetail = async () => {
    setIsLoading(true);
    try {
      const { data: payrollData } = await supabase
        .from('employee_payrolls')
        .select('*')
        .eq('id', payrollId)
        .single();
      
      setPayroll(payrollData);

      const { data: commissionsData } = await supabase
        .from('payroll_invoice_commissions')
        .select('*')
        .eq('payroll_id', payrollId);
      
      setCommissions(commissionsData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const formatMonth = (dateString: string) => {
    const date = new Date(dateString);
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  if (!payroll) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            PHIẾU LƯƠNG THÁNG {formatMonth(payroll.month)}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : (
          <div className="space-y-6">
            {/* 1️⃣ THÔNG TIN NHÂN VIÊN */}
            <Card>
              <CardHeader>
                <CardTitle>1️⃣ Thông Tin Nhân Viên</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Mã Nhân Viên</Label>
                  <p className="font-semibold">{payroll.employee_code}</p>
                </div>
                <div>
                  <Label>Họ và Tên</Label>
                  <p className="font-semibold">{payroll.employee_name}</p>
                </div>
                <div>
                  <Label>Phòng Ban</Label>
                  <p>{payroll.department || 'N/A'}</p>
                </div>
                <div>
                  <Label>Chức Danh</Label>
                  <p>{payroll.position || 'N/A'}</p>
                </div>
                <div>
                  <Label>Công Chuẩn</Label>
                  <p>{payroll.standard_days || 26} ngày</p>
                </div>
                <div>
                  <Label>PC Trách Nhiệm</Label>
                  <p>{formatCurrency(payroll.responsibility_allowance || 0)}</p>
                </div>
              </CardContent>
            </Card>

            {/* 2️⃣ CÁC KHOẢN LƯƠNG */}
            <Card>
              <CardHeader>
                <CardTitle>2️⃣ Các Khoản Lương: {formatCurrency(payroll.total_salary || 0)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Lương FT Chính Thức:</span>
                    <span className="font-semibold">{formatCurrency(payroll.salary_fulltime_official || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lương FT Thử Việc:</span>
                    <span className="font-semibold">{formatCurrency(payroll.salary_fulltime_probation || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Công CT Thực Tế:</span>
                    <span>{payroll.ct_actual_days || 0} ngày</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Công CT Lễ:</span>
                    <span>{payroll.ct_holiday_days || 0} ngày</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CT - OT Ngày:</span>
                    <span>{payroll.ct_ot_days || 0} ngày</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CT - OT Giờ:</span>
                    <span>{payroll.ct_ot_hours || 0} giờ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Công TV Thực Tế:</span>
                    <span>{payroll.tv_actual_days || 0} ngày</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TV - OT Giờ:</span>
                    <span>{payroll.tv_ot_hours || 0} giờ</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3️⃣ CÁC KHOẢN THƯỞNG */}
            <Card>
              <CardHeader>
                <CardTitle>3️⃣ Các Khoản Thưởng: {formatCurrency(payroll.total_bonus || 0)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Thưởng HĐ BH/CS:</span>
                    <span className="font-semibold">{formatCurrency(payroll.bonus_invoice_bh_cs || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thưởng HĐ KTV:</span>
                    <span className="font-semibold">{formatCurrency(payroll.bonus_invoice_ktv || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thưởng Hiệu Suất:</span>
                    <span className="font-semibold">{formatCurrency(payroll.bonus_performance || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phụ Cấp Ăn:</span>
                    <span className="font-semibold">{formatCurrency(payroll.allowance_meal || 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4️⃣ TỔNG HỢP THU NHẬP */}
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>4️⃣ Tổng Hợp Thu Nhập</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-lg">
                  <span>A. Tổng Thu Nhập:</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(payroll.total_income || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>B. Tổng Các Khoản Trừ:</span>
                  <span className="font-bold text-red-600">
                    {formatCurrency(payroll.total_deductions || 0)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-2xl">
                  <span className="font-bold">C. Thực Nhận:</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(payroll.net_payment || 0)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 5️⃣ CHI TIẾT THANH TOÁN */}
            <Card>
              <CardHeader>
                <CardTitle>5️⃣ Chi Tiết Thanh Toán</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Đã Chi Tạm Ứng:</span>
                  <span>{formatCurrency(payroll.paid_advance || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Đã Chi Ngày 3:</span>
                  <span>{formatCurrency(payroll.paid_day_3 || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Chi Dự Ngày 15:</span>
                  <span>{formatCurrency(payroll.paid_day_15 || 0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Tổng Công Ty Đã Chi:</span>
                  <span>{formatCurrency(payroll.total_company_paid || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Chi Dư:</span>
                  <span className={payroll.payment_surplus > 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(payroll.payment_surplus || 0)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 6️⃣ CHI TIẾT HOA HỒNG HÓA ĐƠN */}
            {commissions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>6️⃣ Chi Tiết Hoa Hồng Hóa Đơn</CardTitle>
                </CardHeader>
                <CardContent>
                  <InvoiceCommissionTable commissions={commissions} />
                </CardContent>
              </Card>
            )}

            {/* 7️⃣ GHI CHÚ */}
            {payroll.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>7️⃣ Ghi Chú</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{payroll.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
