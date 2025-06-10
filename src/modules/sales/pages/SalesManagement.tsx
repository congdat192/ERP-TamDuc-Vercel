
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemedSalesStats } from '../components/ThemedSalesStats';
import { SalesFilters } from '../components/SalesFilters';
import { SalesSearchAndActions } from '../components/SalesSearchAndActions';
import { SalesTable } from '../components/SalesTable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColumnConfig } from '../components/ColumnVisibilityFilter';

interface SalesManagementProps {
  currentUser: any;
  onBackToModules: () => void;
}

export function SalesManagement({ currentUser, onBackToModules }: SalesManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Column visibility state
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
    { key: 'method', label: 'Phương/Xá', visible: false },
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
    { key: 'totalDiscount', label: 'Chiết khấu thanh toán', visible: false },
    { key: 'deliveryTime', label: 'Thời gian giao hàng', visible: false },
    { key: 'status', label: 'Trạng thái', visible: true },
    { key: 'invoiceStatus', label: 'Trạng thái HĐDT', visible: true }
  ]);

  const isMobile = useIsMobile();

  // Get visible columns
  const visibleColumns = columns.filter(col => col.visible);

  // Mock data for sales
  const salesData = [
    {
      id: 'HD001',
      date: '10/06/2024 14:30',
      returnCode: '',
      customer: 'Nguyễn Văn A',
      totalAmount: 1500000,
      discount: 50000,
      paidAmount: 1450000,
      status: 'Hoàn thành'
    },
    {
      id: 'HD002', 
      date: '10/06/2024 15:45',
      returnCode: 'TH001',
      customer: 'Trần Thị B',
      totalAmount: 2200000,
      discount: 100000,
      paidAmount: 2100000,
      status: 'Hoàn thành'
    },
    {
      id: 'HD003',
      date: '09/06/2024 09:15',
      returnCode: '',
      customer: 'Lê Văn C',
      totalAmount: 800000,
      discount: 0,
      paidAmount: 800000,
      status: 'Đã hủy'
    }
  ];

  const handleColumnToggle = (columnKey: string) => {
    setColumns(prev => prev.map(col => 
      col.key === columnKey ? { ...col, visible: !col.visible } : col
    ));
  };

  const clearAllFilters = () => {
    // Reset filter logic
    setIsFilterOpen(false);
  };

  const applyFilters = () => {
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen theme-background">
      {/* Mobile overlay */}
      {isFilterOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* Stats Section - Moved up, no title */}
      <div className="w-full px-6 pt-4 pb-2">
        <ThemedSalesStats />
      </div>

      {/* Main Content Layout - Optimized spacing */}
      <div className="flex w-full">
        {/* Desktop Filter Sidebar - Fixed Width 255px */}
        {!isMobile && (
          <div className="w-64 max-w-64 theme-card border-r theme-border-primary/20 p-4 space-y-4">
            <h3 className="font-semibold theme-text text-base">Bộ lọc</h3>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="pr-4">
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
          <div className={`fixed left-0 top-0 h-full w-64 theme-card z-50 transform transition-transform duration-300 ${
            isFilterOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="p-4 space-y-4">
              <h3 className="font-semibold theme-text text-base">Bộ lọc</h3>
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="pr-4">
                  <SalesFilters
                    onClearFilters={clearAllFilters}
                    onApplyFilters={applyFilters}
                    isMobile={isMobile}
                  />
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Main Content Area - Optimized padding */}
        <div className="flex-1 lg:ml-0 px-6 py-2 space-y-3">
          {/* Search & Actions Bar */}
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

          {/* Sales Table */}
          <SalesTable
            salesData={salesData}
            visibleColumns={visibleColumns}
          />
        </div>
      </div>
    </div>
  );
}
