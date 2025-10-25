import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { lensApi } from '../../services/lensApi';
import { SupplierCatalog, CreateSupplierCatalogInput } from '../../types/lens';

interface SupplierCatalogFormProps {
  open: boolean;
  catalog: SupplierCatalog | null;
  onClose: () => void;
}

export function SupplierCatalogForm({ open, catalog, onClose }: SupplierCatalogFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(catalog?.pdf_url || null);
  const [fileName, setFileName] = useState<string>(catalog?.file_name || '');
  const [fileSize, setFileSize] = useState<number | null>(catalog?.file_size || null);
  
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      supplier_name: catalog?.supplier_name || '',
      display_name: catalog?.display_name || '',
      icon: catalog?.icon || '',
      display_order: catalog?.display_order || 0,
    }
  });

  useEffect(() => {
    if (catalog) {
      reset({
        supplier_name: catalog.supplier_name,
        display_name: catalog.display_name,
        icon: catalog.icon || '',
        display_order: catalog.display_order,
      });
      setPdfUrl(catalog.pdf_url);
      setFileName(catalog.file_name);
      setFileSize(catalog.file_size);
    } else {
      reset({
        supplier_name: '',
        display_name: '',
        icon: '',
        display_order: 0,
      });
      setPdfUrl(null);
      setFileName('');
      setFileSize(null);
    }
  }, [catalog, reset]);

  const createMutation = useMutation({
    mutationFn: (input: CreateSupplierCatalogInput) => lensApi.createSupplierCatalog(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-catalogs'] });
      toast.success('Đã tạo catalog');
      onClose();
    },
    onError: (error: any) => toast.error(`Lỗi: ${error.message}`),
  });

  const updateMutation = useMutation({
    mutationFn: (input: any) => lensApi.updateSupplierCatalog(catalog!.id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-catalogs'] });
      toast.success('Đã cập nhật catalog');
      onClose();
    },
    onError: (error: any) => toast.error(`Lỗi: ${error.message}`),
  });

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Chỉ chấp nhận file PDF');
      return;
    }

    setIsUploading(true);
    try {
      const url = await lensApi.uploadCatalogPDF(file);
      setPdfUrl(url);
      setFileName(file.name);
      setFileSize(file.size);
      toast.success('Upload PDF thành công');
    } catch (error: any) {
      toast.error(`Lỗi upload: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (data: any) => {
    if (!pdfUrl) {
      toast.error('Vui lòng upload file PDF');
      return;
    }

    const payload = {
      ...data,
      pdf_url: pdfUrl,
      file_name: fileName,
      file_size: fileSize,
    };

    if (catalog) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{catalog ? 'Sửa Catalog' : 'Thêm Catalog'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Nhà cung cấp *</Label>
            <Input {...register('supplier_name', { required: true })} placeholder="CHEMI, ZEISS, Essilor" />
            {errors.supplier_name && <p className="text-sm text-red-600">Bắt buộc</p>}
          </div>

          <div>
            <Label>Tên hiển thị *</Label>
            <Input {...register('display_name', { required: true })} placeholder="CHEMI Catalog 2024" />
            {errors.display_name && <p className="text-sm text-red-600">Bắt buộc</p>}
          </div>

          <div>
            <Label>Icon (emoji)</Label>
            <Input {...register('icon')} placeholder="🧪" />
          </div>

          <div>
            <Label>File PDF *</Label>
            <div className="flex gap-2 items-center">
              <Button type="button" variant="outline" disabled={isUploading} onClick={() => document.getElementById('pdf-upload')?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Đang upload...' : 'Upload PDF'}
              </Button>
              <Input id="pdf-upload" type="file" accept="application/pdf" className="hidden" onChange={handlePDFUpload} />
              <span className="text-sm text-muted-foreground">{fileName || 'Chưa chọn file'}</span>
            </div>
          </div>

          <div>
            <Label>Thứ tự hiển thị</Label>
            <Input type="number" {...register('display_order')} />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {catalog ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
