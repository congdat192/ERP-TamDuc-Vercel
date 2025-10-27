import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { voucherService, type VoucherCampaign, type ExternalCampaign } from '../../../services/voucherService';
import { toast } from 'sonner';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';

interface CampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: VoucherCampaign | null;
  onSave: () => void;
}

export function CampaignDialog({ open, onOpenChange, campaign, onSave }: CampaignDialogProps) {
  const { register, handleSubmit, reset, setValue } = useForm<VoucherCampaign>();
  const [externalCampaigns, setExternalCampaigns] = useState<ExternalCampaign[]>([]);
  const [isLoadingExternal, setIsLoadingExternal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [showEditWarning, setShowEditWarning] = useState(false);

  useEffect(() => {
    if (campaign) {
      reset(campaign);
      setSelectedCampaignId(campaign.campaign_id);
      setShowEditWarning(false);
    } else {
      reset({ name: '', campaign_id: '', description: '', is_active: true } as any);
      setSelectedCampaignId('');
      setExternalCampaigns([]);
      setShowEditWarning(false);
    }
  }, [campaign, reset, open]);

  const handleLoadExternalCampaigns = async () => {
    setIsLoadingExternal(true);
    try {
      const campaigns = await voucherService.getExternalCampaigns();
      setExternalCampaigns(campaigns);
      toast.success(`Đã load ${campaigns.length} chiến dịch từ hệ thống`);
    } catch (error: any) {
      toast.error(error.message || 'Không thể load campaigns');
      console.error('Failed to load external campaigns:', error);
    } finally {
      setIsLoadingExternal(false);
    }
  };

  const handleSelectCampaign = (value: string) => {
    setSelectedCampaignId(value);
    const selected = externalCampaigns.find(c => c.campaign_id === value);
    if (selected) {
      setValue('campaign_id', selected.campaign_id);
      setValue('name', selected.campaign_name);
      setValue('description', selected.description || '');
      
      if (campaign && campaign.campaign_id !== selected.campaign_id) {
        setShowEditWarning(true);
      }
    }
  };

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
            
            {campaign && showEditWarning && (
              <Alert variant="destructive" className="mb-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  ⚠️ Bạn đang thay đổi Campaign ID của chiến dịch đã tồn tại. Điều này có thể ảnh hưởng đến lịch sử phát voucher!
                </AlertDescription>
              </Alert>
            )}
            
            <Button
              type="button"
              variant="outline"
              onClick={handleLoadExternalCampaigns}
              disabled={isLoadingExternal}
              className="w-full mb-2"
            >
              {isLoadingExternal ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tải campaigns...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Load danh sách chiến dịch
                </>
              )}
            </Button>

            {externalCampaigns.length > 0 && (
              <Select
                value={selectedCampaignId}
                onValueChange={handleSelectCampaign}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chiến dịch từ danh sách" />
                </SelectTrigger>
                <SelectContent>
        {externalCampaigns.map((ec) => (
          <SelectItem key={ec.campaign_id} value={ec.campaign_id}>
            <div className="flex flex-col">
              <span className="font-medium">{ec.campaign_name}</span>
              <span className="text-xs text-muted-foreground">
                ID: {ec.campaign_id}
                {ec.discount_value && ` • Giá trị: ${ec.discount_value.toLocaleString('vi-VN')}đ`}
              </span>
            </div>
          </SelectItem>
        ))}
                </SelectContent>
              </Select>
            )}

            <Input
              {...register('campaign_id', { required: true })}
              placeholder={externalCampaigns.length > 0 ? "Hoặc nhập thủ công Campaign ID" : "Nhập Campaign ID"}
              onChange={(e) => {
                if (campaign && e.target.value !== campaign.campaign_id) {
                  setShowEditWarning(true);
                } else {
                  setShowEditWarning(false);
                }
              }}
            />
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
