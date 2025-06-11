import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface InventoryTableProps {
  inventoryData: any[];
  visibleColumns: any[];
  selectedItems: string[];
  onSelectItem: (itemId: string) => void;
  onSelectAll: (checked: boolean) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  totalItems: number;
  totalPages: number;
}

export function InventoryTable({ 
  inventoryData, 
  visibleColumns, 
  selectedItems, 
  onSelectItem, 
  onSelectAll,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalItems,
  totalPages
}: InventoryTableProps) {
  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return dateStr;
  };

  // Calculate pagination display
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const paginatedData = inventoryData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const allSelected = paginatedData.length > 0 && selectedItems.length === paginatedData.length;

  return (
    <div className="h-full flex flex-col theme-card rounded-lg border theme-border-primary overflow-hidden">
      {/* Table container with horizontal scroll only */}
      <div className="flex-1 overflow-auto">
        <table className="w-full" style={{ minWidth: `${(visibleColumns.length * 150) + 50}px` }}>
          <thead className="sticky top-0 bg-white z-10 border-b theme-border-primary/20">
            <tr>
              {/* Sticky checkbox column */}
              <th className="sticky left-0 bg-white z-20 w-12 px-4 py-3 border-r theme-border-primary/10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                  className="theme-border-primary"
                />
              </th>
              {visibleColumns.map((column) => (
                <th key={column.key} className="min-w-[150px] px-4 py-3 text-left text-sm font-medium theme-text-muted whitespace-nowrap">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:theme-bg-primary/5 border-b theme-border-primary/10">
                {/* Sticky checkbox */}
                <td className="sticky left-0 bg-white z-10 w-12 px-4 py-3 border-r theme-border-primary/10">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => onSelectItem(item.id)}
                    className="theme-border-primary"
                  />
                </td>
                {visibleColumns.map((column) => (
                  <td key={column.key} className="min-w-[150px] px-4 py-3 text-sm whitespace-nowrap">
                    {/* Hình ảnh */}
                    {column.key === 'image' && (
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                        <img 
                          src={item.image || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=80&h=80&fit=crop&crop=center'} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {/* Mã hàng */}
                    {column.key === 'productCode' && (
                      <span className="theme-text font-medium">{item.productCode}</span>
                    )}
                    {/* Mã vạch */}
                    {column.key === 'barcode' && (
                      <span className="theme-text font-mono text-xs">{item.barcode}</span>
                    )}
                    {/* Tên hàng */}
                    {column.key === 'name' && (
                      <span className="theme-text font-medium">{item.name}</span>
                    )}
                    {/* Nhóm hàng */}
                    {column.key === 'category' && (
                      <Badge variant="outline" className="theme-badge-secondary">
                        {item.category}
                      </Badge>
                    )}
                    {/* Loại hàng */}
                    {column.key === 'productType' && (
                      <span className="theme-text">{item.productType}</span>
                    )}
                    {/* Liên kết kênh bán */}
                    {column.key === 'channelLinked' && (
                      item.channelLinked ? (
                        <Badge variant="success" className="sales-status-completed">
                          Có
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="theme-badge-muted">
                          Không
                        </Badge>
                      )
                    )}
                    {/* Giá bán */}
                    {column.key === 'price' && (
                      <span className="font-semibold theme-text-primary">{formatCurrency(item.price)}</span>
                    )}
                    {/* Thương hiệu */}
                    {column.key === 'brand' && (
                      <span className="theme-text">{item.brand}</span>
                    )}
                    {/* Tồn kho */}
                    {column.key === 'stock' && (
                      <span className={`font-medium ${item.stock < 10 ? 'text-red-600' : 'theme-text'}`}>
                        {item.stock}
                      </span>
                    )}
                    {/* Vị trí */}
                    {column.key === 'location' && (
                      <span className="theme-text">{item.location}</span>
                    )}
                    {/* Khách đặt */}
                    {column.key === 'reservedCustomers' && (
                      <span className="theme-text">{item.reservedCustomers || '-'}</span>
                    )}
                    {/* Thời gian tạo */}
                    {column.key === 'createdDate' && (
                      <span className="theme-text">{formatDate(item.createdDate)}</span>
                    )}
                    {/* Dự kiến hết hàng */}
                    {column.key === 'expectedOutOfStock' && (
                      <span className="theme-text">{formatDate(item.expectedOutOfStock)}</span>
                    )}
                    {/* Định mức tồn */}
                    {column.key === 'minStock' && (
                      <span className="theme-text">{item.minStock}</span>
                    )}
                    {/* Trạng thái */}
                    {column.key === 'status' && (
                      <Badge 
                        variant={item.status === 'Đang bán' ? 'success' : 'destructive'}
                        className={item.status === 'Đang bán' ? 'sales-status-completed' : 'sales-status-cancelled'}
                      >
                        {item.status}
                      </Badge>
                    )}
                    {/* Tích điểm */}
                    {column.key === 'pointsEarning' && (
                      item.pointsEarning ? (
                        <Badge variant="success" className="sales-status-completed">
                          Có
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="theme-badge-muted">
                          Không
                        </Badge>
                      )
                    )}
                    {/* Bán trực tiếp */}
                    {column.key === 'directSales' && (
                      item.directSales ? (
                        <Badge variant="success" className="sales-status-completed">
                          Có
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="theme-badge-muted">
                          Không
                        </Badge>
                      )
                    )}
                    {/* Giá vốn */}
                    {column.key === 'costPrice' && (
                      <span className="theme-text">{formatCurrency(item.costPrice)}</span>
                    )}
                    {/* Giá nhập */}
                    {column.key === 'importPrice' && (
                      <span className="theme-text">{formatCurrency(item.importPrice)}</span>
                    )}
                    {/* Đơn vị tính */}
                    {column.key === 'unit' && (
                      <span className="theme-text">{item.unit}</span>
                    )}
                    {/* Khối lượng */}
                    {column.key === 'weight' && (
                      <span className="theme-text">{item.weight || '-'}</span>
                    )}
                    {/* Kích thước */}
                    {column.key === 'dimensions' && (
                      <span className="theme-text">{item.dimensions || '-'}</span>
                    )}
                    {/* Mô tả */}
                    {column.key === 'description' && (
                      <span className="theme-text-muted text-xs">{item.description || '-'}</span>
                    )}
                    {/* Ghi chú */}
                    {column.key === 'notes' && (
                      <span className="theme-text-muted text-xs">{item.notes || '-'}</span>
                    )}
                    {/* Người tạo */}
                    {column.key === 'creator' && (
                      <span className="theme-text">{item.creator}</span>
                    )}
                    {/* Cập nhật cuối */}
                    {column.key === 'lastUpdated' && (
                      <span className="theme-text">{formatDate(item.lastUpdated)}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination - Fixed Outside Scroll Container */}
      <div className="flex items-center justify-between px-4 py-3 border-t theme-border-primary/20">
        <div className="flex items-center space-x-3">
          <span className="text-sm theme-text-muted">Hiển thị</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-2 py-1 text-sm border theme-border-primary rounded theme-card theme-text"
          >
            <option value={5}>5</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm theme-text-muted">
            {startIndex} – {endIndex} trong {totalItems.toLocaleString('vi-VN')} hàng hóa
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 theme-border-primary hover:theme-bg-primary/10 hover:theme-text-primary disabled:opacity-50"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 theme-border-primary hover:theme-bg-primary/10 hover:theme-text-primary disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 py-1 text-sm theme-text min-w-[80px] text-center">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 theme-border-primary hover:theme-bg-primary/10 hover:theme-text-primary disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 theme-border-primary hover:theme-bg-primary/10 hover:theme-text-primary disabled:opacity-50"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
