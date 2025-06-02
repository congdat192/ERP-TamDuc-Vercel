
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Shield, 
  Bell,
  Save,
  CheckCircle
} from 'lucide-react';
import { VoucherSettingsConfig } from '../components/VoucherSettingsConfig';
import { VoucherCustomerSettings } from '../components/VoucherCustomerSettings';
import { ConditionTemplateManager } from '../components/ConditionTemplateManager';
import { toast } from '@/hooks/use-toast';

export function VoucherSettings() {
  const [voucherCodeConfig, setVoucherCodeConfig] = useState<any>(null);

  const handleSaveSettings = () => {
    toast({
      title: "Thành công",
      description: "Cài đặt đã được lưu thành công."
    });
  };

  const handleVoucherCodeConfigChange = (config: any) => {
    setVoucherCodeConfig(config);
    console.log('Voucher code configuration updated:', config);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cài Đặt Module Voucher</h2>
          <p className="text-gray-600">Cấu hình và tùy chỉnh module voucher</p>
        </div>
        <Button onClick={handleSaveSettings}>
          <Save className="w-4 h-4 mr-2" />
          Lưu Cài Đặt
        </Button>
      </div>

      <Tabs defaultValue="template-management" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="template-management">Quản Lý Template</TabsTrigger>
          <TabsTrigger value="customer-settings">Cài Đặt Khách Hàng</TabsTrigger>
          <TabsTrigger value="system-config">Cấu Hình Hệ Thống</TabsTrigger>
          <TabsTrigger value="permissions">Quyền Hạn & Thông Báo</TabsTrigger>
        </TabsList>

        <TabsContent value="template-management" className="space-y-6">
          <ConditionTemplateManager
            onApplyTemplate={(template) => {
              console.log('Applied template:', template);
              toast({
                title: "Áp dụng template",
                description: `Template "${template.name}" đã được áp dụng thành công.`
              });
            }}
            onCreateTemplate={(name, description) => {
              console.log('Creating template:', name, description);
            }}
          />
        </TabsContent>

        <TabsContent value="customer-settings" className="space-y-6">
          <VoucherCustomerSettings 
            onSettingsChange={(settings) => {
              console.log('Customer settings:', settings);
            }}
          />
        </TabsContent>

        <TabsContent value="system-config" className="space-y-6">
          <VoucherSettingsConfig />
        </TabsContent>

        <TabsContent value="permissions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Cài Đặt Quyền Hạn</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Telesales Có Thể Xem Tất Cả Voucher</label>
                      <p className="text-sm text-gray-600">Cho phép xem voucher của người khác</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast({ description: "Demo: Cập nhật quyền hạn" })}>
                      Cập Nhật
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Yêu Cầu Phê Duyệt Voucher Cao Giá Trị</label>
                      <p className="text-sm text-gray-600">Voucher trên 1.000.000đ cần phê duyệt</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast({ description: "Demo: Cập nhật phê duyệt" })}>
                      Cập Nhật
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Cho Phép Cấp Lại Voucher</label>
                      <p className="text-sm text-gray-600">Nhân viên có thể cấp lại voucher</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast({ description: "Demo: Cập nhật cấp lại voucher" })}>
                      Cập Nhật
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Cài Đặt Thông Báo</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Thông Báo Voucher Mới</label>
                      <p className="text-sm text-gray-600">Thông báo khi có voucher được phát hành</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast({ description: "Demo: Cập nhật thông báo" })}>
                      Cập Nhật
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Cảnh Báo Voucher Hết Hạn</label>
                      <p className="text-sm text-gray-600">Thông báo trước khi voucher hết hạn</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast({ description: "Demo: Cập nhật cảnh báo" })}>
                      Cập Nhật
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Báo Cáo Hiệu Suất Hàng Ngày</label>
                      <p className="text-sm text-gray-600">Gửi báo cáo hiệu suất cuối ngày</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast({ description: "Demo: Cập nhật báo cáo" })}>
                      Cập Nhật
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Status Notice */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">Trạng Thái Cài Đặt</h3>
              <p className="text-sm text-gray-600 mt-1">
                Hệ thống quản lý voucher với template điều kiện và tạo mã tự động đã được thiết lập. 
                Các thay đổi sẽ được áp dụng ngay lập tức cho module voucher.
                {voucherCodeConfig && (
                  <span className="block mt-2 font-medium text-blue-600">
                    Cấu hình hiện tại: {voucherCodeConfig.selectedBatch}
                  </span>
                )}
              </p>
              <div className="mt-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm inline-flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Cấu Hình Hoàn Tất
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
