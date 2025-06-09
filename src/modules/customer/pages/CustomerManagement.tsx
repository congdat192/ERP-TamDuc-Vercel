
import { useState } from 'react';
import { ThemedCustomerStats } from '../components/ThemedCustomerStats';
import { CustomerSearchActions } from '../components/CustomerSearchActions';
import { CustomerFilters } from '../components/CustomerFilters';
import { CustomerTable } from '../components/CustomerTable';
import { ColumnConfig } from '../components/ColumnVisibilityFilter';

interface CustomerManagementProps {
  currentUser?: any;
  onBackToModules?: () => void;
}

export function CustomerManagement({ currentUser, onBackToModules }: CustomerManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Mock data for the table
  const [customers] = useState([
    {
      id: 'KH001',
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      group: '1.Giới thiệu',
      birthday: '01/01/1990',
      creator: 'Admin',
      createdDate: '01/01/2024',
      note: 'Khách hàng VIP',
      email: 'nguyenvana@email.com',
      facebook: 'facebook.com/nguyenvana',
      company: 'Công ty ABC',
      taxCode: '123456789',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      deliveryArea: 'Quận 1',
      points: 1000,
      totalSpent: 5000000,
      totalDebt: 0,
      status: 'Hoạt động'
    },
    // Add more mock data as needed
  ]);

  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Đầy đủ 27 cột khách hàng
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'customerCode', label: 'Mã khách hàng', visible: true },
    { key: 'customerName', label: 'Tên khách hàng', visible: true },
    { key: 'customerType', label: 'Loại khách hàng', visible: true },
    { key: 'phone', label: 'Điện thoại', visible: true },
    { key: 'customerGroup', label: 'Nhóm khách hàng', visible: true },
    { key: 'gender', label: 'Giới tính', visible: false },
    { key: 'birthDate', label: 'Ngày sinh', visible: false },
    { key: 'email', label: 'Email', visible: true },
    { key: 'facebook', label: 'Facebook', visible: false },
    { key: 'company', label: 'Công ty', visible: false },
    { key: 'taxCode', label: 'Mã số thuế', visible: false },
    { key: 'idNumber', label: 'Số CCCD/CMND', visible: false },
    { key: 'address', label: 'Địa chỉ', visible: false },
    { key: 'deliveryArea', label: 'Khu vực giao hàng', visible: false },
    { key: 'ward', label: 'Phường/Xã', visible: false },
    { key: 'creator', label: 'Người tạo', visible: false },
    { key: 'createDate', label: 'Ngày tạo', visible: true },
    { key: 'notes', label: 'Ghi chú', visible: false },
    { key: 'lastTransactionDate', label: 'Ngày giao dịch cuối', visible: true },
    { key: 'createBranch', label: 'Chi nhánh tạo', visible: false },
    { key: 'currentDebt', label: 'Nợ hiện tại', visible: false },
    { key: 'debtDays', label: 'Số ngày nợ', visible: false },
    { key: 'totalSales', label: 'Tổng bán', visible: true },
    { key: 'currentPoints', label: 'Điểm hiện tại', visible: false },
    { key: 'totalPoints', label: 'Tổng điểm', visible: false },
    { key: 'totalSalesMinusReturns', label: 'Tổng bán trừ trả hàng', visible: false },
    { key: 'status', label: 'Trạng thái', visible: true }
  ]);

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
      setSelectedCustomers(customers.map(customer => customer.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const totalCustomers = customers.length;
  const totalPages = Math.ceil(totalCustomers / itemsPerPage);

  return (
    <div className="min-h-screen theme-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Header Section - Full Width */}
      <div className="w-full p-6 pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
          <div>
            <h1 className="text-3xl font-bold theme-text">Quản Lý Khách Hàng</h1>
            <p className="theme-text-muted mt-1">Theo dõi và quản lý thông tin khách hàng</p>
          </div>
        </div>
        
        <ThemedCustomerStats />
      </div>

      {/* Main Content Layout - Sidebar + Content */}
      <div className="flex w-full">
        {/* Sidebar Filter - Fixed Width 255px */}
        <CustomerFilters 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 lg:ml-0 p-6 pt-0 space-y-4">
          {/* Search & Actions Bar */}
          <CustomerSearchActions 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            columns={columns}
            handleColumnToggle={handleColumnToggle}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
          
          {/* Data Table */}
          <CustomerTable 
            customers={customers}
            visibleColumns={columns.filter(col => col.visible)}
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
  );
}
