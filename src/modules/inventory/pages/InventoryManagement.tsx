
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemedInventoryStats } from '../components/ThemedInventoryStats';
import { InventoryFilters } from '../components/InventoryFilters';
import { InventorySearchActions } from '../components/InventorySearchActions';
import { InventoryTable } from '../components/InventoryTable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColumnConfig } from '../components/ColumnVisibilityFilter';

interface InventoryManagementProps {
  currentUser: any;
  onBackToModules: () => void;
}

export function InventoryManagement({ currentUser, onBackToModules }: InventoryManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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

  // Get visible columns
  const visibleColumns = columns.filter(col => col.visible);

  // Mock inventory data
  const inventoryData = [
    {
      id: 'SP001',
      productCode: 'IP14PM256',
      barcode: '8935244123456',
      name: 'iPhone 14 Pro Max 256GB',
      category: 'Điện thoại',
      productType: 'Hàng mới',
      channelLinked: true,
      price: 32900000,
      brand: 'Apple',
      stock: 25,
      location: 'Kho A1',
      reservedCustomers: 3,
      createdDate: '15/05/2024 09:30',
      expectedOutOfStock: '20/07/2024',
      minStock: 10,
      status: 'Đang bán',
      pointsEarning: true,
      directSales: true,
      costPrice: 28500000,
      importPrice: 29000000,
      unit: 'Chiếc',
      weight: '240g',
      dimensions: '160.7 x 77.6 x 7.85 mm',
      description: 'iPhone 14 Pro Max màu Deep Purple',
      notes: 'Hàng chính hãng VN/A',
      creator: 'Nguyễn Văn A',
      lastUpdated: '20/06/2024 14:22',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=80&h=80&fit=crop&crop=center'
    },
    {
      id: 'SP002',
      productCode: 'SS23U256',
      barcode: '8935244987654',
      name: 'Samsung Galaxy S23 Ultra 256GB',
      category: 'Điện thoại',
      productType: 'Hàng mới',
      channelLinked: true,
      price: 28900000,
      brand: 'Samsung',
      stock: 18,
      location: 'Kho A2',
      reservedCustomers: 2,
      createdDate: '12/05/2024 11:15',
      expectedOutOfStock: '25/07/2024',
      minStock: 8,
      status: 'Đang bán',
      pointsEarning: true,
      directSales: true,
      costPrice: 25200000,
      importPrice: 25800000,
      unit: 'Chiếc',
      weight: '234g',
      dimensions: '163.4 x 78.1 x 8.9 mm',
      description: 'Galaxy S23 Ultra màu Phantom Black',
      notes: 'Có S Pen đi kèm',
      creator: 'Trần Thị B',
      lastUpdated: '19/06/2024 16:45',
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=80&h=80&fit=crop&crop=center'
    },
    {
      id: 'SP003',
      productCode: 'XM13256',
      barcode: '8935244555666',
      name: 'Xiaomi 13 256GB',
      category: 'Điện thoại',
      productType: 'Hàng mới',
      channelLinked: false,
      price: 16900000,
      brand: 'Xiaomi',
      stock: 5,
      location: 'Kho B1',
      reservedCustomers: 1,
      createdDate: '08/05/2024 14:20',
      expectedOutOfStock: '15/07/2024',
      minStock: 15,
      status: 'Đang bán',
      pointsEarning: true,
      directSales: false,
      costPrice: 14500000,
      importPrice: 15200000,
      unit: 'Chiếc',
      weight: '185g',
      dimensions: '152.8 x 71.5 x 8.1 mm',
      description: 'Xiaomi 13 màu Trắng',
      notes: 'Sắp hết hàng',
      creator: 'Lê Văn C',
      lastUpdated: '18/06/2024 10:30',
      image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=80&h=80&fit=crop&crop=center'
    },
    {
      id: 'SP004',
      productCode: 'MBA15M2',
      barcode: '8935244777888',
      name: 'MacBook Air 15" M2 256GB',
      category: 'Laptop',
      productType: 'Hàng mới',
      channelLinked: true,
      price: 32900000,
      brand: 'Apple',
      stock: 12,
      location: 'Kho C1',
      reservedCustomers: 0,
      createdDate: '10/05/2024 08:45',
      expectedOutOfStock: '30/08/2024',
      minStock: 5,
      status: 'Đang bán',
      pointsEarning: true,
      directSales: true,
      costPrice: 28900000,
      importPrice: 29500000,
      unit: 'Chiếc',
      weight: '1.51kg',
      dimensions: '340.4 x 237.6 x 11.5 mm',
      description: 'MacBook Air 15 inch với chip M2',
      notes: 'Bàn phím backlit',
      creator: 'Phạm Thị D',
      lastUpdated: '21/06/2024 09:15',
      image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=80&h=80&fit=crop&crop=center'
    },
    {
      id: 'SP005',
      productCode: 'AIRPODS3',
      barcode: '8935244999000',
      name: 'AirPods 3rd Generation',
      category: 'Phụ kiện',
      productType: 'Hàng mới',
      channelLinked: true,
      price: 4790000,
      brand: 'Apple',
      stock: 45,
      location: 'Showroom 1',
      reservedCustomers: 5,
      createdDate: '05/05/2024 16:30',
      expectedOutOfStock: '15/09/2024',
      minStock: 20,
      status: 'Đang bán',
      pointsEarning: true,
      directSales: true,
      costPrice: 4200000,
      importPrice: 4350000,
      unit: 'Bộ',
      weight: '4.28g',
      dimensions: '30.79 x 18.26 x 19.21 mm',
      description: 'AirPods thế hệ 3 với Spatial Audio',
      notes: 'Kháng nước IPX4',
      creator: 'Võ Văn E',
      lastUpdated: '22/06/2024 11:20',
      image: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=80&h=80&fit=crop&crop=center'
    }
  ];

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
      setSelectedItems(inventoryData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const clearAllFilters = () => {
    setIsFilterOpen(false);
    setSelectedItems([]);
  };

  const applyFilters = () => {
    setIsFilterOpen(false);
  };

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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
