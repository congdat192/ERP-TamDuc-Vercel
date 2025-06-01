
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Settings, 
  Info, 
  Eye, 
  Save,
  CheckCircle
} from 'lucide-react';
import { VoucherBatchSelector } from './VoucherBatchSelector';
import { ConditionValueMapping } from './ConditionValueMapping';
import { ConditionPriorityManager } from './ConditionPriorityManager';
import { ConditionTemplateManager } from './ConditionTemplateManager';
import { 
  ConditionValueMapping as ConditionValueMappingType,
  ConditionGroupPriority,
  ConditionTemplate,
  MOCK_VALUE_MAPPINGS,
  MOCK_GROUP_PRIORITIES
} from '../types/conditionBuilder';

type CodeGenerationMethod = 'manual' | 'mapping' | 'combined';

interface UnifiedVoucherCodeGeneratorProps {
  onSettingsChange?: (settings: any) => void;
}

export function UnifiedVoucherCodeGenerator({ onSettingsChange }: UnifiedVoucherCodeGeneratorProps) {
  const [selectedBatch, setSelectedBatch] = useState('');
  const [generationMethod, setGenerationMethod] = useState<CodeGenerationMethod>('manual');
  const [codeLength, setCodeLength] = useState(8);
  const [manualPrefix, setManualPrefix] = useState('');
  const [manualSuffix, setManualSuffix] = useState('');
  const [valueMappings, setValueMappings] = useState<ConditionValueMappingType[]>(MOCK_VALUE_MAPPINGS);
  const [groupPriorities, setGroupPriorities] = useState<ConditionGroupPriority[]>(MOCK_GROUP_PRIORITIES);
  const [showPreview, setShowPreview] = useState(true);

  const handleBatchChange = (batch: string) => {
    setSelectedBatch(batch);
  };

  const handleMethodChange = (method: CodeGenerationMethod) => {
    setGenerationMethod(method);
  };

  const generateCodePreview = () => {
    let prefix = '';
    let suffix = manualSuffix;
    
    if (generationMethod === 'manual') {
      prefix = manualPrefix;
    } else if (generationMethod === 'mapping') {
      // Generate prefix from mappings based on priority
      const activePriorities = groupPriorities.filter(p => p.active).sort((a, b) => a.priority - b.priority);
      const prefixParts: string[] = [];
      
      activePriorities.forEach(priority => {
        const mapping = valueMappings.find(m => 
          m.conditionType === priority.type && m.active
        );
        if (mapping) {
          prefixParts.push(mapping.code);
        }
      });
      
      prefix = prefixParts.join('');
    } else if (generationMethod === 'combined') {
      // Combine manual prefix with mapping
      const activePriorities = groupPriorities.filter(p => p.active).sort((a, b) => a.priority - b.priority);
      const mappingParts: string[] = [];
      
      activePriorities.forEach(priority => {
        const mapping = valueMappings.find(m => 
          m.conditionType === priority.type && m.active
        );
        if (mapping) {
          mappingParts.push(mapping.code);
        }
      });
      
      prefix = manualPrefix + mappingParts.join('');
    }
    
    const remainingLength = Math.max(1, codeLength - prefix.length - suffix.length);
    const randomPart = 'X'.repeat(remainingLength);
    
    return `${prefix}${randomPart}${suffix}`;
  };

  const handleSaveConfiguration = () => {
    const settings = {
      selectedBatch,
      generationMethod,
      codeLength,
      manualPrefix,
      manualSuffix,
      valueMappings,
      groupPriorities
    };
    
    onSettingsChange?.(settings);
    console.log('Voucher code configuration saved:', settings);
  };

  const isFormValid = () => {
    if (!selectedBatch || codeLength < 4) return false;
    
    if (generationMethod === 'manual') {
      return manualPrefix.length > 0;
    } else if (generationMethod === 'mapping') {
      return valueMappings.some(m => m.active) && groupPriorities.some(p => p.active);
    } else if (generationMethod === 'combined') {
      return manualPrefix.length > 0 && valueMappings.some(m => m.active) && groupPriorities.some(p => p.active);
    }
    
    return false;
  };

  const handleApplyTemplate = (template: ConditionTemplate) => {
    setValueMappings(template.valueMappings);
    setGroupPriorities(template.groupPriorities);
    if (generationMethod === 'manual') {
      setGenerationMethod('mapping');
    }
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Cấu Hình Tạo Mã Voucher</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Thiết lập cách thức tạo mã voucher cho đợt phát hành</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-4 h-4 mr-1" />
              {showPreview ? 'Ẩn' : 'Hiện'} Preview
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Batch Selection */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Bước 1
              </Badge>
              <h3 className="font-medium">Chọn Đợt Phát Hành</h3>
            </div>
            <VoucherBatchSelector
              selectedBatch={selectedBatch}
              onBatchChange={handleBatchChange}
            />
          </div>

          {/* Step 2: Generation Method */}
          {selectedBatch && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Bước 2
                </Badge>
                <h3 className="font-medium">Cách Tạo Mã Voucher</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    value: 'manual' as const,
                    title: 'Thủ Công',
                    description: 'Nhập prefix và suffix thủ công',
                    subtitle: 'Manual'
                  },
                  {
                    value: 'mapping' as const,
                    title: 'Theo Mapping',
                    description: 'Sử dụng quy tắc mapping điều kiện',
                    subtitle: 'By Mapping'
                  },
                  {
                    value: 'combined' as const,
                    title: 'Kết Hợp',
                    description: 'Kết hợp cả thủ công và mapping',
                    subtitle: 'Combined'
                  }
                ].map((method) => (
                  <Card 
                    key={method.value}
                    className={`cursor-pointer transition-all ${
                      generationMethod === method.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleMethodChange(method.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          generationMethod === method.value 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {generationMethod === method.value && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <h4 className="font-medium">{method.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{method.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{method.subtitle}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Code Length */}
          {selectedBatch && generationMethod && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Bước 3
                </Badge>
                <h3 className="font-medium">Độ Dài Mã Voucher</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="code-length">Số ký tự</Label>
                  <Input
                    id="code-length"
                    type="number"
                    min="4"
                    max="20"
                    value={codeLength}
                    onChange={(e) => setCodeLength(Number(e.target.value))}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Từ 4-20 ký tự</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Method-specific Configuration */}
          {selectedBatch && generationMethod && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Bước 4
                </Badge>
                <h3 className="font-medium">Cấu Hình Chi Tiết</h3>
              </div>

              {/* Manual Configuration */}
              {(generationMethod === 'manual' || generationMethod === 'combined') && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader className="pb-3">
                    <h4 className="font-medium text-orange-800">Cấu Hình Thủ Công</h4>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="manual-prefix">Ký tự đầu (Prefix)</Label>
                        <Input
                          id="manual-prefix"
                          value={manualPrefix}
                          onChange={(e) => setManualPrefix(e.target.value.toUpperCase())}
                          placeholder="VD: VCH, GIFT"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="manual-suffix">Ký tự cuối (Suffix)</Label>
                        <Input
                          id="manual-suffix"
                          value={manualSuffix}
                          onChange={(e) => setManualSuffix(e.target.value.toUpperCase())}
                          placeholder="VD: X, END"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Mapping Configuration */}
              {(generationMethod === 'mapping' || generationMethod === 'combined') && (
                <div className="space-y-4">
                  <ConditionValueMapping 
                    onMappingsChange={setValueMappings}
                  />
                  <ConditionPriorityManager
                    valueMappings={valueMappings}
                    onPriorityChange={setGroupPriorities}
                    codeLength={codeLength}
                  />
                </div>
              )}
            </div>
          )}

          {/* Live Preview */}
          {showPreview && selectedBatch && generationMethod && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <div className="space-y-2">
                  <h4 className="font-medium text-green-800">Live Preview Mã Voucher</h4>
                  <div className="text-sm">
                    <span className="text-gray-600">Đợt phát hành:</span>
                    <Badge variant="secondary" className="ml-2">{selectedBatch}</Badge>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Phương thức:</span>
                    <span className="ml-2 font-medium">
                      {generationMethod === 'manual' && 'Thủ công'}
                      {generationMethod === 'mapping' && 'Theo Mapping'}
                      {generationMethod === 'combined' && 'Kết hợp'}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Preview code:</span>
                    <code className="ml-2 bg-white px-3 py-1 rounded font-mono text-green-600 font-bold text-lg">
                      {generateCodePreview()}
                    </code>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Template Management */}
          {(generationMethod === 'mapping' || generationMethod === 'combined') && (
            <ConditionTemplateManager
              onApplyTemplate={handleApplyTemplate}
              onCreateTemplate={(name, description) => {
                console.log('Creating template:', name, description);
              }}
            />
          )}

          {/* Save Configuration */}
          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={handleSaveConfiguration}
              disabled={!isFormValid()}
              size="lg"
            >
              <Save className="w-4 h-4 mr-2" />
              Lưu Cấu Hình
            </Button>
          </div>

          {/* Form Validation Notice */}
          {!isFormValid() && selectedBatch && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <Info className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <div className="text-sm">
                  <div className="font-medium mb-1">Vui lòng hoàn thành các thông tin bắt buộc:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {!selectedBatch && <li>Chọn mã đợt phát hành</li>}
                    {codeLength < 4 && <li>Độ dài mã tối thiểu 4 ký tự</li>}
                    {generationMethod === 'manual' && !manualPrefix && <li>Nhập ký tự đầu (prefix)</li>}
                    {(generationMethod === 'mapping' || generationMethod === 'combined') && !valueMappings.some(m => m.active) && <li>Thiết lập ít nhất 1 mapping active</li>}
                    {(generationMethod === 'mapping' || generationMethod === 'combined') && !groupPriorities.some(p => p.active) && <li>Kích hoạt ít nhất 1 nhóm ưu tiên</li>}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
