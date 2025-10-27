import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { voucherService } from '../../../services/voucherService';
import { toast } from 'sonner';

interface VoucherSource {
  id: string;
  source_code: string;
  source_name: string;
  description: string | null;
  is_active: boolean;
}

interface SourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: VoucherSource | null;
  onSave: () => void;
}

export function SourceDialog({ open, onOpenChange, source, onSave }: SourceDialogProps) {
  const { register, handleSubmit, reset } = useForm<VoucherSource>();

  useEffect(() => {
    if (source) {
      reset(source);
    } else {
      reset({ 
        source_code: '', 
        source_name: '', 
        description: '', 
        is_active: true 
      } as any);
    }
  }, [source, reset]);

  const onSubmit = async (data: VoucherSource) => {
    try {
      if (source) {
        await voucherService.updateSource(source.id, {
          source_name: data.source_name,
          description: data.description || undefined,
          is_active: data.is_active
        });
        toast.success('Cập nhật nguồn khách hàng thành công');
      } else {
        await voucherService.createSource({
          source_code: data.source_code,
          source_name: data.source_name,
          description: data.description || undefined
        });
        toast.success('Tạo nguồn khách hàng thành công');
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
          <DialogTitle>{source ? 'Sửa nguồn khách hàng' : 'Tạo nguồn khách hàng mới'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Mã nguồn *</Label>
            <Input 
              {...register('source_code', { required: true })} 
              disabled={!!source}
              placeholder="fanpage, website, zalo"
            />
            {source && (
              <p className="text-xs text-muted-foreground">Không thể thay đổi mã sau khi tạo</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Tên hiển thị *</Label>
            <Input 
              {...register('source_name', { required: true })} 
              placeholder="Facebook Fanpage"
            />
          </div>

          <div className="space-y-2">
            <Label>Mô tả</Label>
            <Textarea 
              {...register('description')} 
              placeholder="Mô tả chi tiết về nguồn khách hàng này"
              rows={3}
            />
          </div>

          {source && (
            <div className="flex items-center space-x-2">
              <Switch {...register('is_active')} />
              <Label>Kích hoạt</Label>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">
              {source ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
