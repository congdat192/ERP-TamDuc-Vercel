
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemedSalesStats } from '../components/ThemedSalesStats';
import { SalesFilters } from '../components/SalesFilters';
import { SalesSearchAndActions } from '../components/SalesSearchAndActions';
import { SalesTable } from '../components/SalesTable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColumnConfig } from '../components/ColumnVisibilityFilter';
import { mockSales } from '@/data/mockData';

interface SalesManagementProps {
  currentUser: any;
  onBackToModules: () => void;
}

export function SalesManagement({ currentUser, onBackToModules }: SalesManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSales, setSelectedSales] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Column visibility state - All 27 required columns exactly as requested
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'invoiceCode', label: 'Mã hóa đơn', visible: true },
    { key: 'datetime', label: 'Thời gian', visible: true },
    { key: 'createdTime', label: 'Thời gian tạo', visible: false },
    { key: 'lastUpdated', label: 'Ngày cập nhật', visible: false },
    { key: 'orderCode', label: 'Mã đặt hàng', visible: false },
    { key: 'returnCode', label: 'Mã trả hàng', visible: true },
    { key: 'customer', label: 'Khách hàng', visible: true },
    { key: 'email', label: 'Email', visible: false },
    { key: 'phone', label: 'Điện thoại', visible: false },
    { key: 'address', label: 'Địa chỉ', visible: false },
    { key: 'area', label: 'Khu vực', visible: false },
    { key: 'ward', label: 'Phường/Xã', visible: false },
    { key: 'birthdate', label: 'Ngày sinh', visible: false },
    { key: 'branch', label: 'Chi nhánh', visible: false },
    { key: 'seller', label: 'Người bán', visible: false },
    { key: 'creator', label: 'Người tạo', visible: false },
    { key: 'channel', label: 'Kênh bán', visible: false },
    { key: 'note', label: 'Ghi chú', visible: false },
    { key: 'totalAmount', label: 'Tổng tiền hàng', visible: true },
    { key: 'discount', label: 'Giảm giá', visible: true },
    { key: 'tax', label: 'Giảm thuế', visible: false },
    { key: 'needToPay', label: 'Khách cần trả', visible: false },
    { key: 'paidAmount', label: 'Khách đã trả', visible: true },
    { key: 'paymentDiscount', label: 'Chiết khấu thanh toán', visible: false },
    { key: 'deliveryTime', label: 'Thời gian giao hàng', visible: false },
    { key: 'status', label: 'Trạng thái', visible: true },
    { key: 'invoiceStatus', label: 'Trạng thái HĐĐT', visible: true }
  ]);

  const isMobile = useIsMobile();

  // Get visible columns
  const visibleColumns = columns.filter(col => col.visible);

  // Use mock data
  const salesData = mockSales;

  const handleColumnToggle = (columnKey: string) => {
    setColumns(prev => prev.map(col => 
      col.key === columnKey ? { ...col, visible: !col.visible } : col
    ));
  };

  const handleSelectSale = (saleId: string) => {
    setSelectedSales(prev => 
      prev.includes(saleId) 
        ? prev.filter(id => id !== saleId)
        : [...prev, saleId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPageData = salesData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      setSelectedSales(currentPageData.map(sale => sale.id));
    } else {
      setSelectedSales([]);
    }
  };

  const clearAllFilters = () => {
    setIsFilterOpen(false);
  };

  const applyFilters = () => {
    setIsFilterOpen(false);
  };

  const totalSales = salesData.length;
  const totalPages = Math.ceil(totalSales / itemsPerPage);

  return (
    <div className="flex flex-col h-screen overflow-hidden theme-background">
      {/* Mobile overlay */}
      {isFilterOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* Stats Section - Fixed height */}
      <div className="flex-shrink-0 px-6 pt-4 pb-1">
        <ThemedSalesStats />
      </div>

      {/* Main Content Layout - Takes remaining height */}
      <div className="flex flex-1 min-h-0 px-6 pb-6 gap-3">
        {/* Desktop Filter Sidebar - Fixed width with proper scroll */}
        {!isMobile && (
          <div className="w-64 flex-shrink-0 theme-card rounded-lg border theme-border-primary overflow-hidden">
            <div className="p-4 border-b theme-border-primary/20">
              <h3 className="font-semibold theme-text text-base">Bộ lọc</h3>
            </div>
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="p-4">
                <SalesFilters
                  onClearFilters={clearAllFilters}
                  onApplyFilters={applyFilters}
                  isMobile={isMobile}
                />
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Mobile Filter Sidebar - Drawer Style */}
        {isMobile && (
          <div className={`fixed left-0 top-0 h-full w-64 theme-card rounded-lg z-50 transform transition-transform duration-300 ${
            isFilterOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="p-4 border-b theme-border-primary/20">
              <h3 className="font-semibold theme-text text-base">Bộ lọc</h3>
            </div>
            <ScrollArea className="h-[calc(100vh-100px)]">
              <div className="p-4">
                <SalesFilters
                  onClearFilters={clearAllFilters}
                  onApplyFilters={applyFilters}
                  isMobile={isMobile}
                />
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Main Content Area - Flexible width, takes remaining space */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Search & Actions Bar - Fixed height */}
          <div className="flex-shrink-0">
            <SalesSearchAndActions
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              columns={columns}
              handleColumnToggle={handleColumnToggle}
              isFilterOpen={isFilterOpen}
              setIsFilterOpen={setIsFilterOpen}
              clearAllFilters={clearAllFilters}
              applyFilters={applyFilters}
              isMobile={isMobile}
              salesData={salesData}
            />
          </div>

          {/* Sales Table - Takes remaining height and width */}
          <div className="flex-1 min-h-0">
            <SalesTable
              salesData={salesData}
              visibleColumns={visibleColumns}
              selectedSales={selectedSales}
              onSelectSale={handleSelectSale}
              onSelectAll={handleSelectAll}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalSales={totalSales}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
