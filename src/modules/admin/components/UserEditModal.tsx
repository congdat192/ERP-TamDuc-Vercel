
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { User, UserRole, UpdateUserData, ERPModule, VoucherFeature } from '@/types/auth';
import { DEFAULT_PERMISSIONS, MODULE_PERMISSIONS, VOUCHER_FEATURES } from '@/constants/permissions';

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdated: (user: User) => void;
}

export function UserEditModal({ isOpen, onClose, user, onUserUpdated }: UserEditModalProps) {
  const [formData, setFormData] = useState<UpdateUserData>({
    fullName: '',
    email: '',
    phone: '',
    role: 'telesales',
    notes: '',
    permissions: {
      modules: [],
      voucherFeatures: [],
      canManageUsers: false,
      canViewAllVouchers: false
    }
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UpdateUserData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        notes: user.notes || '',
        permissions: user.permissions
      });
      setErrors({});
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UpdateUserData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên là bắt buộc';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (formData.phone && !/^[0-9+\-\s]+$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser: User = {
        ...user,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        role: formData.role,
        notes: formData.notes || undefined,
        permissions: formData.permissions || user.permissions
      };

      onUserUpdated(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof UpdateUserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRoleChange = (role: UserRole) => {
    const defaultPermissions = DEFAULT_PERMISSIONS[role];
    setFormData(prev => ({
      ...prev,
      role,
      permissions: defaultPermissions
    }));
  };

  const handleModulePermissionChange = (module: ERPModule, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions!,
        modules: checked 
          ? [...prev.permissions!.modules, module]
          : prev.permissions!.modules.filter(m => m !== module)
      }
    }));
  };

  const handleVoucherFeatureChange = (feature: VoucherFeature, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions!,
        voucherFeatures: checked 
          ? [...(prev.permissions!.voucherFeatures || []), feature]
          : (prev.permissions!.voucherFeatures || []).filter(f => f !== feature)
      }
    }));
  };

  const availableModules = MODULE_PERMISSIONS.filter(module => 
    module.allowedRoles.includes(formData.role)
  );

  const availableVoucherFeatures = VOUCHER_FEATURES.filter(feature => 
    feature.allowedRoles.includes(formData.role)
  );

  // Check if user can have special permissions
  const canManageUsers = formData.role === 'erp-admin';
  const canViewAllVouchers = ['erp-admin', 'voucher-admin'].includes(formData.role);

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Người Dùng - {user.fullName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Nhập họ và tên đầy đủ"
                className={errors.fullName ? 'border-red-500' : ''}
              />
              {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="user@company.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="0901234567"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Vai trò *</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="erp-admin">Quản Trị ERP</SelectItem>
                  <SelectItem value="voucher-admin">Quản Lý Voucher</SelectItem>
                  <SelectItem value="telesales">Telesales</SelectItem>
                  <SelectItem value="custom">Tùy Chỉnh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Ghi chú về người dùng"
              rows={3}
            />
          </div>

          {/* Permissions Section */}
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Phân Quyền Chi Tiết</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Module Permissions */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Quyền Truy Cập Module</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-3">
                    {availableModules.map((module) => (
                      <div key={module.module} className="flex items-center space-x-2">
                        <Checkbox
                          id={`module-${module.module}`}
                          checked={formData.permissions?.modules.includes(module.module) || false}
                          onCheckedChange={(checked) => handleModulePermissionChange(module.module, !!checked)}
                        />
                        <Label htmlFor={`module-${module.module}`} className="text-sm">
                          {module.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Voucher Features */}
                {formData.permissions?.modules.includes('voucher') && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Tính Năng Voucher</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-3">
                      {availableVoucherFeatures.map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`voucher-${feature.id}`}
                            checked={formData.permissions?.voucherFeatures?.includes(feature.id as VoucherFeature) || false}
                            onCheckedChange={(checked) => handleVoucherFeatureChange(feature.id as VoucherFeature, !!checked)}
                          />
                          <Label htmlFor={`voucher-${feature.id}`} className="text-sm">
                            {feature.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Special Permissions */}
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-gray-900">Quyền Đặc Biệt</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canManageUsers"
                      checked={formData.permissions?.canManageUsers || false}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        permissions: {
                          ...prev.permissions!,
                          canManageUsers: !!checked
                        }
                      }))}
                      disabled={!canManageUsers}
                    />
                    <Label htmlFor="canManageUsers" className="text-sm">
                      Có thể quản lý người dùng
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canViewAllVouchers"
                      checked={formData.permissions?.canViewAllVouchers || false}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        permissions: {
                          ...prev.permissions!,
                          canViewAllVouchers: !!checked
                        }
                      }))}
                      disabled={!canViewAllVouchers}
                    />
                    <Label htmlFor="canViewAllVouchers" className="text-sm">
                      Có thể xem tất cả voucher
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang cập nhật...' : 'Cập Nhật'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
