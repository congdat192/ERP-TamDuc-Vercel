import { Badge } from '@/components/ui/badge';
import { MapPin, Package, Barcode, AlertCircle } from 'lucide-react';

interface ProductInventoryTagTabProps {
  product: any;
}

export function ProductInventoryTagTab({ product }: ProductInventoryTagTabProps) {
  // Parse JSONB fields
  const productShelves = Array.isArray(product.product_shelves) 
    ? product.product_shelves 
    : (product.product_shelves ? [product.product_shelves] : []);
  
  const productSerials = Array.isArray(product.product_serials) 
    ? product.product_serials 
    : (product.product_serials ? [product.product_serials] : []);
  
  const productBatchExpires = Array.isArray(product.product_batch_expires) 
    ? product.product_batch_expires 
    : (product.product_batch_expires ? [product.product_batch_expires] : []);

  const isLotSerialControl = product.is_lot_serial_control || false;
  const isBatchExpireControl = product.is_batch_expire_control || false;

  return (
    <div className="space-y-6">
      {/* Control Badges */}
      <div className="flex gap-2 mb-4">
        {isLotSerialControl && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Quản lý theo Lô/Serial
          </Badge>
        )}
        {isBatchExpireControl && (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Quản lý theo Hạn sử dụng
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Location Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 theme-text-primary" />
            <h3 className="font-semibold theme-text text-lg">Vị trí kho</h3>
          </div>
          
          <div className="space-y-3">
            {productShelves.length > 0 ? (
              productShelves.map((shelf: any, index: number) => (
                <div key={index} className="p-3 theme-card rounded-lg border theme-border-primary">
                  <div>
                    <label className="text-sm font-medium theme-text-muted">Chi nhánh</label>
                    <p className="theme-text font-medium">{shelf.branch_name || 'Chưa có'}</p>
                  </div>
                  <div className="mt-2">
                    <label className="text-sm font-medium theme-text-muted">Vị trí</label>
                    <p className="theme-text">{shelf.shelf_name || 'Chưa có'}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="theme-text-muted text-sm">Chưa có thông tin vị trí kho</p>
            )}
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
              <p className="theme-text font-mono">{product.code || product.productCode || 'Chưa có'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium theme-text-muted">Mã vạch</label>
              <p className="theme-text font-mono">{product.barcode || 'Chưa có'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium theme-text-muted">SKU</label>
              <p className="theme-text font-mono">
                {product.code ? `SKU-${product.code}` : (product.productCode ? `SKU-${product.productCode}` : 'Chưa có')}
              </p>
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
              <p className="theme-text">{product.unit || product.base_unit || 'Chưa có'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium theme-text-muted">Khối lượng</label>
              <p className="theme-text">{product.weight ? `${product.weight} kg` : 'Chưa cập nhật'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium theme-text-muted">Kích thước</label>
              <p className="theme-text">{product.dimensions || 'Chưa cập nhật'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Serial Numbers Section */}
      {productSerials.length > 0 && (
        <>
          <div className="border-t theme-border-primary/20 pt-6">
            <h3 className="font-semibold theme-text text-lg mb-3">Số Serial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {productSerials.map((serial: any, index: number) => (
                <div key={index} className="p-3 theme-card rounded-lg border theme-border-primary">
                  <p className="theme-text font-mono font-medium">{serial.serial_number || serial}</p>
                  {serial.status && (
                    <Badge variant="outline" className="mt-2 theme-badge-secondary text-xs">
                      {serial.status}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Batch Expiration Section */}
      {productBatchExpires.length > 0 && (
        <>
          <div className="border-t theme-border-primary/20 pt-6">
            <h3 className="font-semibold theme-text text-lg mb-3">Lô hàng & Hạn sử dụng</h3>
            <div className="space-y-3">
              {productBatchExpires.map((batch: any, index: number) => (
                <div key={index} className="p-4 theme-card rounded-lg border theme-border-primary">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium theme-text-muted">Mã lô</label>
                      <p className="theme-text font-medium">{batch.batch_code || 'Chưa có'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium theme-text-muted">Số lượng</label>
                      <p className="theme-text">{batch.quantity || 0}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium theme-text-muted">Ngày sản xuất</label>
                      <p className="theme-text text-sm">
                        {batch.manufacture_date ? new Date(batch.manufacture_date).toLocaleDateString('vi-VN') : 'Chưa có'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium theme-text-muted">Hạn sử dụng</label>
                      <p className="theme-text text-sm">
                        {batch.expiration_date ? new Date(batch.expiration_date).toLocaleDateString('vi-VN') : 'Chưa có'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* QR Code and Additional Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t theme-border-primary/20">
        <div className="space-y-4">
          <h3 className="font-semibold theme-text text-lg">Thẻ bổ sung</h3>
          <div className="flex flex-wrap gap-2">
            {product.allow_direct_sale && <Badge variant="outline" className="theme-badge-secondary">Bán trực tiếp</Badge>}
            {product.allow_earn_points && <Badge variant="outline" className="theme-badge-secondary">Tích điểm</Badge>}
            {product.is_active && <Badge variant="outline" className="theme-badge-secondary">Đang kinh doanh</Badge>}
            {product.has_variants && <Badge variant="outline" className="theme-badge-secondary">Có biến thể</Badge>}
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
