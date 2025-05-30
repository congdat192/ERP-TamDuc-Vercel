
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Mail, 
  Phone, 
  Users, 
  Calendar, 
  CreditCard,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { TenantInfo } from '../utils/mockData';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface TenantDetailModalProps {
  tenant: TenantInfo;
  isOpen: boolean;
  onClose: () => void;
}

export function TenantDetailModal({ tenant, isOpen, onClose }: TenantDetailModalProps) {
  const getStatusColor = (status: TenantInfo['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'trial': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: TenantInfo['status']) => {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'inactive': return 'Không hoạt động';
      case 'suspended': return 'Tạm ngưng';
      case 'trial': return 'Dùng thử';
      default: return 'Không xác định';
    }
  };

  const getPlanText = (plan: TenantInfo['plan']) => {
    switch (plan) {
      case 'basic': return 'Cơ Bản';
      case 'professional': return 'Chuyên Nghiệp';
      case 'enterprise': return 'Doanh Nghiệp';
      default: return 'Không xác định';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>{tenant.companyName}</span>
          </DialogTitle>
          <DialogDescription>
            Chi tiết thông tin khách hàng và dịch vụ đang sử dụng
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông Tin Công Ty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">{tenant.companyName}</p>
                  <p className="text-sm text-gray-500">Tên công ty</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">{tenant.contactEmail}</p>
                  <p className="text-sm text-gray-500">Email liên hệ</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">{tenant.contactPhone}</p>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">{tenant.userCount} người dùng</p>
                  <p className="text-sm text-gray-500">Số lượng tài khoản</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trạng thái:</span>
                <Badge className={getStatusColor(tenant.status)}>
                  {getStatusText(tenant.status)}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Gói dịch vụ:</span>
                <Badge variant="outline">{getPlanText(tenant.plan)}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Subscription & Billing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Thông Tin Thanh Toán</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ngày bắt đầu:</span>
                <span className="font-medium">
                  {tenant.subscription.startDate.toLocaleDateString('vi-VN')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ngày hết hạn:</span>
                <span className="font-medium">
                  {tenant.subscription.endDate.toLocaleDateString('vi-VN')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Giá trị hợp đồng:</span>
                <span className="font-medium text-green-600">
                  {tenant.subscription.amount.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trạng thái thanh toán:</span>
                <Badge className={tenant.subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {tenant.subscription.status === 'active' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </Badge>
              </div>

              <Separator />

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Gia hạn tự động: {tenant.subscription.endDate > new Date() ? 'Bật' : 'Tắt'}
                  </span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Hết hạn trong {formatDistanceToNow(tenant.subscription.endDate, { locale: vi })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Activity & Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Hoạt Động Gần Đây</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Lần đăng nhập cuối:</span>
                <span className="font-medium">
                  {formatDistanceToNow(tenant.lastLoginAt, { addSuffix: true, locale: vi })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ngày tạo tài khoản:</span>
                <span className="font-medium">
                  {tenant.createdAt.toLocaleDateString('vi-VN')}
                </span>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">Thống kê sử dụng (30 ngày qua):</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Số lần đăng nhập:</p>
                    <p className="font-medium">247 lần</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Dữ liệu lưu trữ:</p>
                    <p className="font-medium">2.3 GB</p>
                  </div>
                  <div>
                    <p className="text-gray-600">API calls:</p>
                    <p className="font-medium">15,240</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Số invoice:</p>
                    <p className="font-medium">89 hóa đơn</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thao Tác Nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Quản Lý Người Dùng
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="w-4 h-4 mr-2" />
                Xem Lịch Sử Thanh Toán
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Gửi Email Thông Báo
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="w-4 h-4 mr-2" />
                Xem Báo Cáo Chi Tiết
              </Button>
              
              <Separator />
              
              <div className="space-y-2">
                <Button variant="destructive" size="sm" className="w-full">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Tạm Ngưng Tài Khoản
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Hành động này sẽ ngưng hoạt động của tất cả người dùng
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
