import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, ShieldAlert, HelpCircle, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePermissions } from "@/hooks/usePermissions";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { lensApi } from "@/modules/marketing/services/lensApi";
import { ProductTable, useProductColumnVisibility } from "@/modules/marketing/components/lens-admin/ProductTable";
import { ProductColumnVisibilityFilter } from "@/modules/marketing/components/lens-admin/ProductColumnVisibilityFilter";
import { ProductForm } from "@/modules/marketing/components/lens-admin/ProductForm";
import { ImportExcelDialog } from "@/modules/marketing/components/lens-admin/ImportExcelDialog";
import { ExportExcelButton } from "@/modules/marketing/components/lens-admin/ExportExcelButton";
import { AttributeManager } from "@/modules/marketing/components/lens-admin/AttributeManager";
import { SupplyTiersManager } from "@/modules/marketing/components/lens-admin/SupplyTiersManager";
import { UseCaseScoringManager } from "@/modules/marketing/components/lens-admin/UseCaseScoringManager";
import { ProductSelector } from "@/modules/marketing/components/lens-admin/ProductSelector";
import { RecommendationGroupManager } from "@/modules/marketing/components/lens-admin/RecommendationGroupManager";
import { BannerManager } from "@/modules/marketing/components/lens-admin/BannerManager";
import { SupplierCatalogManager } from "@/modules/marketing/components/lens-admin/SupplierCatalogManager";
import { ProductFilterPanel } from "@/modules/marketing/components/lens-admin/ProductFilterPanel";
import { DraggableProductTable } from "@/modules/marketing/components/lens-admin/DraggableProductTable";
import { LensProduct } from "@/modules/marketing/types/lens";
import { toast } from "sonner";

