
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
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleModeChange = (mode: 'single' | 'multiple' | 'all') => {
    setStoreMode(mode);
  };

  // Mock data
  const mockSalesData: any[] = [];
  const mockVisibleColumns: any[] = [];

  const clearAllFilters = () => {
    setFilters({
      status: '',
      paymentMethod: '',
      customerType: '',
      priceRange: { min: '', max: '' },
      dateRange: { from: undefined, to: undefined },
    });
  };

  const applyFilters = () => {
    // Apply filter logic here
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
      
      {/* Search and Actions - Temporarily comment out until we fix the component */}
      {/* <SalesSearchAndActions 
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      /> */}
      
      {/* Filters */}
      <SalesFilters 
        onClearFilters={clearAllFilters}
        onApplyFilters={applyFilters}
        isMobile={false}
      />
      
      {/* Sales Table */}
      <SalesTable 
        salesData={mockSalesData}
        visibleColumns={mockVisibleColumns}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={20}
        onSelectInvoice={() => {}}
        onUpdateInvoice={() => {}}
        onDeleteInvoice={() => {}}
      />
    </div>
  );
}
