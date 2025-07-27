
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function VoucherManagementPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quản Lý Voucher</h1>
        <p className="text-muted-foreground">Quản lý voucher cho chương trình affiliate</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách voucher</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Trang này đang được phát triển...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
