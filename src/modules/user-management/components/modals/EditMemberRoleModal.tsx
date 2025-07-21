
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, UserCheck } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface Member {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  role: { name: string };
}

interface EditMemberRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  roles: Role[];
  onUpdateRole: (memberId: string, roleId: string) => Promise<void>;
  isLoading?: boolean;
}

export function EditMemberRoleModal({
  isOpen,
  onClose,
  member,
  roles,
  onUpdateRole,
  isLoading = false
}: EditMemberRoleModalProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Reset selectedRoleId when member changes
  React.useEffect(() => {
    if (member && roles.length > 0) {
      // Find current role ID by name (since we only have role name from member data)
      const currentRole = roles.find(role => role.name === member.role.name);
      setSelectedRoleId(currentRole?.id || '');
    }
  }, [member, roles]);

  const handleSave = async () => {
    if (!member || !selectedRoleId) return;

    try {
      setIsSaving(true);
      await onUpdateRole(member.id, selectedRoleId);
      onClose();
    } catch (error) {
      console.error('❌ [EditMemberRoleModal] Error updating role:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  if (!member) return null;

  const selectedRole = roles.find(role => role.id === selectedRoleId);
  const hasChanges = selectedRole && selectedRole.name !== member.role.name;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Chỉnh Sửa Vai Trò
          </DialogTitle>
          <DialogDescription>
            Thay đổi vai trò của thành viên trong hệ thống
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Member Info */}
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <Avatar className="w-12 h-12">
              <AvatarImage src={member.avatar} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {member.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{member.fullName}</p>
              <p className="text-sm text-gray-500 truncate">{member.email}</p>
              <div className="mt-1">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {member.role.name}
                </Badge>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Chọn Vai Trò Mới
            </label>
            <Select
              value={selectedRoleId}
              onValueChange={setSelectedRoleId}
              disabled={isLoading || isSaving}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò..." />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{role.name}</span>
                      {role.description && (
                        <span className="text-sm text-gray-500">{role.description}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Change Preview */}
          {hasChanges && selectedRole && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-amber-600" />
                <span className="text-amber-800">
                  Vai trò sẽ thay đổi từ <strong>{member.role.name}</strong> thành <strong>{selectedRole.name}</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSaving}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving || isLoading}
            className="min-w-[100px]"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang lưu...</span>
              </div>
            ) : (
              'Lưu thay đổi'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
