
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Globe, ShoppingCart, Store, Smartphone, ExternalLink } from 'lucide-react';

interface ProductChannelLinkTabProps {
  product: any;
}

export function ProductChannelLinkTab({ product }: ProductChannelLinkTabProps) {
  return (
    <div className="space-y-6">
      {/* Channel Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 theme-card rounded-lg border theme-border-primary text-center">
          <Store className="w-8 h-8 theme-text-primary mx-auto mb-2" />
          <p className="text-sm theme-text-muted">Cửa hàng</p>
          <Badge variant="success" className="sales-status-completed mt-1">Đã liên kết</Badge>
        </div>

        <div className="p-4 theme-card rounded-lg border theme-border-primary text-center">
          <Globe className="w-8 h-8 theme-text-primary mx-auto mb-2" />
          <p className="text-sm theme-text-muted">Website</p>
          <Badge variant={product.channelLinked ? 'success' : 'outline'} 
                 className={product.channelLinked ? 'sales-status-completed' : 'theme-badge-muted'}>
            {product.channelLinked ? 'Đã liên kết' : 'Chưa liên kết'}
          </Badge>
        </div>

        <div className="p-4 theme-card rounded-lg border theme-border-primary text-center">
          <ShoppingCart className="w-8 h-8 theme-text-primary mx-auto mb-2" />
          <p className="text-sm theme-text-muted">Sàn TMĐT</p>
          <Badge variant="outline" className="theme-badge-muted mt-1">Chưa liên kết</Badge>
        </div>

        <div className="p-4 theme-card rounded-lg border theme-border-primary text-center">
          <Smartphone className="w-8 h-8 theme-text-primary mx-auto mb-2" />
          <p className="text-sm theme-text-muted">App Mobile</p>
          <Badge variant="success" className="sales-status-completed mt-1">Đã liên kết</Badge>
        </div>
      </div>

      {/* Channel Settings */}
      <div className="space-y-6">
        <h3 className="font-semibold theme-text text-lg">Cài đặt kênh bán</h3>
        
        {/* In-store */}
        <div className="p-4 theme-card rounded-lg border theme-border-primary">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Store className="w-5 h-5 theme-text-primary" />
              <div>
                <h4 className="font-medium theme-text">Bán tại cửa hàng</h4>
                <p className="text-sm theme-text-muted">Cho phép bán trực tiếp tại quầy</p>
              </div>
            </div>
            <Switch checked={product.directSales} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="theme-text-muted">Giá bán:</span>
              <span className="theme-text font-medium ml-2">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
              </span>
            </div>
            <div>
              <span className="theme-text-muted">Trạng thái:</span>
              <Badge variant="success" className="sales-status-completed ml-2">Hoạt động</Badge>
            </div>
          </div>
        </div>

        {/* Website */}
        <div className="p-4 theme-card rounded-lg border theme-border-primary">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 theme-text-primary" />
              <div>
                <h4 className="font-medium theme-text">Website bán hàng</h4>
                <p className="text-sm theme-text-muted">Hiển thị sản phẩm trên website</p>
              </div>
            </div>
            <Switch checked={product.channelLinked} />
          </div>
          
          {product.channelLinked && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="theme-text-muted">URL sản phẩm:</span>
                  <Button variant="ghost" size="sm" className="h-auto p-1 ml-2">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
                <div>
                  <span className="theme-text-muted">Trạng thái:</span>
                  <Badge variant="success" className="sales-status-completed ml-2">Đang hiển thị</Badge>
                </div>
              </div>
              
              <div className="text-sm">
                <span className="theme-text-muted">SEO Title:</span>
                <p className="theme-text">{product.name} - Chất lượng cao, giá tốt</p>
              </div>
            </div>
          )}
        </div>

        {/* E-commerce Platforms */}
        <div className="p-4 theme-card rounded-lg border theme-border-primary">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 theme-text-primary" />
              <div>
                <h4 className="font-medium theme-text">Sàn thương mại điện tử</h4>
                <p className="text-sm theme-text-muted">Shopee, Lazada, Tiki, etc.</p>
              </div>
            </div>
            <Switch checked={false} />
          </div>
          
          <div className="text-sm theme-text-muted">
            <p>Chưa liên kết với sàn thương mại điện tử nào. Bấm vào để cài đặt.</p>
          </div>
        </div>

        {/* Mobile App */}
        <div className="p-4 theme-card rounded-lg border theme-border-primary">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 theme-text-primary" />
              <div>
                <h4 className="font-medium theme-text">Ứng dụng di động</h4>
                <p className="text-sm theme-text-muted">App bán hàng trên mobile</p>
              </div>
            </div>
            <Switch checked={true} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="theme-text-muted">Phiên bản app:</span>
              <span className="theme-text font-medium ml-2">v2.1.0</span>
            </div>
            <div>
              <span className="theme-text-muted">Đồng bộ:</span>
              <Badge variant="success" className="sales-status-completed ml-2">Tự động</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
