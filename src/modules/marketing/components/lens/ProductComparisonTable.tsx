import { LensProductWithDetails } from '../../types/lens';
import { Button } from '@/components/ui/button';
import { Eye, Loader } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ProductComparisonTableProps {
  products: LensProductWithDetails[];
  isLoading: boolean;
  onProductClick: (product: LensProductWithDetails) => void;
}

export function ProductComparisonTable({
  products,
  isLoading,
  onProductClick,
}: ProductComparisonTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Không tìm thấy sản phẩm nào</p>
      </div>
    );
  }

  const getAttributeValue = (product: LensProductWithDetails, slug: string): string => {
    const attrs = product.attributes as Record<string, string[]> | null;
    return attrs?.[slug]?.[0] || '-';
  };

  const getFeatures = (product: LensProductWithDetails): string[] => {
    const attrs = product.attributes as Record<string, string[]> | null;
    if (!attrs) return [];
    
    // Get multiselect attributes (features)
    const features: string[] = [];
    Object.keys(attrs).forEach((key) => {
      if (Array.isArray(attrs[key]) && attrs[key].length > 1) {
        features.push(...attrs[key]);
      } else if (key.includes('tinh_nang')) {
        features.push(...(attrs[key] || []));
      }
    });
    
    return features.slice(0, 3); // Limit to 3 features
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="w-20">Hình ảnh</TableHead>
            <TableHead className="min-w-[200px]">Tên sản phẩm</TableHead>
            <TableHead>Thương hiệu</TableHead>
            <TableHead>Chất liệu</TableHead>
            <TableHead>Chiết suất</TableHead>
            <TableHead className="text-right">Giá</TableHead>
            <TableHead>Tính năng</TableHead>
            <TableHead className="w-24"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const features = getFeatures(product);
            const hasPromotion = product.is_promotion && product.sale_price;
            
            return (
              <TableRow key={product.id} className="hover:bg-accent/50">
                <TableCell>
                  <img
                    src={product.image_urls[0] || '/placeholder.svg'}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                        {product.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getAttributeValue(product, 'lens_brand')}</TableCell>
                <TableCell>{getAttributeValue(product, 'chat_lieu')}</TableCell>
                <TableCell>{getAttributeValue(product, 'chiet_suat')}</TableCell>
                <TableCell className="text-right">
                  {hasPromotion ? (
                    <div>
                      <p className="font-semibold text-primary">
                        {product.sale_price?.toLocaleString()}₫
                      </p>
                      <p className="text-xs text-muted-foreground line-through">
                        {product.price?.toLocaleString()}₫
                      </p>
                    </div>
                  ) : (
                    <p className="font-semibold">{product.price?.toLocaleString()}₫</p>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {features.length > 0 ? (
                      features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onProductClick(product)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
