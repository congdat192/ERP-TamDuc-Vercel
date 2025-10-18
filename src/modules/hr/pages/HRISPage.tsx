import { useState, useEffect, useMemo } from 'react';
import { Search, Download, Eye, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
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
import { ExportService } from '../services/exportService';
import { CreateEmployeeModal } from '../components/CreateEmployeeModal';
import { EditEmployeeModal } from '../components/EditEmployeeModal';
import { EmployeeFilters, EmployeeFiltersData } from '../components/EmployeeFilters';
import { EmployeePagination } from '../components/EmployeePagination';
import { EmployeeDetailModal } from '../components/EmployeeDetailModal';
import { BulkOperations } from '../components/BulkOperations';
import { ImportEmployeeModal } from '../components/ImportEmployeeModal';

export function HRISPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<EmployeeFiltersData>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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

  const handleViewDetail = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDetailModalOpen(true);
  };

  const handleExport = () => {
    ExportService.exportToExcel(filteredEmployees, `nhan-vien-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast({
      title: 'Thành công',
      description: 'Đã xuất file Excel thành công',
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedEmployees.map(emp => emp.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(eid => eid !== id));
    }
  };

  // Apply filters and search
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // Search filter
      const matchesSearch = 
        emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Department filter
      if (filters.department && emp.department !== filters.department) return false;

      // Status filter
      if (filters.status && emp.status !== filters.status) return false;

      // Contract type filter
      if (filters.contractType && emp.employmentType !== filters.contractType) return false;

      // Join date range filter
      if (filters.joinDateFrom) {
        const joinDate = new Date(emp.joinDate);
        const fromDate = new Date(filters.joinDateFrom);
        if (joinDate < fromDate) return false;
      }
      if (filters.joinDateTo) {
        const joinDate = new Date(emp.joinDate);
        const toDate = new Date(filters.joinDateTo);
        if (joinDate > toDate) return false;
      }

      return true;
    });
  }, [employees, searchTerm, filters]);

  // Get unique departments for filter
  const departments = useMemo(() => {
    return Array.from(new Set(employees.map(emp => emp.department))).sort();
  }, [employees]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, pageSize]);

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

  const isAllSelected = paginatedEmployees.length > 0 && 
    paginatedEmployees.every(emp => selectedIds.includes(emp.id));

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
            <EmployeeFilters 
              filters={filters} 
              onFiltersChange={setFilters}
              departments={departments}
            />
            <div className="flex gap-2">
              <PermissionGuard requiredPermission="create_employees" showError={false}>
                <ImportEmployeeModal onSuccess={fetchEmployees} />
              </PermissionGuard>
              <Button variant="outline" className="gap-2" onClick={handleExport}>
                <Download className="h-4 w-4" />
                Xuất Excel
              </Button>
            </div>
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

      {/* Bulk Operations */}
      <PermissionGuard requiredPermission="delete_employees" showError={false}>
        <BulkOperations 
          selectedIds={selectedIds}
          onSuccess={fetchEmployees}
          onClearSelection={() => setSelectedIds([])}
        />
      </PermissionGuard>

      {/* Employee Table */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="theme-text">
            Danh Sách Nhân Viên ({filteredEmployees.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Nhân Viên</TableHead>
                <TableHead>Mã NV</TableHead>
                <TableHead>Phòng Ban</TableHead>
                <TableHead>Chức Vụ</TableHead>
                <TableHead>Loại HĐ</TableHead>
                <TableHead>Lương</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 theme-text-secondary">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 theme-text-secondary">
                    Không tìm thấy nhân viên
                  </TableCell>
                </TableRow>
              ) : (
                paginatedEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(employee.id)}
                        onCheckedChange={(checked) => handleSelectOne(employee.id, checked as boolean)}
                      />
                    </TableCell>
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
                    <TableCell className="theme-text">{employee.department}</TableCell>
                    <TableCell className="theme-text">{employee.position}</TableCell>
                    <TableCell className="theme-text">{employee.employmentType}</TableCell>
                    <TableCell className="font-semibold">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(employee.salary.totalFixed)}
                    </TableCell>
                    <TableCell>{getStatusBadge(employee.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Xem chi tiết"
                          onClick={() => handleViewDetail(employee)}
                        >
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

          {/* Pagination */}
          {filteredEmployees.length > 0 && (
            <EmployeePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredEmployees.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          )}
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

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        employee={selectedEmployee}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
    </div>
  );
}
