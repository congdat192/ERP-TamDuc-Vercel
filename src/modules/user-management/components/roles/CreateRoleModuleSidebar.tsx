
import React from 'react';
import { ModuleInfo, PermissionSelection } from '../../types/role-management';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CreateRoleModuleSidebarProps {
  modules: ModuleInfo[];
  selectedModuleId: string | null;
  onModuleSelect: (moduleId: string) => void;
  permissionSelections: PermissionSelection;
}

export function CreateRoleModuleSidebar({
  modules,
  selectedModuleId,
  onModuleSelect,
  permissionSelections
}: CreateRoleModuleSidebarProps) {
  
  const getSelectedPermissionsCount = (moduleId: string) => {
    const moduleSelections = permissionSelections[moduleId] || {};
    return Object.values(moduleSelections).filter(Boolean).length;
  };

  // FIX: Prevent form submission khi click module
  const handleModuleClick = (moduleId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('📋 [CreateRoleModuleSidebar] Module clicked:', moduleId);
    onModuleSelect(moduleId);
  };

  return (
    <div className="w-64 bg-gray-50 border-r">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-900">Modules</h3>
        <p className="text-sm text-gray-600 mt-1">Chọn module để cấu hình quyền</p>
      </div>
      
      <ScrollArea className="flex-1 h-[400px]">
        <div className="p-2">
          {modules.map((module) => {
            const selectedCount = getSelectedPermissionsCount(module.id);
            const isSelected = selectedModuleId === module.id;
            
            return (
              <Button
                key={module.id}
                type="button"
                variant={isSelected ? "default" : "ghost"}
                className={`w-full justify-start mb-1 h-auto p-3 ${
                  isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                }`}
                onClick={(e) => handleModuleClick(module.id, e)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="text-left">
                    <div className="font-medium">{module.name}</div>
                    <div className={`text-xs ${
                      isSelected ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {module.features.length} quyền
                    </div>
                  </div>
                  {selectedCount > 0 && (
                    <Badge 
                      variant={isSelected ? "secondary" : "default"}
                      className={`ml-2 ${
                        isSelected ? 'bg-blue-500 text-white' : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {selectedCount}
                    </Badge>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
