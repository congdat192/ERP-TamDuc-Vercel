
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function WithdrawalManagementPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quản Lý Rút Tiền</h1>
        <p className="text-muted-foreground">Xử lý các yêu cầu rút tiền hoa hồng</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách yêu cầu rút tiền</CardTitle>
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
