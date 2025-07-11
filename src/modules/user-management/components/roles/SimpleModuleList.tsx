
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, AlertTriangle } from 'lucide-react';
import { ModuleInfo, ModulePermissions } from '../../types/role-management';

interface SimpleModuleListProps {
  modules: ModuleInfo[];
  permissions: ModulePermissions;
  selectedModuleId: string | null;
  onModuleSelect: (moduleId: string) => void;
}

export function SimpleModuleList({ modules, permissions, selectedModuleId, onModuleSelect }: SimpleModuleListProps) {
  const getModulePermissionCount = (moduleId: string) => {
    const modulePerms = permissions[moduleId];
    if (!modulePerms) return 0;
    return Object.values(modulePerms).filter(Boolean).length;
  };

  const hasAnyPermissions = (moduleId: string) => {
    return getModulePermissionCount(moduleId) > 0;
  };

  if (modules.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-sm font-medium text-gray-700 mb-4 px-2">Danh Sách Modules</div>
        
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-medium">Không tải được modules</div>
              <div className="text-sm">
                Có thể do lỗi kết nối API. Vui lòng thử lại hoặc liên hệ quản trị viên.
              </div>
            </div>
          </AlertDescription>
        </Alert>
        
        <div className="text-center text-gray-500 py-8">
          <Settings className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <div className="text-sm">Đang tải modules...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="text-sm font-medium text-gray-700 mb-4 px-2">
        Danh Sách Modules ({modules.length})
      </div>
      
      {modules.map((module) => {
        const isSelected = selectedModuleId === module.id;
        const permissionCount = getModulePermissionCount(module.id);
        const hasPerms = hasAnyPermissions(module.id);
        
        return (
          <Button
            key={module.id}
            variant="ghost"
            className={`w-full justify-start p-3 h-auto text-left hover:bg-gray-50 ${
              isSelected ? 'bg-blue-50 border-blue-200 border' : ''
            }`}
            onClick={() => onModuleSelect(module.id)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex-1">
                <div className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                  {module.label}
                </div>
                <div className="text-xs text-gray-500 mt-1">{module.name}</div>
              </div>
              
              {hasPerms && (
                <div className={`text-xs px-2 py-1 rounded ${
                  isSelected ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {permissionCount}/4
                </div>
              )}
            </div>
          </Button>
        );
      })}
    </div>
  );
}
