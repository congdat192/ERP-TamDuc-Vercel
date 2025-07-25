
import React, { useState } from 'react';
import { ThemedInventoryStats } from '../components/ThemedInventoryStats';
import { InventorySearchActions } from '../components/InventorySearchActions';
import { InventoryFilters } from '../components/InventoryFilters';
import { InventoryTable } from '../components/InventoryTable';
import { StoreSelector } from '@/components/ui/store-selector';

export function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    supplier: '',
    status: '',
    stockLevel: '',
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
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Kho Hàng</h1>
          <p className="text-gray-600">Theo dõi và quản lý tồn kho sản phẩm</p>
        </div>
        
        <StoreSelector 
          mode={storeMode}
          onModeChange={handleModeChange}
          showCompareMode={true}
          className="min-w-[200px]"
        />
      </div>

      {/* Inventory Stats */}
      <ThemedInventoryStats />
      
      {/* Search and Actions */}
      <InventorySearchActions 
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />
      
      {/* Filters */}
      <InventoryFilters />
      
      {/* Inventory Table */}
      <InventoryTable />
    </div>
  );
}
