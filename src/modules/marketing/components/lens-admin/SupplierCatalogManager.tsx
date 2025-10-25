import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, FileText, Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { lensApi } from '../../services/lensApi';
import { SupplierCatalogForm } from './SupplierCatalogForm';
import { SupplierCatalog } from '../../types/lens';

export function SupplierCatalogManager() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<SupplierCatalog | null>(null);
  const queryClient = useQueryClient();

  const { data: catalogs, isLoading } = useQuery({
    queryKey: ['supplier-catalogs'],
    queryFn: () => lensApi.getSupplierCatalogs(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => lensApi.deleteSupplierCatalog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-catalogs'] });
      toast.success('Đã xóa catalog');
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  const handleEdit = (catalog: SupplierCatalog) => {
    setEditingCatalog(catalog);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Xóa catalog "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Quản lý Catalog PDF</h3>
          <p className="text-sm text-muted-foreground">Quản lý file PDF catalog của các nhà cung cấp</p>
        </div>
        <Button onClick={() => { setEditingCatalog(null); setIsFormOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm Catalog
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : catalogs && catalogs.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Nhà cung cấp</TableHead>
              <TableHead>Tên hiển thị</TableHead>
              <TableHead>File</TableHead>
              <TableHead>Kích thước</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {catalogs?.map((catalog) => (
              <TableRow key={catalog.id}>
                <TableCell className="text-2xl">{catalog.icon}</TableCell>
                <TableCell className="font-medium">{catalog.supplier_name}</TableCell>
                <TableCell>{catalog.display_name}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{catalog.file_name}</TableCell>
                <TableCell>{catalog.file_size ? `${(catalog.file_size / 1024 / 1024).toFixed(2)} MB` : '-'}</TableCell>
                <TableCell>
                  <Badge variant={catalog.is_active ? 'default' : 'secondary'}>
                    {catalog.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => window.open(catalog.pdf_url, '_blank')}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(catalog)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(catalog.id, catalog.display_name)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Chưa có catalog nào</p>
          <Button onClick={() => { setEditingCatalog(null); setIsFormOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm Catalog đầu tiên
          </Button>
        </div>
      )}

      <SupplierCatalogForm
        open={isFormOpen}
        catalog={editingCatalog}
        onClose={() => { setIsFormOpen(false); setEditingCatalog(null); }}
      />
    </div>
  );
}
