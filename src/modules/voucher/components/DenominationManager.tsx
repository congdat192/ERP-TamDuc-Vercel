
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import type { VoucherDenomination } from '../types';

// Mock data - will be replaced with real API data later
const initialDenominations: VoucherDenomination[] = [
  { id: '1', value: 100000, label: '100.000đ', isActive: true, order: 1 },
  { id: '2', value: 250000, label: '250.000đ', isActive: true, order: 2 },
  { id: '3', value: 500000, label: '500.000đ', isActive: true, order: 3 },
  { id: '4', value: 1000000, label: '1.000.000đ', isActive: true, order: 4 },
];

interface DenominationManagerProps {
  allowCustomValue: boolean;
  onAllowCustomValueChange: (value: boolean) => void;
}

export function DenominationManager({ allowCustomValue, onAllowCustomValueChange }: DenominationManagerProps) {
  const [denominations, setDenominations] = useState<VoucherDenomination[]>(initialDenominations);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingDenomination, setEditingDenomination] = useState<VoucherDenomination | null>(null);
  const [deleteDenominationId, setDeleteDenominationId] = useState<string>('');
  const [newValue, setNewValue] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const formatCurrency = (value: number) => {
    return value.toLocaleString('vi-VN') + ' VNĐ';
  };

  const validateDenomination = (value: string, label: string, excludeId?: string) => {
    if (!value.trim() || !label.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ giá trị và nhãn hiển thị.",
        variant: "destructive"
      });
      return false;
    }

    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue <= 0) {
      toast({
        title: "Lỗi",
        description: "Giá trị phải là số dương.",
        variant: "destructive"
      });
      return false;
    }

    if (denominations.some(d => d.value === numValue && d.id !== excludeId)) {
      toast({
        title: "Lỗi",
        description: "Giá trị này đã tồn tại.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleCreateDenomination = () => {
    if (!validateDenomination(newValue, newLabel)) return;

    const newDenomination: VoucherDenomination = {
      id: Date.now().toString(),
      value: parseInt(newValue),
      label: newLabel.trim(),
      isActive: true,
      order: denominations.length + 1
    };

    setDenominations([...denominations, newDenomination]);
    setNewValue('');
    setNewLabel('');
    setIsCreateModalOpen(false);
    
    toast({
      title: "Thành công",
      description: "Mệnh giá mới đã được tạo thành công."
    });
  };

  const handleEditDenomination = () => {
    if (!editingDenomination) return;
    
    if (!validateDenomination(editingDenomination.value.toString(), editingDenomination.label, editingDenomination.id)) return;

    setDenominations(denominations.map(d => 
      d.id === editingDenomination.id ? editingDenomination : d
    ));
    setIsEditModalOpen(false);
    setEditingDenomination(null);
    
    toast({
      title: "Thành công",
      description: "Mệnh giá đã được cập nhật thành công."
    });
  };

  const handleDeleteDenomination = () => {
    setDenominations(denominations.filter(d => d.id !== deleteDenominationId));
    setIsDeleteDialogOpen(false);
    setDeleteDenominationId('');
    
    toast({
      title: "Thành công",
      description: "Mệnh giá đã được xóa thành công."
    });
  };

  const handleDuplicateDenomination = (denomination: VoucherDenomination) => {
    const duplicated: VoucherDenomination = {
      id: Date.now().toString(),
      value: denomination.value,
      label: `${denomination.label} (Copy)`,
      isActive: denomination.isActive,
      order: denominations.length + 1
    };

    setDenominations([...denominations, duplicated]);
    
    toast({
      title: "Thành công",
      description: "Mệnh giá đã được sao chép thành công."
    });
  };

  const handleToggleStatus = (id: string) => {
    setDenominations(denominations.map(d => 
      d.id === id ? { ...d, isActive: !d.isActive } : d
    ));
    
    toast({
      title: "Thành công",
      description: "Trạng thái đã được cập nhật."
    });
  };

  const handleMoveUp = (id: string) => {
    const index = denominations.findIndex(d => d.id === id);
    if (index > 0) {
      const newDenominations = [...denominations];
      [newDenominations[index], newDenominations[index - 1]] = [newDenominations[index - 1], newDenominations[index]];
      setDenominations(newDenominations);
    }
  };

  const handleMoveDown = (id: string) => {
    const index = denominations.findIndex(d => d.id === id);
    if (index < denominations.length - 1) {
      const newDenominations = [...denominations];
      [newDenominations[index], newDenominations[index + 1]] = [newDenominations[index + 1], newDenominations[index]];
      setDenominations(newDenominations);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mệnh Giá Voucher</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="custom-value">Cho phép nhập giá trị tùy chỉnh</Label>
              <Switch
                id="custom-value"
                checked={allowCustomValue}
                onCheckedChange={onAllowCustomValueChange}
              />
            </div>
            <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm Mệnh Giá
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thứ Tự</TableHead>
                <TableHead>Giá Trị</TableHead>
                <TableHead>Nhãn Hiển Thị</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {denominations.map((item, index) => (
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
                        disabled={index === denominations.length - 1}
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(item.value)}
                  </TableCell>
                  <TableCell>{item.label}</TableCell>
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
                        onClick={() => handleDuplicateDenomination(item)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingDenomination(item);
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
                          setDeleteDenominationId(item.id);
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
            <DialogTitle>Thêm Mệnh Giá Mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-value">Giá Trị (VNĐ)</Label>
              <Input
                id="new-value"
                type="number"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Nhập giá trị..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-label">Nhãn Hiển Thị</Label>
              <Input
                id="new-label"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="VD: 100.000đ"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateDenomination}>
              Thêm Mệnh Giá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Mệnh Giá</DialogTitle>
          </DialogHeader>
          {editingDenomination && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-value">Giá Trị (VNĐ)</Label>
                <Input
                  id="edit-value"
                  type="number"
                  value={editingDenomination.value}
                  onChange={(e) => setEditingDenomination({
                    ...editingDenomination,
                    value: parseInt(e.target.value) || 0
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-label">Nhãn Hiển Thị</Label>
                <Input
                  id="edit-label"
                  value={editingDenomination.label}
                  onChange={(e) => setEditingDenomination({
                    ...editingDenomination,
                    label: e.target.value
                  })}
                  className="mt-1"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditDenomination}>
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
              Bạn có chắc chắn muốn xóa mệnh giá này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDenomination} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
