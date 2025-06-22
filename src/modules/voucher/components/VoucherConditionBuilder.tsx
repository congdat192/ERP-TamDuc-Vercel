import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Plus, 
  Trash2, 
  GripVertical, 
  Info, 
  Eye, 
  ChevronUp, 
  ChevronDown,
  Save
} from 'lucide-react';
import { ConditionRow, VoucherCondition, CONDITION_TYPES, MOCK_CONDITION_VALUES } from '../types/conditionBuilder';
import { cn } from '@/lib/utils';

interface VoucherConditionBuilderProps {
  codeLength: number;
  onCodeLengthChange: (length: number) => void;
  onConditionsChange?: (conditions: ConditionRow[]) => void;
  onSaveAsTemplate?: (templateName: string, conditions: ConditionRow[]) => void;
}

export function VoucherConditionBuilder({ 
  codeLength, 
  onCodeLengthChange,
  onConditionsChange,
  onSaveAsTemplate
}: VoucherConditionBuilderProps) {
  const [conditionRows, setConditionRows] = useState<ConditionRow[]>([
    {
      id: 'default',
      field: '', // Add missing field
      operator: 'equals', // Add missing operator  
      value: '', // Add missing value
      conditions: [],
      prefix: 'VCH',
      suffix: '',
      priority: 999,
      isDefault: true
    }
  ]);
  
  const [showPreview, setShowPreview] = useState(true);
  const [templateName, setTemplateName] = useState('');
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);

  const addConditionRow = () => {
    const newRow: ConditionRow = {
      id: `row-${Date.now()}`,
      field: '', // Add missing field
      operator: 'equals', // Add missing operator
      value: '', // Add missing value
      conditions: [],
      prefix: '',
      suffix: '',
      priority: conditionRows.length
    };
    setConditionRows([...conditionRows.filter(row => !row.isDefault), newRow, ...conditionRows.filter(row => row.isDefault)]);
  };

  const removeConditionRow = (rowId: string) => {
    setConditionRows(conditionRows.filter(row => row.id !== rowId));
  };

  const updateConditionRow = (rowId: string, updates: Partial<ConditionRow>) => {
    setConditionRows(conditionRows.map(row => 
      row.id === rowId ? { ...row, ...updates } : row
    ));
  };

  const addCondition = (rowId: string) => {
    const newCondition: VoucherCondition = {
      id: `condition-${Date.now()}`,
      type: 'customerType',
      operator: 'equals', // Add missing operator
      value: '',
      label: ''
    };
    
    updateConditionRow(rowId, {
      conditions: [...(conditionRows.find(row => row.id === rowId)?.conditions || []), newCondition]
    });
  };

  const removeCondition = (rowId: string, conditionId: string) => {
    const row = conditionRows.find(r => r.id === rowId);
    if (row) {
      updateConditionRow(rowId, {
        conditions: row.conditions.filter(c => c.id !== conditionId)
      });
    }
  };

  const updateCondition = (rowId: string, conditionId: string, updates: Partial<VoucherCondition>) => {
    const row = conditionRows.find(r => r.id === rowId);
    if (row) {
      updateConditionRow(rowId, {
        conditions: row.conditions.map(c => 
          c.id === conditionId ? { ...c, ...updates } : c
        )
      });
    }
  };

  const moveRowUp = (rowId: string) => {
    const index = conditionRows.findIndex(row => row.id === rowId);
    if (index > 0 && !conditionRows[index].isDefault) {
      const newRows = [...conditionRows];
      [newRows[index], newRows[index - 1]] = [newRows[index - 1], newRows[index]];
      setConditionRows(newRows);
    }
  };

  const moveRowDown = (rowId: string) => {
    const index = conditionRows.findIndex(row => row.id === rowId);
    if (index < conditionRows.length - 2 && !conditionRows[index].isDefault) {
      const newRows = [...conditionRows];
      [newRows[index], newRows[index + 1]] = [newRows[index + 1], newRows[index]];
      setConditionRows(newRows);
    }
  };

  const generateCodePreview = (row: ConditionRow) => {
    const randomPart = 'X'.repeat(Math.max(1, codeLength - row.prefix.length - row.suffix.length));
    return `${row.prefix}${randomPart}${row.suffix}`;
  };

  const getConditionDescription = (row: ConditionRow) => {
    if (row.isDefault) {
      return 'Điều kiện mặc định (fallback) khi không có điều kiện nào khớp';
    }
    
    if (row.conditions.length === 0) {
      return 'Chưa có điều kiện nào được thiết lập';
    }
    
    return row.conditions.map(condition => {
      const typeLabel = CONDITION_TYPES.find(t => t.value === condition.type)?.label || condition.type;
      const valueLabel = condition.label || condition.value || 'Chưa chọn';
      return `${typeLabel} = ${valueLabel}`;
    }).join(' VÀ ');
  };

  const handleSaveAsTemplate = () => {
    if (templateName.trim() && onSaveAsTemplate) {
      onSaveAsTemplate(templateName.trim(), conditionRows);
      setTemplateName('');
      setShowSaveTemplate(false);
    }
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Điều kiện tạo mã voucher</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Thiết lập điều kiện tự động tạo mã voucher dựa trên thông tin khách hàng và nhân viên</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="w-4 h-4 mr-1" />
                {showPreview ? 'Ẩn' : 'Hiện'} Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveTemplate(!showSaveTemplate)}
              >
                <Save className="w-4 h-4 mr-1" />
                Lưu Template
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Code Length Setting */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="code-length">Độ dài mã voucher</Label>
              <Input
                id="code-length"
                type="number"
                min="4"
                max="20"
                value={codeLength}
                onChange={(e) => onCodeLengthChange(Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Từ 4-20 ký tự</p>
            </div>
          </div>

          {/* Save as Template */}
          {showSaveTemplate && (
            <Alert>
              <Save className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    placeholder="Nhập tên template..."
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleSaveAsTemplate} disabled={!templateName.trim()}>
                    Lưu
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setShowSaveTemplate(false);
                      setTemplateName('');
                    }}
                  >
                    Hủy
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Add Condition Row Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Điều kiện tạo mã</h3>
            <Button onClick={addConditionRow} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Thêm điều kiện
            </Button>
          </div>

          {/* Condition Rows */}
          <div className="space-y-4">
            {conditionRows.map((row, index) => (
              <Card key={row.id} className={cn(
                "border-2", 
                row.isDefault ? "border-yellow-200 bg-yellow-50" : "border-gray-200"
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {!row.isDefault && (
                        <div className="flex flex-col">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveRowUp(row.id)}
                            disabled={index === 0}
                            className="h-4 w-6 p-0"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveRowDown(row.id)}
                            disabled={index >= conditionRows.length - 2}
                            className="h-4 w-6 p-0"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <Badge variant={row.isDefault ? "secondary" : "default"}>
                        {row.isDefault ? 'Mặc định' : `Ưu tiên ${index + 1}`}
                      </Badge>
                    </div>
                    {!row.isDefault && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeConditionRow(row.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{getConditionDescription(row)}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Conditions */}
                  {!row.isDefault && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Điều kiện (tối đa 3)</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addCondition(row.id)}
                          disabled={row.conditions.length >= 3}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Thêm
                        </Button>
                      </div>
                      
                      {row.conditions.map((condition) => (
                        <div key={condition.id} className="flex items-center space-x-2 p-3 border rounded-lg bg-gray-50">
                          <Select
                            value={condition.type}
                            onValueChange={(value: any) => updateCondition(row.id, condition.id, { type: value, value: '', label: '' })}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CONDITION_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Select
                            value={Array.isArray(condition.value) ? condition.value[0] : condition.value}
                            onValueChange={(value) => {
                              const values = MOCK_CONDITION_VALUES[condition.type];
                              const option = Array.isArray(values) ? values.find(v => v.value === value) : null;
                              const label = option?.label || value;
                              updateCondition(row.id, condition.id, { value, label });
                            }}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Chọn giá trị..." />
                            </SelectTrigger>
                            <SelectContent>
                              {(() => {
                                const values = MOCK_CONDITION_VALUES[condition.type];
                                return Array.isArray(values) ? values.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                )) : null;
                              })()}
                            </SelectContent>
                          </Select>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCondition(row.id, condition.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Prefix & Suffix */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`prefix-${row.id}`}>Ký tự đầu</Label>
                      <Input
                        id={`prefix-${row.id}`}
                        value={row.prefix}
                        onChange={(e) => updateConditionRow(row.id, { prefix: e.target.value })}
                        placeholder="VD: VIP"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`suffix-${row.id}`}>Ký tự cuối</Label>
                      <Input
                        id={`suffix-${row.id}`}
                        value={row.suffix}
                        onChange={(e) => updateConditionRow(row.id, { suffix: e.target.value })}
                        placeholder="VD: X"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  {/* Preview */}
                  {showPreview && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">
                        Preview: <code className="bg-white px-2 py-1 rounded text-blue-600">
                          {generateCodePreview(row)}
                        </code>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Configuration History */}
          <div className="text-xs text-gray-500 pt-4 border-t">
            Lần cập nhật cuối: Hôm nay lúc 16:20 bởi John Doe
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
