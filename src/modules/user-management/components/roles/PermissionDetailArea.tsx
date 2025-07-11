
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Plus, Edit, Trash2 } from 'lucide-react';
import { ModuleInfo, ModulePermissions, CustomPermission } from '../../types/role-management';

interface PermissionDetailAreaProps {
  selectedModule: ModuleInfo | null;
  permissions: ModulePermissions;
  onPermissionChange: (moduleId: string, permission: keyof CustomPermission, value: boolean) => void;
}

const permissionConfig = [
  { key: 'view' as const, label: 'Xem', icon: Eye, color: 'text-blue-600' },
  { key: 'add' as const, label: 'Tạo', icon: Plus, color: 'text-green-600' },
  { key: 'edit' as const, label: 'Sửa', icon: Edit, color: 'text-yellow-600' },
  { key: 'delete' as const, label: 'Xóa', icon: Trash2, color: 'text-red-600' }
];

export function PermissionDetailArea({ selectedModule, permissions, onPermissionChange }: PermissionDetailAreaProps) {
  if (!selectedModule) {
    return (
      <div className="h-full flex items-center justify-center text-center">
        <div className="text-gray-500">
          <div className="text-lg font-medium mb-2">Chọn module để cấu hình quyền</div>
          <div className="text-sm">Click vào module bên phải để xem và cấu hình quyền chi tiết</div>
        </div>
      </div>
    );
  }

  const modulePerms = permissions[selectedModule.id] || { view: false, add: false, edit: false, delete: false };

  const handlePermissionChange = (permissionKey: keyof CustomPermission, checked: boolean) => {
    onPermissionChange(selectedModule.id, permissionKey, checked);
  };

  return (
    <div className="h-full">
      <div className="border-b pb-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{selectedModule.label}</h3>
        <p className="text-sm text-gray-500 mt-1">Cấu hình quyền cơ bản cho module này</p>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 mb-4">Quyền Truy Cập</h4>
        
        <div className="grid grid-cols-2 gap-4">
          {permissionConfig.map((perm) => {
            const Icon = perm.icon;
            return (
              <div key={perm.key} className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Checkbox
                  checked={modulePerms[perm.key]}
                  onCheckedChange={(checked) => handlePermissionChange(perm.key, !!checked)}
                />
                <Icon className={`w-5 h-5 ${perm.color}`} />
                <span className="text-sm font-medium text-gray-700">{perm.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
