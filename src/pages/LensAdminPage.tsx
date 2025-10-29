import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermissions } from "@/hooks/usePermissions";
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
import { LensProduct } from "@/modules/marketing/types/lens";
import { toast } from "sonner";

export function LensAdminPage() {
  const { hasFeatureAccess } = usePermissions();

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
  const { columns, handleColumnToggle } = useProductColumnVisibility();

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

  const products = productsData?.products || [];

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
        <div>
          <h1 className="text-3xl font-bold">Quản lý Lens Catalog</h1>
          <p className="text-muted-foreground">Quản lý sản phẩm tròng kính và thuộc tính</p>
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

          <ProductTable
            products={products}
            onEdit={handleEdit}
            onClone={handleClone}
            onRefetch={refetch}
            onSelect={(id) => {
              setSelectedProductId(id);
              setActiveTab("tiers");
            }}
          />
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
