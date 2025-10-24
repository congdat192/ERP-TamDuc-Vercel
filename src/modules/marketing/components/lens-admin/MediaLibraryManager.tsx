import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, AlertTriangle } from 'lucide-react';
import { lensApi } from '../../services/lensApi';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function MediaLibraryManager() {
  const [unusedDays, setUnusedDays] = useState(30);
  const queryClient = useQueryClient();

  const { data: unusedMedia = [], isLoading } = useQuery({
    queryKey: ['unusedMedia', unusedDays],
    queryFn: () => lensApi.getUnusedMedia(unusedDays),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => lensApi.deleteMediaFromLibrary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unusedMedia'] });
      toast.success('Đã xóa ảnh');
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  const handleDelete = (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa ảnh này?')) return;
    deleteMutation.mutate(id);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const totalSize = unusedMedia.reduce((sum, m) => sum + m.file_size, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Quản lý ảnh không sử dụng
          </CardTitle>
          <CardDescription>
            Xóa ảnh không được sử dụng trong bất kỳ sản phẩm nào để tiết kiệm dung lượng
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold">{unusedMedia.length} ảnh</p>
              <p className="text-sm text-muted-foreground">
                Tổng dung lượng: {formatBytes(totalSize)}
              </p>
            </div>
            <Select value={String(unusedDays)} onValueChange={(v) => setUnusedDays(Number(v))}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Hơn 7 ngày</SelectItem>
                <SelectItem value="30">Hơn 30 ngày</SelectItem>
                <SelectItem value="90">Hơn 90 ngày</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Đang tải...
            </div>
          ) : unusedMedia.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Không có ảnh không sử dụng
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {unusedMedia.map((media) => (
                <div key={media.id} className="relative group border rounded-lg overflow-hidden">
                  <img
                    src={supabase.storage.from('lens-images').getPublicUrl(media.file_path).data.publicUrl}
                    alt={media.file_name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                    <p className="text-white text-xs truncate">{media.file_name}</p>
                    <p className="text-white/80 text-xs">{formatBytes(media.file_size)}</p>
                    <p className="text-white/80 text-xs">
                      {new Date(media.created_at).toLocaleDateString('vi-VN')}
                    </p>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="mt-2"
                      onClick={() => handleDelete(media.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Xóa
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
