
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ModuleInfo } from '../../types/role-management';

interface CreateRoleModuleSidebarProps {
  modules: ModuleInfo[];
  selectedModuleId: string | null;
  onModuleSelect: (moduleId: string) => void;
  permissionSelections: Record<string, Record<number, boolean>>;
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

  const getTotalPermissionsCount = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    return module?.features.length || 0;
  };

  return (
    <div className="w-64 border-r bg-gray-50">
      <div className="p-4 border-b">
        <h3 className="font-medium text-gray-900">Modules</h3>
        <p className="text-sm text-gray-500">Chọn module để cấu hình quyền</p>
      </div>
      
      <ScrollArea className="h-96">
        <div className="p-2">
          {modules.map((module) => {
            const selectedCount = getSelectedPermissionsCount(module.id);
            const totalCount = getTotalPermissionsCount(module.id);
            const isSelected = selectedModuleId === module.id;
            
            return (
              <button
                key={module.id}
                onClick={() => onModuleSelect(module.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg mb-2 transition-colors",
                  "hover:bg-white hover:shadow-sm",
                  isSelected && "bg-blue-50 border border-blue-200"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{module.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{module.description}</div>
                  </div>
                  
                  <div className="ml-3 flex flex-col items-end">
                    <Badge 
                      variant={selectedCount > 0 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {selectedCount}/{totalCount}
                    </Badge>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
