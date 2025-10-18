import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { RewardsService } from '../../services/rewardsService';
import type { Reward } from '../../types/benefits';

interface ApproveRewardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reward: Reward;
  onSuccess: () => void;
}

export function ApproveRewardDialog({ isOpen, onClose, reward, onSuccess }: ApproveRewardDialogProps) {
  const [action, setAction] = useState<'approve' | 'reject'>('approve');
  const [rejectionNote, setRejectionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      await RewardsService.approveReward(reward.id);
      toast({
        title: 'Thành công',
        description: 'Đã phê duyệt khen thưởng',
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

  const handleReject = async () => {
    if (!rejectionNote.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập lý do từ chối',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await RewardsService.rejectReward(reward.id, rejectionNote);
      toast({
        title: 'Thành công',
        description: 'Đã từ chối khen thưởng',
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

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Phê Duyệt Khen Thưởng</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Reward Info */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Mã KT:</span>
              <span className="text-sm">{reward.reward_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Tiêu Đề:</span>
              <span className="text-sm">{reward.reward_title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Nhân Viên:</span>
              <span className="text-sm">{reward.employee?.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Giá Trị:</span>
              <span className="text-sm font-semibold">{formatCurrency(reward.amount)}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Lý Do:</span>
              <p className="text-sm mt-1">{reward.reason}</p>
            </div>
          </div>

          {/* Action Selection */}
          <div className="flex gap-4">
            <Button
              variant={action === 'approve' ? 'default' : 'outline'}
              onClick={() => setAction('approve')}
              className="flex-1"
            >
              Phê Duyệt
            </Button>
            <Button
              variant={action === 'reject' ? 'destructive' : 'outline'}
              onClick={() => setAction('reject')}
              className="flex-1"
            >
              Từ Chối
            </Button>
          </div>

          {/* Rejection Note */}
          {action === 'reject' && (
            <div className="space-y-2">
              <Label htmlFor="rejectionNote">
                Lý Do Từ Chối <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="rejectionNote"
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                placeholder="Nhập lý do từ chối khen thưởng..."
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            variant={action === 'approve' ? 'default' : 'destructive'}
            onClick={action === 'approve' ? handleApprove : handleReject}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : action === 'approve' ? 'Xác Nhận Phê Duyệt' : 'Xác Nhận Từ Chối'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
