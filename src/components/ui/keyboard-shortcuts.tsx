import { useState } from 'react';
import { 
  Keyboard, 
  Command, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface KeyboardShortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: KeyboardShortcut[] = [
  // Navigation
  { keys: ['Ctrl', 'H'], description: 'Về trang chủ', category: 'Điều hướng' },
  { keys: ['Ctrl', 'D'], description: 'Dashboard', category: 'Điều hướng' },
  { keys: ['Ctrl', 'U'], description: 'Quản lý người dùng', category: 'Điều hướng' },
  { keys: ['Ctrl', 'V'], description: 'Module Voucher', category: 'Điều hướng' },
  { keys: ['Ctrl', 'S'], description: 'Cài đặt hệ thống', category: 'Điều hướng' },
  
  // Search and Filters
  { keys: ['Ctrl', 'K'], description: 'Mở tìm kiếm nhanh', category: 'Tìm kiếm' },
  { keys: ['Ctrl', 'F'], description: 'Tìm kiếm trong trang', category: 'Tìm kiếm' },
  { keys: ['Ctrl', 'Shift', 'F'], description: 'Bộ lọc nâng cao', category: 'Tìm kiếm' },
  { keys: ['Escape'], description: 'Đóng tìm kiếm', category: 'Tìm kiếm' },
  
  // Actions
  { keys: ['Ctrl', 'N'], description: 'Tạo mới', category: 'Thao tác' },
  { keys: ['Ctrl', 'E'], description: 'Chỉnh sửa', category: 'Thao tác' },
  { keys: ['Ctrl', 'Enter'], description: 'Lưu', category: 'Thao tác' },
  { keys: ['Delete'], description: 'Xóa mục đã chọn', category: 'Thao tác' },
  { keys: ['Ctrl', 'A'], description: 'Chọn tất cả', category: 'Thao tác' },
  { keys: ['Ctrl', 'Shift', 'A'], description: 'Bỏ chọn tất cả', category: 'Thao tác' },
  
  // Table Navigation
  { keys: ['↑'], description: 'Dòng trước', category: 'Bảng' },
  { keys: ['↓'], description: 'Dòng sau', category: 'Bảng' },
  { keys: ['Space'], description: 'Chọn/bỏ chọn dòng', category: 'Bảng' },
  { keys: ['Enter'], description: 'Mở chi tiết', category: 'Bảng' },
  
  // Modal and Dialog
  { keys: ['Escape'], description: 'Đóng modal', category: 'Modal' },
  { keys: ['Tab'], description: 'Chuyển trường tiếp theo', category: 'Modal' },
  { keys: ['Shift', 'Tab'], description: 'Chuyển trường trước', category: 'Modal' },
  
  // General
  { keys: ['Ctrl', 'Z'], description: 'Hoàn tác', category: 'Chung' },
  { keys: ['Ctrl', 'Y'], description: 'Làm lại', category: 'Chung' },
  { keys: ['Ctrl', 'R'], description: 'Làm mới trang', category: 'Chung' },
  { keys: ['?'], description: 'Hiển thị phím tắt', category: 'Chung' }
];

export const KeyboardShortcutsDialog = () => {
  const [open, setOpen] = useState(false);
  
  const groupedShortcuts = shortcuts.reduce((groups, shortcut) => {
    if (!groups[shortcut.category]) {
      groups[shortcut.category] = [];
    }
    groups[shortcut.category].push(shortcut);
    return groups;
  }, {} as Record<string, KeyboardShortcut[]>);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
          <Keyboard className="w-4 h-4 mr-2" />
          Phím Tắt
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Keyboard className="w-5 h-5" />
            <span>Phím Tắt Bàn Phím</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categoryShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{shortcut.description}</span>
                    <div className="flex items-center space-x-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <div key={keyIndex} className="flex items-center">
                          <KeyBadge keyName={key} />
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="mx-1 text-gray-400">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Command className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Mẹo sử dụng phím tắt</h4>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Nhấn <KeyBadge keyName="?" inline /> để mở nhanh danh sách phím tắt</li>
                <li>• Sử dụng <KeyBadge keyName="Ctrl" inline /> + <KeyBadge keyName="K" inline /> để tìm kiếm nhanh</li>
                <li>• Phím <KeyBadge keyName="Escape" inline /> để đóng các modal và hộp thoại</li>
                <li>• Phím mũi tên để điều hướng trong bảng và danh sách</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface KeyBadgeProps {
  keyName: string;
  inline?: boolean;
}

const KeyBadge = ({ keyName, inline = false }: KeyBadgeProps) => {
  const getKeyIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case 'enter':
        return <CornerDownLeft className="w-3 h-3" />;
      case 'escape':
        return <Zap className="w-3 h-3" />;
      case '↑':
        return <ArrowUp className="w-3 h-3" />;
      case '↓':
        return <ArrowDown className="w-3 h-3" />;
      case 'ctrl':
        return <Command className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const displayKey = (key: string) => {
    switch (key.toLowerCase()) {
      case 'ctrl':
        return 'Ctrl';
      case 'shift':
        return 'Shift';
      case 'alt':
        return 'Alt';
      case 'enter':
        return 'Enter';
      case 'escape':
        return 'Esc';
      case 'space':
        return 'Space';
      case 'delete':
        return 'Del';
      case 'tab':
        return 'Tab';
      default:
        return key;
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`font-mono text-xs ${inline ? 'inline-flex' : ''} items-center space-x-1 px-2 py-1`}
    >
      {getKeyIcon(keyName)}
      <span>{displayKey(keyName)}</span>
    </Badge>
  );
};

// Hook for keyboard shortcuts
export const useKeyboardShortcuts = (shortcuts: Record<string, () => void>) => {
  useState(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const ctrl = event.ctrlKey;
      const shift = event.shiftKey;
      const alt = event.altKey;

      // Build shortcut string
      let shortcut = '';
      if (ctrl) shortcut += 'ctrl+';
      if (shift) shortcut += 'shift+';
      if (alt) shortcut += 'alt+';
      shortcut += key;

      if (shortcuts[shortcut]) {
        event.preventDefault();
        shortcuts[shortcut]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });
};
