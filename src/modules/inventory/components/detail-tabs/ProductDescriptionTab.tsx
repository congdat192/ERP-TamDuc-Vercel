
import { Separator } from '@/components/ui/separator';

interface ProductDescriptionTabProps {
  product: any;
}

export function ProductDescriptionTab({ product }: ProductDescriptionTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Description */}
        <div className="space-y-4">
          <h3 className="font-semibold theme-text text-lg">Mô tả sản phẩm</h3>
          <div className="p-4 theme-card rounded-lg border theme-border-primary">
            <p className="theme-text text-sm leading-relaxed">
              {product.description || 'Chưa có mô tả cho sản phẩm này.'}
            </p>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-4">
          <h3 className="font-semibold theme-text text-lg">Ghi chú</h3>
          <div className="p-4 theme-card rounded-lg border theme-border-primary">
            <p className="theme-text text-sm leading-relaxed">
              {product.notes || 'Chưa có ghi chú nào.'}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Order Template */}
      {product.order_template && (
        <div className="space-y-4">
          <h3 className="font-semibold theme-text text-lg">Mẫu đơn hàng</h3>
          <div className="p-4 theme-card rounded-lg border theme-border-primary">
            <p className="theme-text text-sm leading-relaxed">
              {product.order_template}
            </p>
          </div>
        </div>
      )}

      <Separator />

      {/* Creation Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold theme-text text-lg mb-3">Ngày tạo</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium theme-text-muted">Thời gian</label>
              <p className="theme-text">
                {product.created_at ? new Date(product.created_at).toLocaleString('vi-VN') : 'Chưa có'}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold theme-text text-lg mb-3">Cập nhật cuối</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium theme-text-muted">Thời gian</label>
              <p className="theme-text">
                {product.updated_at ? new Date(product.updated_at).toLocaleString('vi-VN') : 'Chưa có'}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold theme-text text-lg mb-3">Đồng bộ lần cuối</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium theme-text-muted">Thời gian</label>
              <p className="theme-text">
                {product.synced_at ? new Date(product.synced_at).toLocaleString('vi-VN') : 'Chưa đồng bộ'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
