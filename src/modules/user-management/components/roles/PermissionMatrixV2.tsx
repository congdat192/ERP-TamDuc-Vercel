import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModuleInfo, FeatureInfo, PermissionSelection } from '../../types/role-management';
import { Eye, Plus, Edit, Trash2, ChevronRight } from 'lucide-react';

interface PermissionMatrixV2Props {
  modules: ModuleInfo[];
  selections: PermissionSelection;
  onSelectionChange: (moduleId: string, featureCode: string, selected: boolean) => void;
}

const CRUD_TYPES = [
  { type: 'view', label: 'Xem', icon: Eye, color: 'text-blue-600' },
  { type: 'create', label: 'Thêm mới', icon: Plus, color: 'text-green-600' },
  { type: 'edit', label: 'Sửa', icon: Edit, color: 'text-yellow-600' },
  { type: 'delete', label: 'Xóa', icon: Trash2, color: 'text-red-600' }
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
          <tr className="bg-muted/50 border-t-2 border-border">
            <td 
              colSpan={5} 
              className="p-3 font-medium text-foreground"
              style={{ paddingLeft: `${paddingLeft + 12}px` }}
            >
              <div className="flex items-center space-x-2">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <span>{feature.name}</span>
                <Badge variant="outline" className="text-xs">
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
          className="p-3 text-sm text-foreground"
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
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Không có modules nào để cấu hình quyền
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b-2 border-border">
              <tr>
                <th className="text-left p-4 font-medium min-w-[250px] text-foreground">
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
                  <tr className="bg-primary/10 border-t-4 border-primary">
                    <td colSpan={5} className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
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
      </CardContent>
    </Card>
  );
}
