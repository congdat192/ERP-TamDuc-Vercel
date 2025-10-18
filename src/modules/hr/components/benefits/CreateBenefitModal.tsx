import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BenefitsService } from '../../services/benefitsService';
import type { CreateBenefitData } from '../../types/benefits';

interface CreateBenefitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateBenefitModal({ isOpen, onClose, onSuccess }: CreateBenefitModalProps) {
  const [formData, setFormData] = useState<CreateBenefitData>({
    benefit_name: '',
    benefit_type: 'allowance',
    description: '',
    eligibility_criteria: '',
    value: undefined,
    frequency: 'monthly',
    effective_from: '',
    effective_to: '',
    status: 'active',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.benefit_name.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập tên phúc lợi',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await BenefitsService.createBenefit(formData);
      toast({
        title: 'Thành công',
        description: 'Đã tạo phúc lợi mới',
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm Phúc Lợi Mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Benefit Name */}
          <div className="space-y-2">
            <Label htmlFor="benefit_name">
              Tên Phúc Lợi <span className="text-destructive">*</span>
            </Label>
            <Input
              id="benefit_name"
              value={formData.benefit_name}
              onChange={(e) => setFormData({ ...formData, benefit_name: e.target.value })}
              placeholder="VD: Bảo hiểm y tế toàn diện"
            />
          </div>

          {/* Type & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="benefit_type">Loại Phúc Lợi</Label>
              <Select
                value={formData.benefit_type}
                onValueChange={(value: any) => setFormData({ ...formData, benefit_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="insurance">Bảo Hiểm</SelectItem>
                  <SelectItem value="allowance">Phụ Cấp</SelectItem>
                  <SelectItem value="bonus">Thưởng</SelectItem>
                  <SelectItem value="leave">Nghỉ Phép</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng Thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt Động</SelectItem>
                  <SelectItem value="inactive">Tạm Ngưng</SelectItem>
                  <SelectItem value="expired">Hết Hạn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô Tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả chi tiết về phúc lợi"
              rows={3}
            />
          </div>

          {/* Eligibility */}
          <div className="space-y-2">
            <Label htmlFor="eligibility_criteria">Điều Kiện Nhận</Label>
            <Textarea
              id="eligibility_criteria"
              value={formData.eligibility_criteria}
              onChange={(e) => setFormData({ ...formData, eligibility_criteria: e.target.value })}
              placeholder="VD: Nhân viên chính thức, thâm niên >= 12 tháng"
              rows={2}
            />
          </div>

          {/* Value & Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Giá Trị (VNĐ)</Label>
              <Input
                id="value"
                type="number"
                value={formData.value || ''}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || undefined })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Tần Suất</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value: any) => setFormData({ ...formData, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-time">Một Lần</SelectItem>
                  <SelectItem value="monthly">Hàng Tháng</SelectItem>
                  <SelectItem value="quarterly">Hàng Quý</SelectItem>
                  <SelectItem value="yearly">Hàng Năm</SelectItem>
                  <SelectItem value="as-needed">Khi Cần</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Effective Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="effective_from">Ngày Bắt Đầu</Label>
              <Input
                id="effective_from"
                type="date"
                value={formData.effective_from}
                onChange={(e) => setFormData({ ...formData, effective_from: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="effective_to">Ngày Kết Thúc</Label>
              <Input
                id="effective_to"
                type="date"
                value={formData.effective_to}
                onChange={(e) => setFormData({ ...formData, effective_to: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang tạo...' : 'Tạo Phúc Lợi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
