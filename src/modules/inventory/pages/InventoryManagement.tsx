
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemedInventoryStats } from '../components/ThemedInventoryStats';
import { InventorySearchActions } from '../components/InventorySearchActions';
import { InventoryFilters } from '../components/InventoryFilters';
import { InventoryTable } from '../components/InventoryTable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColumnConfig } from '../components/ColumnVisibilityFilter';
import { inventoryService } from '@/services/localStorage/inventoryService';
import { MockInventory } from '@/data/mockData';

interface InventoryManagementProps {
  currentUser?: any;
  onBackToModules?: () => void;
}

export function InventoryManagement({ currentUser, onBackToModules }: InventoryManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [products, setProducts] = useState<MockInventory[]>([]);

  // Load products from localStorage
  useEffect(() => {
    const loadProducts = () => {
      const data = inventoryService.getAll();
      setProducts(data);
    };

    loadProducts();

    // Listen for data changes
    const handleDataChange = (event: CustomEvent) => {
      if (event.detail.storageKey === 'erp_inventory') {
        loadProducts();
      }
    };

    window.addEventListener('erp-data-changed', handleDataChange as EventListener);
    return () => {
      window.removeEventListener('erp-data-changed', handleDataChange as EventListener);
    };
  }, []);

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'productCode', label: 'Mã hàng', visible: true },
    { key: 'barcode', label: 'Mã vạch', visible: false },
    { key: 'productName', label: 'Tên hàng', visible: true },
    { key: 'category', label: 'Loại hàng', visible: true },
    { key: 'productType', label: 'Loại sản phẩm', visible: false },
    { key: 'channelLinked', label: 'Liên kết kênh', visible: false },
    { key: 'price', label: 'Giá bán', visible: true },
    { key: 'brand', label: 'Thương hiệu', visible: false },
    { key: 'currentStock', label: 'Tồn hiện tại', visible: true },
    { key: 'location', label: 'Vị trí', visible: false },
    { key: 'reservedCustomers', label: 'KH đặt trước', visible: false },
    { key: 'createdDate', label: 'Ngày tạo', visible: false },
    { key: 'expectedOutOfStock', label: 'Dự kiến hết hàng', visible: false },
    { key: 'minStock', label: 'Định mức tồn', visible: false },
    { key: 'status', label: 'Trạng thái', visible: true },
    { key: 'pointsEarning', label: 'Tích điểm', visible: false },
    { key: 'directSales', label: 'Bán trực tiếp', visible: false }
  ]);

  const isMobile = useIsMobile();
  const visibleColumns = columns.filter(col => col.visible);

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setColumns(prev => 
      prev.map(col => 
        col.key === columnKey ? { ...col, visible } : col
      )
    );
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPageData = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      setSelectedProducts(currentPageData.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  return (
    <div className="flex flex-col h-screen overflow-hidden theme-background">
      {/* Mobile overlay */}
      {isFilterOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* Stats Section */}
      <div className="flex-shrink-0 px-6 pt-4 pb-1">
        <ThemedInventoryStats />
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-1 min-h-0 px-6 pb-6 gap-3">
        {/* Desktop Filter Sidebar */}
        {!isMobile && (
          <div className="w-80 flex-shrink-0 theme-card rounded-lg border theme-border-primary overflow-hidden">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="p-4">
                <InventoryFilters />
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Mobile Filter Sidebar */}
        {isMobile && (
          <div className={`fixed left-0 top-0 h-full w-80 theme-card rounded-lg z-50 transform transition-transform duration-300 ${
            isFilterOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <ScrollArea className="h-[calc(100vh-100px)]">
              <div className="p-4">
                <InventoryFilters />
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Search & Actions Bar */}
          <div className="flex-shrink-0">
            <InventorySearchActions 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              columns={columns}
              handleColumnToggle={handleColumnToggle}
              onToggleSidebar={() => setIsFilterOpen(!isFilterOpen)}
            />
          </div>

          {/* Products Table */}
          <div className="flex-1 min-h-0">
            <InventoryTable 
              products={products}
              visibleColumns={visibleColumns}
              selectedProducts={selectedProducts}
              handleSelectProduct={handleSelectProduct}
              handleSelectAll={handleSelectAll}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalProducts={totalProducts}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
