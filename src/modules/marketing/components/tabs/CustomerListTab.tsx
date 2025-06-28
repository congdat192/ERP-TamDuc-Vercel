import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, User, Eye, Edit, Download, Upload, Settings } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { CustomerDetailModal } from '../CustomerDetailModal';
import { EditCustomerModal } from '../EditCustomerModal';
import { CustomerFiltersBar, CustomerFilters } from '../CustomerFiltersBar';
import { BulkOperationsBar, BulkSelectCheckbox, BulkSelectHeader } from '@/components/ui/bulk-operations';

interface MarketingCustomer {
  id: string;
  name: string;
  phone: string;
  group: string;
  source: string;
  email: string;
  createdDate: string;
  status: 'active' | 'inactive';
  totalSpent: number;
  voucherCount: number;
}

const mockCustomers: MarketingCustomer[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    group: 'VIP',
    source: 'KiotViet',
    email: 'nguyenvana@email.com',
    createdDate: '2024-06-20',
    status: 'active',
    totalSpent: 2500000,
    voucherCount: 3
  },
  {
    id: '2',
    name: 'Trần Thị B',
    phone: '0912345678',
    group: 'Thường',
    source: 'Voucher Campaign',
    email: 'tranthib@email.com',
    createdDate: '2024-06-18',
    status: 'active',
    totalSpent: 800000,
    voucherCount: 1
  },
  {
    id: '3',
    name: 'Lê Văn C',
    phone: '0923456789',
    group: 'Tiềm năng',
    source: 'Marketing Campaign',
    email: 'levanc@email.com',
    createdDate: '2024-06-15',
    status: 'inactive',
    totalSpent: 0,
    voucherCount: 2
  }
];

