
import { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Trash2, 
  Edit, 
  Download, 
  Archive, 
  Eye, 
  EyeOff,
  MoreHorizontal,
  Users,
  FileText,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

interface BulkOperationsBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkDelete?: () => void;
  onBulkEdit?: () => void;
  onBulkExport?: () => void;
  onBulkArchive?: () => void;
  onBulkActivate?: () => void;
  onBulkDeactivate?: () => void;
  entityName: string;
  actions?: BulkAction[];
}

interface BulkAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  requiresConfirmation?: boolean;
}

export const BulkOperationsBar = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBulkDelete,
  onBulkEdit,
  onBulkExport,
  onBulkArchive,
  onBulkActivate,
  onBulkDeactivate,
  entityName,
  actions = []
}: BulkOperationsBarProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  if (selectedCount === 0) return null;

  const isAllSelected = selectedCount === totalCount;
  const defaultActions: BulkAction[] = [
    ...(onBulkEdit ? [{
      label: `Chỉnh Sửa (${selectedCount})`,
      icon: <Edit className="w-4 h-4" />,
      onClick: onBulkEdit
    }] : []),
    ...(onBulkExport ? [{
      label: `Xuất Dữ Liệu (${selectedCount})`,
      icon: <Download className="w-4 h-4" />,
      onClick: onBulkExport
    }] : []),
    ...(onBulkActivate ? [{
      label: `Kích Hoạt (${selectedCount})`,
      icon: <Eye className="w-4 h-4" />,
      onClick: onBulkActivate
    }] : []),
    ...(onBulkDeactivate ? [{
      label: `Vô Hiệu Hóa (${selectedCount})`,
      icon: <EyeOff className="w-4 h-4" />,
      onClick: onBulkDeactivate
    }] : []),
    ...(onBulkArchive ? [{
      label: `Lưu Trữ (${selectedCount})`,
      icon: <Archive className="w-4 h-4" />,
      onClick: () => setShowArchiveConfirm(true),
      requiresConfirmation: true
    }] : []),
    ...(onBulkDelete ? [{
      label: `Xóa (${selectedCount})`,
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => setShowDeleteConfirm(true),
      variant: 'destructive' as const,
      requiresConfirmation: true
    }] : [])
  ];

  const allActions = [...defaultActions, ...actions];

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={isAllSelected ? onDeselectAll : onSelectAll}
            className="text-blue-700 hover:text-blue-800"
          >
            {isAllSelected ? (
              <CheckSquare className="w-4 h-4 mr-2" />
            ) : (
              <Square className="w-4 h-4 mr-2" />
            )}
            {isAllSelected ? 'Bỏ Chọn Tất Cả' : 'Chọn Tất Cả'}
          </Button>
          
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {selectedCount} {entityName} được chọn
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          {allActions.slice(0, 3).map((action, index) => (
            <Button
              key={index}
              variant={action.variant === 'destructive' ? 'destructive' : 'outline'}
              size="sm"
              onClick={action.onClick}
              className="flex items-center space-x-1"
            >
              {action.icon}
              <span className="hidden sm:inline">{action.label}</span>
            </Button>
          ))}
          
          {allActions.length > 3 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {allActions.slice(3).map((action, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={action.onClick}
                    className={action.variant === 'destructive' ? 'text-red-600' : ''}
                  >
                    {action.icon}
                    <span className="ml-2">{action.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác Nhận Xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa {selectedCount} {entityName} đã chọn? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onBulkDelete?.();
                setShowDeleteConfirm(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa {selectedCount} Mục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={showArchiveConfirm} onOpenChange={setShowArchiveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác Nhận Lưu Trữ</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn lưu trữ {selectedCount} {entityName} đã chọn? 
              Các mục này sẽ được chuyển vào khu vực lưu trữ.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onBulkArchive?.();
                setShowArchiveConfirm(false);
              }}
            >
              Lưu Trữ {selectedCount} Mục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

interface BulkSelectCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const BulkSelectCheckbox = ({ checked, onChange, disabled }: BulkSelectCheckboxProps) => {
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onChange}
      disabled={disabled}
      className="w-4 h-4"
    />
  );
};

interface BulkSelectHeaderProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export const BulkSelectHeader = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll
}: BulkSelectHeaderProps) => {
  const isAllSelected = selectedCount === totalCount && totalCount > 0;
  const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;

  return (
    <Checkbox
      checked={isAllSelected}
      ref={(el) => {
        if (el) {
          const checkbox = el.querySelector('input[type="checkbox"]') as HTMLInputElement;
          if (checkbox) {
            checkbox.indeterminate = isIndeterminate;
          }
        }
      }}
      onCheckedChange={() => {
        if (isAllSelected || isIndeterminate) {
          onDeselectAll();
        } else {
          onSelectAll();
        }
      }}
      className="w-4 h-4"
    />
  );
};
