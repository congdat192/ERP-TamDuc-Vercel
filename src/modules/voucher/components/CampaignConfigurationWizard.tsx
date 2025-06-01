import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { VoucherTypeSelector } from './VoucherTypeSelector';
import { StaffTypeSelector } from './StaffTypeSelector';
import { CustomerTargetSelector } from './CustomerTargetSelector';
import { ValueSelector } from './ValueSelector';
import { ConditionsSelector } from './ConditionsSelector';
import { Campaign, CampaignChoice, CampaignFormData } from '../types/campaign';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CampaignConfigurationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CampaignFormData) => void;
  initialData?: Campaign | null;
  mode: 'create' | 'edit';
}

export function CampaignConfigurationWizard({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode
}: CampaignConfigurationWizardProps) {
  const [formData, setFormData] = useState<CampaignFormData>({
    name: initialData?.name || '',
    types: initialData?.types || ['monthly'],
    schedule: initialData?.schedule || {
      startDate: new Date(),
      isCustom: false
    },
    status: initialData?.status || 'draft',
    description: initialData?.description || '',
    choices: initialData?.choices || [
      {
        id: '1',
        voucherType: 'voucher',
        staffTypes: [],
        customerTargets: [],
        value: 0,
        valueType: 'fixed',
        conditions: []
      }
    ]
  });

  const [hasEndDate, setHasEndDate] = useState(!!initialData?.schedule.endDate);

  // Validation helpers - simplified and more direct
  const isNameValid = formData.name.trim().length > 0;
  const currentChoice = formData.choices[0];
  const isChoiceConfigured = currentChoice && currentChoice.value > 0;
  const isFormValid = isNameValid && isChoiceConfigured;

  // Debug logging to track state changes
  console.log('CampaignWizard Debug:', {
    formDataName: formData.name,
    currentChoiceValue: currentChoice?.value,
    isNameValid,
    isChoiceConfigured,
    isFormValid,
    fullCurrentChoice: currentChoice
  });

  const getValidationMessages = () => {
    const messages = [];
    if (!isNameValid) {
      messages.push('Vui lòng nhập tên chiến dịch');
    }
    if (!isChoiceConfigured) {
      messages.push('Vui lòng cấu hình giá trị voucher/coupon');
    }
    return messages;
  };

  const updateCurrentChoice = (updates: Partial<CampaignChoice>) => {
    console.log('Updating choice with:', updates);
    const updatedChoice = { ...currentChoice, ...updates };
    console.log('Updated choice:', updatedChoice);
    
    const newFormData = {
      ...formData,
      choices: [updatedChoice]
    };
    
    console.log('New form data:', newFormData);
    setFormData(newFormData);
  };

  const handleEndDateToggle = (enabled: boolean) => {
    setHasEndDate(enabled);
    if (!enabled) {
      setFormData({
        ...formData,
        schedule: {
          ...formData.schedule,
          endDate: undefined
        }
      });
    }
  };

  const handleStatusToggle = (isActive: boolean) => {
    setFormData({
      ...formData,
      status: isActive ? 'active' : 'draft'
    });
  };

  const handleSubmit = () => {
    console.log('Submit attempted with formValid:', isFormValid);
    if (isFormValid) {
      console.log('Submitting form data:', formData);
      onSubmit(formData);
    } else {
      console.log('Form validation failed:', { isNameValid, isChoiceConfigured });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Tạo Chiến Dịch Mới' : 'Chỉnh Sửa Chiến Dịch'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Tiến Độ Hoàn Thành</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                {isNameValid ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                )}
                <span className={cn("text-sm", isNameValid ? "text-green-600" : "text-gray-500")}>
                  Thông tin chiến dịch
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {isChoiceConfigured ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                )}
                <span className={cn("text-sm", isChoiceConfigured ? "text-green-600" : "text-gray-500")}>
                  Cấu hình voucher/coupon (Giá trị: {currentChoice?.value || 0})
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Validation Messages */}
          {!isFormValid && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Vui lòng hoàn thành các bước sau:</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {getValidationMessages().map((message, index) => (
                      <li key={index}>{message}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Campaign Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Cài Đặt Chiến Dịch</span>
                {isNameValid ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên Chiến Dịch *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nhập tên chiến dịch"
                    className={cn(!isNameValid && formData.name === '' ? "border-red-300" : "")}
                  />
                  {!isNameValid && formData.name === '' && (
                    <p className="text-sm text-red-600">Tên chiến dịch là bắt buộc</p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Trạng Thái Chiến Dịch</Label>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="status-toggle" className="text-sm">
                        {formData.status === 'active' ? 'Kích hoạt' : 'Nháp'}
                      </Label>
                      <Switch
                        id="status-toggle"
                        checked={formData.status === 'active'}
                        onCheckedChange={handleStatusToggle}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formData.status === 'active' 
                      ? 'Chiến dịch sẽ được kích hoạt ngay lập tức' 
                      : 'Chiến dịch sẽ được lưu dưới dạng nháp'
                    }
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ngày Bắt Đầu</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.schedule.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.schedule.startDate ? (
                          format(formData.schedule.startDate, "dd/MM/yyyy")
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.schedule.startDate}
                        onSelect={(date) => setFormData({
                          ...formData,
                          schedule: {
                            ...formData.schedule,
                            startDate: date || new Date()
                          }
                        })}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Ngày Kết Thúc</Label>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="has-end-date" className="text-sm">Có ngày kết thúc</Label>
                      <Switch
                        id="has-end-date"
                        checked={hasEndDate}
                        onCheckedChange={handleEndDateToggle}
                      />
                    </div>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={!hasEndDate}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          (!formData.schedule.endDate || !hasEndDate) && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.schedule.endDate && hasEndDate ? (
                          format(formData.schedule.endDate, "dd/MM/yyyy")
                        ) : (
                          <span>Không giới hạn</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.schedule.endDate}
                        onSelect={(date) => setFormData({
                          ...formData,
                          schedule: {
                            ...formData.schedule,
                            endDate: date
                          }
                        })}
                        initialFocus
                        className="p-3 pointer-events-auto"
                        disabled={(date) => {
                          const startDate = formData.schedule.startDate;
                          return startDate ? date < startDate : false;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô Tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nhập mô tả chiến dịch"
                />
              </div>
            </CardContent>
          </Card>

          {/* Voucher/Coupon Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Cấu Hình Voucher/Coupon</span>
                {isChoiceConfigured ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <VoucherTypeSelector
                value={currentChoice.voucherType}
                onChange={(value) => updateCurrentChoice({ voucherType: value })}
              />

              <StaffTypeSelector
                value={currentChoice.staffTypes}
                onChange={(value) => updateCurrentChoice({ staffTypes: value })}
              />

              <CustomerTargetSelector
                value={currentChoice.customerTargets}
                onChange={(value) => updateCurrentChoice({ customerTargets: value })}
              />

              <ValueSelector
                voucherType={currentChoice.voucherType}
                value={currentChoice.value}
                valueType={currentChoice.valueType}
                onChange={(value, valueType) => updateCurrentChoice({ 
                  value, 
                  valueType: currentChoice.voucherType === 'voucher' ? 'fixed' : valueType 
                })}
              />

              <ConditionsSelector
                value={currentChoice.conditions}
                onChange={(value) => updateCurrentChoice({ conditions: value })}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={cn(!isFormValid && "cursor-not-allowed")}
            >
              {mode === 'create' ? 'Tạo Chiến Dịch' : 'Cập Nhật Chiến Dịch'}
              {!isFormValid && (
                <AlertCircle className="w-4 h-4 ml-2" />
              )}
            </Button>
          </div>
          
          {/* Button Help Text */}
          {!isFormValid && (
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Hoàn thành tất cả các bước bắt buộc để kích hoạt nút tạo chiến dịch
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
