import { DollarSign } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function PayrollPage() {
  const { hasPermission } = usePermissions();

  if (!hasPermission('view_payroll') && !hasPermission('full_access')) {
    return (
      <Alert variant="destructive" className="my-4">
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription>
          Bạn không có quyền truy cập tính năng này.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold theme-text flex items-center gap-2">
          <DollarSign className="w-8 h-8" />
          Tính Lương Tự Động (3P)
        </h1>
        <p className="theme-text-secondary mt-1">
          Hệ thống tính lương tự động tích hợp People, Process, Payroll
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Tính Năng Đang Phát Triển
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription className="space-y-2">
              <p className="font-medium">Tính năng tính lương tự động sẽ tích hợp với:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Ca Làm & Chấm Công - Lấy dữ liệu công, giờ làm, OT</li>
                <li>Hồ Sơ Nhân Sự - Lương cơ bản, phụ cấp, hợp đồng</li>
                <li>Phúc Lợi & Kỷ Luật - Thưởng, trừ lương</li>
                <li>Tính toán thuế TNCN, BHXH, BHYT, BHTN</li>
                <li>Tự động tạo phiếu lương theo công thức</li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                Vui lòng hoàn thiện module <strong>Ca Làm & Chấm Công</strong> trước khi triển khai tính năng này.
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
