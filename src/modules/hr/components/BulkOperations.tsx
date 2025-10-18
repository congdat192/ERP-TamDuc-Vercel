import { useState } from 'react';
import { Trash2, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { EmployeeService } from '../services/employeeService';

interface BulkOperationsProps {
  selectedIds: string[];
  onSuccess: () => void;
  onClearSelection: () => void;
}

export function BulkOperations({ selectedIds, onSuccess, onClearSelection }: BulkOperationsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleBulkDelete = async () => {
    setLoading(true);
    try {
      await Promise.all(selectedIds.map(id => EmployeeService.deleteEmployee(id)));
      toast({
        title: 'Thành công',
        description: `Đã xóa ${selectedIds.length} nhân viên`,
      });
      onSuccess();
      onClearSelection();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể xóa nhân viên',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleBulkStatusUpdate = async (status: 'active' | 'inactive') => {
    setLoading(true);
    try {
      await Promise.all(selectedIds.map(id => EmployeeService.updateEmployee(id, { status })));
      toast({
        title: 'Thành công',
        description: `Đã cập nhật trạng thái cho ${selectedIds.length} nhân viên`,
      });
      onSuccess();
      onClearSelection();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể cập nhật trạng thái',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setActivateDialogOpen(false);
      setDeactivateDialogOpen(false);
    }
  };

  if (selectedIds.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
        <span className="text-sm font-medium">
          Đã chọn {selectedIds.length} nhân viên
        </span>
        <div className="flex-1" />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActivateDialogOpen(true)}
          disabled={loading}
        >
          <UserCheck className="h-4 w-4 mr-2" />
          Kích hoạt
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDeactivateDialogOpen(true)}
          disabled={loading}
        >
          <UserX className="h-4 w-4 mr-2" />
          Vô hiệu hóa
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeleteDialogOpen(true)}
          disabled={loading}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Xóa
        </Button>
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          Hủy chọn
        </Button>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa {selectedIds.length} nhân viên đã chọn?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Activate Confirmation */}
      <AlertDialog open={activateDialogOpen} onOpenChange={setActivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận kích hoạt</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn kích hoạt {selectedIds.length} nhân viên đã chọn?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleBulkStatusUpdate('active')}>
              Kích hoạt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deactivate Confirmation */}
      <AlertDialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận vô hiệu hóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn vô hiệu hóa {selectedIds.length} nhân viên đã chọn?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleBulkStatusUpdate('inactive')}>
              Vô hiệu hóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
