
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProductInfoTab } from './detail-tabs/ProductInfoTab';
import { ProductDescriptionTab } from './detail-tabs/ProductDescriptionTab';
import { ProductInventoryTagTab } from './detail-tabs/ProductInventoryTagTab';
import { ProductStockTab } from './detail-tabs/ProductStockTab';
import { ProductChannelLinkTab } from './detail-tabs/ProductChannelLinkTab';
import { ProductAdvancedTab } from './detail-tabs/ProductAdvancedTab';

interface ProductDetailRowProps {
  product: any;
  visibleColumnsCount: number;
}

export function ProductDetailRow({ product, visibleColumnsCount }: ProductDetailRowProps) {
  return (
    <tr className="bg-gray-50/50">
      <td colSpan={visibleColumnsCount + 1} className="p-0">
        <div className="p-6 border-2 border-solid theme-border-primary bg-white/80 rounded-lg mx-2 my-1 shadow-sm">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid grid-cols-6 w-full max-w-3xl mb-6">
              <TabsTrigger value="info" className="text-sm">Thông tin</TabsTrigger>
              <TabsTrigger value="description" className="text-sm">Mô tả, ghi chú</TabsTrigger>
              <TabsTrigger value="inventory" className="text-sm">Thẻ kho</TabsTrigger>
              <TabsTrigger value="stock" className="text-sm">Tồn kho</TabsTrigger>
              <TabsTrigger value="advanced" className="text-sm">Thuộc tính & Giá</TabsTrigger>
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
            
            <TabsContent value="advanced" className="mt-0">
              <ProductAdvancedTab product={product} />
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
