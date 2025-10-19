import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Employee } from '../types';
import { AvatarService } from '../services/avatarService';
import { EmployeeDocumentsTab } from './detail-tabs/EmployeeDocumentsTab';
import { EmployeeAdminDocumentsTab } from './detail-tabs/EmployeeAdminDocumentsTab';
import { EmployeeBenefitsTab } from './detail-tabs/EmployeeBenefitsTab';
import { EmployeeRewardsTab } from './detail-tabs/EmployeeRewardsTab';
import { EmployeeDisciplineTab } from './detail-tabs/EmployeeDisciplineTab';
import { MonthlyAttendanceTab } from './MonthlyAttendanceTab';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmployeeDetailModal({ employee, open, onOpenChange }: EmployeeDetailModalProps) {
  if (!employee) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi Tiết Nhân Viên</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={AvatarService.getAvatarUrl(employee.avatar)} />
              <AvatarFallback className="text-2xl">{employee.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-bold theme-text">{employee.fullName}</h3>
              <p className="theme-text-secondary">{employee.position}</p>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(employee.status)}
                <Badge variant="outline">{employee.employmentType}</Badge>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full h-auto flex flex-wrap gap-1 p-2">
              <TabsTrigger value="info">Thông Tin</TabsTrigger>
              <TabsTrigger value="salary">Lương</TabsTrigger>
              <TabsTrigger value="performance">Hiệu Suất</TabsTrigger>
              <TabsTrigger value="attendance">Chấm Công</TabsTrigger>
              <TabsTrigger value="documents">Chứng Từ</TabsTrigger>
              <TabsTrigger value="admin-docs">VB Hành Chính</TabsTrigger>
              <TabsTrigger value="benefits">Phúc Lợi</TabsTrigger>
              <TabsTrigger value="rewards">Khen Thưởng</TabsTrigger>
              <TabsTrigger value="discipline">Kỷ Luật</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 mt-4">
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm theme-text-secondary">Mã Nhân Viên</p>
                      <p className="font-medium theme-text">{employee.employeeCode}</p>
                    </div>
                    <div>
                      <p className="text-sm theme-text-secondary">Email</p>
                      <p className="font-medium theme-text">{employee.email}</p>
                    </div>
                    <div>
                      <p className="text-sm theme-text-secondary">Số Điện Thoại</p>
                      <p className="font-medium theme-text">{employee.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm theme-text-secondary">Phòng Ban</p>
                      <p className="font-medium theme-text">{employee.department}</p>
                    </div>
                    <div>
                      <p className="text-sm theme-text-secondary">Chức Vụ</p>
                      <p className="font-medium theme-text">{employee.position}</p>
                    </div>
                    <div>
                      <p className="text-sm theme-text-secondary">Ngày Vào Làm</p>
                      <p className="font-medium theme-text">
                        {new Date(employee.joinDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm theme-text-secondary">Loại Hợp Đồng</p>
                      <p className="font-medium theme-text">{employee.employmentType}</p>
                    </div>
                    <div>
                      <p className="text-sm theme-text-secondary">Trạng Thái</p>
                      <div className="mt-1">{getStatusBadge(employee.status)}</div>
                    </div>
            </div>
          </CardContent>
        </Card>

        {/* Address & Emergency Contact Card */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h4 className="font-semibold text-lg theme-text border-b pb-2">
              Địa Chỉ & Liên Hệ Khẩn Cấp
            </h4>
            
            {/* Current Address */}
            <div>
              <p className="text-sm theme-text-secondary">Nơi Ở Hiện Tại</p>
              <p className="font-medium theme-text mt-1">
                {employee.currentAddress || 'Chưa cập nhật'}
              </p>
            </div>

            {/* Emergency Contact */}
            {employee.emergencyContact && (
              <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                <div>
                  <p className="text-sm theme-text-secondary">Mối Quan Hệ</p>
                  <Badge variant="outline" className="mt-1">
                    {employee.emergencyContact.relationship}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm theme-text-secondary">Tên Người Liên Hệ</p>
                  <p className="font-medium theme-text mt-1">
                    {employee.emergencyContact.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm theme-text-secondary">Số Điện Thoại</p>
                  <p className="font-medium theme-text mt-1">
                    {employee.emergencyContact.phone}
                  </p>
                </div>
              </div>
            )}
            
            {!employee.emergencyContact && (
              <p className="text-sm theme-text-secondary italic">
                Chưa cập nhật thông tin liên hệ khẩn cấp
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

            <TabsContent value="salary" className="space-y-4 mt-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm theme-text-secondary">Lương Cơ Bản</p>
                      <p className="text-xl font-bold theme-text">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(employee.salary.basic)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm theme-text-secondary">Phụ Cấp Ăn Trưa</p>
                      <p className="text-xl font-bold theme-text">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(employee.salary.allowanceMeal)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm theme-text-secondary">Phụ Cấp Xăng Xe</p>
                      <p className="text-xl font-bold theme-text">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(employee.salary.allowanceFuel)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm theme-text-secondary">Phụ Cấp Điện Thoại</p>
                      <p className="text-xl font-bold theme-text">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(employee.salary.allowancePhone)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm theme-text-secondary">Phụ Cấp Khác</p>
                      <p className="text-xl font-bold theme-text">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(employee.salary.allowanceOther)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm theme-text-secondary">Tổng Lương Cứng</p>
                      <p className="text-2xl font-bold text-primary">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(employee.salary.totalFixed)}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm theme-text-secondary mb-2">Công Thức Tính Lương</p>
                    <p className="font-mono text-sm theme-text">
                      Tổng Lương Cứng = Lương Cơ Bản + Tất Cả Phụ Cấp
                    </p>
                    <p className="font-mono text-sm font-bold theme-text mt-1">
                      = {employee.salary.totalFixed.toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4 mt-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm theme-text-secondary">Điểm KPI</p>
                      <p className="text-3xl font-bold theme-text">{employee.performance.kpi}</p>
                    </div>
                    <div>
                      <p className="text-sm theme-text-secondary">Ngày Đánh Giá Gần Nhất</p>
                      <p className="text-xl font-medium theme-text">
                        {employee.performance.lastReview
                          ? new Date(employee.performance.lastReview).toLocaleDateString('vi-VN')
                          : 'Chưa đánh giá'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm theme-text-secondary mb-2">Xếp Loại</p>
                    <Badge
                      variant={
                        employee.performance.kpi >= 90 ? 'default' :
                        employee.performance.kpi >= 70 ? 'secondary' :
                        employee.performance.kpi >= 50 ? 'outline' : 'destructive'
                      }
                      className="text-base px-4 py-1"
                    >
                      {employee.performance.kpi >= 90 ? 'Xuất Sắc' :
                       employee.performance.kpi >= 70 ? 'Tốt' :
                       employee.performance.kpi >= 50 ? 'Trung Bình' : 'Cần Cải Thiện'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance">
              <MonthlyAttendanceTab employeeId={employee.id} />
            </TabsContent>

            <TabsContent value="documents">
              <EmployeeDocumentsTab employeeId={employee.id} />
            </TabsContent>

            <TabsContent value="admin-docs">
              <EmployeeAdminDocumentsTab employeeId={employee.id} />
            </TabsContent>

            <TabsContent value="benefits">
              <EmployeeBenefitsTab employeeId={employee.id} />
            </TabsContent>

            <TabsContent value="rewards">
              <EmployeeRewardsTab employeeId={employee.id} />
            </TabsContent>

            <TabsContent value="discipline">
              <EmployeeDisciplineTab employeeId={employee.id} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
