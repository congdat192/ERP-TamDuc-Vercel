
import React, { useState } from 'react';
import { ThemedSalesStats } from '../components/ThemedSalesStats';
import { SalesSearchAndActions } from '../components/SalesSearchAndActions';
import { SalesFilters } from '../components/SalesFilters';
import { SalesTable } from '../components/SalesTable';
import { StoreSelector } from '@/components/ui/store-selector';

export function SalesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    paymentMethod: '',
    customerType: '',
    priceRange: { min: '', max: '' },
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
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Bán Hàng</h1>
          <p className="text-gray-600">Theo dõi và quản lý các giao dịch bán hàng</p>
        </div>
        
        <StoreSelector 
          mode={storeMode}
          onModeChange={handleModeChange}
          showCompareMode={true}
          className="min-w-[200px]"
        />
      </div>

      {/* Sales Stats */}
      <ThemedSalesStats />
      
      {/* Search and Actions */}
      <SalesSearchAndActions 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      {/* Filters */}
      <SalesFilters 
        filters={filters}
        onFiltersChange={handleFilterChange}
      />
      
      {/* Sales Table */}
      <SalesTable 
        searchTerm={searchTerm}
        filters={filters}
      />
    </div>
  );
}
