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
import { AlertTriangle, FileText, Calendar, FileCheck } from 'lucide-react';

interface EmployeeDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  employeeName: string;
  warnings?: {
    documents: number;
    attendance: number;
    adminDocs: number;
  };
}

export function EmployeeDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  employeeName,
  warnings,
}: EmployeeDeleteDialogProps) {
  const hasWarnings = warnings && (warnings.documents > 0 || warnings.attendance > 0 || warnings.adminDocs > 0);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Xác Nhận Xóa Nhân Viên
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 pt-4">
            <p className="text-base">
              Bạn có chắc muốn xóa nhân viên <strong className="text-foreground">{employeeName}</strong>?
            </p>
            
            {hasWarnings && (
              <div className="space-y-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <p className="font-semibold text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Cảnh báo: Dữ liệu liên quan sẽ bị ảnh hưởng
                </p>
                
                <div className="space-y-2 text-sm">
                  {warnings.documents > 0 && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span><strong>{warnings.documents}</strong> chứng từ cá nhân</span>
                    </div>
                  )}
                  
                  {warnings.attendance > 0 && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span><strong>{warnings.attendance}</strong> bản ghi chấm công</span>
                    </div>
                  )}
                  
                  {warnings.adminDocs > 0 && (
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-muted-foreground" />
                      <span><strong>{warnings.adminDocs}</strong> văn bản hành chính</span>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground pt-2 border-t">
                  ℹ️ Dữ liệu sẽ <strong>KHÔNG bị mất</strong> nhưng sẽ mất liên kết với nhân viên. 
                  Thông tin nhân viên sẽ được lưu trữ để tra cứu sau này.
                </p>
              </div>
            )}
            
            <p className="text-sm text-destructive font-medium">
              ⚠️ Hành động này không thể hoàn tác!
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90"
          >
            Xác Nhận Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
