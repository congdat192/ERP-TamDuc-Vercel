import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { lensApi } from '@/modules/marketing/services/lensApi';
import { ProductTable } from '@/modules/marketing/components/lens-admin/ProductTable';
import { ProductForm } from '@/modules/marketing/components/lens-admin/ProductForm';
import { LensProduct } from '@/modules/marketing/types/lens';

export function LensAdminPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<LensProduct | null>(null);

  const { data: productsData, refetch } = useQuery({
    queryKey: ['admin-lens-products'],
    queryFn: () => lensApi.getProducts({}, 1, 100),
  });

  const { data: brands } = useQuery({
    queryKey: ['lens-brands'],
    queryFn: () => lensApi.getBrands(),
  });

  const { data: features } = useQuery({
    queryKey: ['lens-features'],
    queryFn: () => lensApi.getFeatures(),
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
          <p className="text-muted-foreground">Quản lý sản phẩm tròng kính</p>
        </div>

        <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      <ProductTable
        products={products}
        brands={brands || []}
        onEdit={handleEdit}
        onRefetch={refetch}
      />

      <ProductForm
        open={isFormOpen}
        product={editingProduct}
        brands={brands || []}
        features={features || []}
        onClose={handleFormClose}
      />
    </div>
  );
}
