import { LensProductWithDetails } from '../../types/lens';
import { Badge } from '@/components/ui/badge';
import { Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: LensProductWithDetails;
  onClick: () => void;
  onAddCompare: () => void;
  isInCompare: boolean;
  canAddMore: boolean;
}

export function ProductCard({
  product,
  onClick,
  onAddCompare,
  isInCompare,
  canAddMore,
}: ProductCardProps) {
  return (
    <div
      className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer"
      onClick={onClick}
    >
      {product.is_promotion && product.promotion_text && (
        <Badge className="absolute top-2 right-2 z-10 bg-red-600 hover:bg-red-700">
          {product.promotion_text}
        </Badge>
      )}

      <div className="aspect-square bg-muted relative overflow-hidden">
        {product.image_urls && product.image_urls.length > 0 ? (
          <img
            src={product.image_urls[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Chưa có ảnh
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-sm line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        <p className="text-sm text-muted-foreground">{product.brand?.name}</p>

        <div className="flex gap-1 flex-wrap min-h-[24px]">
          {product.features?.slice(0, 4).map((feature) => (
            <span key={feature.id} className="text-lg" title={feature.name}>
              {feature.icon}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-lg font-bold text-green-700">
            {product.price.toLocaleString('vi-VN')}₫
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isInCompare && canAddMore) {
                onAddCompare();
              }
            }}
            disabled={isInCompare || !canAddMore}
            className="p-2 rounded-lg border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isInCompare ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
