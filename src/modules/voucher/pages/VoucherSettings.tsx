
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Shield, 
  Bell, 
  Palette,
  AlertCircle,
  Save,
  CheckCircle
} from 'lucide-react';
import { VoucherSettingsConfig } from '../components/VoucherSettingsConfig';
import { VoucherBatchSelector } from '../components/VoucherBatchSelector';
import { VoucherCodeCustomization } from '../components/VoucherCodeCustomization';
import { VoucherCustomerSettings } from '../components/VoucherCustomerSettings';
import { toast } from '@/hooks/use-toast';

export function VoucherSettings() {
  const [selectedBatch, setSelectedBatch] = useState('');
  const [autoIssue, setAutoIssue] = useState(false);

  const handleBatchChange = (batch: string) => {
    setSelectedBatch(batch);
    if (batch) {
      toast({
        title: "Batch đã được chọn",
        description: `Đã chọn voucher batch: ${batch}. Bạn có thể bắt đầu cấu hình điều kiện tạo mã.`
      });
    }
  };

  const handleSaveSettings = () => {
    toast({
      title: "Thành công",
      description: "Cài đặt đã được lưu thành công."
    });
  };

  const handleCodeCustomizationChange = (settings: any) => {
    console.log('Code customization settings updated:', settings);
    // In a real app, this would save to backend
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

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Cài Đặt Chung</TabsTrigger>
          <TabsTrigger value="configuration">Cấu Hình</TabsTrigger>
          <TabsTrigger value="permissions">Quyền Hạn</TabsTrigger>
          <TabsTrigger value="notifications">Thông Báo</TabsTrigger>
          <TabsTrigger value="appearance">Giao Diện</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Cài Đặt Chung</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Voucher Batch Selection */}
              <div className="border-b border-gray-200 pb-6">
                <VoucherBatchSelector
                  selectedBatch={selectedBatch}
                  onBatchChange={handleBatchChange}
                />
              </div>

              {/* Voucher Issuance Option */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-issue">Tự động phát hành voucher khi khởi tạo</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Automatically issue the voucher immediately upon creation, no manual approval needed.
                    </p>
                  </div>
                  <Switch 
                    id="auto-issue" 
                    checked={autoIssue}
                    onCheckedChange={setAutoIssue}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voucher Code UI Customization - Enhanced with new features */}
          <VoucherCodeCustomization 
            selectedBatch={selectedBatch}
            onSettingsChange={handleCodeCustomizationChange}
          />

          {/* Voucher Customer Settings */}
          <VoucherCustomerSettings 
            onSettingsChange={(settings) => {
              console.log('Customer settings:', settings);
            }}
          />
        </TabsContent>

        <TabsContent value="configuration" className="space-y-6">
          <VoucherSettingsConfig />
        </TabsContent>

        <TabsContent value="permissions">
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
                    <Label>Telesales Có Thể Xem Tất Cả Voucher</Label>
                    <p className="text-sm text-gray-600">Cho phép xem voucher của người khác</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Yêu Cầu Phê Duyệt Voucher Cao Giá Trị</Label>
                    <p className="text-sm text-gray-600">Voucher trên 1.000.000đ cần phê duyệt</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cho Phép Cấp Lại Voucher</Label>
                    <p className="text-sm text-gray-600">Nhân viên có thể cấp lại voucher</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
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
                    <Label>Thông Báo Voucher Mới</Label>
                    <p className="text-sm text-gray-600">Thông báo khi có voucher được phát hành</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cảnh Báo Voucher Hết Hạn</Label>
                    <p className="text-sm text-gray-600">Thông báo trước khi voucher hết hạn</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Báo Cáo Hiệu Suất Hàng Ngày</Label>
                    <p className="text-sm text-gray-600">Gửi báo cáo hiệu suất cuối ngày</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Cài Đặt Giao Diện</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="theme">Chủ Đề Màu Sắc</Label>
                  <Select defaultValue="orange">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn chủ đề" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="orange">Cam (Mặc Định)</SelectItem>
                      <SelectItem value="blue">Xanh Dương</SelectItem>
                      <SelectItem value="green">Xanh Lá</SelectItem>
                      <SelectItem value="purple">Tím</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="layout">Bố Cục Dashboard</Label>
                  <Select defaultValue="grid">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn bố cục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Lưới</SelectItem>
                      <SelectItem value="list">Danh Sách</SelectItem>
                      <SelectItem value="compact">Gọn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Hiển Thị Hình Ảnh Avatar</Label>
                  <p className="text-sm text-gray-600">Hiển thị avatar trong bảng xếp hạng</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Notice */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">Trạng Thái Cài Đặt</h3>
              <p className="text-sm text-gray-600 mt-1">
                Hệ thống quản lý voucher code với mapping giá trị điều kiện và thứ tự ưu tiên đã được thiết lập. 
                Các thay đổi sẽ được áp dụng ngay lập tức cho module voucher.
                {selectedBatch && (
                  <span className="block mt-2 font-medium text-blue-600">
                    Đợt phát hành hiện tại: {selectedBatch}
                  </span>
                )}
              </p>
              <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Cấu Hình Hoàn Tất
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