export function LensAdminPage() {
  const { hasFeatureAccess } = usePermissions();
  const navigate = useNavigate();

  // Check permission
  if (!hasFeatureAccess("manage_lens_admin")) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            Bạn không có quyền truy cập module Lens Admin. Vui lòng liên hệ quản trị viên để được cấp quyền.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<
    "products" | "attributes" | "tiers" | "usecases" | "recommendations" | "banners" | "catalogs"
  >("products");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<LensProduct | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [productFilters, setProductFilters] = useState<Record<string, string[]>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const { columns, handleColumnToggle } = useProductColumnVisibility();
  
  // Convert columns to visibility object
  const columnVisibility = columns.reduce((acc, col) => ({
    ...acc, 
    [col.key]: col.visible
  }), {} as Record<string, boolean>);

  const {
    data: productsData,
    refetch,
    isLoading: isLoadingProducts,
  } = useQuery({
    queryKey: ["admin-lens-products", productFilters],
    queryFn: () => lensApi.getProducts({}, 1, 100),
  });

  const { data: brands } = useQuery({
    queryKey: ["lens-brands"],
    queryFn: () => lensApi.getBrands(),
  });

  const { data: attributes } = useQuery({
    queryKey: ['lens-attributes'],
    queryFn: () => lensApi.getAttributes(),
  });

  const products = productsData?.products || [];

  // Filter products based on filters and search query
  const filteredProducts = useMemo(() => {
    let result = products;

    // Apply text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(product => {
        // Search in product name
        if (product.name.toLowerCase().includes(query)) return true;

        // Search in SKU
        if (product.sku && product.sku.toLowerCase().includes(query)) return true;

        // Search in description
        if (product.description && product.description.toLowerCase().includes(query)) return true;

        // Search in brand
        const brand = product.attributes?.lens_brand?.[0];
        if (brand && brand.toLowerCase().includes(query)) return true;

        return false;
      });
    }

    // Apply attribute filters
    if (Object.keys(productFilters).length > 0) {
      result = result.filter(product => {
        return Object.entries(productFilters).every(([slug, values]) => {
          if (values.length === 0) return true;
          const productValues = product.attributes[slug] || [];
          return values.some(v => productValues.includes(v));
        });
      });

      // Sort by display_order when filters are active
      result = [...result].sort((a, b) =>
        (a.display_order || 999999) - (b.display_order || 999999)
      );
    }

    return result;
  }, [products, productFilters, searchQuery]);

  const hasActiveFilters = Object.keys(productFilters).length > 0;

  // Pagination calculations
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [productFilters, searchQuery, itemsPerPage]);

  const handleFilterChange = (slug: string, value: string) => {
    setProductFilters(prev => {
      const current = prev[slug] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      
      if (updated.length === 0) {
        const { [slug]: _, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [slug]: updated };
    });
  };

  const handleClearFilters = () => {
    setProductFilters({});
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: LensProduct) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleClone = (product: LensProduct) => {
    const clonedProduct: LensProduct = {
      ...product,
      id: "",
      name: `[Copy] ${product.name}`,
      sku: null,
      created_at: "",
      updated_at: "",
      view_count: 0,
    };

    setEditingProduct(clonedProduct);
    setIsFormOpen(true);

    toast.info("Đang sao chép sản phẩm. Vui lòng kiểm tra và lưu lại.", {
      duration: 3000,
    });
  };

  const handleFormClose = (success?: boolean) => {
    setIsFormOpen(false);
    setEditingProduct(null);
    if (success) {
      refetch();
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold">Quản lý Lens Catalog</h1>
            <p className="text-muted-foreground">Quản lý sản phẩm tròng kính và thuộc tính</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => navigate('/help/lens-admin')}
                >
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hướng dẫn sử dụng</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
          <TabsTrigger value="attributes">Thuộc tính</TabsTrigger>
          <TabsTrigger value="tiers">Tầng cung ứng</TabsTrigger>
          <TabsTrigger value="usecases">Use Cases</TabsTrigger>
          <TabsTrigger value="recommendations">Tư vấn nhanh</TabsTrigger>
          <TabsTrigger value="banners">Banner</TabsTrigger>
          <TabsTrigger value="catalogs">📄 PDF Catalogs</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex gap-2 justify-end">
            <ProductColumnVisibilityFilter
              columns={columns}
              onColumnToggle={handleColumnToggle}
            />
            <ExportExcelButton />
            <Button variant="outline" onClick={() => setIsImportOpen(true)}>
              Nhập Excel
            </Button>
            <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Thêm sản phẩm
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm theo tên, SKU, mô tả hoặc thương hiệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <ProductFilterPanel
            attributes={attributes || []}
            filters={productFilters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearFilters}
          />

          {/* Product count and pagination info */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {searchQuery ? (
                <>
                  Tìm thấy <span className="font-semibold">{totalProducts}</span> sản phẩm phù hợp với "{searchQuery}"
                  {products.length > 0 && ` (trong tổng số ${products.length} sản phẩm)`}
                </>
              ) : hasActiveFilters ? (
                <>
                  Đang lọc <span className="font-semibold">{totalProducts}</span> sản phẩm
                </>
              ) : (
                <>
                  Tổng số <span className="font-semibold">{totalProducts}</span> sản phẩm
                </>
              )}
              {totalPages > 1 && (
                <span className="ml-2">
                  - Hiển thị {startIndex + 1}-{Math.min(endIndex, totalProducts)}
                </span>
              )}
            </div>

            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Hiển thị:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">/ trang</span>
            </div>
          </div>

          <DraggableProductTable
            products={paginatedProducts}
            onEdit={handleEdit}
            onClone={handleClone}
            onRefetch={refetch}
            onSelect={(id) => {
              setSelectedProductId(id);
              setActiveTab("tiers");
            }}
            columnVisibility={columnVisibility}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Trước
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="px-2 text-muted-foreground">...</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-10"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Sau
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="attributes">
          <AttributeManager />
        </TabsContent>

        <TabsContent value="tiers" className="space-y-4">
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Chọn sản phẩm</label>
            <ProductSelector
              products={products}
              selectedId={selectedProductId}
              onSelect={setSelectedProductId}
              isLoading={isLoadingProducts}
            />
          </div>
          {selectedProductId ? (
            <SupplyTiersManager productId={selectedProductId} />
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Chọn một sản phẩm để quản lý tầng cung ứng</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="usecases" className="space-y-4">
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Chọn sản phẩm</label>
            <ProductSelector
              products={products}
              selectedId={selectedProductId}
              onSelect={setSelectedProductId}
              isLoading={isLoadingProducts}
            />
          </div>
          {selectedProductId ? (
            <UseCaseScoringManager productId={selectedProductId} />
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Chọn một sản phẩm để chấm điểm use cases</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommendations">
          <RecommendationGroupManager />
        </TabsContent>

        <TabsContent value="banners">
          <BannerManager />
        </TabsContent>

        <TabsContent value="catalogs">
          <SupplierCatalogManager />
        </TabsContent>
      </Tabs>

      <ProductForm open={isFormOpen} product={editingProduct} onClose={handleFormClose} />

      <ImportExcelDialog
        open={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        brands={brands || []}
        onImportSuccess={refetch}
      />
    </div>
  );
}
