
import { useState } from 'react';
import { Search, Plus, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ColumnVisibilityFilter } from '../components/ColumnVisibilityFilter';
import { ColumnConfig } from '../components/ColumnVisibilityFilter';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { InventoryFilters } from './InventoryFilters';

interface InventorySearchActionsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  columns: ColumnConfig[];
  handleColumnToggle: (columnKey: string) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (value: boolean) => void;
  clearAllFilters: () => void;
  applyFilters: () => void;
  isMobile: boolean;
  inventoryData: any[];
  selectedCategories: number[];
  selectedCategoryPaths: string[];
  onCategoriesChange: (ids: number[], paths: string[]) => void;
  selectedBrands: number[];
  setSelectedBrands: (brands: number[]) => void;
  lowStockOnly: boolean;
  setLowStockOnly: (value: boolean) => void;
  overstockOnly: boolean;
  setOverstockOnly: (value: boolean) => void;
}

export function InventorySearchActions({
  searchTerm,
  setSearchTerm,
  columns,
  handleColumnToggle,
  isFilterOpen,
  setIsFilterOpen,
  clearAllFilters,
  applyFilters,
  isMobile,
  inventoryData,
  selectedCategories,
  selectedCategoryPaths,
  onCategoriesChange,
  selectedBrands,
  setSelectedBrands,
  lowStockOnly,
  setLowStockOnly,
  overstockOnly,
  setOverstockOnly
}: InventorySearchActionsProps) {
  return (
    <div className="theme-card rounded-lg border theme-border-primary">
      <div className="p-4">
        <div className="flex flex-col lg:flex-row items-center space-y-3 lg:space-y-0 lg:space-x-4">
          {/* Search Input */}
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 theme-text-muted h-4 w-4" />
            <Input
              placeholder="Tìm kiếm theo mã hàng, tên hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 voucher-input"
            />
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
                <span className="hidden sm:inline">Hàng hóa</span>
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
                      <InventoryFilters 
                        onClearFilters={clearAllFilters}
                        onApplyFilters={applyFilters}
                        isMobile={isMobile}
                        selectedCategories={selectedCategories}
                        selectedCategoryPaths={selectedCategoryPaths}
                        onCategoriesChange={onCategoriesChange}
                        selectedBrands={selectedBrands}
                        setSelectedBrands={setSelectedBrands}
                        lowStockOnly={lowStockOnly}
                        setLowStockOnly={setLowStockOnly}
                        overstockOnly={overstockOnly}
                        setOverstockOnly={setOverstockOnly}
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
