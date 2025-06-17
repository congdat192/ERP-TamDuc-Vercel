import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2,
  ArrowUp,
  ArrowDown,
  Copy
} from 'lucide-react';
import { mockCustomerTypes, type MockCustomerType } from '../data/mockData';

export function CustomerTypeManager() {
  const [types, setTypes] = useState<MockCustomerType[]>(mockCustomerTypes);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<MockCustomerType | null>(null);
  const [deleteTypeId, setDeleteTypeId] = useState<string>('');
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const validateType = (name: string, description: string, excludeId?: string) => {
    if (!name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên loại khách hàng.",
        variant: "destructive"
      });
      return false;
    }

    if (types.some(t => t.name.toLowerCase() === name.trim().toLowerCase() && t.id !== excludeId)) {
      toast({
        title: "Lỗi",
        description: "Tên loại khách hàng đã tồn tại.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleCreateType = () => {
    if (!validateType(newName, newDescription)) return;

    const newType: MockCustomerType = {
      id: Date.now().toString(),
      name: newName.trim(),
      description: newDescription.trim(),
      isActive: true,
      order: types.length + 1
    };

    setTypes([...types, newType]);
    setNewName('');
    setNewDescription('');
    setIsCreateModalOpen(false);
    
    toast({
      title: "Thành công",
      description: "Loại khách hàng mới đã được tạo thành công."
    });
  };

  const handleEditType = () => {
    if (!editingType) return;
    
    if (!validateType(editingType.name, editingType.description, editingType.id)) return;

    setTypes(types.map(t => 
      t.id === editingType.id ? editingType : t
    ));
    setIsEditModalOpen(false);
    setEditingType(null);
    
    toast({
      title: "Thành công",
      description: "Loại khách hàng đã được cập nhật thành công."
    });
  };

  const handleDeleteType = () => {
    setTypes(types.filter(t => t.id !== deleteTypeId));
    setIsDeleteDialogOpen(false);
    setDeleteTypeId('');
    
    toast({
      title: "Thành công",
      description: "Loại khách hàng đã được xóa thành công."
    });
  };

  const handleDuplicateType = (type: MockCustomerType) => {
    const duplicated: MockCustomerType = {
      id: Date.now().toString(),
      name: `${type.name} (Copy)`,
      description: type.description,
      isActive: type.isActive,
      order: types.length + 1
    };

    setTypes([...types, duplicated]);
    
    toast({
      title: "Thành công",
      description: "Loại khách hàng đã được sao chép thành công."
    });
  };

  const handleToggleStatus = (id: string) => {
    setTypes(types.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ));
    
    toast({
      title: "Thành công",
      description: "Trạng thái đã được cập nhật."
    });
  };

  const handleMoveUp = (id: string) => {
    const index = types.findIndex(t => t.id === id);
    if (index > 0) {
      const newTypes = [...types];
      [newTypes[index], newTypes[index - 1]] = [newTypes[index - 1], newTypes[index]];
      setTypes(newTypes);
    }
  };

  const handleMoveDown = (id: string) => {
    const index = types.findIndex(t => t.id === id);
    if (index < types.length - 1) {
      const newTypes = [...types];
      [newTypes[index], newTypes[index + 1]] = [newTypes[index + 1], newTypes[index]];
      setTypes(newTypes);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Loại Khách Hàng</CardTitle>
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm Loại
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thứ Tự</TableHead>
                <TableHead>Tên Loại</TableHead>
                <TableHead>Mô Tả</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleMoveUp(item.id)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <span className="font-medium">{index + 1}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleMoveDown(item.id)}
                        disabled={index === types.length - 1}
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={item.isActive} 
                      onCheckedChange={() => handleToggleStatus(item.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDuplicateType(item)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingType(item);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600"
                        onClick={() => {
                          setDeleteTypeId(item.id);
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
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm Loại Khách Hàng Mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-name">Tên Loại</Label>
              <Input
                id="new-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nhập tên loại..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-description">Mô Tả</Label>
              <Textarea
                id="new-description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Nhập mô tả..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateType}>
              Thêm Loại
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Loại Khách Hàng</DialogTitle>
          </DialogHeader>
          {editingType && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Tên Loại</Label>
                <Input
                  id="edit-name"
                  value={editingType.name}
                  onChange={(e) => setEditingType({
                    ...editingType,
                    name: e.target.value
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Mô Tả</Label>
                <Textarea
                  id="edit-description"
                  value={editingType.description}
                  onChange={(e) => setEditingType({
                    ...editingType,
                    description: e.target.value
                  })}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditType}>
              Lưu Thay Đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác Nhận Xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa loại khách hàng này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteType} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
