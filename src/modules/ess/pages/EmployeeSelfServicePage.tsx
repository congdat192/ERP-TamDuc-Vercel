import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmployeePayrollTab } from '../components/EmployeePayrollTab';

export function EmployeeSelfServicePage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold theme-text">Cổng Thông Tin Nhân Viên</h1>
        <p className="theme-text-secondary mt-1">
          Xem thông tin cá nhân và phiếu lương của bạn
        </p>
      </div>

      <Tabs defaultValue="payroll" className="w-full">
        <TabsList>
          <TabsTrigger value="payroll">Phiếu Lương</TabsTrigger>
          <TabsTrigger value="profile">Hồ Sơ Cá Nhân</TabsTrigger>
        </TabsList>

        <TabsContent value="payroll">
          <EmployeePayrollTab />
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Cá Nhân</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Tính năng đang được phát triển...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
