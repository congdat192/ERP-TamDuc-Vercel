
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ActivityLogPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nhật Ký Hoạt Động</h1>
        <p className="text-muted-foreground">Theo dõi các hoạt động trong hệ thống affiliate</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử hoạt động</CardTitle>
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
