import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter, Sliders, LayoutGrid, Table as TableIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { lensApi } from '@/modules/marketing/services/lensApi';
import { useLensFilters } from '@/modules/marketing/hooks/useLensFilters';
import { useCompare } from '@/modules/marketing/hooks/useCompare';
import { LensAppBar } from '@/modules/marketing/components/lens/LensAppBar';
import { FeatureFilterChips } from '@/modules/marketing/components/lens/FeatureFilterChips';
import { AttributeDropdownFilters } from '@/modules/marketing/components/lens/AttributeDropdownFilters';
import { AdvancedFilterDrawer } from '@/modules/marketing/components/lens/AdvancedFilterDrawer';
import { SupplyUseCaseFilterDrawer } from '@/modules/marketing/components/lens/SupplyUseCaseFilterDrawer';
import { SortDropdown } from '@/modules/marketing/components/lens/SortDropdown';
import { ProductGrid } from '@/modules/marketing/components/lens/ProductGrid';
import { ProductComparisonTable } from '@/modules/marketing/components/lens/ProductComparisonTable';
import { BannerGrid } from '@/modules/marketing/components/lens/BannerGrid';
import { FooterBar } from '@/modules/marketing/components/lens/FooterBar';
import { ProductDetailModal } from '@/modules/marketing/components/lens/ProductDetailModal';
import { CompareModal } from '@/modules/marketing/components/lens/CompareModal';
import { LensProductWithDetails, LensRecommendationGroup } from '@/modules/marketing/types/lens';
import { getAdvancedFilterCount, getSupplyUseCaseFilterCount } from '@/modules/marketing/utils/filterCount';

export function LensCatalogPage() {
  const { filters, updateFilter, clearFilters, hasActiveFilters } = useLensFilters();
  const compareState = useCompare();
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<LensProductWithDetails | null>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSupplyUseCaseFilters, setShowSupplyUseCaseFilters] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<LensRecommendationGroup | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  const advancedFilterCount = getAdvancedFilterCount(filters);
  const supplyUseCaseFilterCount = getSupplyUseCaseFilterCount(filters);

  const { data: brandsData } = useQuery({
    queryKey: ['lens-brands'],
    queryFn: () => lensApi.getBrands(),
  });

  const { data: attributes } = useQuery({
    queryKey: ['lens-attributes'],
    queryFn: () => lensApi.getAttributes(),
  });

  // Fetch products based on recommendation or regular filters
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['lens-products', filters, page, selectedRecommendation?.id],
    queryFn: () => {
      if (selectedRecommendation) {
        return lensApi.getProductsByRecommendation(selectedRecommendation.id);
      }
      return lensApi.getProducts(filters, page, 8);
    },
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

  // Auto clear recommendation when user applies filters
  useEffect(() => {
    if (hasActiveFilters && selectedRecommendation) {
      setSelectedRecommendation(null);
      toast({
        title: "Đã tắt tư vấn nhanh",
        description: "Bộ lọc thủ công đã được áp dụng",
      });
    }
  }, [hasActiveFilters, selectedRecommendation]);

  const handleRecommendationSelect = (group: LensRecommendationGroup | null) => {
    setSelectedRecommendation(group);
    if (group) {
      clearFilters(); // Clear existing filters when selecting recommendation
    }
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <LensAppBar 
        onSearchChange={(q) => updateFilter('search', q)}
        compareCount={compareState.count}
        onCompareClick={() => setShowCompareModal(true)}
        selectedRecommendation={selectedRecommendation}
        onRecommendationSelect={handleRecommendationSelect}
      />

      {/* Sticky Filter Section */}
      <div className="sticky top-16 z-40 bg-background border-b">
        <FeatureFilterChips features={features} />
        <AttributeDropdownFilters 
          attributes={attributes || []}
          actionButtons={
            <>
              <div className="relative">
                <button
                  onClick={() => setShowAdvancedFilters(true)}
                  className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
                  title="Lọc theo thương hiệu & tính năng"
                >
                  <Filter className="w-5 h-5 text-blue-600" />
                </button>
                {advancedFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 shadow-sm">
                    {advancedFilterCount}
                  </span>
                )}
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowSupplyUseCaseFilters(true)}
                  className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
                  title="Lọc theo thông số, nhu cầu & tầng cung ứng"
                >
                  <Sliders className="w-5 h-5 text-purple-600" />
                </button>
                {supplyUseCaseFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 shadow-sm">
                    {supplyUseCaseFilterCount}
                  </span>
                )}
              </div>
              
              <SortDropdown />
              
              <div className="flex border border-border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'card' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('card')}
                  className="rounded-none"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="rounded-none"
                >
                  <TableIcon className="w-4 h-4" />
                </Button>
              </div>
            </>
          }
        />
      </div>

      <main className="container mx-auto px-4 py-6 space-y-8">
        {viewMode === 'card' ? (
          <ProductGrid
            products={products}
            isLoading={isLoading}
            onProductClick={(product) => setSelectedProduct(product)}
            onAddCompare={compareState.addToCompare}
            isInCompare={compareState.isInCompare}
            canAddMore={compareState.canAddMore}
          />
        ) : (
          <ProductComparisonTable
            products={products}
            isLoading={isLoading}
            onProductClick={(product) => setSelectedProduct(product)}
          />
        )}

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

      <SupplyUseCaseFilterDrawer
        open={showSupplyUseCaseFilters}
        onOpenChange={setShowSupplyUseCaseFilters}
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
