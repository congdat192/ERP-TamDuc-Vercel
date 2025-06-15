
import { Badge } from '@/components/ui/badge';
import { ProductCodeLink } from '@/modules/sales/components/ProductCodeLink';
import { mockSales, mockInventory, getProductById } from '@/data/mockData';

interface CustomerSalesHistoryTabProps {
  customerId: string;
}

export function CustomerSalesHistoryTab({ customerId }: CustomerSalesHistoryTabProps) {
  // Filter sales data for this customer
  const customerSales = mockSales.filter(sale => sale.customerId === customerId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Hoàn thành':
        return <Badge className="theme-badge-success">Hoàn thành</Badge>;
      case 'Đang xử lý':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Đang xử lý</Badge>;
      case 'Đã hủy':
        return <Badge className="berry-error-light">Đã hủy</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getProductsForSale = (sale: any) => {
    return sale.items?.map((itemId: string) => getProductById(itemId)).filter(Boolean) || [];
  };

  const getTotalQuantityForSale = (sale: any) => {
    const products = getProductsForSale(sale);
    return products.length; // Since we don't have quantity info, use product count
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold theme-text">Lịch sử bán hàng</h4>
        <div className="text-sm theme-text-muted">
          Tổng {customerSales.length} giao dịch
        </div>
      </div>

      <div className="theme-card rounded-lg border theme-border-primary overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b theme-border-primary/20">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                  Mã hóa đơn
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                  Ngày bán
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                  Số lượng
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border-primary/10">
              {customerSales.map((sale) => {
                const products = getProductsForSale(sale);
                return (
                  <tr key={sale.id} className="hover:theme-bg-primary/5">
                    <td className="px-4 py-3 text-sm theme-text">
                      <ProductCodeLink productCode={sale.orderCode} />
                    </td>
                    <td className="px-4 py-3 text-sm theme-text-muted">
                      {sale.date}
                    </td>
                    <td className="px-4 py-3 text-sm theme-text">
                      <div className="space-y-1">
                        {products.slice(0, 2).map((product, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <ProductCodeLink productCode={product.productCode} className="text-xs" />
                            <span className="text-xs theme-text-muted">- {product.name}</span>
                          </div>
                        ))}
                        {products.length > 2 && (
                          <div className="text-xs theme-text-muted">
                            +{products.length - 2} sản phẩm khác
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm theme-text text-center">
                      {getTotalQuantityForSale(sale)}
                    </td>
                    <td className="px-4 py-3 text-sm theme-text font-medium">
                      {formatCurrency(sale.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {getStatusBadge(sale.status)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
