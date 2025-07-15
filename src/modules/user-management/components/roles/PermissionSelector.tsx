
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Plus, Edit, Trash2 } from 'lucide-react';
import { ModuleInfo, PermissionSelection, FeatureInfo } from '../../types/role-management';

interface PermissionSelectorProps {
  modules: ModuleInfo[];
  selections: PermissionSelection;
  onSelectionChange: (moduleId: string, featureId: number, selected: boolean) => void;
}

const permissionIcons = {
  view: Eye,
  create: Plus,
  edit: Edit,
  delete: Trash2
};

const permissionColors = {
  view: 'text-blue-600',
  create: 'text-green-600',
  edit: 'text-yellow-600',
  delete: 'text-red-600'
};

export function PermissionSelector({ modules, selections, onSelectionChange }: PermissionSelectorProps) {
  const getSelectedCount = (moduleId: string) => {
    const moduleSelections = selections[moduleId] || {};
    return Object.values(moduleSelections).filter(Boolean).length;
  };

  const getTotalCount = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    return module?.features.length || 0;
  };

  const isModuleFullySelected = (moduleId: string) => {
    const selectedCount = getSelectedCount(moduleId);
    const totalCount = getTotalCount(moduleId);
    return selectedCount > 0 && selectedCount === totalCount;
  };

  const isModulePartiallySelected = (moduleId: string) => {
    const selectedCount = getSelectedCount(moduleId);
    const totalCount = getTotalCount(moduleId);
    return selectedCount > 0 && selectedCount < totalCount;
  };

  const handleModuleSelectAll = (moduleId: string, selected: boolean) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    module.features.forEach(feature => {
      onSelectionChange(moduleId, feature.id, selected);
    });
  };

  if (modules.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-sm">Không có modules để cấu hình quyền</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Cấu Hình Quyền</h3>
      <p className="text-sm text-gray-600">Chọn quyền cho từng module</p>
      
      <div className="grid grid-cols-1 gap-4">
        {modules.map((module) => {
          const moduleSelections = selections[module.id] || {};
          const selectedCount = getSelectedCount(module.id);
          const totalCount = getTotalCount(module.id);
          const isFullySelected = isModuleFullySelected(module.id);
          const isPartiallySelected = isModulePartiallySelected(module.id);

          return (
            <Card key={module.id} className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Checkbox
                        checked={isFullySelected}
                        onCheckedChange={(checked) => handleModuleSelectAll(module.id, !!checked)}
                      />
                      {isPartiallySelected && !isFullySelected && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-2 h-2 bg-blue-600 rounded-sm" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{module.label}</div>
                      <div className="text-xs text-gray-500">{module.description}</div>
                    </div>
                  </div>
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {selectedCount}/{totalCount}
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {module.features.map((feature) => {
                    const Icon = permissionIcons[feature.type];
                    const colorClass = permissionColors[feature.type];
                    const isSelected = moduleSelections[feature.id] || false;

                    return (
                      <div key={feature.id} className="flex items-center space-x-2 p-2 rounded border hover:bg-gray-50">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => onSelectionChange(module.id, feature.id, !!checked)}
                        />
                        <Icon className={`w-4 h-4 ${colorClass}`} />
                        <span className="text-sm text-gray-700">{feature.name}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
