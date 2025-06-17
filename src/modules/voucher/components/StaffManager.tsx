
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Copy,
  Users
} from 'lucide-react';
import { mockStaff, type Staff } from '../data/mockData';

export function StaffManager() {
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [deleteStaffId, setDeleteStaffId] = useState<string>('');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'telesale' | 'cskh'>('telesale');

  const validateStaff = (name: string, excludeId?: string) => {
    if (!name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên nhân viên.",
        variant: "destructive"
      });
      return false;
    }

    if (staff.some(s => s.name.toLowerCase() === name.trim().toLowerCase() && s.id !== excludeId)) {
      toast({
        title: "Lỗi",
        description: "Tên nhân viên đã tồn tại.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleCreateStaff = () => {
    if (!validateStaff(newName)) return;

    const newStaffMember: Staff = {
      id: Date.now().toString(),
      name: newName.trim(),
      type: newType,
      isActive: true,
      order: staff.length + 1
    };

    setStaff([...staff, newStaffMember]);
    setNewName('');
    setNewType('telesale');
    setIsCreateModalOpen(false);
    
    toast({
      title: "Thành công",
      description: "Nhân viên mới đã được thêm thành công."
    });
  };

  const handleEditStaff = () => {
    if (!editingStaff) return;
    
    if (!validateStaff(editingStaff.name, editingStaff.id)) return;

    setStaff(staff.map(s => 
      s.id === editingStaff.id ? editingStaff : s
    ));
    setIsEditModalOpen(false);
    setEditingStaff(null);
    
    toast({
      title: "Thành công",
      description: "Thông tin nhân viên đã được cập nhật thành công."
    });
  };

  const handleDeleteStaff = () => {
    setStaff(staff.filter(s => s.id !== deleteStaffId));
    setIsDeleteDialogOpen(false);
    setDeleteStaffId('');
    
    toast({
      title: "Thành công",
      description: "Nhân viên đã được xóa thành công."
    });
  };

  const handleDuplicateStaff = (staffMember: Staff) => {
    const duplicated: Staff = {
      id: Date.now().toString(),
      name: `${staffMember.name} (Copy)`,
      type: staffMember.type,
      isActive: staffMember.isActive,
      order: staff.length + 1
    };

    setStaff([...staff, duplicated]);
    
    toast({
      title: "Thành công",
      description: "Nhân viên đã được sao chép thành công."
    });
  };

  const handleToggleStatus = (id: string) => {
    setStaff(staff.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ));
    
    toast({
      title: "Thành công",
      description: "Trạng thái đã được cập nhật."
    });
  };

  const handleMoveUp = (id: string) => {
    const index = staff.findIndex(s => s.id === id);
    if (index > 0) {
      const newStaff = [...staff];
      [newStaff[index], newStaff[index - 1]] = [newStaff[index - 1], newStaff[index]];
      setStaff(newStaff);
    }
  };

  const handleMoveDown = (id: string) => {
    const index = staff.findIndex(s => s.id === id);
    if (index < staff.length - 1) {
      const newStaff = [...staff];
      [newStaff[index], newStaff[index + 1]] = [newStaff[index + 1], newStaff[index]];
      setStaff(newStaff);
    }
  };

  const getStaffTypeLabel = (type: 'telesale' | 'cskh') => {
    return type === 'telesale' ? 'Telesales' : 'CSKH';
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Quản Lý Nhân Viên</span>
          </CardTitle>
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm Nhân Viên
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thứ Tự</TableHead>
                <TableHead>Tên Nhân Viên</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((item, index) => (
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
                        disabled={index === staff.length - 1}
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'telesale' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {getStaffTypeLabel(item.type)}
                    </span>
                  </TableCell>
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
                        onClick={() => handleDuplicateStaff(item)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingStaff(item);
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
                          setDeleteStaffId(item.id);
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
            <DialogTitle>Thêm Nhân Viên Mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-name">Tên Nhân Viên</Label>
              <Input
                id="new-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nhập tên nhân viên..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-type">Loại Nhân Viên</Label>
              <Select value={newType} onValueChange={(value: 'telesale' | 'cskh') => setNewType(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn loại nhân viên..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="telesale">Telesales</SelectItem>
                  <SelectItem value="cskh">CSKH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateStaff}>
              Thêm Nhân Viên
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Nhân Viên</DialogTitle>
          </DialogHeader>
          {editingStaff && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Tên Nhân Viên</Label>
                <Input
                  id="edit-name"
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({
                    ...editingStaff,
                    name: e.target.value
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Loại Nhân Viên</Label>
                <Select 
                  value={editingStaff.type} 
                  onValueChange={(value: 'telesale' | 'cskh') => setEditingStaff({
                    ...editingStaff,
                    type: value
                  })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="telesale">Telesales</SelectItem>
                    <SelectItem value="cskh">CSKH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditStaff}>
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
              Bạn có chắc chắn muốn xóa nhân viên này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStaff} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
