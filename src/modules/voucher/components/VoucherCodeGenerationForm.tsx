
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Info, 
  Eye, 
  Save,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { VoucherBatchSelector } from './VoucherBatchSelector';
import { CollapsibleMappingSection } from './CollapsibleMappingSection';
import { 
  ConditionValueMapping as ConditionValueMappingType,
  ConditionGroupPriority,
  MOCK_VALUE_MAPPINGS,
  MOCK_GROUP_PRIORITIES
} from '../types/conditionBuilder';
import { toast } from '@/hooks/use-toast';

type CodeGenerationMethod = 'manual' | 'mapping' | 'hybrid';

interface VoucherCodeGenerationFormProps {
  onSettingsChange?: (settings: any) => void;
}

export function VoucherCodeGenerationForm({ onSettingsChange }: VoucherCodeGenerationFormProps) {
  const [selectedBatch, setSelectedBatch] = useState('');
  const [generationMethod, setGenerationMethod] = useState<CodeGenerationMethod>('manual');
  const [codeLength, setCodeLength] = useState(8);
  const [manualPrefix, setManualPrefix] = useState('');
  const [manualSuffix, setManualSuffix] = useState('');
  const [autoIssue, setAutoIssue] = useState(false);
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
    } else if (generationMethod === 'hybrid') {
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
    } else if (generationMethod === 'hybrid') {
      return manualPrefix.length > 0 && valueMappings.some(m => m.active) && groupPriorities.some(p => p.active);
    }
    
    return false;
  };

  return (
    <Card className="voucher-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 theme-text-primary" />
            <span className="theme-text">Cấu Hình Tạo Mã Voucher</span>
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
      <CardContent className="space-y-6">
        {/* Bước 1: Chọn Đợt Phát Hành */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Badge variant="default" className="theme-badge-primary">
              Bước 1
            </Badge>
            <h3 className="font-medium theme-text">Chọn Đợt Phát Hành</h3>
          </div>
          <VoucherBatchSelector
            selectedBatch={selectedBatch}
            onBatchChange={handleBatchChange}
          />
        </div>

        {/* Bước 2: Chọn Phương Thức Tạo Mã */}
        {selectedBatch && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="theme-badge-primary">
                Bước 2
              </Badge>
              <h3 className="font-medium theme-text">Cách Tạo Mã Voucher</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  value: 'manual' as const,
                  title: 'Thủ Công',
                  description: 'Nhập ký tự đầu và cuối thủ công'
                },
                {
                  value: 'mapping' as const,
                  title: 'Theo Mapping',
                  description: 'Sử dụng quy tắc mapping điều kiện'
                },
                {
                  value: 'hybrid' as const,
                  title: 'Kết Hợp',
                  description: 'Kết hợp cả thủ công và mapping'
                }
              ].map((method) => (
                <Card 
                  key={method.value}
                  className={`cursor-pointer transition-all voucher-card ${
                    generationMethod === method.value 
                      ? 'berry-primary-100 border-2 theme-border-primary' 
                      : 'hover:berry-primary-50'
                  }`}
                  onClick={() => handleMethodChange(method.value)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                        generationMethod === method.value 
                          ? 'berry-primary border-transparent' 
                          : 'border-gray-300'
                      }`}>
                        {generationMethod === method.value && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <h4 className="font-medium text-sm theme-text">{method.title}</h4>
                    </div>
                    <p className="text-xs theme-text-muted">{method.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Bước 3: Cấu Hình Chi Tiết */}
        {selectedBatch && generationMethod && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="theme-badge-primary">
                Bước 3
              </Badge>
              <h3 className="font-medium theme-text">Cấu Hình Chi Tiết</h3>
            </div>

            {/* Độ dài mã */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="code-length" className="theme-text">Độ dài mã voucher</Label>
                <Input
                  id="code-length"
                  type="number"
                  min="4"
                  max="20"
                  value={codeLength}
                  onChange={(e) => setCodeLength(Number(e.target.value))}
                  className="mt-1 voucher-input"
                />
                <p className="text-xs theme-text-muted mt-1">Từ 4-20 ký tự</p>
              </div>
            </div>

            {/* Tự động phát hành */}
            <div className="p-3 berry-warning-light rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-issue" className="font-medium theme-text">Tự động phát hành voucher khi khởi tạo</Label>
                  <p className="text-sm theme-text-muted mt-1">
                    Tự động phát hành voucher ngay khi tạo mới, không cần duyệt thủ công.
                  </p>
                </div>
                <Switch 
                  id="auto-issue" 
                  checked={autoIssue}
                  onCheckedChange={setAutoIssue}
                />
              </div>
            </div>

            {/* Cấu hình thủ công */}
            {(generationMethod === 'manual' || generationMethod === 'hybrid') && (
              <Card className="berry-secondary-light">
                <CardHeader className="pb-3">
                  <h4 className="font-medium theme-text text-sm">Cấu Hình Thủ Công</h4>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="manual-prefix" className="theme-text">Ký tự đầu (Prefix)</Label>
                      <Input
                        id="manual-prefix"
                        value={manualPrefix}
                        onChange={(e) => setManualPrefix(e.target.value.toUpperCase())}
                        placeholder="VD: VCH, GIFT"
                        className="mt-1 voucher-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="manual-suffix" className="theme-text">Ký tự cuối (Suffix)</Label>
                      <Input
                        id="manual-suffix"
                        value={manualSuffix}
                        onChange={(e) => setManualSuffix(e.target.value.toUpperCase())}
                        placeholder="VD: X, END"
                        className="mt-1 voucher-input"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cấu hình mapping */}
            {(generationMethod === 'mapping' || generationMethod === 'hybrid') && (
              <div className="space-y-3">
                <CollapsibleMappingSection
                  valueMappings={valueMappings}
                  groupPriorities={groupPriorities}
                  onMappingsChange={setValueMappings}
                  onPriorityChange={setGroupPriorities}
                  codeLength={codeLength}
                />
              </div>
            )}
          </div>
        )}

        {/* Xem trước */}
        {showPreview && selectedBatch && generationMethod && (
          <Alert className="voucher-alert-success">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <h4 className="font-medium theme-text">Xem Trước Mã Voucher</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="theme-text-muted">Đợt phát hành:</span>
                    <Badge variant="secondary" className="ml-2 theme-badge-secondary">{selectedBatch}</Badge>
                  </div>
                  <div>
                    <span className="theme-text-muted">Phương thức:</span>
                    <span className="ml-2 font-medium theme-text">
                      {generationMethod === 'manual' && 'Thủ công'}
                      {generationMethod === 'mapping' && 'Theo Mapping'}
                      {generationMethod === 'hybrid' && 'Kết hợp'}
                    </span>
                  </div>
                  <div>
                    <span className="theme-text-muted">Mã voucher mẫu:</span>
                    <code className="ml-2 bg-white px-2 py-1 rounded font-mono theme-text-primary font-bold">
                      {generateCodePreview()}
                    </code>
                  </div>
                  <div>
                    <span className="theme-text-muted">Tự động phát hành:</span>
                    <span className="ml-2 font-medium theme-text">
                      {autoIssue ? 'Có' : 'Không'}
                    </span>
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Lưu cấu hình */}
        <div className="flex justify-end pt-3 border-t theme-border-primary/20">
          <Button 
            onClick={handleSaveConfiguration}
            disabled={!isFormValid()}
            size="lg"
            variant="default"
          >
            <Save className="w-4 h-4 mr-2" />
            Lưu Cấu Hình
          </Button>
        </div>

        {/* Thông báo validation */}
        {!isFormValid() && selectedBatch && (
          <Alert className="voucher-alert-warning">
            <Info className="h-4 w-4" />
            <AlertDescription className="theme-text">
              <div className="text-sm">
                <div className="font-medium mb-1">Vui lòng hoàn thành các thông tin bắt buộc:</div>
                <ul className="list-disc list-inside space-y-1">
                  {!selectedBatch && <li>Chọn mã đợt phát hành</li>}
                  {codeLength < 4 && <li>Độ dài mã tối thiểu 4 ký tự</li>}
                  {generationMethod === 'manual' && !manualPrefix && <li>Nhập ký tự đầu (prefix)</li>}
                  {(generationMethod === 'mapping' || generationMethod === 'hybrid') && !valueMappings.some(m => m.active) && <li>Thiết lập ít nhất 1 mapping hoạt động</li>}
                  {(generationMethod === 'mapping' || generationMethod === 'hybrid') && !groupPriorities.some(p => p.active) && <li>Kích hoạt ít nhất 1 nhóm ưu tiên</li>}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
