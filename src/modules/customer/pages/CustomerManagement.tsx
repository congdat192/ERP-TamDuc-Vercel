import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColumnVisibilityFilter, ColumnConfig } from '../components/ColumnVisibilityFilter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Download,
  Upload,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Menu,
  X
} from 'lucide-react';

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

  // Column visibility state
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'id', label: 'Mã khách hàng', visible: true },
    { key: 'name', label: 'Tên khách hàng', visible: true },
    { key: 'phone', label: 'Điện thoại', visible: true },
    { key: 'group', label: 'Nhóm khách hàng', visible: true },
    { key: 'birthday', label: 'Ngày sinh', visible: true },
    { key: 'creator', label: 'Người tạo', visible: false },
    { key: 'createdDate', label: 'Ngày tạo', visible: false },
    { key: 'note', label: 'Ghi chú', visible: false },
    { key: 'email', label: 'Email', visible: false },
    { key: 'facebook', label: 'Facebook', visible: false },
    { key: 'company', label: 'Công ty', visible: false },
    { key: 'taxCode', label: 'Mã số thuế', visible: false },
    { key: 'address', label: 'Địa chỉ', visible: false },
    { key: 'deliveryArea', label: 'Khu vực giao hàng', visible: false },
    { key: 'points', label: 'Điểm hiện tại', visible: false },
    { key: 'totalSpent', label: 'Tổng bán', visible: false },
    { key: 'totalDebt', label: 'Tổng bán trừ trả hàng', visible: false },
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

  const getGroupBadgeColor = (group: string) => {
    switch (group) {
      case '1.Giới thiệu':
        return 'bg-blue-100 text-blue-800';
      case '2. Facebook':
        return 'bg-purple-100 text-purple-800';
      case '3. Google':
        return 'bg-green-100 text-green-800';
      case '4. Di dưỡng':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCellContent = (customer: any, columnKey: string) => {
    switch (columnKey) {
      case 'id':
        return <span className="font-medium text-blue-600">{customer.id}</span>;
      case 'name':
        return <span className="font-medium">{customer.name}</span>;
      case 'phone':
        return customer.phone;
      case 'group':
        return (
          <Badge className={getGroupBadgeColor(customer.group)} variant="secondary">
            {customer.group}
          </Badge>
        );
      case 'birthday':
        return customer.birthday;
      case 'creator':
        return customer.creator;
      case 'createdDate':
        return customer.createdDate;
      case 'note':
        return customer.note;
      case 'email':
        return customer.email;
      case 'facebook':
        return customer.facebook;
      case 'company':
        return customer.company;
      case 'taxCode':
        return customer.taxCode;
      case 'address':
        return customer.address;
      case 'deliveryArea':
        return customer.deliveryArea;
      case 'points':
        return customer.points.toLocaleString();
      case 'totalSpent':
        return customer.totalSpent.toLocaleString();
      case 'totalDebt':
        return customer.totalDebt.toLocaleString();
      case 'status':
        return customer.status;
      default:
        return '';
    }
  };

  const totalCustomers = 122614;
  const totalDebt = '100,717,794';
  // Get visible columns
  const visibleColumns = columns.filter(col => col.visible);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBackToModules}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Khách hàng</h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Upload className="w-4 h-4 mr-2" />
              Import file
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Download className="w-4 h-4 mr-2" />
              Gửi tin nhắn
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Khách hàng
            </Button>
            <Button variant="ghost" size="sm" className="sm:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
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
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          sm:translate-x-0 
          fixed sm:relative 
          z-50 sm:z-auto
          w-64 sm:w-64 lg:w-72
          bg-white border-r border-gray-200 
          min-h-screen 
          transition-transform duration-300 ease-in-out
        `}>
          <div className="p-4">
            {/* Mobile close button */}
            <div className="flex justify-between items-center mb-4 sm:hidden">
              <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Overview */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Tổng bán</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giá trị</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <input type="text" placeholder="Từ" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                      <input type="text" placeholder="Nhập giá trị" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <input type="text" placeholder="Tới" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                      <input type="text" placeholder="Nhập giá trị" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Period */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Thời gian</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Toàn thời gian</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    <span className="text-sm">Tùy chỉnh</span>
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Debt Status */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Nợ hiện tại</h3>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <input type="text" placeholder="Từ" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                    <input type="text" placeholder="Nhập giá trị" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                  </div>
                  <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <input type="text" placeholder="Tới" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                    <input type="text" placeholder="Nhập giá trị" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                  </div>
                </div>
              </div>

              {/* Days Overdue */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Số ngày nợ</h3>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <input type="text" placeholder="Từ" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                    <input type="text" placeholder="Nhập giá trị" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                  </div>
                  <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <input type="text" placeholder="Tới" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                    <input type="text" placeholder="Nhập giá trị" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                  </div>
                </div>
              </div>

              {/* Transaction Area */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Điểm hiện tại</h3>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <input type="text" placeholder="Từ" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                    <input type="text" placeholder="Nhập giá trị" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                  </div>
                  <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <input type="text" placeholder="Tới" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                    <input type="text" placeholder="Nhập giá trị" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                  </div>
                </div>
              </div>

              {/* Transaction Zone */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Khu vực giao hàng</h3>
                <select className="w-full px-2 py-1 text-xs border rounded">
                  <option>Chọn Tỉnh/TP - Quận/Huyện</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Trạng thái</h3>
                <div className="space-y-2">
                  <Button variant="default" size="sm" className="w-full justify-start bg-blue-500 text-white">
                    Tất cả
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Đang hoạt động
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Ngưng hoạt động
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex-1 relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Theo mã, tên, số điện thoại"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Lọc
                  </Button>
                  <ColumnVisibilityFilter 
                    columns={columns}
                    onColumnToggle={handleColumnToggle}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6 p-4">
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-bold text-gray-900">{totalDebt}</span>
            </div>
          </div>

          {/* Customer Table with fixed height ScrollArea */}
          <div className="bg-white rounded-lg border border-gray-200">
            <ScrollArea className="h-[600px]">
              <div className="min-w-full overflow-x-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10 border-b">
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-12 px-4 py-3">
                        <Checkbox 
                          checked={selectedCustomers.length === paginatedCustomers.length && paginatedCustomers.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      {visibleColumns.map((column) => (
                        <TableHead key={column.key} className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-500 min-w-[150px]">
                          {column.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCustomers.map((customer) => (
                      <TableRow key={customer.id} className="hover:bg-gray-50 border-b">
                        <TableCell className="px-4 py-3">
                          <Checkbox 
                            checked={selectedCustomers.includes(customer.id)}
                            onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked as boolean)}
                          />
                        </TableCell>
                        {visibleColumns.map((column) => (
                          <TableCell key={column.key} className="whitespace-nowrap px-4 py-3 min-w-[150px]">
                            {renderCellContent(customer, column.key)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>

            {/* Pagination - outside ScrollArea */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Hiển thị</span>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">dòng</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <span className="text-sm text-gray-600">
                  {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} trong {totalCustomers.toLocaleString()} khách hàng
                </span>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    <Input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => setCurrentPage(Number(e.target.value))}
                      className="w-16 h-8 text-center"
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
