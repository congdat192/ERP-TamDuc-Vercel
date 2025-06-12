
import { Badge } from '@/components/ui/badge';
import { MapPin, Package, Barcode } from 'lucide-react';

interface ProductInventoryTagTabProps {
  product: any;
}

export function ProductInventoryTagTab({ product }: ProductInventoryTagTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Location Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 theme-text-primary" />
            <h3 className="font-semibold theme-text text-lg">Vị trí kho</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium theme-text-muted">Vị trí</label>
              <p className="theme-text font-medium">{product.location}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium theme-text-muted">Khu vực</label>
              <Badge variant="outline" className="theme-badge-secondary">
                Kho A - Tầng 1
              </Badge>
            </div>
            
            <div>
              <label className="text-sm font-medium theme-text-muted">Kệ hàng</label>
              <p className="theme-text">A-01-15</p>
            </div>
          </div>
        </div>

        {/* Identification */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Barcode className="w-5 h-5 theme-text-primary" />
            <h3 className="font-semibold theme-text text-lg">Mã định danh</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium theme-text-muted">Mã hàng</label>
              <p className="theme-text font-mono">{product.productCode}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium theme-text-muted">Mã vạch</label>
              <p className="theme-text font-mono">{product.barcode}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium theme-text-muted">SKU</label>
              <p className="theme-text font-mono">SKU-{product.productCode}</p>
            </div>
          </div>
        </div>

        {/* Package Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-5 h-5 theme-text-primary" />
            <h3 className="font-semibold theme-text text-lg">Thông tin đóng gói</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium theme-text-muted">Đơn vị tính</label>
              <p className="theme-text">{product.unit}</p>
            </div>
            
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
      </div>

      {/* QR Code and Additional Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t theme-border-primary/20">
        <div className="space-y-4">
          <h3 className="font-semibold theme-text text-lg">Thẻ bổ sung</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="theme-badge-secondary">Hàng nhập</Badge>
            <Badge variant="outline" className="theme-badge-secondary">Có sẵn</Badge>
            <Badge variant="outline" className="theme-badge-secondary">Bán chạy</Badge>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold theme-text text-lg">Mã QR</h3>
          <div className="w-20 h-20 bg-gray-100 border-2 border-dashed theme-border-primary rounded-lg flex items-center justify-center">
            <span className="text-xs theme-text-muted">QR Code</span>
          </div>
        </div>
      </div>
    </div>
  );
}
