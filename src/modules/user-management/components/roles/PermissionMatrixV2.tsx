import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ModuleInfo, FeatureInfo, PermissionSelection } from '../../types/role-management';
import { Eye, Plus, Edit, Trash2, ChevronRight } from 'lucide-react';

interface PermissionMatrixV2Props {
  modules: ModuleInfo[];
  selections: PermissionSelection;
  onSelectionChange: (moduleId: string, featureCode: string, selected: boolean) => void;
}

const CRUD_TYPES = [
  { type: 'view', label: 'Xem', icon: Eye, color: 'theme-text-info' },
  { type: 'create', label: 'Thêm mới', icon: Plus, color: 'theme-text-success' },
  { type: 'edit', label: 'Sửa', icon: Edit, color: 'theme-text-warning' },
  { type: 'delete', label: 'Xóa', icon: Trash2, color: 'theme-text-danger' }
] as const;

export function PermissionMatrixV2({ modules, selections, onSelectionChange }: PermissionMatrixV2Props) {
  
  const renderFeatureRow = (
    moduleId: string, 
    feature: FeatureInfo, 
    isParent: boolean,
    level: number = 0
  ) => {
    const paddingLeft = level * 24; // Indent children
    const moduleSelections = selections[moduleId] || {};
    
    // For parent features, just show as header
    if (isParent && feature.children && feature.children.length > 0) {
      return (
        <React.Fragment key={feature.id}>
      {/* Parent Row */}
      <tr className="bg-muted/50 border-t-2 theme-border-primary-subtle border-b border-border">
        <td 
          colSpan={5} 
          className="p-3 font-semibold text-foreground sticky left-0 bg-muted/50 z-10"
          style={{ paddingLeft: `${paddingLeft + 12}px` }}
        >
          <div className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span>{feature.name}</span>
            <Badge variant="outline" className="text-xs ml-2">
              {feature.children.length} quyền
            </Badge>
          </div>
        </td>
      </tr>
          
          {/* Children Rows */}
          {feature.children.map(child => 
            renderFeatureRow(moduleId, child, false, level + 1)
          )}
        </React.Fragment>
      );
    }
    
    // For leaf features (actual permissions)
    return (
      <tr key={feature.id} className="border-b border-border hover:bg-accent/50 transition-colors">
        <td 
          className="p-3 text-sm text-foreground sticky left-0 bg-card z-10"
          style={{ paddingLeft: `${paddingLeft + 12}px` }}
        >
          <div className="flex items-center space-x-2">
            {level > 0 && <div className="w-4 h-4" />}
            <span>{feature.name}</span>
          </div>
        </td>
        
        {/* CRUD Checkboxes */}
        {CRUD_TYPES.map(({ type }) => {
          // Check if this feature matches the CRUD type
          const matchesType = feature.type === type || 
                             (type === 'create' && feature.code.includes('issue'));
          
          return (
            <td key={type} className="p-3 text-center">
              {matchesType ? (
                <Checkbox
                  checked={moduleSelections[feature.code] || false}
                  onCheckedChange={(checked) => 
                    onSelectionChange(moduleId, feature.code, !!checked)
                  }
                />
              ) : (
                <span className="text-muted-foreground/30">—</span>
              )}
            </td>
          );
        })}
      </tr>
    );
  };

  if (modules.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <div className="text-center text-muted-foreground">
          Không có modules nào để cấu hình quyền
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex-1 min-h-0">
      <table className="w-full">
        <thead className="theme-bg-primary-subtle border-b-2 theme-border-primary-subtle sticky top-0 z-30">
          <tr className="h-12">
            <th className="text-left p-4 font-medium min-w-[260px] text-foreground sticky left-0 theme-bg-primary-subtle z-40">
              Tính năng
            </th>
            {CRUD_TYPES.map(({ type, label, icon: Icon, color }) => (
              <th key={type} className="text-center p-4 font-medium min-w-[100px]">
                <div className="flex flex-col items-center space-y-1">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-xs text-foreground">{label}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {modules.map(module => (
            <React.Fragment key={module.id}>
              {/* Module Header */}
              <tr className="theme-bg-secondary-subtle border-t-4 theme-border-secondary-subtle sticky top-12 z-20">
                <td colSpan={5} className="p-4 sticky left-0 theme-bg-secondary-subtle z-20">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold shadow-sm">
                      {module.label.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{module.label}</div>
                      <div className="text-sm text-muted-foreground">{module.description}</div>
                    </div>
                  </div>
                </td>
              </tr>
                  
              {/* Feature Rows */}
              {module.featureTree.map(feature => 
                renderFeatureRow(module.id, feature, feature.type === 'parent', 0)
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
