import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { User, UserRole, UserPermissions, CreateUserData } from '@/types/auth';

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: (user: User) => void;
}

export function UserCreateModal({ isOpen, onClose, onUserCreated }: UserCreateModalProps) {
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('custom');
  const [notes, setNotes] = useState('');
  const [password, setPassword] = useState('');
  const [sendVerificationEmail, setSendVerificationEmail] = useState(false);
  const [requirePasswordReset, setRequirePasswordReset] = useState(false);
  const [permissions, setPermissions] = useState<UserPermissions>({
    modules: [],
    voucherFeatures: [],
    canManageUsers: false,
    canViewAllVouchers: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !username || !email || !password || !role) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    const newUser: User = {
      id: Date.now().toString(),
      fullName,
      username,
      email,
      phone: phone || undefined,
      role,
      permissions,
      isActive: true,
      status: 'pending_verification',
      createdAt: new Date().toISOString(),
      avatarPath: undefined,
      emailVerified: false,
      securitySettings: {
        twoFactorEnabled: false,
        loginAttemptLimit: 5,
        passwordChangeRequired: requirePasswordReset
      },
      activities: [],
      notes
    };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onUserCreated(newUser);
      toast({
        title: 'Thành công',
        description: 'Người dùng đã được tạo thành công.'
      });
      onClose();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tạo người dùng. Vui lòng thử lại.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Tạo Người Dùng Mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Họ và Tên</Label>
              <Input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="username">Tên Đăng Nhập</Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Số Điện Thoại</Label>
              <Input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">Mật Khẩu</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Vai Trò</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="erp-admin">ERP Admin</SelectItem>
                  <SelectItem value="voucher-admin">Voucher Admin</SelectItem>
                  <SelectItem value="telesales">Telesales</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi Chú</Label>
            <Input
              type="text"
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sendVerificationEmail"
              checked={sendVerificationEmail}
              onCheckedChange={(checked) => setSendVerificationEmail(!!checked)}
            />
            <Label htmlFor="sendVerificationEmail">Gửi Email Xác Minh</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="requirePasswordReset"
              checked={requirePasswordReset}
              onCheckedChange={(checked) => setRequirePasswordReset(!!checked)}
            />
            <Label htmlFor="requirePasswordReset">Yêu Cầu Đặt Lại Mật Khẩu</Label>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang Tạo...' : 'Tạo Người Dùng'}
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
