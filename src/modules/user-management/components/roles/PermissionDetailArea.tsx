
import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight, Eye, Plus, Edit, Trash2 } from 'lucide-react';
import { ModuleInfo, ModulePermissions, CustomPermission } from '../../types/role-management';

interface PermissionDetailAreaProps {
  selectedModule: ModuleInfo | null;
  permissions: ModulePermissions;
  onPermissionChange: (moduleId: string, permission: keyof CustomPermission, value: boolean) => void;
}

// Mock sub-permissions structure for different modules
const moduleSubPermissions: Record<string, Array<{ id: string; label: string; permissions: Array<keyof CustomPermission> }>> = {
  inventory: [
    { id: 'overview', label: 'Tổng quan', permissions: ['view'] },
    { id: 'product-list', label: 'Danh sách hàng hóa', permissions: ['view', 'add', 'edit', 'delete'] },
    { id: 'price-setup', label: 'Thiết lập giá', permissions: ['view', 'add', 'edit', 'delete'] },
    { id: 'inventory-management', label: 'Quản lý tồn kho', permissions: ['view', 'add', 'edit'] }
  ],
  sales: [
    { id: 'overview', label: 'Tổng quan', permissions: ['view'] },
    { id: 'orders', label: 'Quản lý đơn hàng', permissions: ['view', 'add', 'edit', 'delete'] },
    { id: 'invoices', label: 'Hóa đơn', permissions: ['view', 'add', 'edit'] },
    { id: 'reports', label: 'Báo cáo bán hàng', permissions: ['view'] }
  ],
  customer: [
    { id: 'overview', label: 'Tổng quan', permissions: ['view'] },
    { id: 'customer-list', label: 'Danh sách khách hàng', permissions: ['view', 'add', 'edit', 'delete'] },
    { id: 'customer-groups', label: 'Nhóm khách hàng', permissions: ['view', 'add', 'edit', 'delete'] },
    { id: 'loyalty', label: 'Chương trình thành viên', permissions: ['view', 'edit'] }
  ]
};

const permissionConfig = [
  { key: 'view' as const, label: 'Xem', icon: Eye, color: 'text-blue-600' },
  { key: 'add' as const, label: 'Tạo', icon: Plus, color: 'text-green-600' },
  { key: 'edit' as const, label: 'Chỉnh sửa', icon: Edit, color: 'text-yellow-600' },
  { key: 'delete' as const, label: 'Xóa', icon: Trash2, color: 'text-red-600' }
];

export function PermissionDetailArea({ selectedModule, permissions, onPermissionChange }: PermissionDetailAreaProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

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

  const moduleSubPerms = moduleSubPermissions[selectedModule.name] || [];
  const modulePerms = permissions[selectedModule.id] || { view: false, add: false, edit: false, delete: false };

  const handlePermissionChange = (permissionKey: keyof CustomPermission, checked: boolean) => {
    onPermissionChange(selectedModule.id, permissionKey, checked);
  };

  return (
    <div className="h-full">
      <div className="border-b pb-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{selectedModule.label}</h3>
        <p className="text-sm text-gray-500 mt-1">Cấu hình quyền chi tiết cho module này</p>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[400px]">
        {moduleSubPerms.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const availablePerms = permissionConfig.filter(p => section.permissions.includes(p.key));
          
          return (
            <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <Collapsible open={isExpanded} onOpenChange={() => toggleSection(section.id)}>
                <CollapsibleTrigger className="w-full p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{section.label}</span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {availablePerms.map((perm) => {
                      const Icon = perm.icon;
                      return (
                        <div key={perm.key} className="flex items-center space-x-3 p-2 rounded border border-gray-100 hover:bg-gray-50">
                          <Checkbox
                            checked={modulePerms[perm.key]}
                            onCheckedChange={(checked) => handlePermissionChange(perm.key, !!checked)}
                          />
                          <Icon className={`w-4 h-4 ${perm.color}`} />
                          <span className="text-sm text-gray-700">{perm.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          );
        })}
      </div>
    </div>
  );
}
