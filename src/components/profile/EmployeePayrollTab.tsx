import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Receipt, 
  Calendar, 
  DollarSign, 
  ArrowLeft,
  FileText,
  TrendingUp,
  Banknote
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface PayrollRecord {
  id: string;
  employee_id: string;
  month: string;
  company_name: string;
  employee_code: string;
  employee_name: string;
  total_salary: number;
  salary_fulltime_ct: number;
  standard_days: number;
  actual_days: number;
  actual_salary: number;
  ot_days: number;
  ot_amount: number;
  total_bonus: number;
  invoice_bonus: number;
  total_income: number;
  total_deductions: number;
  net_payment: number;
  notes: string | null;
  status: 'draft' | 'issued' | 'locked';
  created_at: string;
  issued_at: string | null;
}

interface InvoiceCommission {
  id: string;
  invoice_level: string;
  quantity: number;
  return_value: string | null;
  return_quantity: number;
}

export default function EmployeePayrollTab({ employeeId }: { employeeId: string }) {
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const [commissions, setCommissions] = useState<InvoiceCommission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPayrolls();
  }, [employeeId]);

  const fetchPayrolls = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("employee_payrolls")
        .select("*")
        .eq("employee_id", employeeId)
        .in("status", ["issued", "locked"])
        .order("month", { ascending: false });

      if (error) throw error;
      setPayrolls((data || []) as PayrollRecord[]);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách phiếu lương",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommissions = async (payrollId: string) => {
    try {
      const { data, error } = await supabase
        .from("payroll_invoice_commissions")
        .select("*")
        .eq("payroll_id", payrollId);

      if (error) throw error;
      setCommissions(data || []);
    } catch (error: any) {
      console.error("Error fetching commissions:", error);
    }
  };

  const handleViewPayroll = async (payroll: PayrollRecord) => {
    setSelectedPayroll(payroll);
    await fetchCommissions(payroll.id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatMonth = (dateString: string) => {
    const date = new Date(dateString);
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { label: "Nháp", variant: "secondary" as const },
      issued: { label: "Đã Phát Hành", variant: "default" as const },
      locked: { label: "Đã Khóa", variant: "outline" as const },
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.draft;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  // Empty State
  if (payrolls.length === 0 && !selectedPayroll) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 theme-bg-primary/10 rounded-full">
            <Receipt className="w-12 h-12 theme-text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Chưa Có Phiếu Lương</h3>
            <p className="text-muted-foreground max-w-md">
              Phiếu lương sẽ được phát hành vào đầu mỗi tháng. Vui lòng kiểm tra lại sau.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Detail View
  if (selectedPayroll) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => {
            setSelectedPayroll(null);
            setCommissions([]);
          }}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay Lại Danh Sách
        </Button>

        {/* Header */}
        <Card className="p-6 theme-bg-gradient">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Phiếu Lương Tháng {formatMonth(selectedPayroll.month)}
              </h2>
              {getStatusBadge(selectedPayroll.status)}
            </div>
            <DollarSign className="w-8 h-8 theme-text-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Công ty</p>
              <p className="font-medium">{selectedPayroll.company_name || 'Mắt Kính Tâm Đức'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Mã nhân viên</p>
              <p className="font-medium">{selectedPayroll.employee_code}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Họ và tên</p>
              <p className="font-medium">{selectedPayroll.employee_name}</p>
            </div>
          </div>
        </Card>

        {/* Section 1: Các Khoản Lương */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Banknote className="w-5 h-5 theme-text-primary" />
            <h3 className="text-lg font-semibold">1️⃣ Các Khoản Lương</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-semibold">Tổng các khoản lương:</span>
              <span className="font-bold theme-text-primary text-lg">
                {formatCurrency(selectedPayroll.total_salary)}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lương Fulltime CT:</span>
                <span className="font-medium">{formatCurrency(selectedPayroll.salary_fulltime_ct)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Công chuẩn:</span>
                <span className="font-medium">{selectedPayroll.standard_days} ngày</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Công thực tế:</span>
                <span className="font-medium">{selectedPayroll.actual_days} ngày</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lương công thực tế:</span>
                <span className="font-medium">{formatCurrency(selectedPayroll.actual_salary)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CT - OT ngày:</span>
                <span className="font-medium">{selectedPayroll.ot_days} ngày</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tiền OT:</span>
                <span className="font-medium">{formatCurrency(selectedPayroll.ot_amount)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Section 2: Các Khoản Thưởng */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 theme-text-primary" />
            <h3 className="text-lg font-semibold">2️⃣ Các Khoản Thưởng</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-semibold">Tổng thưởng:</span>
              <span className="font-bold theme-text-primary text-lg">
                {formatCurrency(selectedPayroll.total_bonus)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Thưởng hóa đơn:</span>
              <span className="font-medium">{formatCurrency(selectedPayroll.invoice_bonus)}</span>
            </div>
          </div>
        </Card>

        {/* Section 3: Tổng Hợp Thu Nhập */}
        <Card className="p-6 theme-bg-gradient">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 theme-text-primary" />
            <h3 className="text-lg font-semibold">📊 Tổng Hợp Thu Nhập</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="font-medium">A. Tổng thu nhập (1) + (2):</span>
              <span className="font-bold text-lg">{formatCurrency(selectedPayroll.total_income)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium">B. Các khoản trừ:</span>
              <span className="font-bold text-lg text-destructive">
                {formatCurrency(selectedPayroll.total_deductions)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-t-2 border-primary/20">
              <span className="font-bold text-lg">C. Thực nhận (A - B):</span>
              <span className="font-bold text-2xl theme-text-primary">
                {formatCurrency(selectedPayroll.net_payment)} ✅
              </span>
            </div>
          </div>
        </Card>

        {/* Section 4: Chi Tiết Hoa Hồng Hóa Đơn */}
        {commissions.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="w-5 h-5 theme-text-primary" />
              <h3 className="text-lg font-semibold">📋 Chi Tiết Hoa Hồng Hóa Đơn</h3>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mức hóa đơn</TableHead>
                    <TableHead className="text-right">SL</TableHead>
                    <TableHead>Đơn hoàn</TableHead>
                    <TableHead className="text-right">SL Hoàn</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell className="font-medium">{commission.invoice_level}</TableCell>
                      <TableCell className="text-right">{commission.quantity}</TableCell>
                      <TableCell>{commission.return_value || "-"}</TableCell>
                      <TableCell className="text-right">{commission.return_quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {/* Section 5: Ghi Chú */}
        {selectedPayroll.notes && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 theme-text-primary" />
              <h3 className="text-lg font-semibold">📝 Ghi Chú</h3>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {selectedPayroll.notes}
            </p>
          </Card>
        )}
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Phiếu Lương Của Tôi</h2>
          <p className="text-muted-foreground">Xem lịch sử phiếu lương theo tháng</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {payrolls.map((payroll) => (
          <Card
            key={payroll.id}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleViewPayroll(payroll)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 theme-text-primary" />
                  <span className="font-semibold text-lg">Tháng {formatMonth(payroll.month)}</span>
                </div>
                {getStatusBadge(payroll.status)}
              </div>
              <Receipt className="w-6 h-6 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tổng thu nhập:</span>
                <span className="text-sm font-medium">
                  {formatCurrency(payroll.total_income)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Các khoản trừ:</span>
                <span className="text-sm font-medium text-destructive">
                  {formatCurrency(payroll.total_deductions)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-semibold">Thực nhận:</span>
                <span className="font-bold theme-text-primary text-lg">
                  {formatCurrency(payroll.net_payment)}
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4" size="sm">
              Xem Chi Tiết
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
