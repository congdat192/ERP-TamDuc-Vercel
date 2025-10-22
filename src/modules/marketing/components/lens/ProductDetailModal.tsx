import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { LensProductWithDetails, LensProduct } from '../../types/lens';
import { lensApi } from '../../services/lensApi';
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [variants, setVariants] = useState<LensProduct[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<LensProduct>(product);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && product.parent_sku) {
      setLoading(true);
      lensApi.getProductVariants(product.parent_sku)
        .then(data => {
          setVariants(data.length > 0 ? data : [product]);
          setSelectedVariant(product);
        })
        .catch(() => setVariants([product]))
        .finally(() => setLoading(false));
    } else if (open) {
      setVariants([product]);
      setSelectedVariant(product);
    }
  }, [open, product]);

  const images = selectedVariant.image_urls || [];
  const hasImages = images.length > 0;
  const hasVariants = variants.length > 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[calc(90vh-120px)]">
          <div className="grid md:grid-cols-2 gap-6 p-1">
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
                {hasImages ? (
                  <>
                    <img
                      src={images[selectedImageIndex]}
                      alt={`${product.name} - Ảnh ${selectedImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {selectedImageIndex + 1} / {images.length}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Chưa có ảnh
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <ScrollArea className="w-full" type="always">
                  <div className="flex gap-2 pb-2">
                    {images.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`
                          flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all
                          ${index === selectedImageIndex 
                            ? 'border-green-600 ring-2 ring-green-600 ring-offset-2' 
                            : 'border-transparent hover:border-gray-300'
                          }
                        `}
                      >
                        <img
                          src={url}
                          alt={`Ảnh ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              )}

              {product.is_promotion && product.promotion_text && (
                <Badge className="bg-red-600 hover:bg-red-700">{product.promotion_text}</Badge>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="space-y-4">
              {/* Variant Selector */}
              {hasVariants && (
                <div className="border-b pb-4">
                  <Label className="text-sm font-medium mb-2 block">Chọn phiên bản</Label>
                  <Select 
                    value={selectedVariant.id}
                    onValueChange={(id) => {
                      const variant = variants.find(v => v.id === id);
                      if (variant) {
                        setSelectedVariant(variant);
                        setSelectedImageIndex(0);
                      }
                    }}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {variants.map(v => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.refractive_index && `${v.refractive_index} - `}
                          {v.price.toLocaleString('vi-VN')}₫
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <p className="text-2xl font-bold text-green-700">
                  Giá: {selectedVariant.price.toLocaleString('vi-VN')}₫
                </p>
              </div>

              <div>
                <p className="text-base">
                  <span className="text-muted-foreground">Thương hiệu:</span>{' '}
                  <span className="font-semibold">{selectedVariant.brand?.name || product.brand?.name}</span>
                </p>
              </div>

              {selectedVariant.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Mô tả</p>
                  <p className="text-sm">{selectedVariant.description}</p>
                </div>
              )}

              <div className="border-t pt-4 space-y-3">
                <h3 className="font-semibold">Thông số kỹ thuật</h3>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {selectedVariant.material && (
                    <>
                      <span className="text-muted-foreground">Chất liệu:</span>
                      <span className="font-medium">{selectedVariant.material}</span>
                    </>
                  )}
                  
                  {selectedVariant.refractive_index && (
                    <>
                      <span className="text-muted-foreground">Chiết suất:</span>
                      <span className="font-medium">{selectedVariant.refractive_index}</span>
                    </>
                  )}
                  
                  {selectedVariant.origin && (
                    <>
                      <span className="text-muted-foreground">Xuất xứ:</span>
                      <span className="font-medium">{selectedVariant.origin}</span>
                    </>
                  )}
                  
                  {selectedVariant.warranty_months && (
                    <>
                      <span className="text-muted-foreground">Bảo hành:</span>
                      <span className="font-medium">{selectedVariant.warranty_months} tháng</span>
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
