
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemedSalesStats } from '../components/ThemedSalesStats';
import { SalesSearchAndActions } from '../components/SalesSearchAndActions';
import { SalesFilters } from '../components/SalesFilters';
import { SalesTable } from '../components/SalesTable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColumnConfig } from '../components/ColumnVisibilityFilter';
import { salesService } from '@/services/localStorage/salesService';
import { MockSale } from '@/data/mockData';

interface SalesManagementProps {
  currentUser?: any;
  onBackToModules?: () => void;
}

export function SalesManagement({ currentUser, onBackToModules }: SalesManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSales, setSelectedSales] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sales, setSales] = useState<MockSale[]>([]);

  // Load sales from localStorage
  useEffect(() => {
    const loadSales = () => {
      const data = salesService.getAll();
      setSales(data);
    };

    loadSales();

    // Listen for data changes
    const handleDataChange = (event: CustomEvent) => {
      if (event.detail.storageKey === 'erp_sales') {
        loadSales();
      }
    };

    window.addEventListener('erp-data-changed', handleDataChange as EventListener);
    return () => {
      window.removeEventListener('erp-data-changed', handleDataChange as EventListener);
    };
  }, []);

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'orderCode', label: 'Mã đơn hàng', visible: true },
    { key: 'invoiceCode', label: 'Mã hóa đơn', visible: true },
    { key: 'returnCode', label: 'Mã trả hàng', visible: false },
    { key: 'date', label: 'Ngày bán', visible: true },
    { key: 'createdTime', label: 'Giờ tạo', visible: false },
    { key: 'lastUpdated', label: 'Cập nhật cuối', visible: false },
    { key: 'customer', label: 'Khách hàng', visible: true },
    { key: 'email', label: 'Email', visible: false },
    { key: 'phone', label: 'Điện thoại', visible: true },
    { key: 'address', label: 'Địa chỉ', visible: false },
    { key: 'area', label: 'Khu vực', visible: false },
    { key: 'ward', label: 'Phường/Xã', visible: false },
    { key: 'birthdate', label: 'Ngày sinh', visible: false },
    { key: 'branch', label: 'Chi nhánh', visible: false },
    { key: 'seller', label: 'NV bán hàng', visible: true },
    { key: 'creator', label: 'Người tạo', visible: false },
    { key: 'channel', label: 'Kênh bán', visible: true },
    { key: 'note', label: 'Ghi chú', visible: false },
    { key: 'totalAmount', label: 'Tổng tiền', visible: true },
    { key: 'discount', label: 'Chiết khấu', visible: false },
    { key: 'tax', label: 'Thuế', visible: false },
    { key: 'needToPay', label: 'Cần thanh toán', visible: true },
    { key: 'paidAmount', label: 'Đã thanh toán', visible: true },
    { key: 'paymentDiscount', label: 'CK thanh toán', visible: false },
    { key: 'deliveryTime', label: 'Thời gian giao', visible: false },
    { key: 'status', label: 'Trạng thái', visible: true }
  ]);

  const isMobile = useIsMobile();
  const visibleColumns = columns.filter(col => col.visible);

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setColumns(prev => 
      prev.map(col => 
        col.key === columnKey ? { ...col, visible } : col
      )
    );
  };

  const handleSelectSale = (saleId: string, checked: boolean) => {
    if (checked) {
      setSelectedSales(prev => [...prev, saleId]);
    } else {
      setSelectedSales(prev => prev.filter(id => id !== saleId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPageData = sales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      setSelectedSales(currentPageData.map(sale => sale.id));
    } else {
      setSelectedSales([]);
    }
  };

  const totalSales = sales.length;
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

      {/* Stats Section */}
      <div className="flex-shrink-0 px-6 pt-4 pb-1">
        <ThemedSalesStats />
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-1 min-h-0 px-6 pb-6 gap-3">
        {/* Desktop Filter Sidebar */}
        {!isMobile && (
          <div className="w-64 flex-shrink-0 theme-card rounded-lg border theme-border-primary overflow-hidden">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="p-4">
                <SalesFilters />
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Mobile Filter Sidebar */}
        {isMobile && (
          <div className={`fixed left-0 top-0 h-full w-64 theme-card rounded-lg z-50 transform transition-transform duration-300 ${
            isFilterOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <ScrollArea className="h-[calc(100vh-100px)]">
              <div className="p-4">
                <SalesFilters />
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Search & Actions Bar */}
          <div className="flex-shrink-0">
            <SalesSearchAndActions 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              columns={columns}
              handleColumnToggle={handleColumnToggle}
              onToggleSidebar={() => setIsFilterOpen(!isFilterOpen)}
            />
          </div>

          {/* Sales Table */}
          <div className="flex-1 min-h-0">
            <SalesTable 
              sales={sales}
              visibleColumns={visibleColumns}
              selectedSales={selectedSales}
              handleSelectSale={handleSelectSale}
              handleSelectAll={handleSelectAll}
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
