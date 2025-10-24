import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { lensApi } from '../../services/lensApi';
import { X } from 'lucide-react';
import { Loader } from 'lucide-react';

interface CompareModalProps {
  productIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemove: (productId: string) => void;
}

export function CompareModal({ productIds, open, onOpenChange, onRemove }: CompareModalProps) {
  const { data: products, isLoading } = useQuery({
    queryKey: ['compare-products', productIds],
    queryFn: async () => {
      const results = await Promise.all(
        productIds.map(id => lensApi.getProductById(id))
      );
      return results.filter(Boolean);
    },
    enabled: open && productIds.length > 0,
  });

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl">
          <div className="flex items-center justify-center py-10">
            <Loader className="w-8 h-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>So sánh sản phẩm ({products?.length || 0})</DialogTitle>
        </DialogHeader>

        {products && products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-muted text-left">Thông số</th>
                  {products.map((product) => (
                    <th key={product!.id} className="border p-2 bg-muted min-w-[200px]">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium">{product!.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemove(product!.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-medium">Hình ảnh</td>
                  {products.map((product) => (
                    <td key={product!.id} className="border p-2">
                      <div className="aspect-square bg-muted rounded overflow-hidden">
                        {product!.image_urls && product!.image_urls.length > 0 ? (
                          <img
                            src={product!.image_urls[0]}
                            alt={product!.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            Chưa có ảnh
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Giá</td>
                  {products.map((product) => (
                    <td key={product!.id} className="border p-2">
                      <span className="text-lg font-bold text-green-700">
                        {product!.price.toLocaleString('vi-VN')}₫
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Thương hiệu</td>
                  {products.map((product) => (
                    <td key={product!.id} className="border p-2">{product!.brand?.name}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Chất liệu</td>
                  {products.map((product) => (
                    <td key={product!.id} className="border p-2">{product!.attributes?.material?.[0] || '-'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Chiết suất</td>
                  {products.map((product) => (
                    <td key={product!.id} className="border p-2">{product!.attributes?.refractive_index?.[0] || '-'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Xuất xứ</td>
                  {products.map((product) => (
                    <td key={product!.id} className="border p-2">{product!.attributes?.origin?.[0] || '-'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Tính năng</td>
                  {products.map((product) => (
                    <td key={product!.id} className="border p-2">
                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          const allAttributes = (window as any).__allAttributes || [];
                          const multiselectAttrs = allAttributes.filter((a: any) => a.type === 'multiselect');
                          
                          return multiselectAttrs.map((attr: any) => {
                            const selectedValues = product!.attributes?.[attr.slug] || [];
                            
                            return selectedValues.map((value: string) => (
                              <span key={`${attr.id}-${value}`} className="text-sm" title={`${attr.name}: ${value}`}>
                                {attr.icon} {value}
                              </span>
                            ));
                          });
                        })()}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            Chưa có sản phẩm để so sánh
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
