
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Building2, 
  Users, 
  MoreHorizontal,
  Filter,
  Download
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockTenantList, TenantInfo } from '../utils/mockData';
import { TenantDetailModal } from '../components/TenantDetailModal';
import { CreateTenantModal } from '../components/CreateTenantModal';

export function TenantManagement() {
  const [tenants, setTenants] = useState<TenantInfo[]>(mockTenantList());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<TenantInfo | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredTenants = tenants.filter(tenant =>
    tenant.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: TenantInfo['status']) => {
    const statusConfig = {
      active: { label: 'Hoạt động', className: 'bg-green-100 text-green-800' },
      inactive: { label: 'Không hoạt động', className: 'bg-gray-100 text-gray-800' },
      suspended: { label: 'Tạm ngưng', className: 'bg-red-100 text-red-800' },
      trial: { label: 'Dùng thử', className: 'bg-blue-100 text-blue-800' }
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getPlanBadge = (plan: TenantInfo['plan']) => {
    const planConfig = {
      basic: { label: 'Cơ Bản', className: 'bg-gray-100 text-gray-800' },
      professional: { label: 'Chuyên Nghiệp', className: 'bg-blue-100 text-blue-800' },
      enterprise: { label: 'Doanh Nghiệp', className: 'bg-purple-100 text-purple-800' }
    };
    const config = planConfig[plan];
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Khách Hàng</h1>
          <p className="text-gray-600 mt-1">Quản lý tất cả khách hàng sử dụng nền tảng ERP</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm Khách Hàng
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Tổng Khách Hàng</p>
                <p className="text-2xl font-bold">{tenants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Đang Hoạt Động</p>
                <p className="text-2xl font-bold">{tenants.filter(t => t.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Dùng Thử</p>
                <p className="text-2xl font-bold">{tenants.filter(t => t.status === 'trial').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Tổng Người Dùng</p>
                <p className="text-2xl font-bold">{tenants.reduce((sum, t) => sum + t.userCount, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh Sách Khách Hàng</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm tên công ty, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Lọc
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Công Ty</TableHead>
                <TableHead>Gói Dịch Vụ</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Số Người Dùng</TableHead>
                <TableHead>Ngày Tạo</TableHead>
                <TableHead>Đăng Nhập Cuối</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow key={tenant.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{tenant.companyName}</p>
                      <p className="text-sm text-gray-500">{tenant.contactEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getPlanBadge(tenant.plan)}</TableCell>
                  <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                  <TableCell>
                    <span className="font-medium">{tenant.userCount}</span> người dùng
                  </TableCell>
                  <TableCell>{tenant.createdAt.toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {tenant.lastLoginAt.toLocaleDateString('vi-VN')}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedTenant(tenant)}>
                          Xem Chi Tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>Chỉnh Sửa</DropdownMenuItem>
                        <DropdownMenuItem>Quản Lý Người Dùng</DropdownMenuItem>
                        <DropdownMenuItem>Xem Hóa Đơn</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Tạm Ngưng
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedTenant && (
        <TenantDetailModal
          tenant={selectedTenant}
          isOpen={!!selectedTenant}
          onClose={() => setSelectedTenant(null)}
        />
      )}

      {showCreateModal && (
        <CreateTenantModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onTenantCreated={(newTenant) => {
            setTenants([...tenants, newTenant]);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}
