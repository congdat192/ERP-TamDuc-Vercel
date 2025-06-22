
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, UserCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CustomerType {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

// Consistent mock data for customer types
const mockCustomerTypes: CustomerType[] = [
  {
    id: '1',
    name: 'Khách hàng VIP',
    description: 'Khách hàng có giá trị cao, mua sắm thường xuyên',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Khách hàng thường',
    description: 'Khách hàng mua sắm bình thường',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Khách hàng mới',
    description: 'Khách hàng lần đầu mua sắm',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Khách hàng doanh nghiệp',
    description: 'Khách hàng là doanh nghiệp, mua số lượng lớn',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

export function CustomerTypeManager() {
  const [types, setTypes] = useState<CustomerType[]>(mockCustomerTypes);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<CustomerType | null>(null);
  const [deleteTypeId, setDeleteTypeId] = useState<string>('');

  // Form states
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const handleCreateType = () => {
    if (!formName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên loại khách hàng",
        variant: "destructive"
      });
      return;
    }

    const newType: CustomerType = {
      id: Date.now().toString(),
      name: formName.trim(),
      description: formDescription.trim(),
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setTypes([...types, newType]);
    setFormName('');
    setFormDescription('');
    setIsCreateDialogOpen(false);

    toast({
      title: "Thành công",
      description: `Đã thêm loại khách hàng "${newType.name}"`,
    });
  };

  const handleEditType = () => {
    if (!selectedType || !formName.trim()) return;

    const updatedType = {
      ...selectedType,
      name: formName.trim(),
      description: formDescription.trim()
    };

    setTypes(types.map(type => 
      type.id === selectedType.id ? updatedType : type
    ));

    setIsEditDialogOpen(false);
    setSelectedType(null);
    setFormName('');
    setFormDescription('');

    toast({
      title: "Thành công",
      description: `Đã cập nhật loại khách hàng "${updatedType.name}"`,
    });
  };

  const handleDeleteType = () => {
    const typeToDelete = types.find(t => t.id === deleteTypeId);
    setTypes(types.filter(t => t.id !== deleteTypeId));
    setIsDeleteDialogOpen(false);
    setDeleteTypeId('');

    toast({
      title: "Thành công",
      description: `Đã xóa loại khách hàng "${typeToDelete?.name}"`,
    });
  };

  const toggleTypeStatus = (typeId: string) => {
    setTypes(types.map(type => 
      type.id === typeId ? { ...type, isActive: !type.isActive } : type
    ));
  };

  const openEditDialog = (type: CustomerType) => {
    setSelectedType(type);
    setFormName(type.name);
    setFormDescription(type.description || '');
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    setFormName('');
    setFormDescription('');
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card className="voucher-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 theme-text-primary" />
            <span className="theme-text">Loại Khách Hàng</span>
          </CardTitle>
          <Button onClick={openCreateDialog} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Thêm Loại KH
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Loại</TableHead>
                <TableHead>Mô Tả</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium theme-text">{type.name}</TableCell>
                  <TableCell className="theme-text-muted text-sm">
                    {type.description || '-'}
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={type.isActive}
                      onCheckedChange={() => toggleTypeStatus(type.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(type)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          setDeleteTypeId(type.id);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {types.length === 0 && (
            <div className="text-center py-8 theme-text-muted">
              <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Chưa có loại khách hàng nào được thêm</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="voucher-card">
          <DialogHeader>
            <DialogTitle className="theme-text">Thêm Loại Khách Hàng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type-name">Tên loại</Label>
              <Input
                id="type-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="VD: VIP, Thường, Mới..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type-description">Mô tả</Label>
              <Input
                id="type-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Mô tả về loại khách hàng này..."
              />
            </div>
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleCreateType} className="flex-1">
                Thêm Loại
              </Button>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="voucher-card">
          <DialogHeader>
            <DialogTitle className="theme-text">Chỉnh Sửa Loại Khách Hàng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-type-name">Tên loại</Label>
              <Input
                id="edit-type-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="VD: VIP, Thường, Mới..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type-description">Mô tả</Label>
              <Input
                id="edit-type-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Mô tả về loại khách hàng này..."
              />
            </div>
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleEditType} className="flex-1">
                Cập Nhật
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="voucher-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="theme-text">Xác Nhận Xóa</AlertDialogTitle>
            <AlertDialogDescription className="theme-text-muted">
              Bạn có chắc chắn muốn xóa loại khách hàng này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteType}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
