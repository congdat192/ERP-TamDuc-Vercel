import { useState } from 'react';
import { Search, Plus, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Employee } from '../types';

const dummyEmployees: Employee[] = [
  {
    id: '1',
    employeeCode: 'NV001',
    fullName: 'Nguyễn Văn An',
    email: 'an.nguyen@tamduc.vn',
    phone: '0901234567',
    avatar: '/placeholder.svg',
    position: 'Sales Manager',
    department: 'Sales',
    joinDate: '2023-01-15',
    contractType: 'Chính Thức',
    status: 'active',
    salary: { p1: 15000000, p2: 1.5, p3: 3000000, total: 25500000 },
    performance: { kpi: 85, lastReview: '2024-01-01' }
  },
  {
    id: '2',
    employeeCode: 'NV002',
    fullName: 'Trần Thị Bình',
    email: 'binh.tran@tamduc.vn',
    phone: '0902345678',
    avatar: '/placeholder.svg',
    position: 'HR Specialist',
    department: 'HR',
    joinDate: '2023-03-20',
    contractType: 'Chính Thức',
    status: 'active',
    salary: { p1: 12000000, p2: 1.3, p3: 2000000, total: 17600000 },
    performance: { kpi: 90, lastReview: '2024-01-01' }
  },
  {
    id: '3',
    employeeCode: 'NV003',
    fullName: 'Lê Minh Châu',
    email: 'chau.le@tamduc.vn',
    phone: '0903456789',
    avatar: '/placeholder.svg',
    position: 'Sales Staff',
    department: 'Sales',
    joinDate: '2023-06-10',
    contractType: 'Thử Việc',
    status: 'probation',
    salary: { p1: 8000000, p2: 1.0, p3: 1000000, total: 9000000 },
    performance: { kpi: 75, lastReview: '2024-01-01' }
  },
];

export function HRISPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status: Employee['status']) => {
    const statusMap = {
      active: { label: 'Đang làm', variant: 'default' as const },
      probation: { label: 'Thử việc', variant: 'secondary' as const },
      inactive: { label: 'Nghỉ việc', variant: 'outline' as const },
      terminated: { label: 'Đã sa thải', variant: 'destructive' as const },
    };
    const config = statusMap[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold theme-text">Hồ Sơ Nhân Sự</h1>
          <p className="theme-text-secondary mt-1">Quản lý thông tin nhân viên và hợp đồng</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm Nhân Viên
        </Button>
      </div>

      {/* Search & Filters */}
      <Card className="theme-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 theme-text-secondary" />
              <Input
                placeholder="Tìm kiếm theo tên, mã nhân viên, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Bộ Lọc
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Xuất Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="theme-card">
          <CardContent className="p-4">
            <p className="text-sm theme-text-secondary">Tổng Nhân Viên</p>
            <p className="text-2xl font-bold theme-text">{dummyEmployees.length}</p>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <p className="text-sm theme-text-secondary">Đang Làm</p>
            <p className="text-2xl font-bold theme-text">
              {dummyEmployees.filter(e => e.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <p className="text-sm theme-text-secondary">Thử Việc</p>
            <p className="text-2xl font-bold theme-text">
              {dummyEmployees.filter(e => e.status === 'probation').length}
            </p>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <p className="text-sm theme-text-secondary">Nghỉ Việc</p>
            <p className="text-2xl font-bold theme-text">
              {dummyEmployees.filter(e => e.status === 'inactive').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Table */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="theme-text">Danh Sách Nhân Viên</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhân Viên</TableHead>
                <TableHead>Mã NV</TableHead>
                <TableHead>Chức Vụ</TableHead>
                <TableHead>Phòng Ban</TableHead>
                <TableHead>Loại HĐ</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback>{employee.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium theme-text">{employee.fullName}</p>
                        <p className="text-sm theme-text-secondary">{employee.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="theme-text">{employee.employeeCode}</TableCell>
                  <TableCell className="theme-text">{employee.position}</TableCell>
                  <TableCell className="theme-text">{employee.department}</TableCell>
                  <TableCell className="theme-text">{employee.contractType}</TableCell>
                  <TableCell>{getStatusBadge(employee.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
