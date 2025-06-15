
import { useParams, Navigate } from 'react-router-dom';
import { mockInventory } from '@/data/mockData';
import { ProductDetailRow } from '@/modules/inventory/components/ProductDetailRow';

export function ProductDetailPage() {
  const { productCode } = useParams<{ productCode: string }>();
  
  // Tìm sản phẩm theo productCode
  const product = mockInventory.find(p => p.productCode === productCode);
  
  // Nếu không tìm thấy sản phẩm, redirect về trang Products
  if (!product) {
    return <Navigate to="/ERP/Products" replace />;
  }

  return (
    <div className="p-6 theme-background">
      <div className="mb-6">
        <h1 className="text-2xl font-bold theme-text mb-2">Chi tiết sản phẩm: {product.name}</h1>
        <p className="theme-text-muted">Mã sản phẩm: {product.productCode}</p>
      </div>
      
      <div className="theme-card rounded-lg border theme-border-primary overflow-hidden">
        <table className="w-full">
          <tbody>
            <ProductDetailRow 
              product={product} 
              visibleColumnsCount={0}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}
