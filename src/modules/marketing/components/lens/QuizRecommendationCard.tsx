import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Package, TrendingUp, Star } from 'lucide-react';
import { LensQuizRecommendation } from '../../types/lens-extended';
import { useNavigate } from 'react-router-dom';

interface QuizRecommendationCardProps {
  recommendation: LensQuizRecommendation;
  rank: number;
}

export function QuizRecommendationCard({ recommendation, rank }: QuizRecommendationCardProps) {
  const navigate = useNavigate();
  const { product, total_score, matched_use_cases, available_tier, reasoning } = recommendation;

  const finalPrice = product.sale_price || product.price;
  const hasDiscount = product.sale_price && product.sale_price < product.price;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTierLabel = (tierType: string) => {
    const labels: Record<string, string> = {
      'IN_STORE': 'Có sẵn tại CH',
      'NEXT_DAY': 'Giao ngày mai',
      'CUSTOM_ORDER': 'Đặt hàng',
      'FACTORY_ORDER': 'Đặt từ nhà máy'
    };
    return labels[tierType] || tierType;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Rank Badge */}
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
              rank === 1 ? 'bg-yellow-100 text-yellow-600 border-2 border-yellow-300' :
              rank === 2 ? 'bg-gray-100 text-gray-600 border-2 border-gray-300' :
              rank === 3 ? 'bg-orange-100 text-orange-600 border-2 border-orange-300' :
              'bg-gray-50 text-gray-500'
            }`}>
              {rank === 1 && <Star className="w-6 h-6 fill-current" />}
              {rank !== 1 && `#${rank}`}
            </div>
          </div>

          {/* Product Image */}
          <div className="flex-shrink-0">
            {product.image_urls && product.image_urls.length > 0 ? (
              <img
                src={product.image_urls[0]}
                alt={product.name}
                className="w-32 h-32 object-cover rounded-lg border"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                {product.sku && (
                  <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                )}
              </div>
              
              <div className={`px-4 py-2 rounded-full border-2 ${getScoreColor(total_score)}`}>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-bold">{total_score}</span>
                  <span className="text-xs">/100</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                {finalPrice.toLocaleString('vi-VN')}₫
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {product.price.toLocaleString('vi-VN')}₫
                  </span>
                  <Badge variant="destructive">
                    -{Math.round(((product.price - product.sale_price!) / product.price) * 100)}%
                  </Badge>
                </>
              )}
            </div>

            {/* Reasoning */}
            <p className="text-sm text-muted-foreground">{reasoning}</p>

            {/* Matched Use Cases */}
            {matched_use_cases.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {matched_use_cases.slice(0, 3).map((uc) => (
                  <Badge key={uc.code} variant="secondary" className="text-xs">
                    {uc.name}: {uc.score}/100
                  </Badge>
                ))}
              </div>
            )}

            {/* Availability */}
            {available_tier && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Package className="w-3 h-3 mr-1" />
                  {getTierLabel(available_tier.tier_type)}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  SPH: {available_tier.sph_min} → {available_tier.sph_max} | 
                  CYL: {available_tier.cyl_min} → {available_tier.cyl_max}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => navigate(`/lens/${product.id}`)}
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Xem chi tiết
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
