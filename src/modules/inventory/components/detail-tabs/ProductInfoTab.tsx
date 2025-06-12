
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ProductInfoTabProps {
  product: any;
}

export function ProductInfoTab({ product }: ProductInfoTabProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-semibold theme-text text-lg mb-3">Thông tin cơ bản</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium theme-text-muted">Mã hàng</label>
              <p className="theme-text font-mono">{product.productCode}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium theme-text-muted">Tên hàng</label>
              <p className="theme-text font-medium">{product.name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium theme-text-muted">Mã vạch</label>
              <p className="theme-text font-mono text-sm">{product.barcode}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium theme-text-muted">Nhóm hàng</label>
              <Badge variant="outline" className="theme-badge-secondary">
                {product.category}
              </Badge>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="font-semibold theme-text text-lg mb-3">Giá cả</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium theme-text-muted">Giá bán</label>
              <p className="theme-text-primary font-semibold text-lg">{formatCurrency(product.price)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium theme-text-muted">Giá vốn</label>
              <p className="theme-text">{formatCurrency(product.costPrice)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium theme-text-muted">Giá nhập</label>
              <p className="theme-text">{formatCurrency(product.importPrice)}</p>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h3 className="font-semibold theme-text text-lg mb-3">Chi tiết sản phẩm</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium theme-text-muted">Thương hiệu</label>
              <p className="theme-text">{product.brand}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium theme-text-muted">Loại hàng</label>
              <p className="theme-text">{product.productType}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium theme-text-muted">Đơn vị tính</label>
              <p className="theme-text">{product.unit}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium theme-text-muted">Trạng thái</label>
              <Badge 
                variant={product.status === 'Đang bán' ? 'success' : 'destructive'}
                className={product.status === 'Đang bán' ? 'sales-status-completed' : 'sales-status-cancelled'}
              >
                {product.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Physical Properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold theme-text text-lg mb-3">Thuộc tính vật lý</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium theme-text-muted">Khối lượng</label>
              <p className="theme-text">{product.weight || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <label className="text-sm font-medium theme-text-muted">Kích thước</label>
              <p className="theme-text">{product.dimensions || 'Chưa cập nhật'}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold theme-text text-lg mb-3">Cài đặt</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium theme-text-muted">Tích điểm:</label>
              <Badge variant={product.pointsEarning ? 'success' : 'outline'} 
                     className={product.pointsEarning ? 'sales-status-completed' : 'theme-badge-muted'}>
                {product.pointsEarning ? 'Có' : 'Không'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium theme-text-muted">Bán trực tiếp:</label>
              <Badge variant={product.directSales ? 'success' : 'outline'}
                     className={product.directSales ? 'sales-status-completed' : 'theme-badge-muted'}>
                {product.directSales ? 'Có' : 'Không'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
