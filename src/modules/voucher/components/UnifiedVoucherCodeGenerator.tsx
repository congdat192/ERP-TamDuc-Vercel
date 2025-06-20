
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
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
import { VoucherBatchManager } from './VoucherBatchManager';
import { TemplateManager } from './TemplateManager';
import { 
  ConditionValueMapping as ConditionValueMappingType,
  ConditionGroupPriority,
  MOCK_VALUE_MAPPINGS,
  MOCK_GROUP_PRIORITIES
} from '../types/conditionBuilder';
import { VoucherBatch } from '../types/voucherBatch';
import { toast } from '@/hooks/use-toast';

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
  const [autoIssue, setAutoIssue] = useState(false);
  const [valueMappings, setValueMappings] = useState<ConditionValueMappingType[]>(MOCK_VALUE_MAPPINGS);
  const [groupPriorities, setGroupPriorities] = useState<ConditionGroupPriority[]>(MOCK_GROUP_PRIORITIES);
  const [showPreview, setShowPreview] = useState(true);
  const [showMappingConfig, setShowMappingConfig] = useState(false);
  const [showBatchManager, setShowBatchManager] = useState(false);
  const [showTemplateManager, setShowTemplateManager] = useState(false);

  const handleBatchChange = (batch: string) => {
    setSelectedBatch(batch);
  };

  const handleMethodChange = (method: CodeGenerationMethod) => {
    setGenerationMethod(method);
    
    // Auto show/hide relevant sections
    if (method === 'mapping' || method === 'combined') {
      setShowMappingConfig(true);
    } else {
      setShowMappingConfig(false);
    }
  };

  const generateCodePreview = () => {
    let prefix = '';
    let suffix = manualSuffix;
    
    if (generationMethod === 'manual') {
      prefix = manualPrefix;
    } else if (generationMethod === 'mapping') {
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
      autoIssue,
      valueMappings,
      groupPriorities
    };
    
    onSettingsChange?.(settings);
    console.log('Voucher code configuration saved:', settings);
    
    toast({
      title: "Thành công",
      description: "Cấu hình tạo mã voucher đã được lưu thành công."
    });
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

  const handleApplyBatch = (batch: VoucherBatch) => {
    setManualPrefix(batch.codePrefix);
    setManualSuffix(batch.codeSuffix || '');
    setCodeLength(batch.codeLength);
    setSelectedBatch(batch.name);
    setGenerationMethod('manual');
    
    toast({
      title: "Áp dụng đợt phát hành",
      description: `Cấu hình từ đợt "${batch.name}" đã được áp dụng thành công.`
    });
  };

  const handleCreateBatch = (name: string, description: string) => {
    console.log('Creating voucher batch:', name, description);
    
    toast({
      title: "Tạo đợt phát hành",
      description: `Đợt "${name}" đã được tạo thành công.`
    });
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
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
                    <p>Thiết lập cách thức tạo mã voucher cho đợt phát hành từ KiotViet</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="w-4 h-4 mr-1" />
                {showPreview ? 'Ẩn' : 'Hiện'} Xem Trước
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step 1: Batch Selection from KiotViet */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Bước 1
                </Badge>
                <h3 className="font-medium">Chọn Đợt Phát Hành từ KiotViet</h3>
              </div>
              <VoucherBatchSelector
                selectedBatch={selectedBatch}
                onBatchChange={handleBatchChange}
              />
            </div>

            {/* Auto Issue Setting */}
            {selectedBatch && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-issue" className="font-medium">Tự động phát hành voucher khi khởi tạo</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Tự động phát hành voucher ngay khi tạo mới theo quy tắc đã cấu hình.
                    </p>
                  </div>
                  <Switch 
                    id="auto-issue" 
                    checked={autoIssue}
                    onCheckedChange={setAutoIssue}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Generation Method */}
            {selectedBatch && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Bước 2
                  </Badge>
                  <h3 className="font-medium">Quy Tắc Tạo Mã Voucher</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    {
                      value: 'manual' as const,
                      title: 'Thủ Công',
                      description: 'Nhập ký tự đầu và cuối cố định'
                    },
                    {
                      value: 'mapping' as const,
                      title: 'Theo Nguồn KH & Nhân Viên',
                      description: 'Tạo mã theo nguồn khách hàng và loại nhân viên'
                    },
                    {
                      value: 'combined' as const,
                      title: 'Kết Hợp',
                      description: 'Kết hợp cả thủ công và mapping nguồn'
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
                      <CardContent className="p-3">
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
                          <h4 className="font-medium text-sm">{method.title}</h4>
                        </div>
                        <p className="text-xs text-gray-600">{method.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Code Length */}
            {selectedBatch && generationMethod && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Bước 3
                  </Badge>
                  <h3 className="font-medium">Độ Dài Mã Voucher</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Bước 4
                  </Badge>
                  <h3 className="font-medium">Cấu Hình Chi Tiết</h3>
                </div>

                {/* Manual Configuration */}
                {(generationMethod === 'manual' || generationMethod === 'combined') && (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardHeader className="pb-2">
                      <h4 className="font-medium text-orange-800 text-sm">Cấu Hình Thủ Công</h4>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

                {/* Mapping Configuration Toggle */}
                {(generationMethod === 'mapping' || generationMethod === 'combined') && (
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowMappingConfig(!showMappingConfig)}
                      className="w-full"
                    >
                      {showMappingConfig ? 'Ẩn' : 'Hiện'} Cấu Hình Mapping Nguồn KH & Nhân Viên
                    </Button>
                    
                    {showMappingConfig && (
                      <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
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
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Preview */}
        {showPreview && selectedBatch && generationMethod && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div className="space-y-2">
                <h4 className="font-medium text-green-800">Xem Trước Mã Voucher</h4>
                <div className="text-sm">
                  <span className="text-gray-600">Đợt phát hành từ KiotViet:</span>
                  <Badge variant="secondary" className="ml-2">{selectedBatch}</Badge>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Quy tắc tạo mã:</span>
                  <span className="ml-2 font-medium">
                    {generationMethod === 'manual' && 'Thủ công'}
                    {generationMethod === 'mapping' && 'Theo Nguồn KH & Nhân Viên'}
                    {generationMethod === 'combined' && 'Kết hợp'}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Mã voucher mẫu:</span>
                  <code className="ml-2 bg-white px-2 py-1 rounded font-mono text-green-600 font-bold">
                    {generateCodePreview()}
                  </code>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Tự động phát hành:</span>
                  <span className="ml-2 font-medium">
                    {autoIssue ? 'Có' : 'Không'}
                  </span>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Additional Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Batch Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Quản Lý Đợt Phát Hành</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowBatchManager(!showBatchManager)}
                >
                  {showBatchManager ? 'Ẩn' : 'Hiện'}
                </Button>
              </CardTitle>
            </CardHeader>
            {showBatchManager && (
              <CardContent>
                <VoucherBatchManager
                  onApplyBatch={handleApplyBatch}
                  onCreateBatch={handleCreateBatch}
                />
              </CardContent>
            )}
          </Card>

          {/* Template Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Quản Lý Mẫu Tin Nhắn</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowTemplateManager(!showTemplateManager)}
                >
                  {showTemplateManager ? 'Ẩn' : 'Hiện'}
                </Button>
              </CardTitle>
            </CardHeader>
            {showTemplateManager && (
              <CardContent>
                <TemplateManager />
              </CardContent>
            )}
          </Card>
        </div>

        {/* Save Configuration */}
        <div className="flex justify-end pt-3 border-t">
          <Button 
            onClick={handleSaveConfiguration}
            disabled={!isFormValid()}
            size="lg"
          >
            <Save className="w-4 h-4 mr-2" />
            Lưu Cấu Hình Tạo Mã
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
                  {!selectedBatch && <li>Chọn đợt phát hành từ KiotViet</li>}
                  {codeLength < 4 && <li>Độ dài mã tối thiểu 4 ký tự</li>}
                  {generationMethod === 'manual' && !manualPrefix && <li>Nhập ký tự đầu (prefix)</li>}
                  {(generationMethod === 'mapping' || generationMethod === 'combined') && !valueMappings.some(m => m.active) && <li>Thiết lập ít nhất 1 mapping nguồn khách hàng/nhân viên</li>}
                  {(generationMethod === 'mapping' || generationMethod === 'combined') && !groupPriorities.some(p => p.active) && <li>Kích hoạt ít nhất 1 nhóm ưu tiên</li>}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </TooltipProvider>
  );
}
