
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ModuleLicense, ModuleStatus, ModulePlan, TenantModuleLicensing } from '../types/module-licensing';

interface ModuleLicenseModalProps {
  module: ModuleLicense;
  tenant: TenantModuleLicensing;
  isOpen: boolean;
  onClose: () => void;
  onSave: (module: ModuleLicense) => void;
}

export function ModuleLicenseModal({ module, tenant, isOpen, onClose, onSave }: ModuleLicenseModalProps) {
  const [editedModule, setEditedModule] = useState<ModuleLicense>({ ...module });
  const [activationDate, setActivationDate] = useState<Date | undefined>(module.activationDate);
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(module.expirationDate);

  const handleSave = () => {
    const updatedModule: ModuleLicense = {
      ...editedModule,
      activationDate,
      expirationDate,
    };
    onSave(updatedModule);
  };

  const getStatusColor = (status: ModuleStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'disabled': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      case 'trial': return 'bg-blue-100 text-blue-800';
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateRevenue = () => {
    if (!activationDate || !expirationDate) return 0;
    const months = Math.ceil((expirationDate.getTime() - activationDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return editedModule.monthlyPrice * Math.max(1, months);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Quản Lý License - {module.moduleName}</span>
          </DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin license cho {tenant.tenantName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Module Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{module.moduleName}</h3>
              <Badge className={getStatusColor(editedModule.status)}>
                {editedModule.status === 'active' ? 'Hoạt động' : 
                 editedModule.status === 'disabled' ? 'Vô hiệu' :
                 editedModule.status === 'expired' ? 'Hết hạn' :
                 editedModule.status === 'suspended' ? 'Tạm ngưng' :
                 editedModule.status === 'trial' ? 'Dùng thử' : 'Chờ thanh toán'}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{module.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status & Plan */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={editedModule.status}
                  onValueChange={(value) => setEditedModule(prev => ({ ...prev, status: value as ModuleStatus }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="disabled">Vô hiệu</SelectItem>
                    <SelectItem value="expired">Hết hạn</SelectItem>
                    <SelectItem value="suspended">Tạm ngưng</SelectItem>
                    <SelectItem value="trial">Dùng thử</SelectItem>
                    <SelectItem value="pending_payment">Chờ thanh toán</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="plan">Gói dịch vụ</Label>
                <Select
                  value={editedModule.plan}
                  onValueChange={(value) => setEditedModule(prev => ({ ...prev, plan: value as ModulePlan }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Miễn phí</SelectItem>
                    <SelectItem value="basic">Cơ bản</SelectItem>
                    <SelectItem value="professional">Chuyên nghiệp</SelectItem>
                    <SelectItem value="enterprise">Doanh nghiệp</SelectItem>
                    <SelectItem value="trial">Dùng thử</SelectItem>
                    <SelectItem value="custom">Tùy chỉnh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Giá tháng (VNĐ)</Label>
                <Input
                  id="price"
                  type="number"
                  value={editedModule.monthlyPrice}
                  onChange={(e) => setEditedModule(prev => ({ ...prev, monthlyPrice: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-4">
              <div>
                <Label>Ngày kích hoạt</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {activationDate ? format(activationDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={activationDate}
                      onSelect={setActivationDate}
                      locale={vi}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Ngày hết hạn</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expirationDate ? format(expirationDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={expirationDate}
                      onSelect={setExpirationDate}
                      locale={vi}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const now = new Date();
                    setExpirationDate(new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()));
                  }}
                >
                  +1 năm
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const now = new Date();
                    setExpirationDate(new Date(now.getFullYear(), now.getMonth() + 6, now.getDate()));
                  }}
                >
                  +6 tháng
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const now = new Date();
                    setExpirationDate(new Date(now.getFullYear(), now.getMonth() + 3, now.getDate()));
                  }}
                >
                  +3 tháng
                </Button>
              </div>
            </div>
          </div>

          {/* Usage Quota */}
          {editedModule.usageQuota && (
            <div className="space-y-4">
              <Label>Giới hạn sử dụng</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="quota-limit">Giới hạn</Label>
                  <Input
                    id="quota-limit"
                    type="number"
                    value={editedModule.usageQuota.limit}
                    onChange={(e) => setEditedModule(prev => ({
                      ...prev,
                      usageQuota: prev.usageQuota ? {
                        ...prev.usageQuota,
                        limit: parseInt(e.target.value) || 0
                      } : undefined
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="quota-used">Đã sử dụng</Label>
                  <Input
                    id="quota-used"
                    type="number"
                    value={editedModule.usageQuota.used}
                    onChange={(e) => setEditedModule(prev => ({
                      ...prev,
                      usageQuota: prev.usageQuota ? {
                        ...prev.usageQuota,
                        used: parseInt(e.target.value) || 0
                      } : undefined
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="quota-type">Loại</Label>
                  <Select
                    value={editedModule.usageQuota.type}
                    onValueChange={(value) => setEditedModule(prev => ({
                      ...prev,
                      usageQuota: prev.usageQuota ? {
                        ...prev.usageQuota,
                        type: value as 'users' | 'storage' | 'transactions' | 'api_calls'
                      } : undefined
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="users">Người dùng</SelectItem>
                      <SelectItem value="storage">Dung lượng</SelectItem>
                      <SelectItem value="transactions">Giao dịch</SelectItem>
                      <SelectItem value="api_calls">API Calls</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              value={editedModule.notes || ''}
              onChange={(e) => setEditedModule(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Thêm ghi chú về license này..."
              rows={3}
            />
          </div>

          <Separator />

          {/* Revenue Calculation */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Tính toán doanh thu</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Giá tháng:</p>
                <p className="font-semibold">{(editedModule.monthlyPrice / 1000000).toFixed(1)}M VNĐ</p>
              </div>
              <div>
                <p className="text-gray-600">Tổng doanh thu dự kiến:</p>
                <p className="font-semibold text-green-600">{(calculateRevenue() / 1000000).toFixed(1)}M VNĐ</p>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {editedModule.status === 'expired' && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <p className="text-red-800 font-medium">Module đã hết hạn</p>
              </div>
              <p className="text-red-700 text-sm mt-1">
                Khách hàng sẽ không thể truy cập module này cho đến khi được gia hạn.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave}>
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
