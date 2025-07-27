
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Báo Cáo/Xuất File</h1>
        <p className="text-muted-foreground">Tạo báo cáo và xuất dữ liệu</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Báo cáo thống kê</CardTitle>
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
