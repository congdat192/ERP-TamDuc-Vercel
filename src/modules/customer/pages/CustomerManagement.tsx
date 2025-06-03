
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, RefreshCw } from 'lucide-react';
import { CustomerSidebar } from '../components/CustomerSidebar';
import { CustomerTable } from '../components/CustomerTable';
import { AddCustomerModal } from '../components/AddCustomerModal';
import { CustomerEditModal } from '../components/CustomerEditModal';
import { CustomerDetailModal } from '../components/CustomerDetailModal';
import { useCustomers } from '../hooks/useCustomers';
import { Customer } from '../types';
import { useToast } from '@/hooks/use-toast';

export function CustomerManagement() {
  const { customers, filters, setFilters, searchTerm, setSearchTerm, summary } = useCustomers();
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleRefresh = () => {
    toast({
      title: "Đã làm mới",
      description: "Dữ liệu khách hàng đã được cập nhật"
    });
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleEditFromDetail = (customer: Customer) => {
    setIsDetailModalOpen(false);
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleCustomerUpdated = (updatedCustomer: Customer) => {
    // In a real app, this would update the customer list
    console.log('Customer updated:', updatedCustomer);
    setIsEditModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleAddCustomer = () => {
    setIsAddModalOpen(true);
  };

  const handleCustomerAdded = () => {
    // In a real app, this would refresh the customer list
    toast({
      title: "Thành công",
      description: "Đã thêm khách hàng mới thành công"
    });
    setIsAddModalOpen(false);
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
                onClick={handleAddCustomer}
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

      {/* Modals */}
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCustomerAdded={handleCustomerAdded}
      />

      <CustomerEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        customer={selectedCustomer}
        onCustomerUpdated={handleCustomerUpdated}
      />

      <CustomerDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        customer={selectedCustomer}
        onEditCustomer={handleEditFromDetail}
      />
    </div>
  );
}
