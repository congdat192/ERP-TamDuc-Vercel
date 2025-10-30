import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ScheduleConfig {
  id?: string;
  credential_id: string;
  sync_type: string;
  frequency: 'hourly' | 'daily' | 'custom';
  custom_interval_hours?: number;
  enabled: boolean;
  next_run_at?: string;
  last_run_at?: string;
}

interface Props {
  credentialId: string;
}

export function KiotVietScheduleConfig({ credentialId }: Props) {
  const queryClient = useQueryClient();
  const [config, setConfig] = useState<ScheduleConfig>({
    credential_id: credentialId,
    sync_type: 'products_full',
    frequency: 'daily',
    enabled: false,
  });

  // Fetch existing schedule
  const { data: existingSchedule } = useQuery({
    queryKey: ['kiotviet-schedule', credentialId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kiotviet_sync_schedules')
        .select('*')
        .eq('credential_id', credentialId)
        .eq('sync_type', 'products_full')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  // Update local state when schedule is fetched
  useEffect(() => {
    if (existingSchedule) {
      setConfig({
        id: existingSchedule.id,
        credential_id: existingSchedule.credential_id,
        sync_type: existingSchedule.sync_type,
        frequency: existingSchedule.frequency as 'hourly' | 'daily' | 'custom',
        custom_interval_hours: existingSchedule.custom_interval_hours || undefined,
        enabled: existingSchedule.enabled,
        next_run_at: existingSchedule.next_run_at,
        last_run_at: existingSchedule.last_run_at,
      });
    }
  }, [existingSchedule]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: ScheduleConfig) => {
      if (data.id) {
        // Update existing
        const { error } = await supabase
          .from('kiotviet_sync_schedules')
          .update({
            frequency: data.frequency,
            custom_interval_hours: data.custom_interval_hours,
            enabled: data.enabled,
          })
          .eq('id', data.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('kiotviet_sync_schedules')
          .insert({
            credential_id: data.credential_id,
            sync_type: data.sync_type,
            frequency: data.frequency,
            custom_interval_hours: data.custom_interval_hours,
            enabled: data.enabled,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kiotviet-schedule', credentialId] });
      toast.success('Đã lưu cấu hình đồng bộ tự động');
    },
    onError: (error: any) => {
      toast.error('Lỗi lưu cấu hình: ' + error.message);
    },
  });

  const handleSave = () => {
    // Validate custom interval
    if (config.frequency === 'custom' && (!config.custom_interval_hours || config.custom_interval_hours < 1)) {
      toast.error('Vui lòng nhập số giờ hợp lệ (tối thiểu 1)');
      return;
    }

    saveMutation.mutate(config);
  };

  // Calculate next sync text
  const getNextSyncText = () => {
    if (!config.enabled) return 'Đã tắt';
    if (!config.next_run_at) return 'Chưa lên lịch';

    const nextRun = new Date(config.next_run_at);
    if (nextRun <= new Date()) return 'Đang chờ chạy...';

    return 'Trong ' + formatDistanceToNow(nextRun, { locale: vi, addSuffix: false });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Đồng Bộ Tự Động
        </CardTitle>
        <CardDescription>
          Cấu hình lịch đồng bộ dữ liệu tự động từ KiotViet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="schedule-enabled" className="flex flex-col gap-1">
            <span className="font-medium">Bật đồng bộ tự động</span>
            <span className="text-sm text-muted-foreground">
              Tự động đồng bộ dữ liệu theo lịch đã cấu hình
            </span>
          </Label>
          <Switch
            id="schedule-enabled"
            checked={config.enabled}
            onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
          />
        </div>

        {/* Frequency Selector */}
        <div className="space-y-2">
          <Label>Tần suất đồng bộ</Label>
          <Select
            value={config.frequency}
            onValueChange={(value: 'hourly' | 'daily' | 'custom') =>
              setConfig({ ...config, frequency: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Mỗi giờ</SelectItem>
              <SelectItem value="daily">Mỗi ngày</SelectItem>
              <SelectItem value="custom">Tùy chỉnh</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Interval Input */}
        {config.frequency === 'custom' && (
          <div className="space-y-2">
            <Label htmlFor="custom-hours">Số giờ (1-168)</Label>
            <Input
              id="custom-hours"
              type="number"
              min={1}
              max={168}
              value={config.custom_interval_hours || ''}
              onChange={(e) =>
                setConfig({ ...config, custom_interval_hours: parseInt(e.target.value) || undefined })
              }
              placeholder="Nhập số giờ"
            />
          </div>
        )}

        {/* Next Sync Preview */}
        {config.enabled && (
          <div className="rounded-lg border bg-muted/50 p-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Đồng bộ tiếp theo:</span>
              <span className="font-medium">{getNextSyncText()}</span>
            </div>
            {config.last_run_at && (
              <div className="mt-1 text-xs text-muted-foreground">
                Lần cuối: {new Date(config.last_run_at).toLocaleString('vi-VN')}
              </div>
            )}
          </div>
        )}

        {/* Info Alert */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
          <div className="flex gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-xs text-blue-800 dark:text-blue-300">
              Hệ thống sẽ kiểm tra lịch mỗi 5 phút. Đồng bộ sẽ chạy khi đến thời gian đã lên lịch.
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} disabled={saveMutation.isPending} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {saveMutation.isPending ? 'Đang lưu...' : 'Lưu cấu hình'}
        </Button>
      </CardContent>
    </Card>
  );
}
