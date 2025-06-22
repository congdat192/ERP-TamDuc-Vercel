
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  Info, 
  Eye, 
  Save,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  FileText,
  ArrowRight
} from 'lucide-react';
import { VoucherBatchSelector } from './VoucherBatchSelector';
import { AdvancedMappingConfiguration } from './AdvancedMappingConfiguration';
import { 
  ConditionValueMapping as ConditionValueMappingType,
  ConditionGroupPriority,
  MOCK_VALUE_MAPPINGS,
  MOCK_GROUP_PRIORITIES
} from '../types/conditionBuilder';
import { VoucherBatch } from '../types/voucherBatch';
import { toast } from '@/hooks/use-toast';

type CodeGenerationMethod = 'manual' | 'mapping' | 'combined';

interface CreateVoucherBatchFormProps {
  onSave: (batch: VoucherBatch, config: any) => void;
  onCancel: () => void;
}

export function CreateVoucherBatchForm({ onSave, onCancel }: CreateVoucherBatchFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Step 1: Basic Info + KiotViet Selection
  const [batchName, setBatchName] = useState('');
  const [batchDescription, setBatchDescription] = useState('');
  const [selectedKiotVietBatch, setSelectedKiotVietBatch] = useState('');

  // Step 2: Basic Code Configuration
  const [codeLength, setCodeLength] = useState(8);
  const [manualPrefix, setManualPrefix] = useState('');
  const [manualSuffix, setManualSuffix] = useState('');
  const [autoIssue, setAutoIssue] = useState(false);

  // Step 3: Generation Method
  const [generationMethod, setGenerationMethod] = useState<CodeGenerationMethod>('manual');

  // Step 4: Advanced Mapping
  const [valueMappings, setValueMappings] = useState<ConditionValueMappingType[]>(MOCK_VALUE_MAPPINGS);
  const [groupPriorities, setGroupPriorities] = useState<ConditionGroupPriority[]>(MOCK_GROUP_PRIORITIES);

  // Step 5: Preview & Validation
  const [showPreview, setShowPreview] = useState(true);

  const stepTitles = [
    'Thông Tin Cơ Bản',
    'Cấu Hình Mã Voucher',
    'Phương Thức Tạo Mã',
    'Mapping Nâng Cao', 
    'Xem Trước & Lưu'
  ];

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

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return batchName.trim() && selectedKiotVietBatch;
      case 2:
        return codeLength >= 4 && manualPrefix.trim();
      case 3:
        return true; // Generation method is always selected
      case 4:
        if (generationMethod === 'manual') return true;
        return valueMappings.some(m => m.active) && groupPriorities.some(p => p.active);
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNextStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    const newBatch: VoucherBatch = {
      id: `batch-${Date.now()}`,
      name: batchName.trim(),
      description: batchDescription.trim(),
      codePrefix: manualPrefix.trim().toUpperCase(),
      codeSuffix: manualSuffix?.trim().toUpperCase() || '',
      codeLength: codeLength,
      isActive: true,
      isDefault: false,
      createdBy: 'Người dùng hiện tại',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const config = {
      selectedKiotVietBatch,
      generationMethod,
      autoIssue,
      valueMappings,
      groupPriorities
    };

    onSave(newBatch, config);
    
    toast({
      title: "Tạo thành công",
      description: `Đợt phát hành "${batchName}" đã được tạo thành công.`
    });
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold theme-text">Thông Tin Đợt Phát Hành</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="batch-name" className="theme-text">Tên đợt phát hành *</Label>
            <Input
              id="batch-name"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              placeholder="VD: Đợt Tết 2024, Đợt VIP..."
              className="mt-1 voucher-input"
            />
          </div>
          <div>
            <Label htmlFor="batch-description" className="theme-text">Mô tả</Label>
            <Textarea
              id="batch-description"
              value={batchDescription}
              onChange={(e) => setBatchDescription(e.target.value)}
              placeholder="Mô tả về đợt phát hành này..."
              className="mt-1 voucher-input"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold theme-text">Liên Kết Với KiotViet</h3>
        <VoucherBatchSelector
          selectedBatch={selectedKiotVietBatch}
          onBatchChange={setSelectedKiotVietBatch}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold theme-text">Cấu Hình Mã Voucher Cơ Bản</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="code-prefix" className="theme-text">Ký tự đầu (Prefix) *</Label>
          <Input
            id="code-prefix"
            value={manualPrefix}
            onChange={(e) => setManualPrefix(e.target.value.toUpperCase())}
            placeholder="VD: VCH, TET24"
            className="mt-1 voucher-input"
          />
        </div>
        <div>
          <Label htmlFor="code-suffix" className="theme-text">Ký tự cuối (Suffix)</Label>
          <Input
            id="code-suffix"
            value={manualSuffix}
            onChange={(e) => setManualSuffix(e.target.value.toUpperCase())}
            placeholder="VD: X, END"
            className="mt-1 voucher-input"
          />
        </div>
        <div>
          <Label htmlFor="code-length" className="theme-text">Độ dài tổng</Label>
          <Input
            id="code-length"
            type="number"
            min="4"
            max="20"
            value={codeLength}
            onChange={(e) => setCodeLength(Number(e.target.value))}
            className="mt-1 voucher-input"
          />
        </div>
      </div>

      <div className="p-4 berry-warning-light rounded-lg">
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
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold theme-text">Chọn Phương Thức Tạo Mã</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            value: 'manual' as const,
            title: 'Thủ Công',
            description: 'Sử dụng prefix/suffix cố định đã cấu hình'
          },
          {
            value: 'mapping' as const,
            title: 'Mapping Điều Kiện',
            description: 'Tạo mã theo nguồn KH, loại KH, nhân viên'
          },
          {
            value: 'combined' as const,
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
            onClick={() => setGenerationMethod(method.value)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
                  generationMethod === method.value 
                    ? 'berry-primary border-transparent' 
                    : 'border-gray-300'
                }`}>
                  {generationMethod === method.value && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
                <h4 className="font-medium theme-text">{method.title}</h4>
              </div>
              <p className="text-sm theme-text-muted">{method.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {generationMethod !== 'manual' && (
        <Alert className="voucher-alert-info">
          <Info className="h-4 w-4" />
          <AlertDescription className="theme-text">
            Bạn đã chọn phương thức <strong>{generationMethod === 'mapping' ? 'Mapping Điều Kiện' : 'Kết Hợp'}</strong>. 
            Ở bước tiếp theo, bạn sẽ cấu hình các quy tắc mapping chi tiết.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold theme-text">Cấu Hình Mapping Nâng Cao</h3>
      
      {generationMethod === 'manual' ? (
        <Alert className="voucher-alert-success">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="theme-text">
            Bạn đã chọn phương thức <strong>Thủ Công</strong>. Không cần cấu hình mapping bổ sung.
            Mã voucher sẽ được tạo theo prefix/suffix đã thiết lập.
          </AlertDescription>
        </Alert>
      ) : (
        <AdvancedMappingConfiguration
          generationMethod={generationMethod}
          valueMappings={valueMappings}
          groupPriorities={groupPriorities}
          onMappingsChange={setValueMappings}
          onPriorityChange={setGroupPriorities}
          codeLength={codeLength}
        />
      )}
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold theme-text">Xem Trước & Xác Nhận</h3>
      
      <Card className="voucher-card">
        <CardHeader>
          <CardTitle className="text-base theme-text">Tóm Tắt Cấu Hình</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm theme-text-muted">Tên đợt:</span>
              <p className="font-medium theme-text">{batchName}</p>
            </div>
            <div>
              <span className="text-sm theme-text-muted">KiotViet Batch:</span>
              <Badge variant="secondary" className="theme-badge-secondary">{selectedKiotVietBatch}</Badge>
            </div>
            <div>
              <span className="text-sm theme-text-muted">Phương thức:</span>
              <p className="font-medium theme-text">
                {generationMethod === 'manual' && 'Thủ công'}
                {generationMethod === 'mapping' && 'Mapping điều kiện'}
                {generationMethod === 'combined' && 'Kết hợp'}
              </p>
            </div>
            <div>
              <span className="text-sm theme-text-muted">Tự động phát hành:</span>
              <p className="font-medium theme-text">{autoIssue ? 'Có' : 'Không'}</p>
            </div>
          </div>
          
          {batchDescription && (
            <div>
              <span className="text-sm theme-text-muted">Mô tả:</span>
              <p className="text-sm theme-text mt-1">{batchDescription}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Alert className="voucher-alert-success">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <h4 className="font-medium theme-text">Mã Voucher Mẫu</h4>
            <div className="text-sm">
              <code className="bg-white px-3 py-2 rounded font-mono theme-text-primary font-bold text-lg">
                {generateCodePreview()}
              </code>
            </div>
            <p className="text-sm theme-text-muted">
              Đây là mẫu mã voucher sẽ được tạo theo cấu hình của bạn.
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold theme-text flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Tạo Đợt Phát Hành Mới</span>
          </h2>
          <Badge variant="outline" className="theme-badge-secondary">
            Bước {currentStep}/{totalSteps}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
          <div className="flex justify-between text-xs theme-text-muted">
            {stepTitles.map((title, index) => (
              <span 
                key={index}
                className={index + 1 === currentStep ? 'theme-text-primary font-medium' : ''}
              >
                {title}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <Card className="voucher-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 theme-text-primary" />
            <span className="theme-text">{stepTitles[currentStep - 1]}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderCurrentStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onCancel : handlePrevious}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{currentStep === 1 ? 'Hủy' : 'Quay lại'}</span>
        </Button>

        {currentStep < totalSteps ? (
          <Button
            onClick={handleNext}
            disabled={!canProceedToNextStep()}
            className="flex items-center space-x-2"
          >
            <span>Tiếp theo</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSave}
            disabled={!canProceedToNextStep()}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Tạo Đợt Phát Hành</span>
          </Button>
        )}
      </div>

      {/* Validation Warning */}
      {!canProceedToNextStep() && (
        <Alert className="voucher-alert-warning">
          <Info className="h-4 w-4" />
          <AlertDescription className="theme-text">
            <div className="text-sm">
              <div className="font-medium mb-1">Vui lòng hoàn thành các thông tin bắt buộc:</div>
              <ul className="list-disc list-inside space-y-1">
                {currentStep === 1 && !batchName.trim() && <li>Nhập tên đợt phát hành</li>}
                {currentStep === 1 && !selectedKiotVietBatch && <li>Chọn đợt phát hành từ KiotViet</li>}
                {currentStep === 2 && !manualPrefix.trim() && <li>Nhập ký tự đầu (prefix)</li>}
                {currentStep === 2 && codeLength < 4 && <li>Độ dài mã tối thiểu 4 ký tự</li>}
                {currentStep === 4 && generationMethod !== 'manual' && !valueMappings.some(m => m.active) && <li>Thiết lập ít nhất 1 mapping hoạt động</li>}
                {currentStep === 4 && generationMethod !== 'manual' && !groupPriorities.some(p => p.active) && <li>Kích hoạt ít nhất 1 nhóm ưu tiên</li>}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
