
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ReferralManagementPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quản Lý Giới Thiệu</h1>
        <p className="text-muted-foreground">Theo dõi và quản lý các lượt giới thiệu F0-F1</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách giới thiệu</CardTitle>
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
