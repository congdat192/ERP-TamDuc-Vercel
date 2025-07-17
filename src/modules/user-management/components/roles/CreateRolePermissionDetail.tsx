
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ModuleInfo, PermissionSelection } from '../../types/role-management';

interface CreateRolePermissionDetailProps {
  selectedModule: ModuleInfo | null;
  permissionSelections: PermissionSelection;
  onPermissionChange: (moduleId: string, featureCode: string, selected: boolean) => void;
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
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-gray-500 text-center">
          <div className="text-lg font-medium mb-2">Chọn Module</div>
          <div className="text-sm">Vui lòng chọn một module từ danh sách bên trái để xem các quyền có sẵn</div>
        </div>
      </div>
    );
  }

  const modulePermissions = permissionSelections[selectedModule.id] || {};

  const getPermissionTypeColor = (type: string) => {
    switch (type) {
      case 'view': return 'bg-blue-100 text-blue-800';
      case 'create': return 'bg-green-100 text-green-800';
      case 'edit': return 'bg-yellow-100 text-yellow-800';
      case 'delete': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPermissionTypeLabel = (type: string) => {
    switch (type) {
      case 'view': return 'Xem';
      case 'create': return 'Tạo';
      case 'edit': return 'Sửa';
      case 'delete': return 'Xóa';
      default: return type;
    }
  };

  return (
    <div className="flex-1 flex flex-col border-l bg-white">
      {/* Header */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-semibold">{selectedModule.name.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{selectedModule.name}</h3>
            <p className="text-sm text-gray-600">{selectedModule.description}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-medium text-gray-900">
              Quyền có sẵn ({selectedModule.features.length})
            </h4>
            {disabled && (
              <Badge variant="secondary" className="text-xs">
                Chỉ đọc
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            {selectedModule.features.map((feature) => {
              const isChecked = modulePermissions[feature.code] || false;
              
              return (
                <div key={feature.code} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <Checkbox
                    id={`permission-${feature.code}`}
                    checked={isChecked}
                    disabled={disabled}
                    onCheckedChange={(checked) => {
                      onPermissionChange(selectedModule.id, feature.code, checked as boolean);
                    }}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Label 
                        htmlFor={`permission-${feature.code}`}
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                      >
                        {feature.name}
                      </Label>
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-2 py-0.5 ${getPermissionTypeColor(feature.type)}`}
                      >
                        {getPermissionTypeLabel(feature.type)}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <div className="mt-2">
                      <code className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {feature.code}
                      </code>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedModule.features.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-sm">Module này chưa có quyền nào được định nghĩa</div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50">
        <div className="text-xs text-gray-600">
          <div className="font-medium mb-1">Tổng quan quyền được chọn:</div>
          <div>
            {Object.values(modulePermissions).filter(Boolean).length} / {selectedModule.features.length} quyền
          </div>
        </div>
      </div>
    </div>
  );
}
