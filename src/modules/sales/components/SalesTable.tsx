
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColumnConfig } from './ColumnVisibilityFilter';

interface SalesTableProps {
  salesData: any[];
  visibleColumns: ColumnConfig[];
}

export function SalesTable({ salesData, visibleColumns }: SalesTableProps) {
  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  return (
    <div className="theme-card rounded-lg border mb-6">
      {/* Table container with proper horizontal scroll */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full table-fixed" style={{ minWidth: `${visibleColumns.length * 150}px` }}>
          <thead className="sticky top-0 bg-white z-10 border-b theme-border-primary/20">
            <tr>
              {visibleColumns.map((column) => (
                <th key={column.key} className="min-w-[150px] px-4 py-3 text-left font-medium theme-text-muted whitespace-nowrap">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale) => (
              <tr key={sale.id} className="hover:theme-bg-primary/5 border-b theme-border-primary/10">
                {visibleColumns.map((column) => (
                  <td key={column.key} className="min-w-[150px] px-4 py-3 whitespace-nowrap">
                    {column.key === 'invoiceCode' && (
                      <span className="theme-text font-medium">{sale.id}</span>
                    )}
                    {column.key === 'datetime' && (
                      <span className="theme-text">{sale.date}</span>
                    )}
                    {column.key === 'returnCode' && (
                      sale.returnCode ? (
                        <Badge variant="outline" className="berry-warning-light">
                          {sale.returnCode}
                        </Badge>
                      ) : null
                    )}
                    {column.key === 'customer' && (
                      <span className="theme-text">{sale.customer}</span>
                    )}
                    {column.key === 'totalAmount' && (
                      <span className="font-semibold theme-text">{formatCurrency(sale.totalAmount)}</span>
                    )}
                    {column.key === 'discount' && (
                      <span className="sales-amount-negative font-medium">
                        {sale.discount > 0 ? formatCurrency(sale.discount) : '-'}
                      </span>
                    )}
                    {column.key === 'paidAmount' && (
                      <span className="sales-amount-positive font-medium">
                        {formatCurrency(sale.paidAmount)}
                      </span>
                    )}
                    {column.key === 'status' && (
                      <Badge 
                        variant={sale.status === 'Hoàn thành' ? 'success' : 'destructive'}
                        className={sale.status === 'Hoàn thành' ? 'sales-status-completed' : 'sales-status-cancelled'}
                      >
                        {sale.status}
                      </Badge>
                    )}
                    {column.key === 'invoiceStatus' && (
                      <Badge variant="outline" className="theme-badge-secondary">
                        Chưa có
                      </Badge>
                    )}
                    {!['invoiceCode', 'datetime', 'returnCode', 'customer', 'totalAmount', 'discount', 'paidAmount', 'status', 'invoiceStatus'].includes(column.key) && (
                      <span className="theme-text-muted">-</span>
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
