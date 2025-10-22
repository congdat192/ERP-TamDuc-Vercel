import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LensProductWithDetails } from '../../types/lens';
import { Plus, Check } from 'lucide-react';

interface ProductDetailModalProps {
  product: LensProductWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCompare: () => void;
  isInCompare: boolean;
  canAddMore: boolean;
}

export function ProductDetailModal({
  product,
  open,
  onOpenChange,
  onAddCompare,
  isInCompare,
  canAddMore,
}: ProductDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Chưa có ảnh
                </div>
              )}
            </div>

            {product.is_promotion && product.promotion_text && (
              <Badge className="bg-red-600 hover:bg-red-700">{product.promotion_text}</Badge>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Thương hiệu</p>
              <p className="font-semibold">{product.brand?.name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Giá</p>
              <p className="text-3xl font-bold text-green-700">
                {product.price.toLocaleString('vi-VN')}₫
              </p>
            </div>

            {product.description && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mô tả</p>
                <p className="text-sm">{product.description}</p>
              </div>
            )}

            <div className="border-t pt-4 space-y-3">
              <h3 className="font-semibold">Thông số kỹ thuật</h3>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                {product.material && (
                  <>
                    <span className="text-muted-foreground">Chất liệu:</span>
                    <span className="font-medium">{product.material}</span>
                  </>
                )}
                
                {product.refractive_index && (
                  <>
                    <span className="text-muted-foreground">Chiết suất:</span>
                    <span className="font-medium">{product.refractive_index}</span>
                  </>
                )}
                
                {product.origin && (
                  <>
                    <span className="text-muted-foreground">Xuất xứ:</span>
                    <span className="font-medium">{product.origin}</span>
                  </>
                )}
                
                {product.warranty_months && (
                  <>
                    <span className="text-muted-foreground">Bảo hành:</span>
                    <span className="font-medium">{product.warranty_months} tháng</span>
                  </>
                )}
              </div>
            </div>

            {product.features && product.features.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Tính năng</p>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature) => (
                    <Badge key={feature.id} variant="secondary">
                      {feature.icon} {feature.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={onAddCompare}
              disabled={isInCompare || !canAddMore}
            >
              {isInCompare ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Đã thêm vào so sánh
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm vào so sánh
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
