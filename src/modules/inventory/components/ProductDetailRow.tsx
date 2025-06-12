
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProductInfoTab } from './detail-tabs/ProductInfoTab';
import { ProductDescriptionTab } from './detail-tabs/ProductDescriptionTab';
import { ProductInventoryTagTab } from './detail-tabs/ProductInventoryTagTab';
import { ProductStockTab } from './detail-tabs/ProductStockTab';
import { ProductChannelLinkTab } from './detail-tabs/ProductChannelLinkTab';

interface ProductDetailRowProps {
  product: any;
  visibleColumnsCount: number;
}

export function ProductDetailRow({ product, visibleColumnsCount }: ProductDetailRowProps) {
  return (
    <tr className="bg-gray-50/50">
      <td colSpan={visibleColumnsCount + 1} className="p-0">
        <div className="p-6 border-l-4 border-l-blue-500 bg-white/80">
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
      </td>
    </tr>
  );
}
