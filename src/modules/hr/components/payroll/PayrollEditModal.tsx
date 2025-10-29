import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface PayrollEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  payrollId: string | null;
  onUpdate: () => void;
}

export function PayrollEditModal({ isOpen, onClose, payrollId, onUpdate }: PayrollEditModalProps) {
  const [payroll, setPayroll] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (payrollId && isOpen) {
      fetchPayrollDetail();
    }
  }, [payrollId, isOpen]);

  const fetchPayrollDetail = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('employee_payrolls')
        .select('*')
        .eq('id', payrollId)
        .single();
      
      if (error) throw error;
      setPayroll(data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.message || 'Không thể tải dữ liệu phiếu lương',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setPayroll((prev: any) => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate totals
      const totalSalary = 
        (Number(updated.salary_fulltime_official) || 0) +
        (Number(updated.salary_fulltime_probation) || 0) +
        (Number(updated.salary_parttime_official) || 0) +
        (Number(updated.salary_parttime_probation) || 0);
      
      const totalBonus = 
        (Number(updated.bonus_invoice_bh_cs) || 0) +
        (Number(updated.bonus_invoice_ktv) || 0) +
        (Number(updated.bonus_performance) || 0) +
        (Number(updated.allowance_meal) || 0) +
        (Number(updated.allowance_fuel) || 0) +
        (Number(updated.allowance_phone) || 0) +
        (Number(updated.allowance_other) || 0) +
        (Number(updated.responsibility_allowance) || 0);
      
      const totalIncome = totalSalary + totalBonus;
      
      const totalDeductions = 
        (Number(updated.deduction_social_insurance) || 0) +
        (Number(updated.deduction_income_tax) || 0) +
        (Number(updated.deduction_other) || 0) +
        (Number(updated.salary_advance) || 0);
      
      const netPayment = totalIncome - totalDeductions;
      
      const totalCompanyPaid = 
        (Number(updated.paid_advance) || 0) +
        (Number(updated.paid_day_3) || 0) +
        (Number(updated.paid_day_15) || 0);
      
      const paymentSurplus = totalCompanyPaid - netPayment;
      
      return {
        ...updated,
        total_salary: totalSalary,
        total_bonus: totalBonus,
        total_income: totalIncome,
        total_deductions: totalDeductions,
        net_payment: netPayment,
        total_company_paid: totalCompanyPaid,
        payment_surplus: paymentSurplus,
      };
    });
  };

  const handleSave = async () => {
    if (!payroll) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('employee_payrolls')
        .update({
          // Salary fields
          salary_fulltime_official: payroll.salary_fulltime_official,
          salary_fulltime_probation: payroll.salary_fulltime_probation,
          salary_parttime_official: payroll.salary_parttime_official,
          salary_parttime_probation: payroll.salary_parttime_probation,
          ct_actual_days: payroll.ct_actual_days,
          ct_holiday_days: payroll.ct_holiday_days,
          ct_ot_days: payroll.ct_ot_days,
          ct_ot_hours: payroll.ct_ot_hours,
          tv_actual_days: payroll.tv_actual_days,
          tv_ot_hours: payroll.tv_ot_hours,
          
          // Bonus fields
          bonus_invoice_bh_cs: payroll.bonus_invoice_bh_cs,
          bonus_invoice_ktv: payroll.bonus_invoice_ktv,
          bonus_performance: payroll.bonus_performance,
          allowance_meal: payroll.allowance_meal,
          allowance_fuel: payroll.allowance_fuel,
          allowance_phone: payroll.allowance_phone,
          allowance_other: payroll.allowance_other,
          responsibility_allowance: payroll.responsibility_allowance,
          
          // Deduction fields
          deduction_social_insurance: payroll.deduction_social_insurance,
          deduction_income_tax: payroll.deduction_income_tax,
          deduction_other: payroll.deduction_other,
          salary_advance: payroll.salary_advance,
          
          // Payment fields
          paid_advance: payroll.paid_advance,
          paid_day_3: payroll.paid_day_3,
          paid_day_15: payroll.paid_day_15,
          
          // Calculated totals
          total_salary: payroll.total_salary,
          total_bonus: payroll.total_bonus,
          total_income: payroll.total_income,
          total_deductions: payroll.total_deductions,
          net_payment: payroll.net_payment,
          total_company_paid: payroll.total_company_paid,
          payment_surplus: payroll.payment_surplus,
          
          // Notes
          notes: payroll.notes,
          
          // Standard days
          standard_days: payroll.standard_days,
        })
        .eq('id', payrollId);
      
      if (error) throw error;
      
      toast({
        title: 'Cập nhật thành công',
        description: 'Phiếu lương đã được cập nhật',
      });
      
      onUpdate();
      onClose();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.message || 'Không thể cập nhật phiếu lương',
      });
    } finally {
      setIsSaving(false);
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
            CHỈNH SỬA PHIẾU LƯƠNG THÁNG {formatMonth(payroll.month)}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : (
          <div className="space-y-6">
            {/* 1️⃣ THÔNG TIN NHÂN VIÊN (READ-ONLY) */}
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
                <div className="col-span-2">
                  <Label htmlFor="company_name">Tên Công Ty</Label>
                  <Input
                    id="company_name"
                    value={payroll.company_name || ''}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    placeholder="Mắt Kính Tâm Đức"
                  />
                </div>
                <div>
                  <Label>Công Chuẩn</Label>
                  <Input 
                    type="number" 
                    value={payroll.standard_days || 26}
                    onChange={(e) => handleInputChange('standard_days', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>PC Trách Nhiệm</Label>
                  <Input 
                    type="number" 
                    value={payroll.responsibility_allowance || 0}
                    onChange={(e) => handleInputChange('responsibility_allowance', Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 2️⃣ CÁC KHOẢN LƯƠNG */}
            <Card>
              <CardHeader>
                <CardTitle>2️⃣ Các Khoản Lương: {formatCurrency(payroll.total_salary || 0)}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Lương FT Chính Thức</Label>
                  <Input 
                    type="number" 
                    value={payroll.salary_fulltime_official || 0}
                    onChange={(e) => handleInputChange('salary_fulltime_official', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Lương FT Thử Việc</Label>
                  <Input 
                    type="number" 
                    value={payroll.salary_fulltime_probation || 0}
                    onChange={(e) => handleInputChange('salary_fulltime_probation', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Lương PT Chính Thức</Label>
                  <Input 
                    type="number" 
                    value={payroll.salary_parttime_official || 0}
                    onChange={(e) => handleInputChange('salary_parttime_official', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Lương PT Thử Việc</Label>
                  <Input 
                    type="number" 
                    value={payroll.salary_parttime_probation || 0}
                    onChange={(e) => handleInputChange('salary_parttime_probation', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Công CT Thực Tế (ngày)</Label>
                  <Input 
                    type="number" 
                    value={payroll.ct_actual_days || 0}
                    onChange={(e) => handleInputChange('ct_actual_days', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Công CT Lễ (ngày)</Label>
                  <Input 
                    type="number" 
                    value={payroll.ct_holiday_days || 0}
                    onChange={(e) => handleInputChange('ct_holiday_days', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>CT - OT Ngày</Label>
                  <Input 
                    type="number" 
                    value={payroll.ct_ot_days || 0}
                    onChange={(e) => handleInputChange('ct_ot_days', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>CT - OT Giờ</Label>
                  <Input 
                    type="number" 
                    value={payroll.ct_ot_hours || 0}
                    onChange={(e) => handleInputChange('ct_ot_hours', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Công TV Thực Tế (ngày)</Label>
                  <Input 
                    type="number" 
                    value={payroll.tv_actual_days || 0}
                    onChange={(e) => handleInputChange('tv_actual_days', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>TV - OT Giờ</Label>
                  <Input 
                    type="number" 
                    value={payroll.tv_ot_hours || 0}
                    onChange={(e) => handleInputChange('tv_ot_hours', Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 3️⃣ CÁC KHOẢN THƯỞNG */}
            <Card>
              <CardHeader>
                <CardTitle>3️⃣ Các Khoản Thưởng: {formatCurrency(payroll.total_bonus || 0)}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Thưởng HĐ BH/CS</Label>
                  <Input 
                    type="number" 
                    value={payroll.bonus_invoice_bh_cs || 0}
                    onChange={(e) => handleInputChange('bonus_invoice_bh_cs', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Thưởng HĐ KTV</Label>
                  <Input 
                    type="number" 
                    value={payroll.bonus_invoice_ktv || 0}
                    onChange={(e) => handleInputChange('bonus_invoice_ktv', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Thưởng Hiệu Suất</Label>
                  <Input 
                    type="number" 
                    value={payroll.bonus_performance || 0}
                    onChange={(e) => handleInputChange('bonus_performance', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Phụ Cấp Ăn</Label>
                  <Input 
                    type="number" 
                    value={payroll.allowance_meal || 0}
                    onChange={(e) => handleInputChange('allowance_meal', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Phụ Cấp Xăng</Label>
                  <Input 
                    type="number" 
                    value={payroll.allowance_fuel || 0}
                    onChange={(e) => handleInputChange('allowance_fuel', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Phụ Cấp Điện Thoại</Label>
                  <Input 
                    type="number" 
                    value={payroll.allowance_phone || 0}
                    onChange={(e) => handleInputChange('allowance_phone', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Phụ Cấp Khác</Label>
                  <Input 
                    type="number" 
                    value={payroll.allowance_other || 0}
                    onChange={(e) => handleInputChange('allowance_other', Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 4️⃣ CÁC KHOẢN TRỪ */}
            <Card>
              <CardHeader>
                <CardTitle>4️⃣ Các Khoản Trừ: {formatCurrency(payroll.total_deductions || 0)}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label>BHXH</Label>
                  <Input 
                    type="number" 
                    value={payroll.deduction_social_insurance || 0}
                    onChange={(e) => handleInputChange('deduction_social_insurance', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Thuế TNCN</Label>
                  <Input 
                    type="number" 
                    value={payroll.deduction_income_tax || 0}
                    onChange={(e) => handleInputChange('deduction_income_tax', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Tạm Ứng Lương</Label>
                  <Input 
                    type="number" 
                    value={payroll.salary_advance || 0}
                    onChange={(e) => handleInputChange('salary_advance', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Khấu Trừ Khác</Label>
                  <Input 
                    type="number" 
                    value={payroll.deduction_other || 0}
                    onChange={(e) => handleInputChange('deduction_other', Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 5️⃣ TỔNG HỢP THU NHẬP */}
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>5️⃣ Tổng Hợp Thu Nhập</CardTitle>
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

            {/* 6️⃣ CHI TIẾT THANH TOÁN */}
            <Card>
              <CardHeader>
                <CardTitle>6️⃣ Chi Tiết Thanh Toán</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Đã Chi Tạm Ứng</Label>
                  <Input 
                    type="number" 
                    value={payroll.paid_advance || 0}
                    onChange={(e) => handleInputChange('paid_advance', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Đã Chi Ngày 3</Label>
                  <Input 
                    type="number" 
                    value={payroll.paid_day_3 || 0}
                    onChange={(e) => handleInputChange('paid_day_3', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Chi Dự Ngày 15</Label>
                  <Input 
                    type="number" 
                    value={payroll.paid_day_15 || 0}
                    onChange={(e) => handleInputChange('paid_day_15', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Tổng Công Ty Đã Chi</Label>
                  <p className="font-semibold pt-2">{formatCurrency(payroll.total_company_paid || 0)}</p>
                </div>
                <div>
                  <Label>Chi Dư</Label>
                  <p className={`font-semibold pt-2 ${payroll.payment_surplus > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(payroll.payment_surplus || 0)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 7️⃣ GHI CHÚ */}
            <Card>
              <CardHeader>
                <CardTitle>7️⃣ Ghi Chú</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={payroll.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  placeholder="Nhập ghi chú..."
                />
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              'Lưu Thay Đổi'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
