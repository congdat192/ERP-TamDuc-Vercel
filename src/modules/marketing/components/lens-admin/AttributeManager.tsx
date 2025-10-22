import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { lensApi } from '../../services/lensApi';
import { LensProductAttribute } from '../../types/lens';
import { toast } from 'sonner';

interface AttributeManagerProps {
  open: boolean;
  onClose: () => void;
}

export function AttributeManager({ open, onClose }: AttributeManagerProps) {
  const [attributes, setAttributes] = useState<LensProductAttribute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingAttr, setEditingAttr] = useState<LensProductAttribute | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: 'select' as 'select' | 'color' | 'text' | 'checkbox',
    options: [] as string[],
    icon: '',
    description: ''
  });
  const [optionsText, setOptionsText] = useState('');

  useEffect(() => {
    if (open) {
      loadAttributes();
    }
  }, [open]);

  const loadAttributes = async () => {
    setIsLoading(true);
    try {
      const data = await lensApi.getAttributes();
      setAttributes(data);
    } catch (error: any) {
      toast.error('Lỗi tải attributes: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (attr: LensProductAttribute) => {
    setEditingAttr(attr);
    setFormData({
      name: attr.name,
      slug: attr.slug,
      type: attr.type,
      options: attr.options,
      icon: attr.icon || '',
      description: attr.description || ''
    });
    setOptionsText(attr.options.join('\n'));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      toast.error('Vui lòng nhập tên và slug');
      return;
    }

    try {
      const dataToSave = {
        ...formData,
        options: formData.type === 'select' ? optionsText.split('\n').filter(o => o.trim()) : [],
        is_active: true,
        display_order: editingAttr?.display_order || attributes.length + 1
      };

      if (editingAttr?.id) {
        await lensApi.updateAttribute(editingAttr.id, dataToSave);
        toast.success('Cập nhật thành công');
      } else {
        await lensApi.createAttribute(dataToSave);
        toast.success('Tạo mới thành công');
      }
      await loadAttributes();
      resetForm();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa attribute này? Dữ liệu liên quan sẽ bị xóa.')) return;
    try {
      await lensApi.deleteAttribute(id);
      toast.success('Đã xóa');
      await loadAttributes();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setEditingAttr(null);
    setFormData({
      name: '',
      slug: '',
      type: 'select',
      options: [],
      icon: '',
      description: ''
    });
    setOptionsText('');
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quản lý thuộc tính sản phẩm</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Attributes Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attributes.map(attr => (
                  <TableRow key={attr.id}>
                    <TableCell>
                      {attr.icon && <span className="mr-2">{attr.icon}</span>}
                      <span className="font-medium">{attr.name}</span>
                    </TableCell>
                    <TableCell><code className="text-xs bg-muted px-2 py-1 rounded">{attr.slug}</code></TableCell>
                    <TableCell><Badge variant="outline">{attr.type}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap max-w-xs">
                        {attr.type === 'checkbox' ? (
                          <Badge variant="secondary" className="text-xs">✓/✗</Badge>
                        ) : attr.type === 'text' ? (
                          <span className="text-xs text-muted-foreground">Text tự do</span>
                        ) : attr.options.length > 0 ? (
                          <>
                            {attr.options.slice(0, 3).map(opt => (
                              <Badge key={opt} variant="outline" className="text-xs">{opt}</Badge>
                            ))}
                            {attr.options.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{attr.options.length - 3}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">Chưa có giá trị</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(attr)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(attr.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Add/Edit Form */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              {editingAttr?.id ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {editingAttr?.id ? 'Chỉnh sửa thuộc tính' : 'Thêm thuộc tính mới'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tên thuộc tính *</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Chất liệu"
                />
              </div>
              <div>
                <Label>Slug (không dấu) *</Label>
                <Input 
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  placeholder="VD: chat_lieu"
                />
              </div>
              <div>
                <Label>Loại *</Label>
                <Select 
                  value={formData.type}
                  onValueChange={(v: any) => setFormData({ ...formData, type: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select">Select (dropdown)</SelectItem>
                    <SelectItem value="checkbox">Checkbox (có/không)</SelectItem>
                    <SelectItem value="text">Text (tự do)</SelectItem>
                    <SelectItem value="color">Color (màu sắc)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Icon (emoji)</Label>
                <Input 
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="☀️ 🛡️ 💙"
                />
              </div>
              <div className="col-span-2">
                <Label>Mô tả</Label>
                <Input 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Giải thích ngắn gọn về thuộc tính này"
                />
              </div>
              {formData.type === 'select' && (
                <div className="col-span-2">
                  <Label>Giá trị (mỗi dòng 1 giá trị)</Label>
                  <Textarea
                    className="min-h-[120px] font-mono text-sm"
                    value={optionsText}
                    onChange={(e) => setOptionsText(e.target.value)}
                    placeholder="Nhập mỗi giá trị một dòng, ví dụ:&#10;Nhựa&#10;Polycarbonate&#10;Trivex&#10;Hi-Index&#10;Mineral"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSave} disabled={!formData.name || !formData.slug}>
                <Save className="w-4 h-4 mr-2" />
                {editingAttr?.id ? 'Cập nhật' : 'Tạo mới'}
              </Button>
              {editingAttr && (
                <Button variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" />
                  Hủy
                </Button>
              )}
              {!editingAttr && (
                <Button variant="outline" onClick={onClose}>
                  Đóng
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
