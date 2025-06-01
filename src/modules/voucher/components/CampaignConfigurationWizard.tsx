
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
import { Plus, Trash2, Copy } from 'lucide-react';
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
    choices: initialData?.choices || []
  });

  const [currentChoice, setCurrentChoice] = useState<CampaignChoice>({
    id: '',
    voucherType: 'voucher',
    staffTypes: [],
    customerTargets: [],
    value: 0,
    valueType: 'fixed',
    conditions: []
  });

  const [editingChoiceIndex, setEditingChoiceIndex] = useState<number | null>(null);
  const [hasEndDate, setHasEndDate] = useState(!!initialData?.schedule.endDate);

  // Validation helpers
  const isNameValid = formData.name.trim().length > 0;
  const hasChoices = formData.choices.length > 0;
  const isFormValid = isNameValid && hasChoices;

  const getValidationMessages = () => {
    const messages = [];
    if (!isNameValid) {
      messages.push('Vui lòng nhập tên chiến dịch');
    }
    if (!hasChoices) {
      messages.push('Vui lòng thêm ít nhất một lựa chọn voucher/coupon');
    }
    return messages;
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

  const addChoice = () => {
    const newChoice: CampaignChoice = {
      ...currentChoice,
      id: Date.now().toString()
    };

    if (editingChoiceIndex !== null) {
      const updatedChoices = [...formData.choices];
      updatedChoices[editingChoiceIndex] = newChoice;
      setFormData({ ...formData, choices: updatedChoices });
      setEditingChoiceIndex(null);
    } else {
      setFormData({ ...formData, choices: [...formData.choices, newChoice] });
    }

    // Reset current choice
    setCurrentChoice({
      id: '',
      voucherType: 'voucher',
      staffTypes: [],
      customerTargets: [],
      value: 0,
      valueType: 'fixed',
      conditions: []
    });
  };

  const editChoice = (index: number) => {
    setCurrentChoice(formData.choices[index]);
    setEditingChoiceIndex(index);
  };

  const duplicateChoice = (index: number) => {
    const choiceToDuplicate = formData.choices[index];
    const duplicatedChoice: CampaignChoice = {
      ...choiceToDuplicate,
      id: Date.now().toString()
    };
    setFormData({ 
      ...formData, 
      choices: [...formData.choices, duplicatedChoice] 
    });
  };

  const removeChoice = (index: number) => {
    setFormData({
      ...formData,
      choices: formData.choices.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = () => {
    if (isFormValid) {
      onSubmit(formData);
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
                {hasChoices ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                )}
                <span className={cn("text-sm", hasChoices ? "text-green-600" : "text-gray-500")}>
                  Cấu hình lựa chọn ({formData.choices.length} lựa chọn)
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

          {/* Choice Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Cấu Hình Lựa Chọn</span>
                {hasChoices ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="choice-config" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="choice-config">
                    {editingChoiceIndex !== null ? 'Chỉnh Sửa Lựa Chọn' : 'Thêm Lựa Chọn Mới'}
                  </TabsTrigger>
                  <TabsTrigger value="choices-list">
                    Danh Sách Lựa Chọn ({formData.choices.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="choice-config" className="space-y-6 mt-6">
                  {!hasChoices && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Bạn cần thêm ít nhất một lựa chọn voucher hoặc coupon để có thể tạo chiến dịch.
                      </AlertDescription>
                    </Alert>
                  )}

                  <VoucherTypeSelector
                    value={currentChoice.voucherType}
                    onChange={(value) => setCurrentChoice({ ...currentChoice, voucherType: value })}
                  />

                  <StaffTypeSelector
                    value={currentChoice.staffTypes}
                    onChange={(value) => setCurrentChoice({ ...currentChoice, staffTypes: value })}
                  />

                  <CustomerTargetSelector
                    value={currentChoice.customerTargets}
                    onChange={(value) => setCurrentChoice({ ...currentChoice, customerTargets: value })}
                  />

                  <ValueSelector
                    voucherType={currentChoice.voucherType}
                    value={currentChoice.value}
                    valueType={currentChoice.valueType}
                    onChange={(value, valueType) => setCurrentChoice({ 
                      ...currentChoice, 
                      value, 
                      valueType: currentChoice.voucherType === 'voucher' ? 'fixed' : valueType 
                    })}
                  />

                  <ConditionsSelector
                    value={currentChoice.conditions}
                    onChange={(value) => setCurrentChoice({ ...currentChoice, conditions: value })}
                  />

                  <div className="flex justify-end space-x-2">
                    {editingChoiceIndex !== null && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingChoiceIndex(null);
                          setCurrentChoice({
                            id: '',
                            voucherType: 'voucher',
                            staffTypes: [],
                            customerTargets: [],
                            value: 0,
                            valueType: 'fixed',
                            conditions: []
                          });
                        }}
                      >
                        Hủy
                      </Button>
                    )}
                    <Button onClick={addChoice}>
                      <Plus className="w-4 h-4 mr-2" />
                      {editingChoiceIndex !== null ? 'Cập Nhật Lựa Chọn' : 'Thêm Lựa Chọn'}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="choices-list" className="mt-6">
                  {formData.choices.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">Chưa có lựa chọn nào</p>
                      <p>Vui lòng thêm ít nhất một lựa chọn voucher hoặc coupon</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.choices.map((choice, index) => (
                        <Card key={choice.id} className="border-l-4 border-l-orange-500">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline">Lựa chọn {index + 1}</Badge>
                                  <Badge>{choice.voucherType === 'voucher' ? 'Voucher' : 'Coupon'}</Badge>
                                </div>
                                <div className="text-sm text-gray-600">
                                  <p><strong>Nhân viên:</strong> {choice.staffTypes.join(', ') || 'Chưa chọn'}</p>
                                  <p><strong>Khách hàng:</strong> {choice.customerTargets.join(', ') || 'Chưa chọn'}</p>
                                  <p><strong>Giá trị:</strong> {choice.value} {choice.valueType === 'fixed' ? 'VNĐ' : '%'}</p>
                                  <p><strong>Điều kiện:</strong> {choice.conditions.length} điều kiện</p>
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => editChoice(index)}
                                >
                                  Sửa
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => duplicateChoice(index)}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeChoice(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
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
