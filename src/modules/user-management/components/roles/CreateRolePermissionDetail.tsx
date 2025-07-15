
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModuleInfo, PermissionSelection } from '../../types/role-management';

interface CreateRolePermissionDetailProps {
  selectedModule: ModuleInfo | null;
  permissionSelections: PermissionSelection;
  onPermissionChange: (moduleId: string, featureId: number, selected: boolean) => void;
  disabled?: boolean;
}

export function CreateRolePermissionDetail({ 
  selectedModule, 
  permissionSelections, 
  onPermissionChange,
  disabled = false
}: CreateRolePermissionDetailProps) {
  
  if (!selectedModule) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <div className="text-lg font-medium mb-2">Chọn Module</div>
          <div className="text-sm">Chọn một module từ sidebar để xem quyền</div>
        </div>
      </div>
    );
  }

  const moduleSelections = permissionSelections[selectedModule.id] || {};

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">{selectedModule.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{selectedModule.description}</p>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {selectedModule.features.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-sm">Module này chưa có tính năng nào</div>
            </div>
          ) : (
            selectedModule.features.map((feature) => {
              const isSelected = moduleSelections[feature.id] || false;
              
              return (
                <div 
                  key={feature.id} 
                  className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <Checkbox
                    id={`feature-${feature.id}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      if (!disabled) {
                        onPermissionChange(selectedModule.id, feature.id, !!checked);
                      }
                    }}
                    disabled={disabled}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <label 
                      htmlFor={`feature-${feature.id}`}
                      className={`block text-sm font-medium cursor-pointer ${
                        disabled ? 'text-gray-400' : 'text-gray-900'
                      }`}
                    >
                      {feature.name}
                    </label>
                    {feature.description && (
                      <p className={`text-xs mt-1 ${
                        disabled ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {feature.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
