
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User, UserRole, UserPermissions, CreateUserData } from '@/types/auth';
import { DEFAULT_PERMISSIONS } from '@/constants/permissions';

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: (user: User) => void;
}

export function UserCreateModal({ isOpen, onClose, onUserCreated }: UserCreateModalProps) {
  const [formData, setFormData] = useState<CreateUserData>({
    fullName: '',
    email: '',
    phone: '',
    role: 'custom',
    notes: '',
    permissions: {
      modules: [],
      actions: ['view'],
      voucherFeatures: [],
      canManageUsers: false,
      canViewAllVouchers: false
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUser: User = {
      id: Date.now().toString(),
      fullName: formData.fullName,
      username: formData.email.split('@')[0],
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      permissions: formData.permissions,
      businessId: null,
      departmentId: null,
      groupId: null,
      isActive: true,
      status: 'pending_verification',
      email_verified_at: null,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      avatarPath: undefined,
      notes: formData.notes || '',
      securitySettings: {
        twoFactorEnabled: false,
        loginAttemptLimit: 3,
        passwordChangeRequired: true
      },
      activities: []
    };

    onUserCreated(newUser);
    onClose();
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      role: 'custom',
      notes: '',
      permissions: {
        modules: [],
        actions: ['view'],
        voucherFeatures: [],
        canManageUsers: false,
        canViewAllVouchers: false
      }
    });
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData(prev => ({
      ...prev,
      role,
      permissions: DEFAULT_PERMISSIONS[role]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo Người Dùng Mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và Tên</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Số Điện Thoại</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Vai Trò</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="erp-admin">ERP Admin</SelectItem>
                <SelectItem value="voucher-admin">Voucher Admin</SelectItem>
                <SelectItem value="telesales">Telesales</SelectItem>
                <SelectItem value="custom">Tùy Chỉnh</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi Chú</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Nhập ghi chú về người dùng..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              Tạo Người Dùng
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
