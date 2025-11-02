
import { Search, MoreHorizontal, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ColumnVisibilityFilter } from './ColumnVisibilityFilter';
import { ColumnConfig } from './ColumnVisibilityFilter';

interface CustomerSearchActionsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onSearch?: () => void;
  onResetSearch?: () => void;
  isLoadingApi?: boolean;
  columns: ColumnConfig[];
  handleColumnToggle: (columnKey: string, visible: boolean) => void;
  onToggleSidebar?: () => void;
}

export function CustomerSearchActions({ 
  searchTerm, 
  setSearchTerm,
  onSearch,
  onResetSearch,
  isLoadingApi = false,
  columns, 
  handleColumnToggle,
  onToggleSidebar 
}: CustomerSearchActionsProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div className="theme-card rounded-lg border theme-border-primary">
      <div className="p-4">
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
            
            {/* Search Input - Responsive stacking */}
            <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
              <div className="flex-1 relative min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 theme-text-muted w-4 h-4" />
                <Input
                  placeholder="Theo mã, tên, số điện thoại"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 voucher-input"
                  disabled={isLoadingApi}
                />
              </div>
              
              {/* Buttons stack horizontally on mobile, inline on desktop */}
              <div className="flex items-center gap-2 shrink-0">
                {onSearch && (
                  <Button 
                    onClick={onSearch}
                    disabled={isLoadingApi}
                    size="sm"
                    className="voucher-button-primary whitespace-nowrap flex-1 sm:flex-none"
                  >
                    {isLoadingApi ? 'Đang tìm...' : 'Tìm'}
                  </Button>
                )}
                {onResetSearch && searchTerm && (
                  <Button 
                    onClick={onResetSearch}
                    variant="outline"
                    size="sm"
                    className="theme-border-primary hover:theme-bg-primary/10 flex-1 sm:flex-none"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>
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
  );
}
