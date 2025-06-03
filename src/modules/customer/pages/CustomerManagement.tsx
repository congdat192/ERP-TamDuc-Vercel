
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, RefreshCw } from 'lucide-react';
import { CustomerSidebar } from '../components/CustomerSidebar';
import { CustomerTable } from '../components/CustomerTable';
import { AddCustomerModal } from '../components/AddCustomerModal';
import { useCustomers } from '../hooks/useCustomers';
import { Customer } from '../types';
import { useToast } from '@/hooks/use-toast';

export function CustomerManagement() {
  const { customers, filters, setFilters, searchTerm, setSearchTerm, summary } = useCustomers();
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleRefresh = () => {
    toast({
      title: "Đã làm mới",
      description: "Dữ liệu khách hàng đã được cập nhật"
    });
  };

  const handleViewCustomer = (customer: Customer) => {
    toast({
      title: "Xem thông tin khách hàng",
      description: `Đang xem thông tin của ${customer.name}`
    });
  };

  const handleEditCustomer = (customer: Customer) => {
    toast({
      title: "Chỉnh sửa khách hàng",
      description: `Đang chỉnh sửa thông tin của ${customer.name}`
    });
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <CustomerSidebar filters={filters} onFiltersChange={setFilters} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Khách hàng</h1>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Làm mới
              </Button>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Khách hàng
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Theo mã, tên, số điện thoại"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Customer Table */}
        <div className="flex-1 p-4">
          <CustomerTable
            customers={customers}
            summary={summary}
            onViewCustomer={handleViewCustomer}
            onEditCustomer={handleEditCustomer}
          />
        </div>
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
