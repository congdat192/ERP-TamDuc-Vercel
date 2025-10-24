import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { LensProductWithDetails } from '../../types/lens';
import { LensProductWithTiersAndScores } from '../../types/lens-extended';
import { Plus, Check, Store, Truck, Clock } from 'lucide-react';
import { lensApi } from '../../services/lensApi';

interface ProductDetailModalProps {
  product: LensProductWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCompare: () => void;
  isInCompare: boolean;
  canAddMore: boolean;
  onProductSelect?: (product: LensProductWithDetails) => void;
}

export function ProductDetailModal({
  product,
  open,
  onOpenChange,
  onAddCompare,
  isInCompare,
  canAddMore,
  onProductSelect,
}: ProductDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const images = product.image_urls || [];
  const hasImages = images.length > 0;
  
  const productWithExtras = product as LensProductWithTiersAndScores;
  const supplyTiers = productWithExtras.supply_tiers || [];
  const useCaseScores = productWithExtras.use_case_scores || [];

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products', product.id],
    queryFn: async () => {
      if (!product.related_product_ids || product.related_product_ids.length === 0) {
        return [];
      }
      return lensApi.getRelatedProducts(product.related_product_ids);
    },
    enabled: open && !!product.related_product_ids && product.related_product_ids.length > 0,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <ScrollArea className="h-full max-h-[calc(90vh-80px)]">
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
                    
                    {/* Badge giảm giá - góc trái trên */}
                    {product.discount_percent && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-base font-bold px-3 py-1.5 rounded-md shadow-lg">
                        -{product.discount_percent}%
                      </div>
                    )}
                    
                    {/* Image counter - góc phải trên */}
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
              {/* Tên sản phẩm */}
              <div>
                <h2 className="text-2xl font-bold theme-text">{product.name}</h2>
              </div>

              {/* Giá */}
              <div>
                {product.sale_price ? (
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <p className="text-3xl font-bold text-red-600">
                      {product.sale_price.toLocaleString('vi-VN')}₫
                    </p>
                    <p className="text-lg line-through text-muted-foreground">
                      Giá gốc: {product.price.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-green-700">
                    {product.price.toLocaleString('vi-VN')}₫
                  </p>
                )}
              </div>

              <div>
                <p className="text-base">
                  <span className="text-muted-foreground">Thương hiệu:</span>{' '}
                  <span className="font-semibold">{product.brand?.name}</span>
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
                  {product.attributes?.material?.[0] && (
                    <>
                      <span className="text-muted-foreground">Chất liệu:</span>
                      <span className="font-medium">{product.attributes.material[0]}</span>
                    </>
                  )}
                  
                  {product.attributes?.refractive_index?.[0] && (
                    <>
                      <span className="text-muted-foreground">Chiết suất:</span>
                      <span className="font-medium">{product.attributes.refractive_index[0]}</span>
                    </>
                  )}
                  
                  {product.attributes?.origin?.[0] && (
                    <>
                      <span className="text-muted-foreground">Xuất xứ:</span>
                      <span className="font-medium">{product.attributes.origin[0]}</span>
                    </>
                  )}
                </div>
              </div>

              {(() => {
                const allAttributes = (window as any).__allAttributes || [];
                const multiselectAttrs = allAttributes.filter((a: any) => a.type === 'multiselect');
                const hasAnyFeatures = multiselectAttrs.some((attr: any) => {
                  return product.attributes?.[attr.slug]?.length > 0;
                });

                return hasAnyFeatures ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tính năng</p>
                    <div className="flex flex-wrap gap-2">
                      {multiselectAttrs.map((attr: any) => {
                        const selectedValues = product.attributes?.[attr.slug] || [];
                        
                        return selectedValues.map((value: string) => (
                          <Badge key={`${attr.id}-${value}`} variant="secondary">
                            {attr.icon} {value}
                          </Badge>
                        ));
                      })}
                    </div>
                  </div>
                ) : null;
              })()}
              
              {/* Supply Tiers Section */}
              {supplyTiers.length > 0 && (
                <div className="border-t pt-4 space-y-3">
                  <h3 className="font-semibold">Tầng cung ứng</h3>
                  <div className="space-y-2">
                    {supplyTiers.filter(t => t.is_active).map(tier => (
                      <div key={tier.id} className="flex items-center gap-3 p-2 border rounded-lg">
                        {tier.tier_type === 'IN_STORE' && <Store className="w-4 h-4 text-blue-600" />}
                        {tier.tier_type === 'NEXT_DAY' && <Truck className="w-4 h-4 text-blue-600" />}
                        {(tier.tier_type === 'CUSTOM_ORDER' || tier.tier_type === 'FACTORY_ORDER') && <Clock className="w-4 h-4 text-orange-600" />}
                        <div className="flex-1 text-sm">
                          <p className="font-medium">{tier.tier_name || tier.tier_type}</p>
                          <p className="text-xs text-muted-foreground">
                            SPH: {tier.sph_min} ~ {tier.sph_max} | CYL: {tier.cyl_min} ~ {tier.cyl_max} | {tier.lead_time_days} ngày
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Use Case Scores Section */}
              {useCaseScores.length > 0 && (
                <div className="border-t pt-4 space-y-3">
                  <h3 className="font-semibold">Phù hợp với nhu cầu</h3>
                  <div className="space-y-2">
                    {useCaseScores
                      .filter(score => score.use_case && score.score >= 50)
                      .sort((a, b) => b.score - a.score)
                      .map(score => (
                        <div key={score.id} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {score.use_case?.icon} {score.use_case?.name}
                            </span>
                            <Badge variant={score.score >= 80 ? 'default' : 'secondary'}>
                              {score.score}/100
                            </Badge>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${score.score >= 80 ? 'bg-green-600' : 'bg-blue-600'}`}
                              style={{ width: `${score.score}%` }}
                            />
                          </div>
                          {score.reasoning && (
                            <p className="text-xs text-muted-foreground">{score.reasoning}</p>
                          )}
                        </div>
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

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-8 p-4 border-t">
              <h3 className="text-lg font-semibold theme-text mb-4">
                Sản phẩm liên quan
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.slice(0, 4).map((relatedProduct) => (
                  <button
                    key={relatedProduct.id}
                    onClick={() => {
                      onProductSelect?.(relatedProduct);
                    }}
                    className="flex flex-col border rounded-lg overflow-hidden hover:shadow-lg transition-all group bg-card"
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      {relatedProduct.image_urls?.[0] ? (
                        <>
                          <img
                            src={relatedProduct.image_urls[0]}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          
                          {/* Discount Badge */}
                          {relatedProduct.discount_percent && (
                            <div className="absolute top-1 left-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                              -{relatedProduct.discount_percent}%
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          Chưa có ảnh
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-3 text-left space-y-1">
                      <p className="text-sm font-medium theme-text line-clamp-2 group-hover:text-green-600 transition-colors">
                        {relatedProduct.name}
                      </p>
                      
                      <div className="flex items-baseline gap-2 flex-wrap">
                        {relatedProduct.sale_price ? (
                          <>
                            <p className="text-base font-bold text-red-600">
                              {relatedProduct.sale_price.toLocaleString('vi-VN')}₫
                            </p>
                            <p className="text-xs line-through text-muted-foreground">
                              {relatedProduct.price.toLocaleString('vi-VN')}₫
                            </p>
                          </>
                        ) : (
                          <p className="text-base font-bold text-green-700">
                            {relatedProduct.price.toLocaleString('vi-VN')}₫
                          </p>
                        )}
                      </div>
                      
                      {relatedProduct.brand && (
                        <p className="text-xs text-muted-foreground">
                          {relatedProduct.brand.name}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
