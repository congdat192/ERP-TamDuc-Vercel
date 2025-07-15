
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ModuleInfo } from '../../types/role-management';

interface CreateRolePermissionDetailProps {
  selectedModule: ModuleInfo | null;
  permissionSelections: Record<string, Record<number, boolean>>;
  onPermissionChange: (moduleId: string, featureId: number, selected: boolean) => void;
}

export function CreateRolePermissionDetail({ 
  selectedModule, 
  permissionSelections,
  onPermissionChange 
}: CreateRolePermissionDetailProps) {
  
  if (!selectedModule) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-lg font-medium mb-2">Chọn Module</div>
          <div className="text-sm">Chọn một module từ danh sách bên trái để cấu hình quyền</div>
        </div>
      </div>
    );
  }

  const moduleSelections = permissionSelections[selectedModule.id] || {};
  const selectedCount = Object.values(moduleSelections).filter(Boolean).length;

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{selectedModule.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{selectedModule.description}</p>
          </div>
          <Badge variant="outline">
            {selectedCount}/{selectedModule.features.length} quyền được chọn
          </Badge>
        </div>
      </div>

      <ScrollArea className="h-80">
        <div className="space-y-4">
          {selectedModule.features.map((feature) => {
            const isSelected = moduleSelections[feature.id] || false;
            
            return (
              <div 
                key={feature.id}
                className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
              >
                <Checkbox
                  id={`feature-${feature.id}`}
                  checked={isSelected}
                  onCheckedChange={(checked) => 
                    onPermissionChange(selectedModule.id, feature.id, !!checked)
                  }
                />
                <div className="flex-1 min-w-0">
                  <label 
                    htmlFor={`feature-${feature.id}`}
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    {feature.name}
                  </label>
                  {feature.description && (
                    <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
