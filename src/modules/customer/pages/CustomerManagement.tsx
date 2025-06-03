
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Plus, Search } from 'lucide-react';
import { CustomerSidebar } from '../components/CustomerSidebar';
import { CustomerTable } from '../components/CustomerTable';
import { AddCustomerModal } from '../components/AddCustomerModal';
import { useCustomers } from '../hooks/useCustomers';
import { Customer } from '../types';

export function CustomerManagement() {
  const {
    customers,
    summary,
    filters,
    isLoading,
    setFilters,
    addCustomer,
    updateCustomer,
    refreshData,
    resetFilters,
  } = useCustomers();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setFilters({
      ...filters,
      search: value.trim() || undefined
    });
  };

  const handleCustomerClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowAddModal(true);
  };

  const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'createdDate'>) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, customerData);
      setEditingCustomer(null);
    } else {
      addCustomer(customerData);
    }
  };

  const handleModalClose = (open: boolean) => {
    setShowAddModal(open);
    if (!open) {
      setEditingCustomer(null);
    }
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <CustomerSidebar
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b bg-background">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Khách hàng</h1>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
              <Button
                size="sm"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Khách hàng
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Theo mã, tên, số điện thoại"
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-6">
          <CustomerTable
            customers={customers}
            summary={summary}
            onCustomerClick={handleCustomerClick}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Add/Edit Customer Modal */}
      <AddCustomerModal
        open={showAddModal}
        onOpenChange={handleModalClose}
        onSave={handleSaveCustomer}
        customer={editingCustomer}
      />
    </div>
  );
}
