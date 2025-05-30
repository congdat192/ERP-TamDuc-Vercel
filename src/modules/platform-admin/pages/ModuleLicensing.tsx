
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter,
  Download,
  Settings,
  TrendingUp,
  Package,
  Calculator,
  UserCheck,
  Users,
  BarChart3,
  FolderKanban,
  ShoppingCart,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Plus,
  MoreHorizontal
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TenantModuleLicensing, ModuleLicense, ModuleStatus, ModulePlan } from '../types/module-licensing';
import { mockTenantModuleLicensing, availableModules } from '../utils/moduleLicensingData';
import { ModuleLicenseModal } from '../components/ModuleLicenseModal';
import { BulkLicenseModal } from '../components/BulkLicenseModal';

const iconMap: Record<string, React.ComponentType<any>> = {
  TrendingUp,
  Package,
  Calculator,
  UserCheck,
  Users,
  BarChart3,
  FolderKanban,
  ShoppingCart
};

export function ModuleLicensing() {
  const [tenants, setTenants] = useState<TenantModuleLicensing[]>(mockTenantModuleLicensing());
  const [selectedTenant, setSelectedTenant] = useState<TenantModuleLicensing | null>(tenants[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<ModuleLicense | null>(null);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<ModuleStatus | 'all'>('all');

  const filteredTenants = tenants.filter(tenant =>
    tenant.tenantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: ModuleStatus) => {
    const statusConfig = {
      active: { label: 'Hoạt động', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      disabled: { label: 'Vô hiệu', className: 'bg-gray-100 text-gray-800', icon: XCircle },
      expired: { label: 'Hết hạn', className: 'bg-red-100 text-red-800', icon: AlertTriangle },
      suspended: { label: 'Tạm ngưng', className: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
      trial: { label: 'Dùng thử', className: 'bg-blue-100 text-blue-800', icon: Clock },
      pending_payment: { label: 'Chờ thanh toán', className: 'bg-yellow-100 text-yellow-800', icon: Clock }
    };
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPlanBadge = (plan: ModulePlan) => {
    const planConfig = {
      free: { label: 'Miễn phí', className: 'bg-gray-100 text-gray-800' },
      basic: { label: 'Cơ bản', className: 'bg-blue-100 text-blue-800' },
      professional: { label: 'Chuyên nghiệp', className: 'bg-purple-100 text-purple-800' },
      enterprise: { label: 'Doanh nghiệp', className: 'bg-green-100 text-green-800' },
      trial: { label: 'Dùng thử', className: 'bg-orange-100 text-orange-800' },
      custom: { label: 'Tùy chỉnh', className: 'bg-pink-100 text-pink-800' }
    };
    const config = planConfig[plan];
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const getUsageIndicator = (license: ModuleLicense) => {
    if (!license.usageQuota) return null;
    const { used, limit, type } = license.usageQuota;
    const percentage = (used / limit) * 100;
    const isHigh = percentage > 80;
    
    return (
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${isHigh ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <span className="text-xs text-gray-600">
          {used}/{limit} {type === 'users' ? 'người dùng' : type === 'storage' ? 'GB' : type === 'transactions' ? 'giao dịch' : 'calls'}
        </span>
      </div>
    );
  };

  const handleModuleToggle = (moduleId: string, enabled: boolean) => {
    if (!selectedTenant) return;
    
    setTenants(prev => prev.map(tenant => {
      if (tenant.tenantId === selectedTenant.tenantId) {
        const updatedModules = tenant.modules.map(module => {
          if (module.moduleId === moduleId) {
            return {
              ...module,
              status: enabled ? 'active' : 'disabled' as ModuleStatus,
              activationDate: enabled ? new Date() : module.activationDate,
              expirationDate: enabled ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : module.expirationDate
            };
          }
          return module;
        });
        
        const updatedTenant = {
          ...tenant,
          modules: updatedModules,
          lastModified: new Date(),
          modifiedBy: 'Platform Admin'
        };
        
        if (tenant.tenantId === selectedTenant.tenantId) {
          setSelectedTenant(updatedTenant);
        }
        
        return updatedTenant;
      }
      return tenant;
    }));
  };

  const handleModuleEdit = (module: ModuleLicense) => {
    setSelectedModule(module);
    setShowLicenseModal(true);
  };

  const filteredModules = selectedTenant?.modules.filter(module => {
    if (filterStatus === 'all') return true;
    return module.status === filterStatus;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Module & Licensing</h1>
          <p className="text-gray-600 mt-1">Quản lý quyền truy cập module và gói dịch vụ cho từng khách hàng</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowBulkModal(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Quản Lý Hàng Loạt
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Xuất Báo Cáo
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600" />
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
              <Package className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Module Đang Hoạt Động</p>
                <p className="text-2xl font-bold">
                  {tenants.reduce((sum, tenant) => sum + tenant.modules.filter(m => m.status === 'active').length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Doanh Thu Tháng</p>
                <p className="text-2xl font-bold">
                  {(tenants.reduce((sum, tenant) => sum + tenant.totalMonthlyRevenue, 0) / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Sắp Hết Hạn</p>
                <p className="text-2xl font-bold">
                  {tenants.reduce((sum, tenant) => sum + tenant.modules.filter(m => {
                    if (!m.expirationDate) return false;
                    const daysLeft = Math.ceil((m.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    return daysLeft <= 30 && daysLeft > 0;
                  }).length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenant List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh Sách Khách Hàng</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredTenants.map((tenant) => (
              <div
                key={tenant.tenantId}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedTenant?.tenantId === tenant.tenantId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedTenant(tenant)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{tenant.tenantName}</p>
                    <p className="text-sm text-gray-500">
                      {tenant.modules.filter(m => m.status === 'active').length} module hoạt động
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      {(tenant.totalMonthlyRevenue / 1000000).toFixed(1)}M VNĐ
                    </p>
                    <p className="text-xs text-gray-500">/ tháng</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Module Management */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {selectedTenant ? `Module - ${selectedTenant.tenantName}` : 'Chọn khách hàng'}
                </CardTitle>
                {selectedTenant && (
                  <CardDescription>
                    Cập nhật lần cuối: {selectedTenant.lastModified.toLocaleDateString('vi-VN')} bởi {selectedTenant.modifiedBy}
                  </CardDescription>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as ModuleStatus | 'all')}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="disabled">Vô hiệu</SelectItem>
                    <SelectItem value="expired">Hết hạn</SelectItem>
                    <SelectItem value="trial">Dùng thử</SelectItem>
                    <SelectItem value="pending_payment">Chờ thanh toán</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Lọc
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedTenant ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Gói</TableHead>
                    <TableHead>Hạn sử dụng</TableHead>
                    <TableHead>Sử dụng</TableHead>
                    <TableHead>Giá/tháng</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModules.map((module) => {
                    const moduleInfo = availableModules.find(m => m.id === module.moduleId);
                    const Icon = moduleInfo ? iconMap[moduleInfo.icon] : Package;
                    
                    return (
                      <TableRow key={module.moduleId}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Icon className="w-5 h-5 text-gray-500" />
                            <div>
                              <p className="font-medium">{module.moduleName}</p>
                              <p className="text-sm text-gray-500">{module.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(module.status)}</TableCell>
                        <TableCell>{getPlanBadge(module.plan)}</TableCell>
                        <TableCell>
                          {module.expirationDate ? (
                            <div>
                              <p className="text-sm">{module.expirationDate.toLocaleDateString('vi-VN')}</p>
                              {module.trialEndsAt && (
                                <p className="text-xs text-orange-600">
                                  Dùng thử đến {module.trialEndsAt.toLocaleDateString('vi-VN')}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">--</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {getUsageIndicator(module)}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {(module.monthlyPrice / 1000000).toFixed(1)}M VNĐ
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Switch
                              checked={module.status === 'active'}
                              onCheckedChange={(checked) => handleModuleToggle(module.moduleId, checked)}
                              disabled={module.status === 'pending_payment'}
                            />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleModuleEdit(module)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  Gia hạn
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Nâng cấp gói
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  Tạm ngưng
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Chọn một khách hàng để xem thông tin module</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {showLicenseModal && selectedModule && (
        <ModuleLicenseModal
          module={selectedModule}
          tenant={selectedTenant!}
          isOpen={showLicenseModal}
          onClose={() => {
            setShowLicenseModal(false);
            setSelectedModule(null);
          }}
          onSave={(updatedModule) => {
            // Update the module in the tenant's modules list
            console.log('Saving module:', updatedModule);
            setShowLicenseModal(false);
            setSelectedModule(null);
          }}
        />
      )}

      {showBulkModal && (
        <BulkLicenseModal
          tenants={tenants}
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          onApply={(changes) => {
            console.log('Applying bulk changes:', changes);
            setShowBulkModal(false);
          }}
        />
      )}
    </div>
  );
}
