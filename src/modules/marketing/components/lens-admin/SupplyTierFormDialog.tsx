import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { lensSupplyTiersApi } from '../../services/lensSupplyTiersApi';
import { LensSupplyTier } from '../../types/lens-extended';
import { toast } from 'sonner';

const schema = z.object({
  tier_type: z.enum(['IN_STORE', 'NEXT_DAY', 'CUSTOM_ORDER', 'FACTORY_ORDER']),
  tier_name: z.string().optional(),
  sph_min: z.number().min(-25).max(25),
  sph_max: z.number().min(-25).max(25),
  cyl_min: z.number().min(-10).max(10),
  cyl_max: z.number().min(-10).max(10),
  lead_time_days: z.number().min(0).max(365),
  stock_quantity: z.number().nullable().optional(),
  price_adjustment: z.number().default(0),
  display_order: z.number().default(0)
}).refine(data => data.sph_min <= data.sph_max, {
  message: "SPH min phải nhỏ hơn hoặc bằng SPH max",
  path: ["sph_max"]
}).refine(data => data.cyl_min <= data.cyl_max, {
  message: "CYL min phải nhỏ hơn hoặc bằng CYL max",
  path: ["cyl_max"]
});

type FormData = z.infer<typeof schema>;

interface SupplyTierFormDialogProps {
  productId: string;
  tier: LensSupplyTier | null;
  open: boolean;
  onClose: (success?: boolean) => void;
}

export function SupplyTierFormDialog({ productId, tier, open, onClose }: SupplyTierFormDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tier_type: 'IN_STORE',
      tier_name: '',
      sph_min: -10,
      sph_max: 4,
      cyl_min: -4,
      cyl_max: 0,
      lead_time_days: 0,
      stock_quantity: null,
      price_adjustment: 0,
      display_order: 0
    }
  });

  useEffect(() => {
    if (tier) {
      form.reset({
        tier_type: tier.tier_type,
        tier_name: tier.tier_name || '',
        sph_min: tier.sph_min,
        sph_max: tier.sph_max,
        cyl_min: tier.cyl_min,
        cyl_max: tier.cyl_max,
        lead_time_days: tier.lead_time_days,
        stock_quantity: tier.stock_quantity,
        price_adjustment: tier.price_adjustment,
        display_order: tier.display_order
      });
    } else {
      form.reset();
    }
  }, [tier, form]);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (tier) {
        return lensSupplyTiersApi.update(tier.id, { ...data, product_id: productId, is_active: true });
      } else {
        return lensSupplyTiersApi.create({ ...data, product_id: productId, is_active: true } as any);
      }
    },
    onSuccess: () => {
      toast.success(tier ? 'Đã cập nhật tầng cung ứng' : 'Đã thêm tầng cung ứng');
      onClose(true);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tier ? 'Cập nhật' : 'Thêm'} Tầng cung ứng</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tier_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại tier</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="IN_STORE">Có sẵn tại CH</SelectItem>
                        <SelectItem value="NEXT_DAY">Giao ngày mai</SelectItem>
                        <SelectItem value="CUSTOM_ORDER">Đặt hàng theo yêu cầu</SelectItem>
                        <SelectItem value="FACTORY_ORDER">Đặt hàng từ nhà máy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tier_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên tier (tuỳ chọn)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="VD: Stock có sẵn" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h4 className="font-semibold">Phạm vi SPH (Độ cầu)</h4>
                <FormField
                  control={form.control}
                  name="sph_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SPH Min</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.25"
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sph_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SPH Max</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.25"
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Phạm vi CYL (Độ loạn)</h4>
                <FormField
                  control={form.control}
                  name="cyl_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CYL Min</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.25"
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cyl_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CYL Max</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.25"
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="lead_time_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian giao (ngày)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tồn kho (tuỳ chọn)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value ?? ''}
                        onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_adjustment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chênh lệch giá (₫)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onClose()}>
                Huỷ
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Đang lưu...' : (tier ? 'Cập nhật' : 'Thêm mới')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
