import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter } from 'lucide-react';
import { lensApi } from '@/modules/marketing/services/lensApi';
import { useLensFilters } from '@/modules/marketing/hooks/useLensFilters';
import { useCompare } from '@/modules/marketing/hooks/useCompare';
import { LensAppBar } from '@/modules/marketing/components/lens/LensAppBar';
import { FeatureFilterChips } from '@/modules/marketing/components/lens/FeatureFilterChips';
import { AttributeDropdownFilters } from '@/modules/marketing/components/lens/AttributeDropdownFilters';
import { AdvancedFilterDrawer } from '@/modules/marketing/components/lens/AdvancedFilterDrawer';
import { SortDropdown } from '@/modules/marketing/components/lens/SortDropdown';
import { ProductGrid } from '@/modules/marketing/components/lens/ProductGrid';
import { BannerGrid } from '@/modules/marketing/components/lens/BannerGrid';
import { FooterBar } from '@/modules/marketing/components/lens/FooterBar';
import { ProductDetailModal } from '@/modules/marketing/components/lens/ProductDetailModal';
import { CompareModal } from '@/modules/marketing/components/lens/CompareModal';
import { LensProductWithDetails } from '@/modules/marketing/types/lens';

export function LensCatalogPage() {
  const { filters, updateFilter, clearFilters, hasActiveFilters } = useLensFilters();
  const compareState = useCompare();
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<LensProductWithDetails | null>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const { data: brandsData } = useQuery({
    queryKey: ['lens-brands'],
    queryFn: () => lensApi.getBrands(),
  });

  const { data: attributes } = useQuery({
    queryKey: ['lens-attributes'],
    queryFn: () => lensApi.getAttributes(),
  });

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['lens-products', filters, page],
    queryFn: () => lensApi.getProducts(filters, page, 8),
  });

  const { data: bannersData } = useQuery({
    queryKey: ['lens-banners'],
    queryFn: () => lensApi.getBanners(),
  });

  const brands = brandsData || [];
  const features = attributes || [];
  const products = productsData?.products || [];
  const total = productsData?.total || 0;
  const banners = bannersData || [];
  
  // Store attributes globally for product cards
  useEffect(() => {
    if (attributes) {
      (window as any).__allAttributes = attributes;
    }
  }, [attributes]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <LensAppBar 
        onSearchChange={(q) => updateFilter('search', q)}
        compareCount={compareState.count}
        onCompareClick={() => setShowCompareModal(true)}
      />

      {/* Sticky Filter Section */}
      <div className="sticky top-16 z-40 bg-background border-b">
        <FeatureFilterChips features={features} />
        <AttributeDropdownFilters 
          attributes={attributes || []}
          actionButtons={
            <>
              <button
                onClick={() => setShowAdvancedFilters(true)}
                className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
                title="Lọc nâng cao"
              >
                <Filter className="w-5 h-5 text-blue-600" />
              </button>
              <SortDropdown />
            </>
          }
        />
      </div>

      <main className="container mx-auto px-4 py-6 space-y-8">
        <ProductGrid
          products={products}
          isLoading={isLoading}
          onProductClick={(product) => setSelectedProduct(product)}
          onAddCompare={compareState.addToCompare}
          isInCompare={compareState.isInCompare}
          canAddMore={compareState.canAddMore}
        />

        {products.length > 0 && (
          <div className="flex justify-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
            >
              Trước
            </button>
            <span className="px-4 py-2 text-sm">
              Trang {page} / {Math.ceil(total / 8)}
            </span>
            <button
              disabled={page >= Math.ceil(total / 8)}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
            >
              Sau
            </button>
          </div>
        )}

        <BannerGrid banners={banners} />
      </main>

      <FooterBar
        totalProducts={total}
        hasFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        compareCount={compareState.count}
        onCompareClick={() => setShowCompareModal(true)}
      />

      <AdvancedFilterDrawer
        open={showAdvancedFilters}
        onOpenChange={setShowAdvancedFilters}
        attributes={attributes || []}
      />

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
          onAddCompare={() => compareState.addToCompare(selectedProduct.id)}
          isInCompare={compareState.isInCompare(selectedProduct.id)}
          canAddMore={compareState.canAddMore}
          onProductSelect={setSelectedProduct}
        />
      )}

      {showCompareModal && (
        <CompareModal
          productIds={compareState.compareList}
          open={showCompareModal}
          onOpenChange={setShowCompareModal}
          onRemove={compareState.removeFromCompare}
        />
      )}
    </div>
  );
}
