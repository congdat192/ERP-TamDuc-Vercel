
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoucherConditionBuilder } from './VoucherConditionBuilder';
import { ConditionTemplateManager } from './ConditionTemplateManager';
import { ConditionRow, ConditionTemplate } from '../types/conditionBuilder';
import { Settings, Template } from 'lucide-react';

interface VoucherCodeCustomizationProps {
  onSettingsChange?: (settings: {
    codeLength: number;
    conditions: ConditionRow[];
  }) => void;
}

export function VoucherCodeCustomization({ onSettingsChange }: VoucherCodeCustomizationProps) {
  const [codeLength, setCodeLength] = useState(8);
  const [conditions, setConditions] = useState<ConditionRow[]>([]);

  const handleCodeLengthChange = (length: number) => {
    setCodeLength(length);
    onSettingsChange?.({
      codeLength: length,
      conditions
    });
  };

  const handleConditionsChange = (newConditions: ConditionRow[]) => {
    setConditions(newConditions);
    onSettingsChange?.({
      codeLength,
      conditions: newConditions
    });
  };

  const handleApplyTemplate = (template: ConditionTemplate) => {
    setConditions(template.conditionRows);
    onSettingsChange?.({
      codeLength,
      conditions: template.conditionRows
    });
  };

  const handleSaveAsTemplate = (templateName: string, conditionRows: ConditionRow[]) => {
    // In a real app, this would save to backend
    console.log('Saving template:', templateName, conditionRows);
    // Show success toast or notification
  };

  const handleCreateTemplate = (name: string, description: string) => {
    // In a real app, this would create a new template
    console.log('Creating new template:', name, description);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="condition-builder" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="condition-builder" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Điều Kiện Tạo Mã</span>
          </TabsTrigger>
          <TabsTrigger value="template-manager" className="flex items-center space-x-2">
            <Template className="w-4 h-4" />
            <span>Quản Lý Template</span>
          </TabsTrigger>
        </TabsList>

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
    </div>
  );
}
