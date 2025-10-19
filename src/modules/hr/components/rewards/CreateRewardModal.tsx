import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { RewardsService } from '../../services/rewardsService';
import type { CreateRewardData } from '../../types/benefits';
import { EmployeeSearchInput } from '../shared/EmployeeSearchInput';

interface CreateRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateRewardModal({ isOpen, onClose, onSuccess }: CreateRewardModalProps) {
  const [formData, setFormData] = useState<CreateRewardData>({
    reward_title: '',
    reward_type: 'bonus',
    employee_id: '',
    awarded_date: new Date().toISOString().split('T')[0],
    reason: '',
    amount: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.reward_title.trim() || !formData.employee_id.trim() || !formData.reason.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await RewardsService.createReward(formData);
      toast({
        title: 'Thành công',
        description: 'Đã tạo khen thưởng mới',
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
          <DialogTitle>Tạo Khen Thưởng Mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reward Title */}
          <div className="space-y-2">
            <Label htmlFor="reward_title">
              Tiêu Đề Khen Thưởng <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reward_title"
              value={formData.reward_title}
              onChange={(e) => setFormData({ ...formData, reward_title: e.target.value })}
              placeholder="VD: Khen thưởng hoàn thành xuất sắc dự án X"
            />
          </div>

          {/* Type & Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reward_type">Loại Khen Thưởng</Label>
              <Select
                value={formData.reward_type}
                onValueChange={(value: any) => setFormData({ ...formData, reward_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bonus">Tiền Thưởng</SelectItem>
                  <SelectItem value="recognition">Khen Ngợi</SelectItem>
                  <SelectItem value="gift">Quà Tặng</SelectItem>
                  <SelectItem value="promotion">Thăng Chức</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Giá Trị (VNĐ)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || undefined })}
                placeholder="0"
              />
            </div>
          </div>

          {/* Employee ID */}
          <div className="space-y-2">
            <Label htmlFor="employee_id">
              Nhân Viên <span className="text-destructive">*</span>
            </Label>
            <EmployeeSearchInput
              value={formData.employee_id}
              onValueChange={(value) => setFormData({ ...formData, employee_id: value })}
              placeholder="Tìm kiếm nhân viên..."
            />
          </div>

          {/* Awarded Date */}
          <div className="space-y-2">
            <Label htmlFor="awarded_date">Ngày Trao Thưởng</Label>
            <Input
              id="awarded_date"
              type="date"
              value={formData.awarded_date}
              onChange={(e) => setFormData({ ...formData, awarded_date: e.target.value })}
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Lý Do Khen Thưởng <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Mô tả chi tiết lý do khen thưởng"
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang tạo...' : 'Tạo Khen Thưởng'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
