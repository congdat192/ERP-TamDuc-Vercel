
import { Badge } from '@/components/ui/badge';

interface SalesTableProps {
  salesData: any[];
  visibleColumns: any[];
}

export function SalesTable({ salesData, visibleColumns }: SalesTableProps) {
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

  return (
    <div className="theme-card rounded-lg border theme-border-primary">
      {/* Table container with proper horizontal scroll constraint */}
      <div 
        className="overflow-x-auto"
        style={{ maxWidth: 'calc(100vw - 310px)' }}
      >
        <table className="w-full" style={{ minWidth: `${visibleColumns.length * 150}px` }}>
          <thead className="sticky top-0 bg-white z-10 border-b theme-border-primary/20">
            <tr>
              {visibleColumns.map((column) => (
                <th key={column.key} className="min-w-[150px] px-4 py-3 text-left text-sm font-medium theme-text-muted whitespace-nowrap">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale) => (
              <tr key={sale.id} className="hover:theme-bg-primary/5 border-b theme-border-primary/10">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
