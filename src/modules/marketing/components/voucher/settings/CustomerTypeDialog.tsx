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

interface CustomerType {
  id: string;
  type_code: string;
  type_name: string;
  description: string | null;
  is_active: boolean;
}

interface CustomerTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerType: CustomerType | null;
  onSave: () => void;
}

export function CustomerTypeDialog({ open, onOpenChange, customerType, onSave }: CustomerTypeDialogProps) {
  const { register, handleSubmit, reset } = useForm<CustomerType>();

  useEffect(() => {
    if (customerType) {
      reset(customerType);
    } else {
      reset({ 
        type_code: '', 
        type_name: '', 
        description: '', 
        is_active: true 
      } as any);
    }
  }, [customerType, reset]);

  const onSubmit = async (data: CustomerType) => {
    try {
      if (customerType) {
        await voucherService.updateCustomerType(customerType.id, {
          type_name: data.type_name,
          description: data.description || undefined,
          is_active: data.is_active
        });
        toast.success('Cập nhật loại khách hàng thành công');
      } else {
        await voucherService.createCustomerType({
          type_code: data.type_code,
          type_name: data.type_name,
          description: data.description || undefined
        });
        toast.success('Tạo loại khách hàng thành công');
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
          <DialogTitle>{customerType ? 'Sửa loại khách hàng' : 'Tạo loại khách hàng mới'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Mã loại khách hàng *</Label>
            <Input 
              {...register('type_code', { required: true })} 
              disabled={!!customerType}
              placeholder="new, existing, vip"
            />
            {customerType && (
              <p className="text-xs text-muted-foreground">Không thể thay đổi mã sau khi tạo</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Tên hiển thị *</Label>
            <Input 
              {...register('type_name', { required: true })} 
              placeholder="Khách hàng mới"
            />
          </div>

          <div className="space-y-2">
            <Label>Mô tả</Label>
            <Textarea 
              {...register('description')} 
              placeholder="Mô tả chi tiết về loại khách hàng này"
              rows={3}
            />
          </div>

          {customerType && (
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
              {customerType ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
