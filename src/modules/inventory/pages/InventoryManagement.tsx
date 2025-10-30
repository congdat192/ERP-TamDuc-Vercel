import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemedInventoryStats } from '../components/ThemedInventoryStats';
import { InventoryFilters } from '../components/InventoryFilters';
import { InventorySearchActions } from '../components/InventorySearchActions';
import { InventoryTable } from '../components/InventoryTable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColumnConfig } from '../components/ColumnVisibilityFilter';
import { KiotVietProductsFullService } from '@/services/kiotvietProductsFullService';

interface InventoryManagementProps {
  currentUser: any;
  onBackToModules: () => void;
}

export function InventoryManagement({ currentUser, onBackToModules }: InventoryManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [expandedRowId, setExpandedRowId] = useState<string | undefined>(undefined);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [overstockOnly, setOverstockOnly] = useState(false);

  // Column visibility state - All 27 required columns
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'image', label: 'Hình ảnh', visible: true },
    { key: 'productCode', label: 'Mã hàng', visible: true },
    { key: 'barcode', label: 'Mã vạch', visible: true },
    { key: 'name', label: 'Tên hàng', visible: true },
    { key: 'category', label: 'Nhóm hàng', visible: true },
    { key: 'productType', label: 'Loại hàng', visible: false },
    { key: 'channelLinked', label: 'Liên kết kênh bán', visible: false },
    { key: 'price', label: 'Giá bán', visible: true },
    { key: 'brand', label: 'Thương hiệu', visible: true },
    { key: 'stock', label: 'Tồn kho', visible: true },
    { key: 'location', label: 'Vị trí', visible: false },
    { key: 'reservedCustomers', label: 'Khách đặt', visible: false },
    { key: 'createdDate', label: 'Thời gian tạo', visible: false },
    { key: 'expectedOutOfStock', label: 'Dự kiến hết hàng', visible: false },
    { key: 'minStock', label: 'Định mức tồn', visible: false },
    { key: 'status', label: 'Trạng thái', visible: true },
    { key: 'pointsEarning', label: 'Tích điểm', visible: false },
    { key: 'directSales', label: 'Bán trực tiếp', visible: false },
    { key: 'costPrice', label: 'Giá vốn', visible: false },
    { key: 'importPrice', label: 'Giá nhập', visible: false },
    { key: 'unit', label: 'Đơn vị tính', visible: false },
    { key: 'weight', label: 'Khối lượng', visible: false },
    { key: 'dimensions', label: 'Kích thước', visible: false },
    { key: 'description', label: 'Mô tả', visible: false },
    { key: 'notes', label: 'Ghi chú', visible: false },
    { key: 'creator', label: 'Người tạo', visible: false },
    { key: 'lastUpdated', label: 'Cập nhật cuối', visible: false }
  ]);

  const isMobile = useIsMobile();

  // Fetch products from kiotviet_products_full
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['kiotviet-products-full', { 
      search: searchTerm,
      categoryIds: selectedCategories,
      trademarkIds: selectedBrands,
      lowStock: lowStockOnly,
      overstock: overstockOnly,
      page: currentPage,
      pageSize: itemsPerPage
    }],
    queryFn: () => KiotVietProductsFullService.getProducts({
      search: searchTerm,
      categoryIds: selectedCategories,
      trademarkIds: selectedBrands,
      lowStock: lowStockOnly,
      overstock: overstockOnly,
      page: currentPage,
      pageSize: itemsPerPage
    })
  });

  // Get visible columns
  const visibleColumns = columns.filter(col => col.visible);

  // Map data to UI format
  const inventoryData = useMemo(() => {
    if (!productsData?.products) return [];
    
    return productsData.products.map(p => {
      // Get first unit from units JSONB
      const firstUnit = Array.isArray(p.units) && p.units.length > 0 ? p.units[0].unitName : '-';
      
      return {
        id: p.id.toString(),
        image: p.images?.[0] || '',
        productCode: p.code,
        barcode: p.barcode || '-',
        name: p.name,
        category: p.category_path || p.category_name || '-',
        productType: p.product_type === 2 ? 'Dịch vụ' : 'Hàng hóa',
        channelLinked: false, // KiotViet doesn't have this field
        price: p.base_price,
        brand: p.trademark_name || '-',
        stock: p.total_on_hand,
        location: p.inventory_by_branch?.[0]?.location || '-',
        reservedCustomers: 0, // Not available in KiotViet
        createdDate: p.created_at ? new Date(p.created_at).toLocaleDateString('vi-VN') : '-',
        expectedOutOfStock: '-', // Not available
        minStock: p.min_stock || 0,
        maxStock: p.max_stock || 0,
        status: p.is_active ? 'Đang bán' : 'Ngừng bán',
        pointsEarning: p.is_reward_point,
        directSales: p.allow_sale,
        costPrice: 0, // Removed as per user request
        importPrice: 0, // Not available
        unit: firstUnit,
        weight: p.weight ? `${p.weight} kg` : '-',
        dimensions: '-', // Not available
        description: p.description || '',
        notes: '-',
        creator: '-',
        lastUpdated: p.updated_at ? new Date(p.updated_at).toLocaleDateString('vi-VN') : '-',
        // Additional fields for detail view
        inventoryByBranch: p.inventory_by_branch || [],
        lowStockAlert: p.low_stock_alert,
        overstockAlert: p.overstock_alert,
        basePrice: p.base_price,
        fullData: p // Keep full data for detail tabs
      };
    });
  }, [productsData]);

  const handleColumnToggle = (columnKey: string) => {
    setColumns(prev => prev.map(col => 
      col.key === columnKey ? { ...col, visible: !col.visible } : col
    ));
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPageData = inventoryData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      setSelectedItems(currentPageData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleRowClick = (itemId: string) => {
    if (expandedRowId === itemId) {
      // If clicking on the same row, close it (toggle)
      setExpandedRowId(undefined);
    } else {
      // If clicking on a different row, open it
      setExpandedRowId(itemId);
    }
  };

  const clearAllFilters = () => {
    setIsFilterOpen(false);
    setSelectedItems([]);
    setExpandedRowId(undefined);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setLowStockOnly(false);
    setOverstockOnly(false);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setIsFilterOpen(false);
    setCurrentPage(1); // Reset to first page when applying filters
  };

  const totalItems = productsData?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex flex-col h-screen overflow-hidden theme-background">
      {/* Mobile overlay */}
      {isFilterOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* Stats Section - Fixed height */}
      <div className="flex-shrink-0 px-6 pt-4 pb-1">
        <ThemedInventoryStats />
      </div>

      {/* Main Content Layout - Takes remaining height */}
      <div className="flex flex-1 min-h-0 px-6 pb-6 gap-3">
        {/* Desktop Filter Sidebar - Fixed width with proper scroll */}
        {!isMobile && (
          <div className="w-64 flex-shrink-0 theme-card rounded-lg border theme-border-primary overflow-hidden">
            <div className="p-4 border-b theme-border-primary/20">
              <h3 className="font-semibold theme-text text-base">Bộ lọc</h3>
            </div>
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="p-4">
                <InventoryFilters
                  onClearFilters={clearAllFilters}
                  onApplyFilters={applyFilters}
                  isMobile={isMobile}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  selectedBrands={selectedBrands}
                  setSelectedBrands={setSelectedBrands}
                  lowStockOnly={lowStockOnly}
                  setLowStockOnly={setLowStockOnly}
                  overstockOnly={overstockOnly}
                  setOverstockOnly={setOverstockOnly}
                />
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Mobile Filter Sidebar - Drawer Style */}
        {isMobile && (
          <div className={`fixed left-0 top-0 h-full w-64 theme-card rounded-lg z-50 transform transition-transform duration-300 ${
            isFilterOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="p-4 border-b theme-border-primary/20">
              <h3 className="font-semibold theme-text text-base">Bộ lọc</h3>
            </div>
            <ScrollArea className="h-[calc(100vh-100px)]">
              <div className="p-4">
                <InventoryFilters
                  onClearFilters={clearAllFilters}
                  onApplyFilters={applyFilters}
                  isMobile={isMobile}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  selectedBrands={selectedBrands}
                  setSelectedBrands={setSelectedBrands}
                  lowStockOnly={lowStockOnly}
                  setLowStockOnly={setLowStockOnly}
                  overstockOnly={overstockOnly}
                  setOverstockOnly={setOverstockOnly}
                />
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Main Content Area - Flexible width, takes remaining space */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Search & Actions Bar - Fixed height */}
          <div className="flex-shrink-0">
            <InventorySearchActions
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              columns={columns}
              handleColumnToggle={handleColumnToggle}
              isFilterOpen={isFilterOpen}
              setIsFilterOpen={setIsFilterOpen}
              clearAllFilters={clearAllFilters}
              applyFilters={applyFilters}
              isMobile={isMobile}
              inventoryData={inventoryData}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              lowStockOnly={lowStockOnly}
              setLowStockOnly={setLowStockOnly}
              overstockOnly={overstockOnly}
              setOverstockOnly={setOverstockOnly}
            />
          </div>

          {/* Inventory Table - Takes remaining height and width */}
          <div className="flex-1 min-h-0">
            <InventoryTable
              inventoryData={inventoryData}
              visibleColumns={visibleColumns}
              selectedItems={selectedItems}
              onSelectItem={handleSelectItem}
              onSelectAll={handleSelectAll}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalItems={totalItems}
              totalPages={totalPages}
              expandedRowId={expandedRowId}
              onRowClick={handleRowClick}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
