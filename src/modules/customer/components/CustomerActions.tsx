
import { Upload, Download, Plus, MoreHorizontal, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomerActionsProps {
  setSidebarOpen: (value: boolean) => void;
}

export function CustomerActions({ setSidebarOpen }: CustomerActionsProps) {
  return (
    <div className="flex items-center space-x-2 sm:space-x-3">
      <Button variant="outline" size="sm" className="hidden sm:flex">
        <Upload className="w-4 h-4 mr-2" />
        Import file
      </Button>
      <Button variant="outline" size="sm" className="hidden sm:flex">
        <Download className="w-4 h-4 mr-2" />
        Gửi tin nhắn
      </Button>
      <Button size="sm">
        <Plus className="w-4 h-4 mr-2" />
        Khách hàng
      </Button>
      <Button variant="ghost" size="sm" className="sm:hidden" onClick={() => setSidebarOpen(true)}>
        <Menu className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" className="hidden sm:flex">
        <MoreHorizontal className="w-4 h-4" />
      </Button>
    </div>
  );
}
