
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Staff {
  id: string;
  name: string;
  type: 'cskh' | 'telesales' | 'admin' | 'sales';
  isActive: boolean;
  createdAt: string;
}

const STAFF_TYPE_LABELS = {
  cskh: 'CSKH',
  telesales: 'Telesales',
  admin: 'Quản lý',
  sales: 'Bán hàng'
};

const mockStaffData: Staff[] = [
  {
    id: '1',
    name: 'Bảo Trâm',
    type: 'cskh',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Anh Thy',
    type: 'cskh',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Nguyễn Liễu',
    type: 'telesales',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

export function StaffManager() {
  const [staffList, setStaffList] = useState<Staff[]>(mockStaffData);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [deleteStaffId, setDeleteStaffId] = useState<string>('');

  // Form states
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<Staff['type']>('cskh');

  const handleCreateStaff = () => {
    if (!formName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên nhân viên",
        variant: "destructive"
      });
      return;
    }

    const newStaff: Staff = {
      id: Date.now().toString(),
      name: formName.trim(),
      type: formType,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setStaffList([...staffList, newStaff]);
    setFormName('');
    setFormType('cskh');
    setIsCreateDialogOpen(false);

    toast({
      title: "Thành công",
      description: `Đã thêm nhân viên "${newStaff.name}"`,
    });
  };

  const handleEditStaff = () => {
    if (!selectedStaff || !formName.trim()) return;

    const updatedStaff = {
      ...selectedStaff,
      name: formName.trim(),
      type: formType
    };

    setStaffList(staffList.map(staff => 
      staff.id === selectedStaff.id ? updatedStaff : staff
    ));

    setIsEditDialogOpen(false);
    setSelectedStaff(null);
    setFormName('');
    setFormType('cskh');

    toast({
      title: "Thành công",
      description: `Đã cập nhật nhân viên "${updatedStaff.name}"`,
    });
  };

  const handleDeleteStaff = () => {
    const staffToDelete = staffList.find(s => s.id === deleteStaffId);
    setStaffList(staffList.filter(s => s.id !== deleteStaffId));
    setIsDeleteDialogOpen(false);
    setDeleteStaffId('');

    toast({
      title: "Thành công",
      description: `Đã xóa nhân viên "${staffToDelete?.name}"`,
    });
  };

  const toggleStaffStatus = (staffId: string) => {
    setStaffList(staffList.map(staff => 
      staff.id === staffId ? { ...staff, isActive: !staff.isActive } : staff
    ));
  };

  const openEditDialog = (staff: Staff) => {
    setSelectedStaff(staff);
    setFormName(staff.name);
    setFormType(staff.type);
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    setFormName('');
    setFormType('cskh');
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card className="voucher-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 theme-text-primary" />
            <span className="theme-text">Danh Sách Nhân Viên</span>
          </CardTitle>
          <Button onClick={openCreateDialog} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Thêm Nhân Viên
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Nhân Viên</TableHead>
                <TableHead>Chức Vụ</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffList.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium theme-text">{staff.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="theme-badge-secondary">
                      {STAFF_TYPE_LABELS[staff.type]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={staff.isActive}
                      onCheckedChange={() => toggleStaffStatus(staff.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(staff)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          setDeleteStaffId(staff.id);
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

          {staffList.length === 0 && (
            <div className="text-center py-8 theme-text-muted">
              <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Chưa có nhân viên nào được thêm</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Staff Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="voucher-card">
          <DialogHeader>
            <DialogTitle className="theme-text">Thêm Nhân Viên Mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="staff-name">Tên nhân viên</Label>
              <Input
                id="staff-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="VD: Nguyễn Văn A"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-type">Chức vụ</Label>
              <Select value={formType} onValueChange={(value: Staff['type']) => setFormType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cskh">CSKH</SelectItem>
                  <SelectItem value="telesales">Telesales</SelectItem>
                  <SelectItem value="sales">Bán hàng</SelectItem>
                  <SelectItem value="admin">Quản lý</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleCreateStaff} className="flex-1">
                Thêm Nhân Viên
              </Button>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="voucher-card">
          <DialogHeader>
            <DialogTitle className="theme-text">Chỉnh Sửa Nhân Viên</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-staff-name">Tên nhân viên</Label>
              <Input
                id="edit-staff-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="VD: Nguyễn Văn A"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-staff-type">Chức vụ</Label>
              <Select value={formType} onValueChange={(value: Staff['type']) => setFormType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cskh">CSKH</SelectItem>
                  <SelectItem value="telesales">Telesales</SelectItem>
                  <SelectItem value="sales">Bán hàng</SelectItem>
                  <SelectItem value="admin">Quản lý</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleEditStaff} className="flex-1">
                Cập Nhật
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="voucher-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="theme-text">Xác Nhận Xóa</AlertDialogTitle>
            <AlertDialogDescription className="theme-text-muted">
              Bạn có chắc chắn muốn xóa nhân viên này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteStaff}
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
