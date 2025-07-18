
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { InvitationService, CreateInvitationRequest } from '../../services/invitationService';
import { RoleService } from '../../services/roleService';
import { CustomRole } from '../../types/role-management';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CreateInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvitationSent?: (invitation: any) => void;
}

export function CreateInvitationModal({ isOpen, onClose, onInvitationSent }: CreateInvitationModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [roles, setRoles] = useState<CustomRole[]>([]);
  const [formData, setFormData] = useState<CreateInvitationRequest>({
    email: '',
    role_id: undefined
  });

  // Load roles khi modal mở
  useEffect(() => {
    if (isOpen) {
      loadRoles();
    }
  }, [isOpen]);

  const loadRoles = async () => {
    setIsLoadingRoles(true);
    try {
      console.log('📋 [CreateInvitationModal] Loading roles...');
      const rolesData = await RoleService.getRoles();
      setRoles(rolesData);
      console.log('✅ [CreateInvitationModal] Roles loaded:', rolesData);
    } catch (error: any) {
      console.error('❌ [CreateInvitationModal] Error loading roles:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách vai trò",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập địa chỉ email",
        variant: "destructive",
      });
      return;
    }

    if (!formData.role_id) {
      toast({
        title: "Lỗi", 
        description: "Vui lòng chọn vai trò cho người được mời",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('📧 [CreateInvitationModal] Sending invitation with role:', formData);
      const invitation = await InvitationService.createInvitation(formData);
      
      toast({
        title: "Thành công",
        description: "Lời mời đã được gửi thành công",
      });
      
      onInvitationSent?.(invitation);
      handleClose();
    } catch (error: any) {
      console.error('❌ [CreateInvitationModal] Error creating invitation:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể gửi lời mời",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ email: '', role_id: undefined });
    onClose();
  };

  const selectedRole = roles.find(role => role.id === formData.role_id);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gửi Lời Mời Thành Viên</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Địa chỉ Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
            <p className="text-sm text-gray-500">
              Người nhận sẽ được gửi email mời tham gia doanh nghiệp
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Vai trò *</Label>
            {isLoadingRoles ? (
              <div className="flex items-center justify-center py-3 border rounded-md">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className="text-sm text-gray-500">Đang tải vai trò...</span>
              </div>
            ) : roles.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Chưa có vai trò nào được tạo. Vui lòng tạo vai trò trước khi gửi lời mời.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <Select 
                  value={formData.role_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, role_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{role.name}</span>
                          {role.description && (
                            <span className="text-xs text-gray-500">{role.description}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedRole && (
                  <p className="text-sm text-gray-500">
                    Người được mời sẽ có {selectedRole.permissions.length} quyền hạn từ vai trò "{selectedRole.name}"
                  </p>
                )}
              </>
            )}
          </div>

          <div className="flex space-x-2 pt-4">
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={isLoading || roles.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Đang gửi...
                </>
              ) : (
                "Gửi lời mời"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
