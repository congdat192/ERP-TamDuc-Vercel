import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { voucherService, type VoucherCampaign } from '../../../services/voucherService';
import { toast } from 'sonner';

interface CampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: VoucherCampaign | null;
  onSave: () => void;
}

export function CampaignDialog({ open, onOpenChange, campaign, onSave }: CampaignDialogProps) {
  const { register, handleSubmit, reset } = useForm<VoucherCampaign>();

  useEffect(() => {
    if (campaign) {
      reset(campaign);
    } else {
      reset({ name: '', campaign_id: '', description: '', is_active: true } as any);
    }
  }, [campaign, reset]);

  const onSubmit = async (data: VoucherCampaign) => {
    try {
      if (campaign) {
        await voucherService.updateCampaign(campaign.id, data);
        toast.success('Cập nhật chiến dịch thành công');
      } else {
        await voucherService.createCampaign(data);
        toast.success('Tạo chiến dịch thành công');
      }
      onSave();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{campaign ? 'Sửa chiến dịch' : 'Tạo chiến dịch mới'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Tên chiến dịch *</Label>
            <Input {...register('name', { required: true })} />
          </div>
          
          <div className="space-y-2">
            <Label>Campaign ID *</Label>
            <Input {...register('campaign_id', { required: true })} disabled={!!campaign} />
          </div>

          <div className="space-y-2">
            <Label>Mô tả</Label>
            <Textarea {...register('description')} />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">
              {campaign ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
