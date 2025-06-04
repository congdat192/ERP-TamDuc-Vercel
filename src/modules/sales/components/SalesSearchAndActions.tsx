
import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ColumnVisibilityFilter } from '../components/ColumnVisibilityFilter';
import { ColumnConfig } from '../components/ColumnVisibilityFilter';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { SalesFilters } from './SalesFilters';

interface SalesSearchAndActionsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
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
  columns,
  handleColumnToggle,
  isFilterOpen,
  setIsFilterOpen,
  clearAllFilters,
  applyFilters,
  isMobile,
  salesData
}: SalesSearchAndActionsProps) {
  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  // Calculate summary values
  const totalSales = salesData.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalDiscount = salesData.reduce((sum, item) => sum + item.discount, 0);
  const totalPaid = salesData.reduce((sum, item) => sum + item.paidAmount, 0);

  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm theo mã hóa đơn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Column visibility filter */}
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
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Hóa đơn
        </Button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-sm text-gray-600">Tổng doanh thu</div>
          <div className="font-semibold text-lg">{formatCurrency(totalSales)}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Tổng giảm giá</div>
          <div className="font-semibold text-lg text-red-600">{formatCurrency(totalDiscount)}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Khách thanh toán</div>
          <div className="font-semibold text-lg text-green-600">{formatCurrency(totalPaid)}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Số hóa đơn</div>
          <div className="font-semibold text-lg">{salesData.length}</div>
        </div>
      </div>
    </div>
  );
}
