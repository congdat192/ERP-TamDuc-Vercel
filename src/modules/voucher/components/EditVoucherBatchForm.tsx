
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VoucherBatch } from '../types/voucherBatch';
import { toast } from '@/hooks/use-toast';

interface EditVoucherBatchFormProps {
  batch: VoucherBatch;
  onSave: (batch: VoucherBatch) => void;
  onCancel: () => void;
}

export function EditVoucherBatchForm({ batch, onSave, onCancel }: EditVoucherBatchFormProps) {
  const [formData, setFormData] = useState<VoucherBatch>({
    ...batch,
    updatedAt: new Date().toISOString()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên đợt phát hành.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.codePrefix.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tiền tố mã voucher.",
        variant: "destructive"
      });
      return;
    }

    if (formData.codeLength < 4 || formData.codeLength > 20) {
      toast({
        title: "Lỗi",
        description: "Độ dài mã voucher phải từ 4 đến 20 ký tự.",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
  };

  const handleInputChange = (field: keyof VoucherBatch, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông Tin Cơ Bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batch-name">Tên Đợt Phát Hành *</Label>
              <Input
                id="batch-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="VD: Đợt Tết Nguyên Đán 2024"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="code-prefix">Tiền Tố Mã *</Label>
              <Input
                id="code-prefix"
                value={formData.codePrefix}
                onChange={(e) => handleInputChange('codePrefix', e.target.value.toUpperCase())}
                placeholder="VD: TET24"
                maxLength={10}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô Tả</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Nhập mô tả cho đợt phát hành..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code-suffix">Hậu Tố Mã</Label>
              <Input
                id="code-suffix"
                value={formData.codeSuffix || ''}
                onChange={(e) => handleInputChange('codeSuffix', e.target.value.toUpperCase())}
                placeholder="VD: X (tùy chọn)"
                maxLength={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code-length">Độ Dài Mã *</Label>
              <Input
                id="code-length"
                type="number"
                min="4"
                max="20"
                value={formData.codeLength}
                onChange={(e) => handleInputChange('codeLength', parseInt(e.target.value))}
                placeholder="VD: 8"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is-active"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange('isActive', checked)}
            />
            <Label htmlFor="is-active">Kích hoạt đợt phát hành</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-3">
        <Button type="submit" className="flex-1">
          Lưu Thay Đổi
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
      </div>
    </form>
  );
}
