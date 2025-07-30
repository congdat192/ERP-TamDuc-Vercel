
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface CreateVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (voucherData: any) => void;
}

export function CreateVoucherModal({ isOpen, onClose, onSubmit }: CreateVoucherModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    f0Id: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: '',
    maxDiscount: '',
    usageLimit: '',
    description: '',
    expiryDate: undefined as Date | undefined
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      discountValue: Number(formData.discountValue),
      minOrderValue: Number(formData.minOrderValue),
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
      usageLimit: Number(formData.usageLimit),
      expiryDate: formData.expiryDate?.toISOString().split('T')[0]
    });
    onClose();
    setFormData({
      code: '',
      f0Id: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderValue: '',
      maxDiscount: '',
      usageLimit: '',
      description: '',
      expiryDate: undefined
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tạo voucher mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã voucher *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="AFF-VCH-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="f0Id">F0 sở hữu *</Label>
              <Select value={formData.f0Id} onValueChange={(value) => setFormData({ ...formData, f0Id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn F0" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Nguyễn Văn A</SelectItem>
                  <SelectItem value="2">Trần Thị B</SelectItem>
                  <SelectItem value="3">Lê Văn C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountType">Loại giảm giá *</Label>
              <Select value={formData.discountType} onValueChange={(value) => setFormData({ ...formData, discountType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                  <SelectItem value="fixed">Số tiền cố định (VND)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountValue">Giá trị giảm *</Label>
              <Input
                id="discountValue"
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                placeholder={formData.discountType === 'percentage' ? '10' : '50000'}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minOrderValue">Đơn hàng tối thiểu (VND) *</Label>
              <Input
                id="minOrderValue"
                type="number"
                value={formData.minOrderValue}
                onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                placeholder="500000"
                required
              />
            </div>
            {formData.discountType === 'percentage' && (
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">Giảm tối đa (VND)</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                  placeholder="100000"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="usageLimit">Giới hạn sử dụng *</Label>
              <Input
                id="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                placeholder="50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Ngày hết hạn *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiryDate ? format(formData.expiryDate, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.expiryDate}
                    onSelect={(date) => setFormData({ ...formData, expiryDate: date })}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả voucher..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              Tạo voucher
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
