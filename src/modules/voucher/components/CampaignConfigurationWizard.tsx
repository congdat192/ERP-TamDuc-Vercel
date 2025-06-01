
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { VoucherTypeSelector } from './VoucherTypeSelector';
import { StaffTypeSelector } from './StaffTypeSelector';
import { CustomerTargetSelector } from './CustomerTargetSelector';
import { ValueSelector } from './ValueSelector';
import { ConditionsSelector } from './ConditionsSelector';
import { Campaign, CampaignChoice, CampaignFormData } from '../types/campaign';
import { Plus, Trash2, Copy } from 'lucide-react';

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
    onSubmit(formData);
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
          {/* Campaign Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Cài Đặt Chiến Dịch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên Chiến Dịch</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nhập tên chiến dịch"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Ngày Bắt Đầu</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.schedule.startDate.toISOString().split('T')[0]}
                    onChange={(e) => setFormData({
                      ...formData,
                      schedule: {
                        ...formData.schedule,
                        startDate: new Date(e.target.value)
                      }
                    })}
                  />
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
              <CardTitle>Cấu Hình Lựa Chọn</CardTitle>
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
                      Chưa có lựa chọn nào được cấu hình
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
              disabled={!formData.name || formData.choices.length === 0}
            >
              {mode === 'create' ? 'Tạo Chiến Dịch' : 'Cập Nhật Chiến Dịch'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
