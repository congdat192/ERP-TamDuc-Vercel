
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemedCustomerStats } from '../components/ThemedCustomerStats';
import { CustomerSearchActions } from '../components/CustomerSearchActions';
import { CustomerFilters } from '../components/CustomerFilters';
import { CustomerTable } from '../components/CustomerTable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColumnConfig } from '../components/ColumnVisibilityFilter';
import { customerService } from '@/services/localStorage/customerService';
import { MockCustomer } from '@/data/mockData';

interface CustomerManagementProps {
  currentUser?: any;
  onBackToModules?: () => void;
}

export function CustomerManagement({ currentUser, onBackToModules }: CustomerManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [customers, setCustomers] = useState<MockCustomer[]>([]);

  // Load customers from localStorage
  useEffect(() => {
    const loadCustomers = () => {
      const data = customerService.getAll();
      setCustomers(data);
    };

    loadCustomers();

    // Listen for data changes
    const handleDataChange = (event: CustomEvent) => {
      if (event.detail.storageKey === 'erp_customers') {
        loadCustomers();
      }
    };

    window.addEventListener('erp-data-changed', handleDataChange as EventListener);
    return () => {
      window.removeEventListener('erp-data-changed', handleDataChange as EventListener);
    };
  }, []);

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'customerCode', label: 'Mã khách hàng', visible: true },
    { key: 'customerName', label: 'Tên khách hàng', visible: true },
    { key: 'customerType', label: 'Loại khách hàng', visible: true },
    { key: 'phone', label: 'Điện thoại', visible: true },
    { key: 'customerGroup', label: 'Nhóm khách hàng', visible: true },
    { key: 'gender', label: 'Giới tính', visible: false },
    { key: 'birthDate', label: 'Ngày sinh', visible: false },
    { key: 'email', label: 'Email', visible: false },
    { key: 'facebook', label: 'Facebook', visible: false },
    { key: 'company', label: 'Công ty', visible: false },
    { key: 'taxCode', label: 'Mã số thuế', visible: false },
    { key: 'idNumber', label: 'Số CCCD/CMND', visible: false },
    { key: 'address', label: 'Địa chỉ', visible: false },
    { key: 'deliveryArea', label: 'Khu vực giao hàng', visible: false },
    { key: 'ward', label: 'Phường/Xã', visible: false },
    { key: 'creator', label: 'Người tạo', visible: false },
    { key: 'createDate', label: 'Ngày tạo', visible: false },
    { key: 'notes', label: 'Ghi chú', visible: false },
    { key: 'lastTransactionDate', label: 'Ngày giao dịch cuối', visible: false },
    { key: 'createBranch', label: 'Chi nhánh tạo', visible: false },
    { key: 'currentDebt', label: 'Nợ hiện tại', visible: false },
    { key: 'debtDays', label: 'Số ngày nợ', visible: false },
    { key: 'totalSales', label: 'Tổng bán', visible: true },
    { key: 'currentPoints', label: 'Điểm hiện tại', visible: false },
    { key: 'totalPoints', label: 'Tổng điểm', visible: false },
    { key: 'totalSalesMinusReturns', label: 'Tổng bán trừ trả hàng', visible: false },
    { key: 'status', label: 'Trạng thái', visible: false }
  ]);

  const isMobile = useIsMobile();

  // Get visible columns
  const visibleColumns = columns.filter(col => col.visible);

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setColumns(prev => 
      prev.map(col => 
        col.key === columnKey ? { ...col, visible } : col
      )
    );
  };

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId]);
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPageData = customers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      setSelectedCustomers(currentPageData.map(customer => customer.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const clearAllFilters = () => {
    setIsFilterOpen(false);
  };

  const applyFilters = () => {
    setIsFilterOpen(false);
  };

  const totalCustomers = customers.length;
  const totalPages = Math.ceil(totalCustomers / itemsPerPage);

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
        <ThemedCustomerStats />
      </div>

      {/* Main Content Layout - Takes remaining height */}
      <div className="flex flex-1 min-h-0 px-6 pb-6 gap-3">
        {/* Desktop Filter Sidebar - Fixed width with proper scroll */}
        {!isMobile && (
          <div className="w-64 flex-shrink-0 theme-card rounded-lg border theme-border-primary overflow-hidden">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="p-4">
                <CustomerFilters />
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Mobile Filter Sidebar - Drawer Style */}
        {isMobile && (
          <div className={`fixed left-0 top-0 h-full w-64 theme-card rounded-lg z-50 transform transition-transform duration-300 ${
            isFilterOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <ScrollArea className="h-[calc(100vh-100px)]">
              <div className="p-4">
                <CustomerFilters />
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Main Content Area - Flexible width, takes remaining space */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Search & Actions Bar - Fixed height */}
          <div className="flex-shrink-0">
            <CustomerSearchActions 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              columns={columns}
              handleColumnToggle={handleColumnToggle}
              onToggleSidebar={() => setIsFilterOpen(!isFilterOpen)}
            />
          </div>

          {/* Customer Table - Takes remaining height and width */}
          <div className="flex-1 min-h-0">
            <CustomerTable 
              customers={customers}
              visibleColumns={visibleColumns}
              selectedCustomers={selectedCustomers}
              handleSelectCustomer={handleSelectCustomer}
              handleSelectAll={handleSelectAll}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalCustomers={totalCustomers}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
