import { Gift, Award, AlertTriangle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Benefit } from '../types';

const dummyBenefits: Benefit[] = [
  {
    id: '1',
    benefitName: 'Bảo Hiểm Sức Khỏe',
    type: 'insurance',
    eligibility: 'Toàn bộ nhân viên chính thức',
    value: 5000000,
    status: 'active',
  },
  {
    id: '2',
    benefitName: 'Phụ Cấp Ăn Trưa',
    type: 'allowance',
    eligibility: 'Toàn bộ nhân viên',
    value: 1000000,
    status: 'active',
  },
  {
    id: '3',
    benefitName: 'Thưởng Hiệu Suất',
    type: 'bonus',
    eligibility: 'Nhân viên đạt KPI >= 80',
    value: 3000000,
    status: 'active',
  },
];

export function BenefitsPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getTypeBadge = (type: Benefit['type']) => {
    const typeMap = {
      insurance: { label: 'Bảo hiểm', color: 'bg-blue-500' },
      allowance: { label: 'Phụ cấp', color: 'bg-green-500' },
      bonus: { label: 'Thưởng', color: 'bg-purple-500' },
      other: { label: 'Khác', color: 'bg-gray-500' },
    };
    const config = typeMap[type];
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold theme-text">Phúc Lợi & Kỷ Luật</h1>
          <p className="theme-text-secondary mt-1">Quản lý phúc lợi, khen thưởng và kỷ luật</p>
        </div>
        <Button className="gap-2">
          <Gift className="h-4 w-4" />
          Thêm Phúc Lợi Mới
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Gift className="h-8 w-8 theme-text-primary" />
              <div>
                <p className="text-sm theme-text-secondary">Gói Phúc Lợi</p>
                <p className="text-2xl font-bold theme-text">{dummyBenefits.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm theme-text-secondary">Khen Thưởng Tháng Này</p>
                <p className="text-2xl font-bold theme-text">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm theme-text-secondary">Kỷ Luật Tháng Này</p>
                <p className="text-2xl font-bold theme-text">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm theme-text-secondary">Biểu Mẫu</p>
                <p className="text-2xl font-bold theme-text">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="benefits" className="space-y-4">
        <TabsList>
          <TabsTrigger value="benefits">Phúc Lợi</TabsTrigger>
          <TabsTrigger value="rewards">Khen Thưởng</TabsTrigger>
          <TabsTrigger value="discipline">Kỷ Luật</TabsTrigger>
          <TabsTrigger value="forms">Biểu Mẫu</TabsTrigger>
        </TabsList>

        <TabsContent value="benefits">
          <Card className="theme-card">
            <CardHeader>
              <CardTitle className="theme-text">Danh Sách Phúc Lợi</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phúc Lợi</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Đối Tượng</TableHead>
                    <TableHead className="text-right">Giá Trị</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyBenefits.map((benefit) => (
                    <TableRow key={benefit.id}>
                      <TableCell className="theme-text font-medium">{benefit.benefitName}</TableCell>
                      <TableCell>{getTypeBadge(benefit.type)}</TableCell>
                      <TableCell className="theme-text-secondary">{benefit.eligibility}</TableCell>
                      <TableCell className="text-right theme-text font-semibold">
                        {formatCurrency(benefit.value)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={benefit.status === 'active' ? 'default' : 'outline'}>
                          {benefit.status === 'active' ? 'Đang áp dụng' : 'Ngưng'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards">
          <Card className="theme-card">
            <CardHeader>
              <CardTitle className="theme-text">Quyết Định Khen Thưởng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 theme-text-secondary">
                <div className="text-center">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa có quyết định khen thưởng nào</p>
                  <Button className="mt-4" size="sm">
                    <Award className="h-4 w-4 mr-2" />
                    Tạo Quyết Định Mới
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discipline">
          <Card className="theme-card">
            <CardHeader>
              <CardTitle className="theme-text">Quyết Định Kỷ Luật</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 theme-text-secondary">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa có quyết định kỷ luật nào</p>
                  <Button className="mt-4" size="sm" variant="outline">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Tạo Quyết Định Mới
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms">
          <Card className="theme-card">
            <CardHeader>
              <CardTitle className="theme-text">Biểu Mẫu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="theme-card cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 theme-text-primary" />
                    <h4 className="font-semibold theme-text mb-2">Đơn Xin Nghỉ Phép</h4>
                    <p className="text-sm theme-text-secondary">Biểu mẫu xin nghỉ phép</p>
                  </CardContent>
                </Card>
                <Card className="theme-card cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 theme-text-primary" />
                    <h4 className="font-semibold theme-text mb-2">Đề Xuất Khen Thưởng</h4>
                    <p className="text-sm theme-text-secondary">Biểu mẫu đề xuất khen thưởng</p>
                  </CardContent>
                </Card>
                <Card className="theme-card cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 theme-text-primary" />
                    <h4 className="font-semibold theme-text mb-2">Biên Bản Vi Phạm</h4>
                    <p className="text-sm theme-text-secondary">Biểu mẫu biên bản vi phạm</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
