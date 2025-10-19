import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { RewardsService } from '../../services/rewardsService';
import type { Reward, UpdateRewardData } from '../../types/benefits';

interface EditRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward: Reward;
  onSuccess: () => void;
}

export function EditRewardModal({ isOpen, onClose, reward, onSuccess }: EditRewardModalProps) {
  const [formData, setFormData] = useState<UpdateRewardData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (reward) {
      setFormData({
        reward_title: reward.reward_title,
        reward_type: reward.reward_type,
        awarded_date: reward.awarded_date,
        reason: reward.reason,
        amount: reward.amount,
      });
    }
  }, [reward]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.reward_title?.trim() || !formData.reason?.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await RewardsService.updateReward(reward.id, formData);
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật khen thưởng',
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
          <DialogTitle>Chỉnh Sửa Khen Thưởng</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reward Code (Read-only) */}
          <div className="space-y-2">
            <Label>Mã Khen Thưởng</Label>
            <Input value={reward.reward_code} disabled />
          </div>

          {/* Reward Title */}
          <div className="space-y-2">
            <Label htmlFor="reward_title">
              Tiêu Đề Khen Thưởng <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reward_title"
              value={formData.reward_title || ''}
              onChange={(e) => setFormData({ ...formData, reward_title: e.target.value })}
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
              />
            </div>
          </div>

          {/* Awarded Date */}
          <div className="space-y-2">
            <Label htmlFor="awarded_date">Ngày Trao Thưởng</Label>
            <Input
              id="awarded_date"
              type="date"
              value={formData.awarded_date || ''}
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
              value={formData.reason || ''}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang cập nhật...' : 'Cập Nhật'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
