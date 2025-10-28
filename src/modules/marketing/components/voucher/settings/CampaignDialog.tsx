import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { voucherService, type VoucherCampaign, type ExternalCampaign } from '../../../services/voucherService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, RefreshCw, AlertCircle, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: VoucherCampaign | null;
  onSave: () => void;
}

export function CampaignDialog({ open, onOpenChange, campaign, onSave }: CampaignDialogProps) {
  const { register, handleSubmit, reset, setValue } = useForm<VoucherCampaign>();
  const [externalCampaigns, setExternalCampaigns] = useState<ExternalCampaign[]>([]);
  const [templates, setTemplates] = useState<Array<{ name: string; url: string }>>([]);
  const [isLoadingExternal, setIsLoadingExternal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  const [showEditWarning, setShowEditWarning] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);

  useEffect(() => {
    if (campaign) {
      reset({
        ...campaign,
        campaign_id: typeof campaign.campaign_id === 'number' 
          ? campaign.campaign_id.toString() 
          : campaign.campaign_id
      });
      setSelectedCampaignId(
        typeof campaign.campaign_id === 'number' 
          ? campaign.campaign_id 
          : parseInt(campaign.campaign_id, 10)
      );
      setShowEditWarning(false);
    } else {
      reset({ name: '', campaign_id: '', description: '', voucher_image_url: '', is_active: true } as any);
      setSelectedCampaignId(null);
      setExternalCampaigns([]);
      setShowEditWarning(false);
    }
  }, [campaign, reset, open]);

  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open]);

  const loadTemplates = async () => {
    try {
      const { data } = await supabase.storage.from('voucher-templates').list();
      if (data) {
        const urls = data.map(file => {
          const { data: { publicUrl } } = supabase.storage
            .from('voucher-templates')
            .getPublicUrl(file.name);
          return { name: file.name, url: publicUrl };
        });
        setTemplates(urls);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

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

  const handleSelectCampaign = (campaignId: number) => {
    setSelectedCampaignId(campaignId);
    const selected = externalCampaigns.find(c => c.campaign_id === campaignId);
    if (selected) {
      setValue('campaign_id', campaignId.toString());
      setValue('name', selected.campaign_name);
      setValue('description', selected.description || '');
      
      const currentCampaignId = typeof campaign?.campaign_id === 'number' 
        ? campaign.campaign_id 
        : parseInt(campaign?.campaign_id || '0', 10);
      
      if (campaign && currentCampaignId !== campaignId) {
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
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    className="w-full justify-between"
                  >
                    {selectedCampaignId
                      ? (() => {
                          const selected = externalCampaigns.find(c => c.campaign_id === selectedCampaignId);
                          return selected ? selected.campaign_name : "Chọn chiến dịch...";
                        })()
                      : "Chọn chiến dịch từ danh sách"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[600px] p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Tìm kiếm theo tên, ID, hoặc mã..." 
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy chiến dịch nào.</CommandEmpty>
                      <CommandGroup>
                        {externalCampaigns.map((ec) => (
                          <CommandItem
                            key={ec.campaign_id}
                            value={`${ec.campaign_name} ${ec.campaign_id} ${ec.campaign_code}`}
                            onSelect={() => {
                              handleSelectCampaign(ec.campaign_id);
                              setComboboxOpen(false);
                            }}
                            className="flex items-center gap-2 py-3"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCampaignId === ec.campaign_id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col flex-1">
                              <span className="font-medium">{ec.campaign_name}</span>
                              <span className="text-xs text-muted-foreground">
                                ID: {ec.campaign_id} • Mã: {ec.campaign_code}
                                {ec.discount_value && ` • Giá trị: ${ec.discount_value.toLocaleString('vi-VN')}đ`}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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

          <div className="space-y-2">
            <Label>Ảnh Voucher</Label>
            {templates.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Chưa có ảnh template. Vui lòng upload ảnh ở tab "Ảnh Voucher"
              </p>
            ) : (
              <select {...register('voucher_image_url')} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option value="">Không chọn ảnh</option>
                {templates.map(t => (
                  <option key={t.url} value={t.url}>
                    {t.name}
                  </option>
                ))}
              </select>
            )}
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
