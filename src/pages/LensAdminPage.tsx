import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, ShieldAlert, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    queryKey: ["admin-lens-products"],
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

  // Filter products based on filters
  const filteredProducts = useMemo(() => {
    if (Object.keys(productFilters).length === 0) return products;
    
    return products.filter(product => {
      return Object.entries(productFilters).every(([slug, values]) => {
        if (values.length === 0) return true;
        const productValues = product.attributes[slug] || [];
        return values.some(v => productValues.includes(v));
      });
    });
  }, [products, productFilters]);

  const hasActiveFilters = Object.keys(productFilters).length > 0;

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

          <ProductFilterPanel
            attributes={attributes || []}
            filters={productFilters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearFilters}
          />

          {hasActiveFilters ? (
            <>
              <p className="text-sm text-muted-foreground">
                Đang lọc {filteredProducts.length} sản phẩm. Kéo thả để sắp xếp thứ tự hiển thị ngoài Lens Catalog.
              </p>
              <DraggableProductTable
                products={filteredProducts}
                onEdit={handleEdit}
                onClone={handleClone}
                onRefetch={refetch}
                onSelect={(id) => {
                  setSelectedProductId(id);
                  setActiveTab("tiers");
                }}
                columnVisibility={columnVisibility}
              />
            </>
          ) : (
            <ProductTable
              products={products}
              onEdit={handleEdit}
              onClone={handleClone}
              onRefetch={refetch}
              onSelect={(id) => {
                setSelectedProductId(id);
                setActiveTab("tiers");
              }}
              columnVisibility={columnVisibility}
            />
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
