import { Button } from '@/components/ui/button';
import { X, ShoppingBag } from 'lucide-react';

interface FooterBarProps {
  totalProducts: number;
  hasFilters: boolean;
  onClearFilters: () => void;
  compareCount: number;
  onCompareClick: () => void;
}

export function FooterBar({
  totalProducts,
  hasFilters,
  onClearFilters,
  compareCount,
  onCompareClick,
}: FooterBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Tìm thấy <span className="font-semibold text-foreground">{totalProducts}</span> sản phẩm
        </div>

        <div className="flex gap-2">
          {hasFilters && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              <X className="w-4 h-4 mr-1" />
              Xóa bộ lọc
            </Button>
          )}

          {compareCount > 0 && (
            <Button size="sm" onClick={onCompareClick} className="bg-green-600 hover:bg-green-700">
              <ShoppingBag className="w-4 h-4 mr-1" />
              So sánh ({compareCount})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
