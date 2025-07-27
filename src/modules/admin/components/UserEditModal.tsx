
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User, UserRole, UpdateUserData } from '@/types/auth';
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
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const updatedUser: User = {
      ...user,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      notes: formData.notes || '',
      permissions: formData.permissions || user.permissions
    };

    onUserUpdated(updatedUser);
    onClose();
  };

  const handleRoleChange = (role: string) => {
    const userRole = role as UserRole;
    setFormData(prev => ({
      ...prev,
      role: userRole,
      permissions: DEFAULT_PERMISSIONS[userRole]
    }));
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Người Dùng</DialogTitle>
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
              Lưu Thay Đổi
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
