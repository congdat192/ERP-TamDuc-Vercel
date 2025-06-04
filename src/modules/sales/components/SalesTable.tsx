
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
    <div className="bg-white rounded-lg border mb-6">
      {/* Table container with proper horizontal scroll */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full table-fixed" style={{ minWidth: `${visibleColumns.length * 150}px` }}>
          <thead className="sticky top-0 bg-white z-10 border-b">
            <tr>
              {visibleColumns.map((column) => (
                <th key={column.key} className="min-w-[150px] px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50 border-b">
                {visibleColumns.map((column) => (
                  <td key={column.key} className="min-w-[150px] px-4 py-3 whitespace-nowrap">
                    {column.key === 'invoiceCode' && sale.id}
                    {column.key === 'datetime' && sale.date}
                    {column.key === 'returnCode' && (
                      sale.returnCode ? (
                        <Badge variant="outline" className="text-orange-600">
                          {sale.returnCode}
                        </Badge>
                      ) : null
                    )}
                    {column.key === 'customer' && sale.customer}
                    {column.key === 'totalAmount' && formatCurrency(sale.totalAmount)}
                    {column.key === 'discount' && (
                      <span className="text-red-600">
                        {sale.discount > 0 ? formatCurrency(sale.discount) : '-'}
                      </span>
                    )}
                    {column.key === 'paidAmount' && (
                      <span className="text-green-600">
                        {formatCurrency(sale.paidAmount)}
                      </span>
                    )}
                    {column.key === 'status' && (
                      <Badge 
                        variant={sale.status === 'Hoàn thành' ? 'default' : 'destructive'}
                        className={sale.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {sale.status}
                      </Badge>
                    )}
                    {column.key === 'invoiceStatus' && (
                      <Badge variant="outline">
                        Chưa có
                      </Badge>
                    )}
                    {!['invoiceCode', 'datetime', 'returnCode', 'customer', 'totalAmount', 'discount', 'paidAmount', 'status', 'invoiceStatus'].includes(column.key) && '-'}
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
