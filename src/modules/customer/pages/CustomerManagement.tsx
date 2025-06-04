import { useState } from 'react';
import { CustomerHeader } from '../components/CustomerHeader';
import { CustomerActions } from '../components/CustomerActions';
import { CustomerFilters } from '../components/CustomerFilters';
import { CustomerSearchActions } from '../components/CustomerSearchActions';
import { CustomerStats } from '../components/CustomerStats';
import { CustomerTable } from '../components/CustomerTable';
import { ColumnConfig } from '../components/ColumnVisibilityFilter';

// Mock customer data
const mockCustomers = [
  {
    id: 'KH869951',
    name: 'Anh Trí',
    phone: '0090147047',
    group: '1.Giới thiệu',
    birthday: '',
    lastTransaction: '03/06/2025',
    debt: 0,
    days: 0,
    creator: 'Admin',
    createdDate: '01/01/2025',
    note: '',
    email: 'tri@example.com',
    facebook: '',
    company: 'Công ty ABC',
    taxCode: '',
    address: 'Hà Nội',
    deliveryArea: 'Hà Nội',
    points: 0,
    totalSpent: 5000000,
    totalDebt: 0,
    status: 'Hoạt động'
  },
  {
    id: 'KH869950',
    name: 'Anh Đỗ Hào',
    phone: '0337092306',
    group: '3. Google',
    birthday: '23/06/2003',
    lastTransaction: '03/06/2025',
    debt: 0,
    days: 0
  },
  {
    id: 'KH869949',
    name: 'Chị Thảo',
    phone: '0979423393',
    group: '4. Di dưỡng',
    birthday: '28/04/1996',
    lastTransaction: '03/06/2025',
    debt: 0,
    days: 0
  },
  {
    id: 'KH869948',
    name: 'Cô Hoa',
    phone: '00982169520',
    group: '1.Giới thiệu',
    birthday: '',
    lastTransaction: '03/06/2025',
    debt: 0,
    days: 0
  },
  {
    id: 'KH869947',
    name: 'Chị Huyền',
    phone: '0977848127',
    group: '1.Giới thiệu',
    birthday: '29/12/2004',
    lastTransaction: '03/06/2025',
    debt: 0,
    days: 0
  },
  {
    id: 'KH869946',
    name: 'Cô Thủy',
    phone: '0903813868',
    group: '3. Google',
    birthday: '09/06/1964',
    lastTransaction: '03/06/2025',
    debt: 0,
    days: 0
  },
  {
    id: 'KH869945',
    name: 'Chị Đỗ Thị Thảo Vân',
    phone: '0396476492',
    group: '1.Giới thiệu',
    birthday: '07/01/2003',
    lastTransaction: '03/06/2025',
    debt: 0,
    days: 0
  },
  {
    id: 'KH869944',
    name: 'Chị Khánh Dư',
    phone: '0912895774',
    group: '1.Giới thiệu',
    birthday: '11/09/2001',
    lastTransaction: '03/06/2025',
    debt: 0,
    days: 0
  },
  {
    id: 'KH869943',
    name: 'Chị Nguyễn Khánh Linh',
    phone: '0336832398',
    group: '1.Giới thiệu',
    birthday: '13/06/1998',
    lastTransaction: '03/06/2025',
    debt: 0,
    days: 0
  },
  {
    id: 'KH869942',
    name: 'Chị Hân',
    phone: '0769550492',
    group: '3. Google',
    birthday: '24/09/2006',
    lastTransaction: '03/06/2025',
    debt: 0,
    days: 0
  },
  {
    id: 'KH869941',
    name: 'Chị Bảo Bình',
    phone: '0967266416',
    group: '2. Facebook',
    birthday: '12/02/1994',
    lastTransaction: '03/06/2025',
    debt: 0,
    days: 0
  },
  {
    id: 'KH869940',
    name: 'Cô Đặng Thị Ngọc Thủy',
    phone: '0919465700',
    group: '1.Giới thiệu',
    birthday: '12/11/1976',
    lastTransaction: '03/06/2025',
    debt: 0,
    days: 0
  },
  {
    id: 'KH869939',
    name: 'Anh Minh Thuận',
    phone: '0762584566',
    group: '3. Google',
    birthday: '24/09/1996',
    lastTransaction: '03/06/2025',
    debt: 0,
    days: 0
  },
  {
    id: 'KH869938',
    name: 'Anh Lê Phát Đại',
    phone: '0852525966',
    group: '2. Facebook',
    birthday: '20/01/1977',
    lastTransaction: '03/06/2025',
    debt: 3000000,
    days: 0
  },
  {
    id: 'KH869937',
    name: 'Anh Vũ',
    phone: '0828751728',
    group: '3. Google',
    birthday: '03/08/2001',
    lastTransaction: '03/06/2025',
    debt: 0,
    days: 0
  }
];

