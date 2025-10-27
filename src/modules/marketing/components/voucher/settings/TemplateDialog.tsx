import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { voucherService, type VoucherTemplate } from '../../../services/voucherService';
import { toast } from 'sonner';

interface TemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: VoucherTemplate | null;
  onSave: () => void;
}

export function TemplateDialog({ open, onOpenChange, template, onSave }: TemplateDialogProps) {
  const { register, handleSubmit, reset, watch } = useForm<VoucherTemplate>();

  useEffect(() => {
    if (template) {
      reset(template);
    } else {
      reset({ 
        name: '', 
        template_text: '', 
        template_html: '', 
        is_default: false 
      } as any);
    }
  }, [template, reset]);

  const onSubmit = async (data: VoucherTemplate) => {
    try {
      if (template) {
        await voucherService.updateTemplate(template.id, data);
        toast.success('Cập nhật template thành công');
      } else {
        await voucherService.createTemplate(data);
        toast.success('Tạo template thành công');
      }
      onSave();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const templateText = watch('template_text', '');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template ? 'Sửa template' : 'Tạo template mới'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Tên template *</Label>
            <Input {...register('name', { required: true })} />
          </div>
          
          <div className="space-y-2">
            <Label>Nội dung template *</Label>
            <Textarea 
              {...register('template_text', { required: true })} 
              rows={6}
              placeholder="Sử dụng {{voucher_code}}, {{campaign_name}}, {{discount_display}}, {{expires_at}}"
            />
            <p className="text-xs text-muted-foreground">
              Biến khả dụng: {`{{voucher_code}}, {{campaign_name}}, {{discount_display}}, {{expires_at}}`}
            </p>
          </div>

          <div className="space-y-2">
            <Label>HTML template (tùy chọn)</Label>
            <Textarea 
              {...register('template_html')} 
              rows={4}
              placeholder="<div>HTML tùy chỉnh cho export ảnh</div>"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch {...register('is_default')} />
            <Label>Đặt làm template mặc định</Label>
          </div>

          {templateText && (
            <div className="p-3 bg-muted rounded-lg">
              <Label className="text-sm font-semibold">Preview:</Label>
              <div className="text-sm whitespace-pre-wrap mt-2">
                {templateText
                  .replace('{{voucher_code}}', 'SAMPLE123')
                  .replace('{{campaign_name}}', 'Chiến dịch mẫu')
                  .replace('{{discount_display}}', '20%')
                  .replace('{{expires_at}}', '31/12/2024')}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">
              {template ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
