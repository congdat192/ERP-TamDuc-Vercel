
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ModuleInfo, ModulePermissions, CustomPermission } from '../../types/role-management';
import { Eye, Plus, Edit, Trash2, CheckSquare, Square } from 'lucide-react';

interface PermissionMatrixProps {
  modules: ModuleInfo[];
  permissions: ModulePermissions;
  onPermissionChange: (moduleId: string, permission: keyof CustomPermission, value: boolean) => void;
}

const permissionConfig = [
  { key: 'view' as const, label: 'Xem', icon: Eye, color: 'text-blue-600' },
  { key: 'add' as const, label: 'Thêm', icon: Plus, color: 'text-green-600' },
  { key: 'edit' as const, label: 'Sửa', icon: Edit, color: 'text-yellow-600' },
  { key: 'delete' as const, label: 'Xóa', icon: Trash2, color: 'text-red-600' }
];

export function PermissionMatrix({ modules, permissions, onPermissionChange }: PermissionMatrixProps) {
  const handleSelectAllModule = (moduleId: string, checked: boolean) => {
    permissionConfig.forEach(perm => {
      onPermissionChange(moduleId, perm.key, checked);
    });
  };

  const handleSelectAllPermission = (permission: keyof CustomPermission, checked: boolean) => {
    modules.forEach(module => {
      onPermissionChange(module.id, permission, checked);
    });
  };

  const isModuleFullySelected = (moduleId: string) => {
    const modulePerms = permissions[moduleId];
    if (!modulePerms) return false;
    return Object.values(modulePerms).every(Boolean);
  };

  const isModulePartiallySelected = (moduleId: string) => {
    const modulePerms = permissions[moduleId];
    if (!modulePerms) return false;
    const selected = Object.values(modulePerms).filter(Boolean);
    return selected.length > 0 && selected.length < 4;
  };

  const isPermissionFullySelected = (permission: keyof CustomPermission) => {
    return modules.every(module => permissions[module.id]?.[permission]);
  };

  const isPermissionPartiallySelected = (permission: keyof CustomPermission) => {
    const selected = modules.filter(module => permissions[module.id]?.[permission]);
    return selected.length > 0 && selected.length < modules.length;
  };

  if (modules.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">
            Không có modules nào để cấu hình quyền
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium">Module</th>
                {permissionConfig.map((perm) => {
                  const Icon = perm.icon;
                  const isFullySelected = isPermissionFullySelected(perm.key);
                  const isPartiallySelected = isPermissionPartiallySelected(perm.key);
                  
                  return (
                    <th key={perm.key} className="text-center p-4 font-medium min-w-[120px]">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex items-center space-x-1">
                          <Icon className={`w-4 h-4 ${perm.color}`} />
                          <span>{perm.label}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSelectAllPermission(perm.key, !isFullySelected)}
                          className="h-6 px-2 text-xs"
                        >
                          {isFullySelected ? (
                            <CheckSquare className="w-3 h-3" />
                          ) : isPartiallySelected ? (
                            <Square className="w-3 h-3 bg-blue-500 text-white" />
                          ) : (
                            <Square className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </th>
                  );
                })}
                <th className="text-center p-4 font-medium">Tất cả</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((module) => {
                const modulePerms = permissions[module.id] || { view: false, add: false, edit: false, delete: false };
                const isFullySelected = isModuleFullySelected(module.id);
                const isPartiallySelected = isModulePartiallySelected(module.id);
                
                return (
                  <tr key={module.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-medium text-gray-900">{module.label}</div>
                          <div className="text-sm text-gray-500">{module.name}</div>
                        </div>
                      </div>
                    </td>
                    {permissionConfig.map((perm) => (
                      <td key={perm.key} className="text-center p-4">
                        <Checkbox
                          checked={modulePerms[perm.key]}
                          onCheckedChange={(checked) => 
                            onPermissionChange(module.id, perm.key, !!checked)
                          }
                        />
                      </td>
                    ))}
                    <td className="text-center p-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelectAllModule(module.id, !isFullySelected)}
                        className="h-6 px-2"
                      >
                        {isFullySelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : isPartiallySelected ? (
                          <Square className="w-4 h-4 bg-blue-500 text-white" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
