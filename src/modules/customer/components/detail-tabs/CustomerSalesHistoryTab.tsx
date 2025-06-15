import { Badge } from '@/components/ui/badge';
import { ProductCodeLink } from '@/modules/sales/components/ProductCodeLink';
import { InvoiceCodeLink } from '@/modules/sales/components/InvoiceCodeLink';
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
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold theme-text font-sans">Lịch sử bán hàng</h4>
        <div className="text-sm theme-text-muted font-sans">
          Tổng {customerSales.length} giao dịch
        </div>
      </div>

      <div className="theme-card rounded-lg border theme-border-primary overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full font-sans">
            <thead className="bg-gray-50 border-b theme-border-primary/20">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider font-sans">
                  Mã hóa đơn
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider font-sans">
                  Ngày bán
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider font-sans">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider font-sans">
                  Số lượng
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider font-sans">
                  Tổng tiền
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider font-sans">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border-primary/10">
              {customerSales.map((sale) => {
                const products = getProductsForSale(sale);
                return (
                  <tr key={sale.id} className="hover:theme-bg-primary/5">
                    <td className="px-4 py-3 text-sm theme-text font-sans">
                      <InvoiceCodeLink invoiceCode={sale.id} className="text-sm font-sans" />
                    </td>
                    <td className="px-4 py-3 text-sm theme-text-muted font-sans">
                      {sale.date}
                    </td>
                    <td className="px-4 py-3 text-sm theme-text font-sans">
                      <div className="space-y-1">
                        {products.slice(0, 2).map((product, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <ProductCodeLink productCode={product.productCode} className="text-xs font-sans" />
                            <span className="text-xs theme-text-muted font-sans">- {product.name}</span>
                          </div>
                        ))}
                        {products.length > 2 && (
                          <div className="text-xs theme-text-muted font-sans">
                            +{products.length - 2} sản phẩm khác
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm theme-text text-center font-sans">
                      {getTotalQuantityForSale(sale)}
                    </td>
                    <td className="px-4 py-3 text-sm theme-text font-medium font-sans">
                      {formatCurrency(sale.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-sm font-sans">
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
