import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LensProductWithDetails } from '../../types/lens';

interface ProductGroupedTableProps {
  products: LensProductWithDetails[];
  isLoading: boolean;
  onProductClick: (product: LensProductWithDetails) => void;
  visibleColumns: Record<string, boolean>;
}

interface ProductGroup {
  groupKey: string;
  baseName: string;
  brand: string;
  image: string;
  features: string[];
  variants: LensProductWithDetails[];
}

// Extract base name (remove refractive index)
function getBaseName(name: string): string {
  return name.replace(/\s+\d\.\d+$/i, '').trim();
}

// Get tier display name in Vietnamese
function getTierDisplayName(tierType: string): string {
  const map: Record<string, string> = {
    IN_STORE: 'Có sẵn',
    NEXT_DAY: 'Giao ngày mai',
    CUSTOM_ORDER: 'Đặt hàng',
    FACTORY_ORDER: 'Đặt từ nhà máy'
  };
  return map[tierType] || tierType;
}

function GroupRow({ 
  group, 
  visibleColumns, 
  onProductClick 
}: { 
  group: ProductGroup; 
  visibleColumns: Record<string, boolean>; 
  onProductClick: (product: LensProductWithDetails) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Collapsed state - Compact preview row */}
      {!expanded && (
        <TableRow 
          className="hover:bg-accent/50 cursor-pointer border-t" 
          onClick={() => setExpanded(true)}
        >
          {(visibleColumns.image || visibleColumns.name) && (
            <TableCell className="w-64 p-3">
              <div className="flex items-center gap-3">
                {visibleColumns.image && (
                  <img 
                    src={group.image || '/placeholder.svg'} 
                    alt={group.baseName}
                    className="w-16 h-16 rounded-lg object-cover shadow-sm border border-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                )}
                {visibleColumns.name && (
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{group.baseName}</h4>
                    <p className="text-xs text-muted-foreground truncate">{group.brand}</p>
                  </div>
                )}
              </div>
            </TableCell>
          )}
          <TableCell colSpan={100} className="text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4" />
              <span>Xem {group.variants.length} phiên bản</span>
            </div>
          </TableCell>
        </TableRow>
      )}

      {/* Expanded state */}
      {expanded && (
        <>
          {/* Header row - Product info */}
          <TableRow className="bg-accent/30 border-t-2">
            {(visibleColumns.image || visibleColumns.name) && (
              <TableCell className="w-64 p-4">
                <div className="flex flex-col items-center gap-2 text-center">
                  {/* Product Name */}
                  {visibleColumns.name && (
                    <h3 className="font-bold text-base leading-tight w-full px-2">
                      {group.baseName}
                    </h3>
                  )}
                  
                  {/* Product Image */}
                  {visibleColumns.image && (
                    <div className="w-full flex justify-center my-2">
                      <img 
                        src={group.image || '/placeholder.svg'} 
                        alt={group.baseName}
                        className="w-40 h-40 rounded-lg object-contain shadow-sm border border-border hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Brand Name */}
                  <p className="text-xs text-muted-foreground font-medium">
                    {group.brand}
                  </p>
                  
                  {/* Feature Badges */}
                  {visibleColumns.features && group.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center">
                      {group.features.slice(0, 4).map((feature, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary" 
                          className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                        >
                          {feature}
                        </Badge>
                      ))}
                      {group.features.length > 4 && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs px-2 py-0.5"
                        >
                          +{group.features.length - 4}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {/* Collapse button */}
                  <button 
                    onClick={() => setExpanded(false)}
                    className="mt-1 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <ChevronDown className="w-3 h-3" />
                    Thu gọn
                  </button>
                </div>
              </TableCell>
            )}
            <TableCell colSpan={100} className="align-top pt-2">
              <p className="text-xs text-muted-foreground">
                {group.variants.length} phiên bản có sẵn
              </p>
            </TableCell>
          </TableRow>

          {/* Variant rows */}
          {group.variants.map((variant, idx) => {
            const supplyTier = variant.supply_tiers?.[0];
            const refractiveIndex = variant.attributes?.chiet_suat?.[0] || 
                                   variant.attributes?.refractive_index?.[0];
            
            return (
              <TableRow key={variant.id} className="hover:bg-accent/50">
                {/* Spacer cell for product info column */}
                {(visibleColumns.image || visibleColumns.name) && (
                  <TableCell className="w-64 bg-accent/5 border-r">
                    <div className="text-center text-xs text-muted-foreground py-2">
                      #{idx + 1}
                    </div>
                  </TableCell>
                )}
                
                {/* Data columns */}
                {visibleColumns.refractive_index && (
                  <TableCell className="text-sm font-medium py-2">
                    {refractiveIndex || '-'}
                  </TableCell>
                )}
                
                {visibleColumns.sph_range && (
                  <TableCell className="text-sm py-2">
                    {supplyTier 
                      ? `${supplyTier.sph_min} đến ${supplyTier.sph_max}`
                      : '-'}
                  </TableCell>
                )}
                
                {visibleColumns.cyl_range && (
                  <TableCell className="text-sm py-2">
                    {supplyTier
                      ? `${supplyTier.cyl_min} đến ${supplyTier.cyl_max}`
                      : '-'}
                  </TableCell>
                )}
                
                {visibleColumns.price && (
                  <TableCell className="text-right font-semibold py-2">
                    {variant.sale_price ? (
                      <div>
                        <div className="text-sm text-destructive">
                          {variant.sale_price.toLocaleString('vi-VN')}₫
                        </div>
                        <div className="text-xs text-muted-foreground line-through">
                          {variant.price.toLocaleString('vi-VN')}₫
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm">
                        {variant.price.toLocaleString('vi-VN')}₫
                      </div>
                    )}
                  </TableCell>
                )}
                
                {visibleColumns.tier_type && (
                  <TableCell className="py-2">
                    {supplyTier ? (
                      <Badge variant="outline" className="text-xs">
                        {getTierDisplayName(supplyTier.tier_type)}
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                )}
                
                <TableCell className="text-right py-2">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => onProductClick(variant)}
                    className="h-7 w-7 p-0"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </>
      )}
    </>
  );
}

export function ProductGroupedTable({
  products,
  isLoading,
  onProductClick,
  visibleColumns
}: ProductGroupedTableProps) {
  // Group products
  const groupedProducts = useMemo(() => {
    const groups = new Map<string, LensProductWithDetails[]>();
    
    products.forEach(product => {
      const baseName = getBaseName(product.name);
      const brand = product.attributes?.lens_brand?.[0] || 'Không rõ';
      const groupKey = `${brand}|${baseName}`;
      
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(product);
    });
    
    // Sort variants by refractive index
    groups.forEach(variants => {
      variants.sort((a, b) => {
        const riA = parseFloat(a.attributes?.chiet_suat?.[0] || a.attributes?.refractive_index?.[0] || '1.50');
        const riB = parseFloat(b.attributes?.chiet_suat?.[0] || b.attributes?.refractive_index?.[0] || '1.50');
        return riA - riB;
      });
    });
    
    return Array.from(groups.entries()).map(([key, variants]) => {
      const firstVariant = variants[0];
      
      // Collect unique features from all variants
      const featuresSet = new Set<string>();
      variants.forEach(v => {
        Object.entries(v.attributes || {}).forEach(([key, values]) => {
          if (key !== 'lens_brand' && key !== 'chiet_suat' && key !== 'refractive_index') {
            values.forEach(val => featuresSet.add(val));
          }
        });
      });
      
      return {
        groupKey: key,
        baseName: getBaseName(firstVariant.name),
        brand: firstVariant.attributes?.lens_brand?.[0] || 'Không rõ',
        image: firstVariant.image_urls[0] || '',
        features: Array.from(featuresSet),
        variants
      };
    });
  }, [products]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground">Đang tải...</div>
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
    <div className="border rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {(visibleColumns.image || visibleColumns.name) && (
              <TableHead className="w-64">Thông tin sản phẩm</TableHead>
            )}
            {visibleColumns.refractive_index && <TableHead>Chiết suất</TableHead>}
            {visibleColumns.sph_range && <TableHead>Độ cầu (SPH)</TableHead>}
            {visibleColumns.cyl_range && <TableHead>Độ loạn (CYL)</TableHead>}
            {visibleColumns.price && <TableHead className="text-right">Đơn giá</TableHead>}
            {visibleColumns.tier_type && <TableHead>Tầng cung ứng</TableHead>}
            <TableHead className="w-24 text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedProducts.map(group => (
            <GroupRow 
              key={group.groupKey} 
              group={group} 
              visibleColumns={visibleColumns}
              onProductClick={onProductClick}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
