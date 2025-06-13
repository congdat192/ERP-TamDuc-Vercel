
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { mockInventory } from '@/data/mockData';

interface InvoiceInfoTabProps {
  invoice: any;
}

export function InvoiceInfoTab({ invoice }: InvoiceInfoTabProps) {
  // Get product details from mock data
  const getProductDetails = (productId: string) => {
    return mockInventory.find(product => product.id === productId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Invoice Basic Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold theme-text text-lg mb-3">Thông tin hóa đơn</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium theme-text-muted">Mã hóa đơn</label>
              <p className="theme-text font-medium">{invoice.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium theme-text-muted">Thời gian</label>
              <p className="theme-text">{invoice.date}</p>
            </div>
            <div>
              <label className="text-sm font-medium theme-text-muted">Người bán</label>
              <p className="theme-text">{invoice.seller}</p>
            </div>
            <div>
              <label className="text-sm font-medium theme-text-muted">Chi nhánh</label>
              <p className="theme-text">{invoice.branch}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold theme-text text-lg mb-3">Trạng thái</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium theme-text-muted">Trạng thái hóa đơn</label>
              <div className="mt-1">
                <Badge 
                  variant={invoice.status === 'Hoàn thành' ? 'success' : 'destructive'}
                  className={invoice.status === 'Hoàn thành' ? 'sales-status-completed' : 'sales-status-cancelled'}
                >
                  {invoice.status}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium theme-text-muted">Kênh bán</label>
              <p className="theme-text">{invoice.channel}</p>
            </div>
            {invoice.returnCode && (
              <div>
                <label className="text-sm font-medium theme-text-muted">Mã trả hàng</label>
                <div className="mt-1">
                  <Badge variant="outline" className="berry-warning-light">
                    {invoice.returnCode}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold theme-text text-lg mb-3">Ghi chú</h3>
          <div className="p-4 theme-card rounded-lg border theme-border-primary">
            <p className="theme-text text-sm">
              {invoice.note || 'Không có ghi chú'}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Products List */}
      <div>
        <h3 className="font-semibold theme-text text-lg mb-4">Danh sách sản phẩm</h3>
        <div className="border theme-border-primary rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium theme-text-muted">Mã sản phẩm</th>
                <th className="px-4 py-3 text-left text-sm font-medium theme-text-muted">Tên sản phẩm</th>
                <th className="px-4 py-3 text-left text-sm font-medium theme-text-muted">Đơn giá</th>
                <th className="px-4 py-3 text-left text-sm font-medium theme-text-muted">Số lượng</th>
                <th className="px-4 py-3 text-left text-sm font-medium theme-text-muted">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((productId: string, index: number) => {
                const product = getProductDetails(productId);
                return (
                  <tr key={productId} className="border-t theme-border-primary/10">
                    <td className="px-4 py-3 text-sm theme-text font-medium">
                      {product?.productCode || productId}
                    </td>
                    <td className="px-4 py-3 text-sm theme-text">
                      {product?.name || 'Sản phẩm không tìm thấy'}
                    </td>
                    <td className="px-4 py-3 text-sm theme-text">
                      {product ? formatCurrency(product.price) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm theme-text">1</td>
                    <td className="px-4 py-3 text-sm theme-text font-medium">
                      {product ? formatCurrency(product.price) : '-'}
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
