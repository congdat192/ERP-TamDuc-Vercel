
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { InvoiceInfoTab } from './detail-tabs/InvoiceInfoTab';
import { PaymentHistoryTab } from './detail-tabs/PaymentHistoryTab';
import { CustomerInfoTab } from './detail-tabs/CustomerInfoTab';
import { InvoicePaymentTab } from './detail-tabs/InvoicePaymentTab';

interface InvoiceDetailRowProps {
  invoice: any;
  visibleColumnsCount: number;
}

export function InvoiceDetailRow({ invoice, visibleColumnsCount }: InvoiceDetailRowProps) {
  return (
    <tr className="bg-gray-50/50">
      <td colSpan={visibleColumnsCount + 1} className="p-0">
        <div className="p-6 border-2 border-solid theme-border-primary bg-white/80 rounded-lg mx-2 my-1 shadow-sm">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-6">
              <TabsTrigger value="info" className="text-sm">Thông tin</TabsTrigger>
              <TabsTrigger value="payment-history" className="text-sm">Lịch sử thanh toán</TabsTrigger>
              <TabsTrigger value="customer" className="text-sm">Khách hàng</TabsTrigger>
              <TabsTrigger value="payment" className="text-sm">Thanh toán</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="mt-0">
              <InvoiceInfoTab invoice={invoice} />
            </TabsContent>
            
            <TabsContent value="payment-history" className="mt-0">
              <PaymentHistoryTab invoice={invoice} />
            </TabsContent>
            
            <TabsContent value="customer" className="mt-0">
              <CustomerInfoTab invoice={invoice} />
            </TabsContent>
            
            <TabsContent value="payment" className="mt-0">
              <InvoicePaymentTab invoice={invoice} />
            </TabsContent>
          </Tabs>
        </div>
      </td>
    </tr>
  );
}
