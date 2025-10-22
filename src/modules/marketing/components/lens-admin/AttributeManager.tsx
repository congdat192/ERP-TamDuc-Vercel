import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { lensApi } from '../../services/lensApi';
import { AttributeFormDialog } from './AttributeFormDialog';
import { LensProductAttribute } from '../../types/lens';
import { toast } from 'sonner';

export function AttributeManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingAttr, setEditingAttr] = useState<LensProductAttribute | null>(null);

  const { data: attributes = [], refetch } = useQuery({
    queryKey: ['lens-attributes'],
    queryFn: () => lensApi.getAttributes(),
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa thuộc tính này? Sản phẩm hiện tại sẽ không bị ảnh hưởng.')) return;
    
    try {
      await lensApi.deleteAttribute(id);
      toast.success('Đã xóa thuộc tính');
      refetch();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Quản lý Thuộc tính Sản phẩm</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Các giá trị này sẽ hiển thị dưới dạng dropdown khi tạo sản phẩm
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingAttr(null);
            setShowForm(true);
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm thuộc tính
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên thuộc tính</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Giá trị</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attributes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Chưa có thuộc tính nào
                </TableCell>
              </TableRow>
            ) : (
              attributes.map(attr => (
                <TableRow key={attr.id}>
                  <TableCell className="font-medium">{attr.name}</TableCell>
                  <TableCell>
                    <code className="bg-muted px-2 py-1 rounded text-sm">{attr.slug}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{attr.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {attr.options.slice(0, 5).map(opt => (
                        <Badge key={opt} variant="secondary">{opt}</Badge>
                      ))}
                      {attr.options.length > 5 && (
                        <Badge variant="secondary">+{attr.options.length - 5}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingAttr(attr);
                          setShowForm(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(attr.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <AttributeFormDialog
        open={showForm}
        attribute={editingAttr}
        onClose={(success) => {
          setShowForm(false);
          if (success) refetch();
        }}
      />
    </Card>
  );
}
