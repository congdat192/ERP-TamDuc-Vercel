
import React, { useState } from 'react';
import { CustomerStats } from '../components/CustomerStats';
import { CustomerFilters } from '../components/CustomerFilters';
import { CustomerTable } from '../components/CustomerTable';
import { CustomerSearchActions } from '../components/CustomerSearchActions';
import { StoreSelector } from '@/components/ui/store-selector';

export function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    customerType: '',
    status: '',
    source: '',
    dateRange: { from: undefined, to: undefined },
  });
  const [storeMode, setStoreMode] = useState<'single' | 'multiple' | 'all'>('single');

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleModeChange = (mode: 'single' | 'multiple' | 'all') => {
    setStoreMode(mode);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with Store Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Khách Hàng</h1>
          <p className="text-gray-600">Quản lý thông tin và lịch sử khách hàng</p>
        </div>
        
        <StoreSelector 
          mode={storeMode}
          onModeChange={handleModeChange}
          showCompareMode={true}
          className="min-w-[200px]"
        />
      </div>

      {/* Customer Stats */}
      <CustomerStats 
        totalCustomers={0}
        newCustomersToday={0}
        totalDebt={0}
        totalSpent={0}
      />
      
      {/* Search and Actions */}
      <CustomerSearchActions 
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />
      
      {/* Filters */}
      <CustomerFilters 
        filters={filters}
        onFiltersChange={handleFilterChange}
      />
      
      {/* Customer Table */}
      <CustomerTable />
    </div>
  );
}