interface CustomerManagementProps {
  currentUser: any;
  onBackToModules: () => void;
}

export function CustomerManagement({ currentUser, onBackToModules }: CustomerManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Column visibility state - cập nhật để có đầy đủ các cột
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'id', label: 'Mã khách hàng', visible: true },
    { key: 'name', label: 'Tên khách hàng', visible: true },
    { key: 'group', label: 'Loại khách hàng', visible: true },
    { key: 'phone', label: 'Điện thoại', visible: true },
    { key: 'birthday', label: 'Ngày sinh', visible: true },
    { key: 'gender', label: 'Giới tính', visible: false },
    { key: 'email', label: 'Email', visible: false },
    { key: 'facebook', label: 'Facebook', visible: false },
    { key: 'company', label: 'Công ty', visible: false },
    { key: 'taxCode', label: 'Mã số thuế', visible: false },
    { key: 'idCard', label: 'Số CCCD/CMND', visible: false },
    { key: 'address', label: 'Địa chỉ', visible: false },
    { key: 'deliveryArea', label: 'Khu vực giao hàng', visible: false },
    { key: 'ward', label: 'Phường/Xã', visible: false },
    { key: 'creator', label: 'Người tạo', visible: false },
    { key: 'createdDate', label: 'Ngày tạo', visible: false },
    { key: 'note', label: 'Ghi chú', visible: false },
    { key: 'lastOrderDate', label: 'Ngày giao dịch cuối', visible: false },
    { key: 'staffCreated', label: 'Chi nhánh tạo', visible: false },
    { key: 'currentDebt', label: 'Nợ hiện tại', visible: false },
    { key: 'debtDays', label: 'Số ngày nợ', visible: false },
    { key: 'totalSales', label: 'Tổng bán', visible: false },
    { key: 'currentPoints', label: 'Điểm hiện tại', visible: false },
    { key: 'totalSalesMinusReturns', label: 'Tổng bán trừ trả hàng', visible: false },
    { key: 'status', label: 'Trạng thái', visible: false }
  ]);

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGroup = selectedGroup === 'all' || customer.group === selectedGroup;
    
    return matchesSearch && matchesGroup;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(paginatedCustomers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, customerId]);
    } else {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
    }
  };

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setColumns(prev => 
      prev.map(col => 
        col.key === columnKey ? { ...col, visible } : col
      )
    );
  };

  // Get visible columns
  const visibleColumns = columns.filter(col => col.visible);
  const totalCustomers = 122614;
  const totalDebt = '100,717,794';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <CustomerHeader onBackToModules={onBackToModules} />
          <CustomerActions setSidebarOpen={setSidebarOpen} />
        </div>
      </div>

      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar Filters */}
        <CustomerFilters sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6">
          {/* Search and Filters */}
          <CustomerSearchActions 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            columns={columns}
            handleColumnToggle={handleColumnToggle}
          />

          {/* Stats Summary */}
          <CustomerStats totalDebt={totalDebt} />

          {/* Customer Table */}
          <CustomerTable
            customers={paginatedCustomers}
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
  );
}
