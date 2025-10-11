
import { Search, Upload, Download, Plus, MoreHorizontal, Filter, Phone, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ColumnVisibilityFilter } from './ColumnVisibilityFilter';
import { ColumnConfig } from './ColumnVisibilityFilter';

interface CustomerSearchActionsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  phoneSearch?: string;
  setPhoneSearch?: (value: string) => void;
  onPhoneSearch?: () => void;
  onResetSearch?: () => void;
  isLoadingApi?: boolean;
  columns: ColumnConfig[];
  handleColumnToggle: (columnKey: string, visible: boolean) => void;
  onToggleSidebar?: () => void;
}

export function CustomerSearchActions({ 
  searchTerm, 
  setSearchTerm,
  phoneSearch = '',
  setPhoneSearch,
  onPhoneSearch,
  onResetSearch,
  isLoadingApi = false,
  columns, 
  handleColumnToggle,
  onToggleSidebar 
}: CustomerSearchActionsProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onPhoneSearch) {
      onPhoneSearch();
    }
  };
  return (
    <div className="theme-card rounded-lg border theme-border-primary">
      <div className="p-4 space-y-3">
        {/* Phone Search Section */}
        {setPhoneSearch && onPhoneSearch && (
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 theme-text-muted w-4 h-4" />
              <Input
                placeholder="Nhập số điện thoại để tra cứu"
                value={phoneSearch}
                onChange={(e) => setPhoneSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 voucher-input"
                disabled={isLoadingApi}
              />
            </div>
            <Button 
              onClick={onPhoneSearch}
              disabled={isLoadingApi}
              className="voucher-button-primary whitespace-nowrap"
            >
              {isLoadingApi ? 'Đang tìm...' : 'Tra cứu'}
            </Button>
            {onResetSearch && phoneSearch && (
              <Button 
                onClick={onResetSearch}
                variant="outline"
                size="icon"
                className="theme-border-primary hover:theme-bg-primary/10"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-center space-y-3 lg:space-y-0 lg:space-x-4">
          {/* Mobile Filter Toggle + Search */}
          <div className="flex items-center space-x-3 w-full lg:flex-1 lg:max-w-md">
            {/* Mobile Filter Toggle */}
            {onToggleSidebar && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onToggleSidebar}
                className="lg:hidden theme-border-primary hover:theme-bg-primary/10 hover:theme-text-primary"
              >
                <Filter className="w-4 h-4 theme-text-primary" />
              </Button>
            )}
            
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 theme-text-muted w-4 h-4" />
              <Input
                placeholder="Theo mã, tên, số điện thoại"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 voucher-input"
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2 w-full lg:w-auto">
            <div className="flex items-center space-x-2 flex-1 lg:flex-none">
              <Button variant="outline" size="sm" className="flex-1 lg:flex-none theme-border-primary hover:theme-bg-primary/10 hover:theme-text-primary">
                <Upload className="w-4 h-4 mr-2 theme-text-primary" />
                <span className="hidden sm:inline">Import file</span>
                <span className="sm:hidden">Import</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-1 lg:flex-none theme-border-primary hover:theme-bg-secondary/10 hover:theme-text-secondary">
                <Download className="w-4 h-4 mr-2 theme-text-secondary" />
                <span className="hidden sm:inline">Gửi tin nhắn</span>
                <span className="sm:hidden">Tin nhắn</span>
              </Button>
              <Button size="sm" className="flex-1 lg:flex-none voucher-button-primary">
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
              <Button variant="ghost" size="sm" className="hover:theme-bg-primary/10 hover:theme-text-primary">
                <MoreHorizontal className="w-4 h-4 theme-text-primary" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
