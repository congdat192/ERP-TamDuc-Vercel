
import { Search, Upload, Download, Plus, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ColumnVisibilityFilter } from './ColumnVisibilityFilter';
import { ColumnConfig } from './ColumnVisibilityFilter';

interface CustomerSearchActionsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  columns: ColumnConfig[];
  handleColumnToggle: (columnKey: string, visible: boolean) => void;
}

export function CustomerSearchActions({ 
  searchTerm, 
  setSearchTerm, 
  columns, 
  handleColumnToggle 
}: CustomerSearchActionsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6">
      <div className="p-4">
        <div className="flex flex-col lg:flex-row items-center space-y-3 lg:space-y-0 lg:space-x-4">
          {/* Search Input - Thu gọn chiều rộng */}
          <div className="flex-1 lg:max-w-md relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Theo mã, tên, số điện thoại"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Action Buttons - Cùng hàng với search */}
          <div className="flex items-center space-x-2 w-full lg:w-auto">
            <div className="flex items-center space-x-2 flex-1 lg:flex-none">
              <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                <Upload className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Import file</span>
                <span className="sm:hidden">Import</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Gửi tin nhắn</span>
                <span className="sm:hidden">Tin nhắn</span>
              </Button>
              <Button size="sm" className="flex-1 lg:flex-none">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Khách hàng</span>
                <span className="sm:hidden">Thêm</span>
              </Button>
            </div>
            
            {/* Column Filter và More Actions */}
            <div className="flex items-center space-x-2">
              <ColumnVisibilityFilter 
                columns={columns}
                onColumnToggle={handleColumnToggle}
              />
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
