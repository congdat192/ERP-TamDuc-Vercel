
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Campaign, CampaignType, CampaignStatus, CAMPAIGN_TYPE_LABELS, CAMPAIGN_STATUS_LABELS } from '../types/campaign';
import { cn } from '@/lib/utils';

const campaignSchema = z.object({
  name: z.string().min(1, 'Tên chiến dịch là bắt buộc').max(100, 'Tên chiến dịch quá dài'),
  description: z.string().optional(),
  types: z.array(z.enum(['monthly', 'promotion-batch', 'ongoing'])).min(1, 'Chọn ít nhất một loại chiến dịch'),
  startDate: z.date({ required_error: 'Ngày bắt đầu là bắt buộc' }),
  endDate: z.date().optional(),
  hasEndDate: z.boolean().default(false),
  isCustomSchedule: z.boolean().default(false),
  customDescription: z.string().optional(),
  status: z.enum(['active', 'inactive', 'draft', 'completed']),
  isActive: z.boolean().default(false)
}).refine((data) => {
  if (data.hasEndDate && data.endDate && data.startDate) {
    return data.endDate > data.startDate;
  }
  return true;
}, {
  message: "Ngày kết thúc phải sau ngày bắt đầu",
  path: ["endDate"]
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CampaignFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Campaign | null;
  mode: 'create' | 'edit';
}

const campaignTypes: CampaignType[] = ['monthly', 'promotion-batch', 'ongoing'];

export function CampaignForm({ isOpen, onClose, onSubmit, initialData, mode }: CampaignFormProps) {
  const [selectedTypes, setSelectedTypes] = useState<CampaignType[]>([]);

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      description: '',
      types: [],
      status: 'draft',
      isActive: false,
      hasEndDate: false,
      isCustomSchedule: false,
      customDescription: ''
    }
  });

  useEffect(() => {
    if (initialData && mode === 'edit') {
      const hasEndDate = !!initialData.schedule.endDate;
      form.reset({
        name: initialData.name,
        description: initialData.description || '',
        types: initialData.types,
        startDate: initialData.schedule.startDate,
        endDate: initialData.schedule.endDate,
        hasEndDate,
        isCustomSchedule: initialData.schedule.isCustom,
        customDescription: initialData.schedule.customDescription || '',
        status: initialData.status,
        isActive: initialData.status === 'active'
      });
      setSelectedTypes(initialData.types);
    } else {
      form.reset({
        name: '',
        description: '',
        types: [],
        status: 'draft',
        isActive: false,
        hasEndDate: false,
        isCustomSchedule: false,
        customDescription: ''
      });
      setSelectedTypes([]);
    }
  }, [initialData, mode, form]);

  const handleTypeToggle = (type: CampaignType) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    setSelectedTypes(newTypes);
    form.setValue('types', newTypes);
  };

  const handleActiveToggle = (isActive: boolean) => {
    form.setValue('isActive', isActive);
    form.setValue('status', isActive ? 'active' : 'draft');
  };

  const handleEndDateToggle = (hasEndDate: boolean) => {
    form.setValue('hasEndDate', hasEndDate);
    if (!hasEndDate) {
      form.setValue('endDate', undefined);
    }
  };

  const handleSubmit = (data: CampaignFormData) => {
    const campaignData = {
      name: data.name,
      description: data.description,
      types: data.types,
      schedule: {
        startDate: data.startDate,
        endDate: data.hasEndDate ? data.endDate : undefined,
        isCustom: data.isCustomSchedule,
        customDescription: data.customDescription
      },
      status: data.isActive ? 'active' : data.status
    };

    onSubmit(campaignData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Tạo Chiến Dịch Mới' : 'Chỉnh Sửa Chiến Dịch'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông Tin Cơ Bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Tên Chiến Dịch *</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="Nhập tên chiến dịch..."
                  className="mt-1"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Mô Tả</Label>
                <Textarea
                  id="description"
                  {...form.register('description')}
                  placeholder="Mô tả ngắn gọn về chiến dịch..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Trạng Thái Chiến Dịch</Label>
                  <p className="text-sm text-gray-500">
                    {form.watch('isActive') ? 'Chiến dịch sẽ được kích hoạt ngay lập tức' : 'Chiến dịch sẽ được lưu dưới dạng nháp'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="active-toggle" className="text-sm">
                    {form.watch('isActive') ? 'Kích hoạt' : 'Nháp'}
                  </Label>
                  <Switch
                    id="active-toggle"
                    checked={form.watch('isActive')}
                    onCheckedChange={handleActiveToggle}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loại Chiến Dịch *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {campaignTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-3">
                    <Checkbox
                      id={type}
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={() => handleTypeToggle(type)}
                    />
                    <Label htmlFor={type} className="flex-1 cursor-pointer">
                      {CAMPAIGN_TYPE_LABELS[type]}
                    </Label>
                  </div>
                ))}
              </div>
              
              {selectedTypes.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedTypes.map((type) => (
                    <Badge key={type} variant="secondary">
                      {CAMPAIGN_TYPE_LABELS[type]}
                    </Badge>
                  ))}
                </div>
              )}
              
              {form.formState.errors.types && (
                <p className="text-sm text-red-600 mt-2">{form.formState.errors.types.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lịch Trình</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Ngày Bắt Đầu *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full mt-1 justify-start text-left font-normal",
                          !form.watch('startDate') && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.watch('startDate') ? (
                          format(form.watch('startDate'), "dd/MM/yyyy")
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.watch('startDate')}
                        onSelect={(date) => form.setValue('startDate', date!)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.startDate && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label>Ngày Kết Thúc</Label>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="has-end-date" className="text-sm">Có ngày kết thúc</Label>
                      <Switch
                        id="has-end-date"
                        checked={form.watch('hasEndDate')}
                        onCheckedChange={handleEndDateToggle}
                      />
                    </div>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={!form.watch('hasEndDate')}
                        className={cn(
                          "w-full mt-1 justify-start text-left font-normal",
                          (!form.watch('endDate') || !form.watch('hasEndDate')) && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.watch('endDate') && form.watch('hasEndDate') ? (
                          format(form.watch('endDate'), "dd/MM/yyyy")
                        ) : (
                          <span>Không giới hạn</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.watch('endDate')}
                        onSelect={(date) => form.setValue('endDate', date)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                        disabled={(date) => {
                          const startDate = form.watch('startDate');
                          return startDate ? date < startDate : false;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.endDate && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.endDate.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="custom-schedule"
                  checked={form.watch('isCustomSchedule')}
                  onCheckedChange={(checked) => form.setValue('isCustomSchedule', checked)}
                />
                <Label htmlFor="custom-schedule">Lịch trình tùy chỉnh</Label>
              </div>

              {form.watch('isCustomSchedule') && (
                <div>
                  <Label htmlFor="customDescription">Mô Tả Lịch Trình</Label>
                  <Textarea
                    id="customDescription"
                    {...form.register('customDescription')}
                    placeholder="Mô tả chi tiết về lịch trình tùy chỉnh..."
                    className="mt-1"
                    rows={2}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Tạo Chiến Dịch' : 'Cập Nhật'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
