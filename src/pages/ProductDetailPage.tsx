
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProductInfoTab } from '@/modules/inventory/components/detail-tabs/ProductInfoTab';
import { ProductDescriptionTab } from '@/modules/inventory/components/detail-tabs/ProductDescriptionTab';
import { ProductInventoryTagTab } from '@/modules/inventory/components/detail-tabs/ProductInventoryTagTab';
import { ProductStockTab } from '@/modules/inventory/components/detail-tabs/ProductStockTab';
import { ProductChannelLinkTab } from '@/modules/inventory/components/detail-tabs/ProductChannelLinkTab';
import { mockInventory, MockInventory } from '@/data/mockData';

export function ProductDetailPage() {
  const { productCode } = useParams<{ productCode: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<MockInventory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productCode) {
      navigate('/ERP/Products');
      return;
    }

    // Tìm sản phẩm theo productCode
    const foundProduct = mockInventory.find(item => item.productCode === productCode);
    
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      // Product không tồn tại, redirect về danh sách với thông báo
      navigate('/ERP/Products', { 
        state: { error: `Không tìm thấy sản phẩm với mã: ${productCode}` }
      });
      return;
    }
    
    setLoading(false);
  }, [productCode, navigate]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header với nút back */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/ERP/Products')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>
        <div>
          <h1 className="text-2xl font-bold theme-text">{product.name}</h1>
          <p className="theme-text-muted">Mã sản phẩm: {product.productCode}</p>
        </div>
      </div>

      {/* Product detail với border nổi bật */}
      <div className="border-2 border-solid theme-border-primary bg-white/80 rounded-lg p-6 shadow-sm">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl mb-6">
            <TabsTrigger value="info" className="text-sm">Thông tin</TabsTrigger>
            <TabsTrigger value="description" className="text-sm">Mô tả, ghi chú</TabsTrigger>
            <TabsTrigger value="inventory" className="text-sm">Thẻ kho</TabsTrigger>
            <TabsTrigger value="stock" className="text-sm">Tồn kho</TabsTrigger>
            <TabsTrigger value="channels" className="text-sm">Liên kết kênh bán</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="mt-0">
            <ProductInfoTab product={product} />
          </TabsContent>
          
          <TabsContent value="description" className="mt-0">
            <ProductDescriptionTab product={product} />
          </TabsContent>
          
          <TabsContent value="inventory" className="mt-0">
            <ProductInventoryTagTab product={product} />
          </TabsContent>
          
          <TabsContent value="stock" className="mt-0">
            <ProductStockTab product={product} />
          </TabsContent>
          
          <TabsContent value="channels" className="mt-0">
            <ProductChannelLinkTab product={product} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