export function CustomerListTab() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [filteredCustomers, setFilteredCustomers] = useState(mockCustomers);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<MarketingCustomer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<MarketingCustomer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);

  const applyFilters = (filters: CustomerFilters) => {
    let filtered = customers;

    // Search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.phone.includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm)
      );
    }

    // Group filter
    if (filters.group !== 'all') {
      filtered = filtered.filter(customer => customer.group === filters.group);
    }

    // Source filter
    if (filters.source !== 'all') {
      filtered = filtered.filter(customer => customer.source === filters.source);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(customer => customer.status === filters.status);
    }

    // Voucher range filter
    if (filters.voucherRange.min || filters.voucherRange.max) {
      const min = parseInt(filters.voucherRange.min) || 0;
      const max = parseInt(filters.voucherRange.max) || Infinity;
      filtered = filtered.filter(customer => 
        customer.voucherCount >= min && customer.voucherCount <= max
      );
    }

    // Spent range filter
    if (filters.spentRange.min || filters.spentRange.max) {
      const min = parseInt(filters.spentRange.min) || 0;
      const max = parseInt(filters.spentRange.max) || Infinity;
      filtered = filtered.filter(customer => 
        customer.totalSpent >= min && customer.totalSpent <= max
      );
    }

    // Date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      const fromDate = filters.dateRange.from ? new Date(filters.dateRange.from) : new Date('1900-01-01');
      const toDate = filters.dateRange.to ? new Date(filters.dateRange.to) : new Date();
      filtered = filtered.filter(customer => {
        const customerDate = new Date(customer.createdDate);
        return customerDate >= fromDate && customerDate <= toDate;
      });
    }

    setFilteredCustomers(filtered);
  };

  const handleSync = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newCustomersCount = Math.floor(Math.random() * 5) + 1;
      toast({
        title: "Đồng bộ thành công",
        description: `Đã đồng bộ ${newCustomersCount} khách hàng mới từ các nguồn`,
      });
    } catch (error) {
      toast({
        title: "Đồng bộ thất bại",
        description: "Có lỗi xảy ra khi đồng bộ dữ liệu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = filteredCustomers.map(customer => 
      `${customer.name},${customer.phone},${customer.email},${customer.group},${customer.source},${customer.status},${customer.totalSpent}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    
    toast({
      title: "Xuất dữ liệu thành công",
      description: `Đã xuất ${filteredCustomers.length} khách hàng`,
    });
  };

  const handleImport = () => {
    toast({
      title: "Nhập dữ liệu",
      description: "Tính năng nhập dữ liệu sẽ được phát triển",
    });
  };

  const handleCustomerClick = (customer: MarketingCustomer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (customer: MarketingCustomer) => {
    setEditingCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleSaveCustomer = (updatedCustomer: MarketingCustomer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    setFilteredCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };

  const handleSelectCustomer = (customerId: string, selected: boolean) => {
    if (selected) {
      setSelectedCustomerIds(prev => [...prev, customerId]);
    } else {
      setSelectedCustomerIds(prev => prev.filter(id => id !== customerId));
    }
  };

  const handleSelectAll = () => {
    setSelectedCustomerIds(filteredCustomers.map(customer => customer.id));
  };

  const handleDeselectAll = () => {
    setSelectedCustomerIds([]);
  };

  const handleBulkDelete = () => {
    setCustomers(prev => prev.filter(customer => !selectedCustomerIds.includes(customer.id)));
    setFilteredCustomers(prev => prev.filter(customer => !selectedCustomerIds.includes(customer.id)));
    setSelectedCustomerIds([]);
    toast({
      title: "Xóa thành công",
      description: `Đã xóa ${selectedCustomerIds.length} khách hàng`,
    });
  };

  const handleBulkExport = () => {
    const selectedCustomers = filteredCustomers.filter(customer => 
      selectedCustomerIds.includes(customer.id)
    );
    
    const csvContent = selectedCustomers.map(customer => 
      `${customer.name},${customer.phone},${customer.email},${customer.group}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected-customers.csv';
    a.click();
    
    toast({
      title: "Xuất dữ liệu đã chọn",
      description: `Đã xuất ${selectedCustomers.length} khách hàng`,
    });
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Không hoạt động</Badge>
    );
  };

  const getSourceBadge = (source: string) => {
    const sourceConfig = {
      'KiotViet': { className: "bg-blue-100 text-blue-800", label: "KiotViet" },
      'Voucher Campaign': { className: "bg-orange-100 text-orange-800", label: "Voucher Campaign" },
      'Marketing Campaign': { className: "bg-purple-100 text-purple-800", label: "Marketing Campaign" }
    };
    const config = sourceConfig[source as keyof typeof sourceConfig] || 
                   { className: "bg-gray-100 text-gray-800", label: source };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 theme-text-primary" />
          <h2 className="text-xl font-semibold theme-text">Danh sách khách hàng</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleImport}
            variant="outline"
            size="sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            Nhập
          </Button>
          <Button 
            onClick={handleExport}
            variant="outline"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất
          </Button>
          <Button 
            onClick={handleSync}
            disabled={isLoading}
            className="voucher-button-primary"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Đang đồng bộ...' : 'Đồng bộ'}
          </Button>
        </div>
      </div>

      <CustomerFiltersBar onFilterChange={applyFilters} />

      <BulkOperationsBar
        selectedCount={selectedCustomerIds.length}
        totalCount={filteredCustomers.length}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleBulkExport}
        entityName="khách hàng"
      />

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <BulkSelectHeader
                  selectedCount={selectedCustomerIds.length}
                  totalCount={filteredCustomers.length}
                  onSelectAll={handleSelectAll}
                  onDeselectAll={handleDeselectAll}
                />
              </TableHead>
              <TableHead className="font-medium">STT</TableHead>
              <TableHead className="font-medium">Tên khách hàng</TableHead>
              <TableHead className="font-medium">Số điện thoại</TableHead>
              <TableHead className="font-medium">Nhóm KH</TableHead>
              <TableHead className="font-medium">Nguồn KH</TableHead>
              <TableHead className="font-medium">Email</TableHead>
              <TableHead className="font-medium">Ngày tạo</TableHead>
              <TableHead className="font-medium">Trạng thái</TableHead>
              <TableHead className="font-medium">Tổng chi tiêu</TableHead>
              <TableHead className="font-medium">Số voucher</TableHead>
              <TableHead className="font-medium">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer, index) => (
              <TableRow key={customer.id} className="hover:bg-gray-50">
                <TableCell>
                  <BulkSelectCheckbox
                    checked={selectedCustomerIds.includes(customer.id)}
                    onChange={(checked) => handleSelectCustomer(customer.id, checked)}
                  />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>
                  <Badge variant="outline">{customer.group}</Badge>
                </TableCell>
                <TableCell>{getSourceBadge(customer.source)}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{new Date(customer.createdDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{getStatusBadge(customer.status)}</TableCell>
                <TableCell>{customer.totalSpent.toLocaleString('vi-VN')}đ</TableCell>
                <TableCell>{customer.voucherCount}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCustomerClick(customer)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditClick(customer)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      <EditCustomerModal
        customer={editingCustomer}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveCustomer}
      />
    </div>
  );
}
