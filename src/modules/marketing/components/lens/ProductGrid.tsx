import { LensProductWithDetails } from '../../types/lens';
import { ProductCard } from './ProductCard';
import { Loader } from 'lucide-react';

interface ProductGridProps {
  products: LensProductWithDetails[];
  isLoading: boolean;
  onProductClick: (product: LensProductWithDetails) => void;
  onAddCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  canAddMore: boolean;
}

export function ProductGrid({
  products,
  isLoading,
  onProductClick,
  onAddCompare,
  isInCompare,
  canAddMore,
}: ProductGridProps) {
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

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick(product)}
          onAddCompare={() => onAddCompare(product.id)}
          isInCompare={isInCompare(product.id)}
          canAddMore={canAddMore}
        />
      ))}
    </div>
  );
}
