
import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Eye, Plus, Edit, Trash2 } from 'lucide-react';
import { ModuleInfo, ModulePermissions, CustomPermission } from '../../types/role-management';

interface ModuleSidebarProps {
  modules: ModuleInfo[];
  permissions: ModulePermissions;
  onPermissionChange: (moduleId: string, permission: keyof CustomPermission, value: boolean) => void;
}

const permissionConfig = [
  { key: 'view' as const, label: 'Xem', icon: Eye, color: 'text-blue-600' },
  { key: 'add' as const, label: 'Tạo', icon: Plus, color: 'text-green-600' },
  { key: 'edit' as const, label: 'Chỉnh sửa', icon: Edit, color: 'text-yellow-600' },
  { key: 'delete' as const, label: 'Xóa', icon: Trash2, color: 'text-red-600' }
];

export function ModuleSidebar({ modules, permissions, onPermissionChange }: ModuleSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const isModuleExpanded = (moduleId: string) => expandedModules.has(moduleId);

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

  const handleSelectAllModule = (moduleId: string, checked: boolean) => {
    permissionConfig.forEach(perm => {
      onPermissionChange(moduleId, perm.key, checked);
    });
  };

  const getModuleSelectionState = (moduleId: string) => {
    if (isModuleFullySelected(moduleId)) return 'full';
    if (isModulePartiallySelected(moduleId)) return 'partial';
    return 'none';
  };

  if (modules.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Không có modules nào để cấu hình quyền
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700 mb-4">Danh Sách Modules</div>
      
      {modules.map((module) => {
        const modulePerms = permissions[module.id] || { view: false, add: false, edit: false, delete: false };
        const isExpanded = isModuleExpanded(module.id);
        const selectionState = getModuleSelectionState(module.id);
        
        return (
          <Collapsible
            key={module.id}
            open={isExpanded}
            onOpenChange={() => toggleModule(module.id)}
          >
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3 text-left">
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Checkbox
                          checked={selectionState === 'full'}
                          onCheckedChange={(checked) => handleSelectAllModule(module.id, !!checked)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        {selectionState === 'partial' && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-2 h-2 bg-blue-600 rounded-sm" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{module.label}</div>
                        <div className="text-xs text-gray-500">{module.name}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectionState !== 'none' && (
                      <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {Object.values(modulePerms).filter(Boolean).length}/4
                      </div>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="border-t bg-gray-50">
                <div className="p-4 space-y-3">
                  {permissionConfig.map((perm) => {
                    const Icon = perm.icon;
                    return (
                      <div key={perm.key} className="flex items-center space-x-3">
                        <Checkbox
                          checked={modulePerms[perm.key]}
                          onCheckedChange={(checked) => 
                            onPermissionChange(module.id, perm.key, !!checked)
                          }
                        />
                        <Icon className={`w-4 h-4 ${perm.color}`} />
                        <span className="text-sm text-gray-700">{perm.label}</span>
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        );
      })}
    </div>
  );
}
