import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Trash2, Eye } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface TemplateImage {
  name: string;
  url: string;
  size: number;
  created_at: string;
}

export function VoucherImageSettings() {
  const [templates, setTemplates] = useState<TemplateImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('voucher-templates')
        .list();

      if (error) throw error;

      const templatesWithUrls = data.map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('voucher-templates')
          .getPublicUrl(file.name);
        
        return {
          name: file.name,
          url: publicUrl,
          size: file.metadata?.size || 0,
          created_at: file.created_at
        };
      });

      setTemplates(templatesWithUrls);
    } catch (error: any) {
      toast.error('Không thể tải danh sách ảnh');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      toast.error('Chỉ hỗ trợ file PNG, JPG, JPEG');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    setLoading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('voucher-templates')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      toast.success('Upload ảnh thành công');
      loadTemplates();
    } catch (error: any) {
      toast.error('Không thể upload ảnh');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setLoading(true);
    try {
      const { error } = await supabase.storage
        .from('voucher-templates')
        .remove([deleteTarget]);

      if (error) throw error;

      toast.success('Đã xóa ảnh');
      setDeleteTarget(null);
      loadTemplates();
    } catch (error: any) {
      toast.error('Không thể xóa ảnh');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Quản lý Ảnh Voucher</h3>
          <p className="text-sm text-muted-foreground">
            Upload và quản lý các template ảnh voucher
          </p>
        </div>
        <div>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleUpload}
            className="hidden"
            id="voucher-image-upload"
            disabled={loading}
          />
          <label htmlFor="voucher-image-upload">
            <Button asChild disabled={loading}>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Upload Ảnh
              </span>
            </Button>
          </label>
        </div>
      </div>

      {loading && templates.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">Đang tải...</div>
      ) : templates.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Chưa có ảnh voucher nào</p>
          <p className="text-sm text-muted-foreground mt-2">
            Click "Upload Ảnh" để thêm template
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(template => (
            <Card key={template.name} className="p-4 space-y-3">
              <img
                src={template.url}
                alt={template.name}
                className="w-full h-48 object-cover rounded cursor-pointer hover:opacity-80 transition"
                onClick={() => setPreviewImage(template.url)}
              />
              <div className="space-y-1">
                <p className="text-sm font-medium truncate" title={template.name}>
                  {template.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(template.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setPreviewImage(template.url)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Xem
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => setDeleteTarget(template.name)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Xóa
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa ảnh này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Dialog */}
      <AlertDialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Xem trước ảnh voucher</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="p-4">
            <img src={previewImage || ''} alt="Preview" className="w-full h-auto" />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Đóng</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
