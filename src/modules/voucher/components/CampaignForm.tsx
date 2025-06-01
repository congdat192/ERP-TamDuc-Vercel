
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
  isCustomSchedule: z.boolean().default(false),
  customDescription: z.string().optional(),
  status: z.enum(['active', 'inactive', 'draft', 'completed'])
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
      isCustomSchedule: false,
      customDescription: ''
    }
  });

  useEffect(() => {
    if (initialData && mode === 'edit') {
      form.reset({
        name: initialData.name,
        description: initialData.description || '',
        types: initialData.types,
        startDate: initialData.schedule.startDate,
        endDate: initialData.schedule.endDate,
        isCustomSchedule: initialData.schedule.isCustom,
        customDescription: initialData.schedule.customDescription || '',
        status: initialData.status
      });
      setSelectedTypes(initialData.types);
    } else {
      form.reset({
        name: '',
        description: '',
        types: [],
        status: 'draft',
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

  const handleSubmit = (data: CampaignFormData) => {
    const campaignData = {
      name: data.name,
      description: data.description,
      types: data.types,
      schedule: {
        startDate: data.startDate,
        endDate: data.endDate,
        isCustom: data.isCustomSchedule,
        customDescription: data.customDescription
      },
      status: data.status
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

              <div>
                <Label>Trạng Thái</Label>
                <Select
                  value={form.watch('status')}
                  onValueChange={(value: CampaignStatus) => form.setValue('status', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Nháp</SelectItem>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Tạm dừng</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                  </SelectContent>
                </Select>
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
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.startDate && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <Label>Ngày Kết Thúc</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full mt-1 justify-start text-left font-normal",
                          !form.watch('endDate') && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.watch('endDate') ? (
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
                        className="pointer-events-auto"
                        disabled={(date) => {
                          const startDate = form.watch('startDate');
                          return startDate ? date < startDate : false;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
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
