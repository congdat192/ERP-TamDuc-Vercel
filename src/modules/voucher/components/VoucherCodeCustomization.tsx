
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { VoucherConditionBuilder } from './VoucherConditionBuilder';
import { ConditionTemplateManager } from './ConditionTemplateManager';
import { ConditionValueMapping } from './ConditionValueMapping';
import { ConditionPriorityManager } from './ConditionPriorityManager';
import { 
  ConditionRow, 
  ConditionTemplate,
  ConditionValueMapping as ConditionValueMappingType,
  ConditionGroupPriority,
  MOCK_VALUE_MAPPINGS,
  MOCK_GROUP_PRIORITIES
} from '../types/conditionBuilder';
import { Settings, FileText, MapPin, ArrowUpDown, Info } from 'lucide-react';

interface VoucherCodeCustomizationProps {
  selectedBatch?: string;
  onSettingsChange?: (settings: {
    codeLength: number;
    conditions: ConditionRow[];
    valueMappings: ConditionValueMappingType[];
    groupPriorities: ConditionGroupPriority[];
  }) => void;
}

export function VoucherCodeCustomization({ 
  selectedBatch,
  onSettingsChange 
}: VoucherCodeCustomizationProps) {
  const [codeLength, setCodeLength] = useState(8);
  const [conditions, setConditions] = useState<ConditionRow[]>([]);
  const [valueMappings, setValueMappings] = useState<ConditionValueMappingType[]>(MOCK_VALUE_MAPPINGS);
  const [groupPriorities, setGroupPriorities] = useState<ConditionGroupPriority[]>(MOCK_GROUP_PRIORITIES);

  const handleCodeLengthChange = (length: number) => {
    setCodeLength(length);
    notifyChange(length, conditions, valueMappings, groupPriorities);
  };

  const handleConditionsChange = (newConditions: ConditionRow[]) => {
    setConditions(newConditions);
    notifyChange(codeLength, newConditions, valueMappings, groupPriorities);
  };

  const handleValueMappingsChange = (newMappings: ConditionValueMappingType[]) => {
    setValueMappings(newMappings);
    notifyChange(codeLength, conditions, newMappings, groupPriorities);
  };

  const handleGroupPrioritiesChange = (newPriorities: ConditionGroupPriority[]) => {
    setGroupPriorities(newPriorities);
    notifyChange(codeLength, conditions, valueMappings, newPriorities);
  };

  const notifyChange = (
    length: number, 
    conds: ConditionRow[], 
    mappings: ConditionValueMappingType[], 
    priorities: ConditionGroupPriority[]
  ) => {
    onSettingsChange?.({
      codeLength: length,
      conditions: conds,
      valueMappings: mappings,
      groupPriorities: priorities
    });
  };

  const handleApplyTemplate = (template: ConditionTemplate) => {
    setConditions(template.conditionRows);
    if (template.valueMappings) {
      setValueMappings(template.valueMappings);
    }
    if (template.groupPriorities) {
      setGroupPriorities(template.groupPriorities);
    }
    notifyChange(codeLength, template.conditionRows, template.valueMappings || valueMappings, template.groupPriorities || groupPriorities);
  };

  const handleSaveAsTemplate = (templateName: string, conditionRows: ConditionRow[]) => {
    const template: ConditionTemplate = {
      id: `template-${Date.now()}`,
      name: templateName,
      conditionRows,
      valueMappings,
      groupPriorities,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Saving template:', template);
    // In a real app, this would save to backend
  };

  const handleCreateTemplate = (name: string, description: string) => {
    const template: ConditionTemplate = {
      id: `template-${Date.now()}`,
      name,
      description,
      conditionRows: conditions,
      valueMappings,
      groupPriorities,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Creating new template:', template);
    // In a real app, this would save to backend
  };

  return (
    <div className="space-y-6">
      {/* Batch Context Alert */}
      {selectedBatch && (
        <Alert className="voucher-alert-info">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center space-x-2">
              <span>Bạn đang cấu hình mã voucher cho đợt phát hành:</span>
              <Badge variant="secondary" className="theme-badge-secondary">
                {selectedBatch}
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="mapping" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger 
            value="mapping" 
            className="voucher-tabs-trigger flex items-center space-x-2"
          >
            <MapPin className="w-4 h-4" />
            <span>Mapping Giá Trị</span>
          </TabsTrigger>
          <TabsTrigger 
            value="priority" 
            className="voucher-tabs-trigger flex items-center space-x-2"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>Thứ Tự Ưu Tiên</span>
          </TabsTrigger>
          <TabsTrigger 
            value="condition-builder" 
            className="voucher-tabs-trigger flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Điều Kiện Chi Tiết</span>
          </TabsTrigger>
          <TabsTrigger 
            value="template-manager" 
            className="voucher-tabs-trigger flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>Quản Lý Template</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mapping" className="space-y-4">
          <ConditionValueMapping 
            onMappingsChange={handleValueMappingsChange}
          />
        </TabsContent>

        <TabsContent value="priority" className="space-y-4">
          <ConditionPriorityManager
            valueMappings={valueMappings}
            onPriorityChange={handleGroupPrioritiesChange}
            codeLength={codeLength}
          />
        </TabsContent>

        <TabsContent value="condition-builder" className="space-y-4">
          <VoucherConditionBuilder
            codeLength={codeLength}
            onCodeLengthChange={handleCodeLengthChange}
            onConditionsChange={handleConditionsChange}
            onSaveAsTemplate={handleSaveAsTemplate}
          />
        </TabsContent>

        <TabsContent value="template-manager" className="space-y-4">
          <ConditionTemplateManager
            onApplyTemplate={handleApplyTemplate}
            onCreateTemplate={handleCreateTemplate}
          />
        </TabsContent>
      </Tabs>

      {/* Configuration Summary */}
      <Card className="voucher-card">
        <CardHeader>
          <CardTitle className="text-sm theme-text">Tóm Tắt Cấu Hình</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="theme-text-muted">Độ dài mã:</span>
              <span className="ml-2 font-medium theme-text">{codeLength} ký tự</span>
            </div>
            <div>
              <span className="theme-text-muted">Số điều kiện:</span>
              <span className="ml-2 font-medium theme-text">{conditions.length} điều kiện</span>
            </div>
            <div>
              <span className="theme-text-muted">Value mappings:</span>
              <span className="ml-2 font-medium theme-text">{valueMappings.filter(m => m.active).length} active</span>
            </div>
            <div>
              <span className="theme-text-muted">Priority groups:</span>
              <span className="ml-2 font-medium theme-text">{groupPriorities.filter(p => p.active).length} active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
