import { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Employee } from '../types';
import { EmployeeService } from '../services/employeeService';
import { CreateEmployeeModal } from '../components/CreateEmployeeModal';
import { EditEmployeeModal } from '../components/EditEmployeeModal';

export function HRISPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();
  const { hasPermission } = usePermissions();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await EmployeeService.getEmployees();
      setEmployees(data);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tải danh sách nhân viên',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDeleteClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEmployee) return;

    try {
      await EmployeeService.deleteEmployee(selectedEmployee.id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa nhân viên',
      });
      await fetchEmployees();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể xóa nhân viên',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedEmployee(null);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchEmployees} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <PermissionGuard requiredPermission="create_employees" showError={false}>
            <CreateEmployeeModal onSuccess={fetchEmployees} />
          </PermissionGuard>
        </div>
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
            <p className="text-2xl font-bold theme-text">{employees.length}</p>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <p className="text-sm theme-text-secondary">Đang Làm</p>
            <p className="text-2xl font-bold theme-text">
              {employees.filter(e => e.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <p className="text-sm theme-text-secondary">Thử Việc</p>
            <p className="text-2xl font-bold theme-text">
              {employees.filter(e => e.status === 'probation').length}
            </p>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <p className="text-sm theme-text-secondary">Nghỉ Việc</p>
            <p className="text-2xl font-bold theme-text">
              {employees.filter(e => e.status === 'inactive').length}
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 theme-text-secondary">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 theme-text-secondary">
                    Không tìm thấy nhân viên
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
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
                        <Button variant="ghost" size="icon" title="Xem chi tiết">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <PermissionGuard requiredPermission="edit_employees" showError={false}>
                          <EditEmployeeModal employee={employee} onSuccess={fetchEmployees} />
                        </PermissionGuard>
                        <PermissionGuard requiredPermission="delete_employees" showError={false}>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteClick(employee)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </PermissionGuard>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa nhân viên</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa nhân viên <strong>{selectedEmployee?.fullName}</strong>?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
