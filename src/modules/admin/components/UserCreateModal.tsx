
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { User, UserRole, CreateUserData } from '@/types/auth';
import { DEFAULT_PERMISSIONS } from '@/constants/permissions';

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: (user: User) => void;
}

export function UserCreateModal({ isOpen, onClose, onUserCreated }: UserCreateModalProps) {
  const [formData, setFormData] = useState<CreateUserData>({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'telesales',
    password: '',
    notes: '',
    requirePasswordReset: true,
    sendVerificationEmail: true,
    permissions: {
      modules: [],
      voucherFeatures: [],
      canManageUsers: false,
      canViewAllVouchers: false
    }
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateUserData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateUserData, string>> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Tên đăng nhập là bắt buộc';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới';
    }

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

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: User = {
        id: Date.now().toString(),
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        role: formData.role,
        status: formData.sendVerificationEmail ? 'pending_verification' : 'active',
        notes: formData.notes || undefined,
        createdAt: new Date().toISOString(),
        lastLogin: undefined,
        emailVerified: !formData.sendVerificationEmail,
        isActive: true,
        permissions: DEFAULT_PERMISSIONS[formData.role],
        securitySettings: {
          twoFactorEnabled: false,
          loginAttemptLimit: 3,
          passwordChangeRequired: formData.requirePasswordReset,
          sessionTimeoutMinutes: 240
        },
        activities: []
      };

      onUserCreated(newUser);
      
      // Reset form
      setFormData({
        username: '',
        fullName: '',
        email: '',
        phone: '',
        role: 'telesales',
        password: '',
        notes: '',
        requirePasswordReset: true,
        sendVerificationEmail: true,
        permissions: {
          modules: [],
          voucherFeatures: [],
          canManageUsers: false,
          canViewAllVouchers: false
        }
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreateUserData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm Người Dùng Mới</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Nhập tên đăng nhập"
                className={errors.username ? 'border-red-500' : ''}
              />
              {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
            </div>

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Vai trò *</Label>
              <Select value={formData.role} onValueChange={(value: UserRole) => handleInputChange('role', value)}>
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

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu tạm thời *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Nhập mật khẩu"
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Ghi chú về người dùng (không bắt buộc)"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendVerificationEmail"
                checked={formData.sendVerificationEmail}
                onCheckedChange={(checked) => handleInputChange('sendVerificationEmail', !!checked)}
              />
              <Label htmlFor="sendVerificationEmail" className="text-sm">
                Gửi email xác thực (người dùng phải xác thực email trước khi đăng nhập)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requirePasswordReset"
                checked={formData.requirePasswordReset}
                onCheckedChange={(checked) => handleInputChange('requirePasswordReset', !!checked)}
              />
              <Label htmlFor="requirePasswordReset" className="text-sm">
                Yêu cầu đổi mật khẩu khi đăng nhập lần đầu
              </Label>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo Tài Khoản'}
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
