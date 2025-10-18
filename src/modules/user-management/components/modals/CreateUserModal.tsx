
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createUserAccount } from '@/modules/user-management/services/createUserService';
import { RoleService } from '@/modules/user-management/services/roleService';
import type { CustomRole } from '@/modules/user-management/types/role-management';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated?: (userData: any) => void;
}

export function CreateUserModal({ isOpen, onClose, onUserCreated }: CreateUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<CustomRole[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    roleId: '',
    notes: ''
  });

  // Fetch roles on mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoadingRoles(true);
        const rolesData = await RoleService.getRoles();
        setRoles(rolesData);
      } catch (error: any) {
        console.error('Error fetching roles:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách vai trò",
          variant: "destructive"
        });
      } finally {
        setIsLoadingRoles(false);
      }
    };

    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.fullName || !formData.roleId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('📝 [CreateUserModal] Creating user with data:', formData);
      
      await createUserAccount({
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        roleId: parseInt(formData.roleId)
      });
      
      toast({
        title: "Thành công",
        description: (
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Tài khoản đã được tạo thành công!</p>
              <p className="text-sm mt-1">
                Email với thông tin đăng nhập đã được gửi đến <strong>{formData.email}</strong>
              </p>
            </div>
          </div>
        ),
        duration: 6000
      });
      
      onUserCreated?.(formData);
      onClose();
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        roleId: '',
        notes: ''
      });
    } catch (error: any) {
      console.error('❌ [CreateUserModal] Error:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tạo tài khoản",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thêm Thành Viên Mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center space-x-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                {formData.fullName.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button type="button" variant="outline" className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Tải Ảnh Lên</span>
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                JPG, PNG hoặc GIF. Tối đa 2MB.
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và Tên *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Nhập họ và tên đầy đủ"
              required
            />
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
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số Điện Thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="0901234567"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="roleId">Vai Trò *</Label>
            <Select 
              value={formData.roleId} 
              onValueChange={(value) => handleInputChange('roleId', value)}
              disabled={isLoadingRoles}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingRoles ? "Đang tải..." : "Chọn vai trò"} />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                    {role.description && (
                      <span className="text-xs text-muted-foreground ml-2">
                        - {role.description}
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Vai trò xác định quyền truy cập của người dùng trong hệ thống
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Lưu ý:</strong> Hệ thống sẽ tự động tạo mật khẩu tạm thời và gửi email 
              đến địa chỉ <strong>{formData.email || '(email chưa nhập)'}</strong> với thông tin đăng nhập. 
              Người dùng sẽ được yêu cầu đổi mật khẩu khi đăng nhập lần đầu tiên.
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi Chú</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Ghi chú về thành viên này..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading || !formData.email || !formData.fullName || !formData.roleId}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tạo tài khoản...
                </>
              ) : (
                'Tạo Tài Khoản & Gửi Email'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
