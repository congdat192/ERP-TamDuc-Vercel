
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, Package } from 'lucide-react';

interface ProductStockTabProps {
  product: any;
}

export function ProductStockTab({ product }: ProductStockTabProps) {
  const stockPercentage = product.maxStock > 0 ? (product.stock / product.maxStock) * 100 : 0;
  const isLowStock = product.lowStockAlert;
  const inventoryByBranch = product.inventoryByBranch || [];

  return (
    <div className="space-y-6">
      {/* Inventory by Branch */}
      {inventoryByBranch.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold theme-text text-lg">Tồn kho theo chi nhánh</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inventoryByBranch.map((branch: any) => (
              <div key={branch.branch_id} className="p-4 theme-card rounded-lg border theme-border-primary">
                <h4 className="font-medium theme-text mb-3">{branch.branch_name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="theme-text-muted">Tồn kho:</span>
                    <span className="font-semibold theme-text">{branch.on_hand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="theme-text-muted">Đã đặt:</span>
                    <span className="theme-text">{branch.reserved}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="theme-text-muted">Khả dụng:</span>
                    <span className="theme-text">{branch.available}</span>
                  </div>
                  {branch.location && (
                    <div className="flex justify-between">
                      <span className="theme-text-muted">Vị trí:</span>
                      <span className="theme-text">{branch.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Stock Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-4 theme-card rounded-lg border theme-border-primary">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 theme-text-primary" />
            <span className="text-sm font-medium theme-text-muted">Tồn kho hiện tại</span>
          </div>
          <p className={`text-2xl font-bold ${isLowStock ? 'text-red-600' : 'theme-text'}`}>
            {product.stock}
          </p>
          <p className="text-sm theme-text-muted">{product.unit}</p>
        </div>

        <div className="p-4 theme-card rounded-lg border theme-border-primary">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium theme-text-muted">Định mức tồn</span>
          </div>
          <p className="text-2xl font-bold theme-text">{product.minStock}</p>
          <p className="text-sm theme-text-muted">{product.unit}</p>
        </div>

        <div className="p-4 theme-card rounded-lg border theme-border-primary">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 theme-text-secondary" />
            <span className="text-sm font-medium theme-text-muted">Tồn kho tối đa</span>
          </div>
          <p className="text-2xl font-bold theme-text">{product.maxStock || 0}</p>
          <p className="text-sm theme-text-muted">{product.unit}</p>
        </div>

        <div className="p-4 theme-card rounded-lg border theme-border-primary">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium theme-text-muted">Khách đặt</span>
          </div>
          <p className="text-2xl font-bold theme-text">{product.reservedCustomers || 0}</p>
          <p className="text-sm theme-text-muted">đơn hàng</p>
        </div>
      </div>

      {/* Stock Progress */}
      <div className="space-y-4">
        <h3 className="font-semibold theme-text text-lg">Mức độ tồn kho</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm theme-text-muted">Tình trạng tồn kho</span>
            <Badge variant={isLowStock ? 'destructive' : 'success'} 
                   className={isLowStock ? 'sales-status-cancelled' : 'sales-status-completed'}>
              {isLowStock ? 'Sắp hết hàng' : 'Đủ hàng'}
            </Badge>
          </div>
          <Progress value={Math.min(stockPercentage, 100)} className="h-3" />
          <div className="flex justify-between text-xs theme-text-muted">
            <span>0</span>
            <span>Định mức: {product.minStock}</span>
            <span>Tối đa: {product.maxStock || 0}</span>
          </div>
        </div>
      </div>

      {/* Stock Forecast */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold theme-text text-lg">Dự báo tồn kho</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium theme-text-muted">Dự kiến hết hàng</label>
              <p className="theme-text">{product.expectedOutOfStock}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium theme-text-muted">Số ngày còn lại</label>
              <p className="theme-text font-medium">15 ngày</p>
            </div>
            
            <div>
              <label className="text-sm font-medium theme-text-muted">Tốc độ bán trung bình</label>
              <p className="theme-text">2-3 sản phẩm/ngày</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold theme-text text-lg">Lịch sử nhập hàng</h3>
          <div className="space-y-3">
            <div className="p-3 theme-card rounded border theme-border-primary/50">
              <div className="flex justify-between items-center">
                <span className="text-sm theme-text">Lần nhập gần nhất</span>
                <span className="text-sm theme-text-muted">15/12/2024</span>
              </div>
              <p className="text-lg font-medium theme-text">+50 sản phẩm</p>
            </div>
            
            <div className="p-3 theme-card rounded border theme-border-primary/50">
              <div className="flex justify-between items-center">
                <span className="text-sm theme-text">Tổng nhập tháng này</span>
                <span className="text-sm theme-text-muted">150 sản phẩm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
