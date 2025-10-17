import { DollarSign, Download, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PayrollRecord } from '../types';

const dummyPayroll: PayrollRecord[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Nguyễn Văn An',
    month: '2024-01',
    p1: 15000000,
    p2: 1.5,
    p3: 3000000,
    totalSalary: 25500000,
    deductions: 3000000,
    netSalary: 22500000,
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Trần Thị Bình',
    month: '2024-01',
    p1: 12000000,
    p2: 1.3,
    p3: 2000000,
    totalSalary: 17600000,
    deductions: 2200000,
    netSalary: 15400000,
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Lê Minh Châu',
    month: '2024-01',
    p1: 8000000,
    p2: 1.0,
    p3: 1000000,
    totalSalary: 9000000,
    deductions: 1000000,
    netSalary: 8000000,
  },
];

export function PayrollPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const totalPayroll = dummyPayroll.reduce((sum, record) => sum + record.netSalary, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold theme-text">Tính Lương (3P)</h1>
          <p className="theme-text-secondary mt-1">
            P1: Vị trí | P2: Năng lực | P3: Hiệu suất
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calculator className="h-4 w-4" />
            Tính Lương
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Xuất Bảng Lương
          </Button>
        </div>
      </div>

      {/* Formula Card */}
      <Card className="theme-card border-primary">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <DollarSign className="h-12 w-12 theme-text-primary" />
            <div>
              <h3 className="font-semibold text-lg theme-text mb-2">Công Thức Tính Lương 3P</h3>
              <div className="space-y-1 text-sm theme-text-secondary">
                <p><strong>Tổng Lương</strong> = (P1 × P2) + P3</p>
                <p><strong>Thực Lãnh</strong> = Tổng Lương - Khấu Trừ (BHXH, BHYT, Thuế)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="theme-card">
          <CardContent className="p-4">
            <p className="text-sm theme-text-secondary">Tổng Chi Phí Lương</p>
            <p className="text-2xl font-bold theme-text">{formatCurrency(totalPayroll)}</p>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <p className="text-sm theme-text-secondary">Số Nhân Viên</p>
            <p className="text-2xl font-bold theme-text">{dummyPayroll.length}</p>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <p className="text-sm theme-text-secondary">Lương TB/Người</p>
            <p className="text-2xl font-bold theme-text">
              {formatCurrency(totalPayroll / dummyPayroll.length)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="theme-text">Bảng Lương Tháng 01/2024</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhân Viên</TableHead>
                <TableHead className="text-right">P1 (VND)</TableHead>
                <TableHead className="text-center">P2 Coeff</TableHead>
                <TableHead className="text-right">P3 (VND)</TableHead>
                <TableHead className="text-right">Tổng (VND)</TableHead>
                <TableHead className="text-right">Khấu Trừ</TableHead>
                <TableHead className="text-right">Thực Lãnh</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyPayroll.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="theme-text font-medium">{record.employeeName}</TableCell>
                  <TableCell className="text-right theme-text">
                    {formatCurrency(record.p1)}
                  </TableCell>
                  <TableCell className="text-center theme-text">{record.p2}</TableCell>
                  <TableCell className="text-right theme-text">
                    {formatCurrency(record.p3)}
                  </TableCell>
                  <TableCell className="text-right theme-text font-semibold">
                    {formatCurrency(record.totalSalary)}
                  </TableCell>
                  <TableCell className="text-right theme-text text-red-600">
                    {formatCurrency(record.deductions)}
                  </TableCell>
                  <TableCell className="text-right theme-text font-bold text-green-600">
                    {formatCurrency(record.netSalary)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="theme-card">
          <CardHeader>
            <CardTitle className="text-base theme-text">P1 - Vị Trí</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm theme-text-secondary">
              Lương cơ bản theo chức vụ và trách nhiệm
            </p>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardHeader>
            <CardTitle className="text-base theme-text">P2 - Năng Lực</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm theme-text-secondary">
              Hệ số năng lực và thâm niên (1.0 - 2.0)
            </p>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardHeader>
            <CardTitle className="text-base theme-text">P3 - Hiệu Suất</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm theme-text-secondary">
              Thưởng KPI/OKR và hiệu suất công việc
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
