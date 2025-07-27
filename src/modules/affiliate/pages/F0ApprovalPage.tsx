
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function F0ApprovalPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Duyệt F0</h1>
        <p className="text-muted-foreground">Quản lý và duyệt các F0 đăng ký tham gia chương trình</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách F0 chờ duyệt</CardTitle>
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
