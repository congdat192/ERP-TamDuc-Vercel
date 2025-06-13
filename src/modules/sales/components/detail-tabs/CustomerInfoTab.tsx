
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface CustomerInfoTabProps {
  invoice: any;
}

export function CustomerInfoTab({ invoice }: CustomerInfoTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Customer Info */}
        <div>
          <h3 className="font-semibold theme-text text-lg mb-3">Thông tin cơ bản</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium theme-text-muted">Tên khách hàng</label>
              <p className="theme-text font-medium">{invoice.customer}</p>
            </div>
            <div>
              <label className="text-sm font-medium theme-text-muted">Số điện thoại</label>
              <p className="theme-text">{invoice.phone || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <label className="text-sm font-medium theme-text-muted">Email</label>
              <p className="theme-text">{invoice.email || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <label className="text-sm font-medium theme-text-muted">Ngày sinh</label>
              <p className="theme-text">{invoice.birthdate || 'Chưa cập nhật'}</p>
            </div>
          </div>
        </div>

        {/* Address Info */}
        <div>
          <h3 className="font-semibold theme-text text-lg mb-3">Địa chỉ</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium theme-text-muted">Địa chỉ</label>
              <p className="theme-text">{invoice.address || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <label className="text-sm font-medium theme-text-muted">Phường/Xã</label>
              <p className="theme-text">{invoice.ward || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <label className="text-sm font-medium theme-text-muted">Khu vực</label>
              <p className="theme-text">{invoice.area || 'Chưa cập nhật'}</p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Purchase History Summary */}
      <div>
        <h3 className="font-semibold theme-text text-lg mb-4">Tóm tắt lịch sử mua hàng</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 theme-card rounded-lg border theme-border-primary text-center">
            <div className="text-2xl font-bold theme-text-primary mb-1">15</div>
            <div className="text-sm theme-text-muted">Tổng đơn hàng</div>
          </div>
          <div className="p-4 theme-card rounded-lg border theme-border-primary text-center">
            <div className="text-2xl font-bold theme-text-primary mb-1">₫25M</div>
            <div className="text-sm theme-text-muted">Tổng chi tiêu</div>
          </div>
          <div className="p-4 theme-card rounded-lg border theme-border-primary text-center">
            <div className="text-2xl font-bold theme-text-primary mb-1">2,200</div>
            <div className="text-sm theme-text-muted">Điểm tích lũy</div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Customer Tags/Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold theme-text text-lg mb-3">Phân loại khách hàng</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="theme-badge-secondary">VIP</Badge>
            <Badge variant="outline" className="theme-badge-secondary">Khách thường xuyên</Badge>
          </div>
        </div>

        <div>
          <h3 className="font-semibold theme-text text-lg mb-3">Ghi chú khách hàng</h3>
          <div className="p-4 theme-card rounded-lg border theme-border-primary">
            <p className="theme-text text-sm">
              Khách hàng VIP, thường mua hàng vào cuối tháng. Ưu tiên thanh toán bằng thẻ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
