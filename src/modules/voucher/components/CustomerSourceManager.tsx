
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
import type { CustomerSource } from '../types';

const initialSources: CustomerSource[] = [
  { id: '1', name: 'Website', description: 'Khách hàng đăng ký từ website', isActive: true, order: 1 },
  { id: '2', name: 'Facebook', description: 'Khách hàng từ Facebook', isActive: true, order: 2 },
  { id: '3', name: 'Giới thiệu', description: 'Khách hàng được giới thiệu', isActive: true, order: 3 },
  { id: '4', name: 'Hotline', description: 'Khách hàng gọi hotline', isActive: false, order: 4 },
];

export function CustomerSourceManager() {
  const [sources, setSources] = useState<CustomerSource[]>(initialSources);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<CustomerSource | null>(null);
  const [deleteSourceId, setDeleteSourceId] = useState<string>('');
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const validateSource = (name: string, description: string, excludeId?: string) => {
    if (!name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên nguồn khách hàng.",
        variant: "destructive"
      });
      return false;
    }

    if (sources.some(s => s.name.toLowerCase() === name.trim().toLowerCase() && s.id !== excludeId)) {
      toast({
        title: "Lỗi",
        description: "Tên nguồn khách hàng đã tồn tại.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleCreateSource = () => {
    if (!validateSource(newName, newDescription)) return;

    const newSource: CustomerSource = {
      id: Date.now().toString(),
      name: newName.trim(),
      description: newDescription.trim(),
      isActive: true,
      order: sources.length + 1
    };

    setSources([...sources, newSource]);
    setNewName('');
    setNewDescription('');
    setIsCreateModalOpen(false);
    
    toast({
      title: "Thành công",
      description: "Nguồn khách hàng mới đã được tạo thành công."
    });
  };

  const handleEditSource = () => {
    if (!editingSource) return;
    
    if (!validateSource(editingSource.name, editingSource.description, editingSource.id)) return;

    setSources(sources.map(s => 
      s.id === editingSource.id ? editingSource : s
    ));
    setIsEditModalOpen(false);
    setEditingSource(null);
    
    toast({
      title: "Thành công",
      description: "Nguồn khách hàng đã được cập nhật thành công."
    });
  };

  const handleDeleteSource = () => {
    setSources(sources.filter(s => s.id !== deleteSourceId));
    setIsDeleteDialogOpen(false);
    setDeleteSourceId('');
    
    toast({
      title: "Thành công",
      description: "Nguồn khách hàng đã được xóa thành công."
    });
  };

  const handleDuplicateSource = (source: CustomerSource) => {
    const duplicated: CustomerSource = {
      id: Date.now().toString(),
      name: `${source.name} (Copy)`,
      description: source.description,
      isActive: source.isActive,
      order: sources.length + 1
    };

    setSources([...sources, duplicated]);
    
    toast({
      title: "Thành công",
      description: "Nguồn khách hàng đã được sao chép thành công."
    });
  };

  const handleToggleStatus = (id: string) => {
    setSources(sources.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ));
    
    toast({
      title: "Thành công",
      description: "Trạng thái đã được cập nhật."
    });
  };

  const handleMoveUp = (id: string) => {
    const index = sources.findIndex(s => s.id === id);
    if (index > 0) {
      const newSources = [...sources];
      [newSources[index], newSources[index - 1]] = [newSources[index - 1], newSources[index]];
      setSources(newSources);
    }
  };

  const handleMoveDown = (id: string) => {
    const index = sources.findIndex(s => s.id === id);
    if (index < sources.length - 1) {
      const newSources = [...sources];
      [newSources[index], newSources[index + 1]] = [newSources[index + 1], newSources[index]];
      setSources(newSources);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Nguồn Khách Hàng</CardTitle>
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm Nguồn
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thứ Tự</TableHead>
                <TableHead>Tên Nguồn</TableHead>
                <TableHead>Mô Tả</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sources.map((item, index) => (
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
                        disabled={index === sources.length - 1}
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
                        onClick={() => handleDuplicateSource(item)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingSource(item);
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
                          setDeleteSourceId(item.id);
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
            <DialogTitle>Thêm Nguồn Khách Hàng Mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-name">Tên Nguồn</Label>
              <Input
                id="new-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nhập tên nguồn..."
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
            <Button onClick={handleCreateSource}>
              Thêm Nguồn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Nguồn Khách Hàng</DialogTitle>
          </DialogHeader>
          {editingSource && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Tên Nguồn</Label>
                <Input
                  id="edit-name"
                  value={editingSource.name}
                  onChange={(e) => setEditingSource({
                    ...editingSource,
                    name: e.target.value
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Mô Tả</Label>
                <Textarea
                  id="edit-description"
                  value={editingSource.description}
                  onChange={(e) => setEditingSource({
                    ...editingSource,
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
            <Button onClick={handleEditSource}>
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
              Bạn có chắc chắn muốn xóa nguồn khách hàng này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSource} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
