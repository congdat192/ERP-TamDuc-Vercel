
import { useState } from 'react';
import { Search, Plus, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ColumnVisibilityFilter } from '../components/ColumnVisibilityFilter';
import { ColumnConfig } from '../components/ColumnVisibilityFilter';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { SalesFilters } from './SalesFilters';

interface SalesSearchAndActionsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  phoneSearch?: string;
  setPhoneSearch?: (value: string) => void;
  onPhoneSearch?: () => void;
  onResetSearch?: () => void;
  isLoadingApi?: boolean;
  columns: ColumnConfig[];
  handleColumnToggle: (columnKey: string) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (value: boolean) => void;
  clearAllFilters: () => void;
  applyFilters: () => void;
  isMobile: boolean;
  salesData: any[];
}

export function SalesSearchAndActions({
  searchTerm,
  setSearchTerm,
  phoneSearch = '',
  setPhoneSearch,
  onPhoneSearch,
  onResetSearch,
  isLoadingApi = false,
  columns,
  handleColumnToggle,
  isFilterOpen,
  setIsFilterOpen,
  clearAllFilters,
  applyFilters,
  isMobile,
  salesData
}: SalesSearchAndActionsProps) {
  return (
    <div className="theme-card rounded-lg border theme-border-primary">
      <div className="p-4 space-y-3">
        {/* First Row: Search by Invoice Code */}
        <div className="flex flex-col lg:flex-row items-center space-y-3 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 theme-text-muted h-4 w-4" />
            <Input
              placeholder="Tìm kiếm theo mã hóa đơn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 voucher-input"
            />
          </div>
        </div>

        {/* Second Row: Search by Phone with API */}
        <div className="flex flex-col lg:flex-row items-center space-y-3 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 flex gap-2 items-center max-w-md">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 theme-text-muted h-4 w-4" />
              <Input
                placeholder="Tra cứu theo số điện thoại..."
                value={phoneSearch}
                onChange={(e) => setPhoneSearch?.(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onPhoneSearch?.();
                  }
                }}
                className="pl-10 voucher-input"
                disabled={isLoadingApi}
              />
            </div>
            <Button 
              size="sm" 
              onClick={onPhoneSearch}
              disabled={isLoadingApi || !phoneSearch}
              className="voucher-button-primary"
            >
              {isLoadingApi ? 'Đang tìm...' : 'Tra cứu'}
            </Button>
            {phoneSearch && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={onResetSearch}
                disabled={isLoadingApi}
                className="theme-border-primary"
              >
                Reset
              </Button>
            )}
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
                <span className="hidden sm:inline">Export file</span>
                <span className="sm:hidden">Export</span>
              </Button>
              <Button size="sm" className="flex-1 lg:flex-none voucher-button-primary">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Hóa đơn</span>
                <span className="sm:hidden">Thêm</span>
              </Button>
            </div>
            
            {/* Column Filter */}
            <div className="flex items-center space-x-2">
              {isMobile ? (
                <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <DrawerTrigger asChild>
                    <ColumnVisibilityFilter 
                      columns={columns} 
                      onColumnToggle={handleColumnToggle} 
                    />
                  </DrawerTrigger>
                  <DrawerContent className="h-[85vh]">
                    <DrawerHeader>
                      <DrawerTitle>Bộ lọc</DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 pb-4 overflow-auto">
                      <SalesFilters 
                        onClearFilters={clearAllFilters}
                        onApplyFilters={applyFilters}
                        isMobile={isMobile}
                      />
                    </div>
                  </DrawerContent>
                </Drawer>
              ) : (
                <ColumnVisibilityFilter 
                  columns={columns} 
                  onColumnToggle={handleColumnToggle} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
