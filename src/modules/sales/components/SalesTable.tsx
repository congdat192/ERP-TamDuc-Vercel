
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { ProductCodeLink } from '@/components/shared/ProductCodeLink';
import { getProductByCode } from '@/data/mockData';

interface SalesTableProps {
  salesData: any[];
  visibleColumns: any[];
  selectedSales?: string[];
  onSelectSale?: (saleId: string) => void;
  onSelectAll?: (checked: boolean) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  totalSales: number;
  totalPages: number;
}

export function SalesTable({ 
  salesData, 
  visibleColumns,
  selectedSales = [],
  onSelectSale,
  onSelectAll,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalSales,
  totalPages
}: SalesTableProps) {
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
  const endIndex = Math.min(currentPage * itemsPerPage, totalSales);
  const paginatedData = salesData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const allSelected = paginatedData.length > 0 && selectedSales.length === paginatedData.length;

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
              {/* Add Products column if not already visible */}
              {!visibleColumns.find(col => col.key === 'products') && (
                <th className="min-w-[200px] px-4 py-3 text-left text-sm font-medium theme-text-muted whitespace-nowrap">
                  Sản phẩm
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((sale) => (
              <tr key={sale.id} className="hover:theme-bg-primary/5 border-b theme-border-primary/10">
                {/* Sticky checkbox */}
                <td className="sticky left-0 bg-white z-10 w-12 px-4 py-3 border-r theme-border-primary/10">
                  <Checkbox
                    checked={selectedSales.includes(sale.id)}
                    onCheckedChange={() => onSelectSale?.(sale.id)}
                    className="theme-border-primary"
                  />
                </td>
                {visibleColumns.map((column) => (
                  <td key={column.key} className="min-w-[150px] px-4 py-3 text-sm whitespace-nowrap">
                    {/* Invoice Code */}
                    {column.key === 'invoiceCode' && (
                      <span className="theme-text font-medium">{sale.id}</span>
                    )}
                    {/* Datetime */}
                    {column.key === 'datetime' && (
                      <span className="theme-text">{sale.date}</span>
                    )}
                    {/* Created Time */}
                    {column.key === 'createdTime' && (
                      <span className="theme-text">{formatDate(sale.createdTime)}</span>
                    )}
                    {/* Last Updated */}
                    {column.key === 'lastUpdated' && (
                      <span className="theme-text">{formatDate(sale.lastUpdated)}</span>
                    )}
                    {/* Order Code */}
                    {column.key === 'orderCode' && (
                      <span className="theme-text">{sale.orderCode || '-'}</span>
                    )}
                    {/* Return Code */}
                    {column.key === 'returnCode' && (
                      sale.returnCode ? (
                        <Badge variant="outline" className="berry-warning-light">
                          {sale.returnCode}
                        </Badge>
                      ) : <span className="theme-text-muted">-</span>
                    )}
                    {/* Customer */}
                    {column.key === 'customer' && (
                      <span className="theme-text font-medium">{sale.customer}</span>
                    )}
                    {/* Email */}
                    {column.key === 'email' && (
                      <span className="theme-text">{sale.email || '-'}</span>
                    )}
                    {/* Phone */}
                    {column.key === 'phone' && (
                      <span className="theme-text">{sale.phone || '-'}</span>
                    )}
                    {/* Address */}
                    {column.key === 'address' && (
                      <span className="theme-text">{sale.address || '-'}</span>
                    )}
                    {/* Area */}
                    {column.key === 'area' && (
                      <span className="theme-text">{sale.area || '-'}</span>
                    )}
                    {/* Ward */}
                    {column.key === 'ward' && (
                      <span className="theme-text">{sale.ward || '-'}</span>
                    )}
                    {/* Birthdate */}
                    {column.key === 'birthdate' && (
                      <span className="theme-text">{sale.birthdate || '-'}</span>
                    )}
                    {/* Branch */}
                    {column.key === 'branch' && (
                      <span className="theme-text">{sale.branch || '-'}</span>
                    )}
                    {/* Seller */}
                    {column.key === 'seller' && (
                      <span className="theme-text">{sale.seller || '-'}</span>
                    )}
                    {/* Creator */}
                    {column.key === 'creator' && (
                      <span className="theme-text">{sale.creator || '-'}</span>
                    )}
                    {/* Channel */}
                    {column.key === 'channel' && (
                      <span className="theme-text">{sale.channel || '-'}</span>
                    )}
                    {/* Note */}
                    {column.key === 'note' && (
                      <span className="theme-text-muted text-xs">{sale.note || '-'}</span>
                    )}
                    {/* Total Amount */}
                    {column.key === 'totalAmount' && (
                      <span className="font-semibold theme-text">{formatCurrency(sale.totalAmount)}</span>
                    )}
                    {/* Discount */}
                    {column.key === 'discount' && (
                      <span className="sales-amount-negative font-medium">
                        {sale.discount > 0 ? formatCurrency(sale.discount) : '-'}
                      </span>
                    )}
                    {/* Tax */}
                    {column.key === 'tax' && (
                      <span className="theme-text">
                        {sale.tax > 0 ? formatCurrency(sale.tax) : '-'}
                      </span>
                    )}
                    {/* Need to Pay */}
                    {column.key === 'needToPay' && (
                      <span className="font-semibold theme-text-primary">
                        {formatCurrency(sale.needToPay)}
                      </span>
                    )}
                    {/* Paid Amount */}
                    {column.key === 'paidAmount' && (
                      <span className="sales-amount-positive font-medium">
                        {formatCurrency(sale.paidAmount)}
                      </span>
                    )}
                    {/* Payment Discount */}
                    {column.key === 'paymentDiscount' && (
                      <span className="theme-text">
                        {sale.paymentDiscount > 0 ? formatCurrency(sale.paymentDiscount) : '-'}
                      </span>
                    )}
                    {/* Delivery Time */}
                    {column.key === 'deliveryTime' && (
                      <span className="theme-text">{sale.deliveryTime || '-'}</span>
                    )}
                    {/* Status */}
                    {column.key === 'status' && (
                      <Badge 
                        variant={sale.status === 'Hoàn thành' ? 'success' : 'destructive'}
                        className={sale.status === 'Hoàn thành' ? 'sales-status-completed' : 'sales-status-cancelled'}
                      >
                        {sale.status}
                      </Badge>
                    )}
                    {/* Invoice Status */}
                    {column.key === 'invoiceStatus' && (
                      <Badge variant="outline" className="theme-badge-secondary">
                        Chưa có
                      </Badge>
                    )}
                  </td>
                ))}
                {/* Products column - Always show clickable product codes */}
                {!visibleColumns.find(col => col.key === 'products') && (
                  <td className="min-w-[200px] px-4 py-3 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {sale.items && sale.items.length > 0 ? (
                        sale.items.map((productCode: string, index: number) => {
                          const product = getProductByCode(productCode);
                          return (
                            <div key={index} className="flex flex-col gap-1">
                              <ProductCodeLink 
                                productCode={productCode}
                                className="text-xs"
                              />
                              {product && (
                                <span className="text-xs theme-text-muted truncate max-w-[120px]">
                                  {product.name}
                                </span>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <span className="theme-text-muted text-xs">-</span>
                      )}
                    </div>
                  </td>
                )}
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
            {startIndex} – {endIndex} trong {totalSales.toLocaleString('vi-VN')} giao dịch
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
