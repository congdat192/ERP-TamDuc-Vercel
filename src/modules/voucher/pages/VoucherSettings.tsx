import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Shield, 
  Bell,
  Save,
  CheckCircle,
  Edit
} from 'lucide-react';
import { VoucherSettingsConfig } from '../components/VoucherSettingsConfig';
import { VoucherIssueRulesConditions } from '../components/VoucherIssueRulesConditions';
import { ConditionTemplateManager } from '../components/ConditionTemplateManager';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ViewAllVouchersSettings {
  enabled: boolean;
  roles: string[];
}

interface ApprovalRequiredSettings {
  enabled: boolean;
  threshold: number;
  approvers: string[];
}

interface ReissueVouchersSettings {
  enabled: boolean;
  roles: string[];
}

interface NewVoucherNotificationSettings {
  enabled: boolean;
  recipients: string[];
  method: string;
}

interface ExpirationNotificationSettings {
  enabled: boolean;
  days: number;
  recipients: string[];
}

interface DailyReportNotificationSettings {
  enabled: boolean;
  time: string;
  recipients: string[];
}

export function VoucherSettings() {
  const [voucherCodeConfig, setVoucherCodeConfig] = useState<any>(null);
  
  // Permission settings state
  const [permissionDialogOpen, setPermissionDialogOpen] = useState<string | null>(null);
  const [permissionSettings, setPermissionSettings] = useState({
    viewAllVouchers: { enabled: true, roles: ['admin', 'manager'] } as ViewAllVouchersSettings,
    approvalRequired: { enabled: true, threshold: 1000000, approvers: ['admin'] } as ApprovalRequiredSettings,
    reissueVouchers: { enabled: false, roles: ['admin', 'telesales'] } as ReissueVouchersSettings
  });

  // Notification settings state
  const [notificationDialogOpen, setNotificationDialogOpen] = useState<string | null>(null);
  const [notificationSettings, setNotificationSettings] = useState({
    newVoucher: { enabled: true, recipients: ['telesales', 'admin'], method: 'both' } as NewVoucherNotificationSettings,
    expiration: { enabled: true, days: 3, recipients: ['customer', 'telesales'] } as ExpirationNotificationSettings,
    dailyReport: { enabled: false, time: '18:00', recipients: ['admin'] } as DailyReportNotificationSettings
  });

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

  const handlePermissionUpdate = (settingKey: string, newSettings: any) => {
    if (settingKey === 'viewAllVouchers') {
      setPermissionSettings(prev => ({
        ...prev,
        viewAllVouchers: { 
          enabled: newSettings.enabled,
          roles: newSettings.roles || prev.viewAllVouchers.roles
        }
      }));
    } else if (settingKey === 'approvalRequired') {
      setPermissionSettings(prev => ({
        ...prev,
        approvalRequired: {
          enabled: newSettings.enabled,
          threshold: newSettings.threshold || prev.approvalRequired.threshold,
          approvers: newSettings.approvers || prev.approvalRequired.approvers
        }
      }));
    } else if (settingKey === 'reissueVouchers') {
      setPermissionSettings(prev => ({
        ...prev,
        reissueVouchers: {
          enabled: newSettings.enabled,
          roles: newSettings.roles || prev.reissueVouchers.roles
        }
      }));
    }
    
    setPermissionDialogOpen(null);
    toast({
      title: "Cập nhật thành công",
      description: "Cài đặt quyền hạn đã được cập nhật."
    });
  };

  const handleNotificationUpdate = (settingKey: string, newSettings: any) => {
    if (settingKey === 'newVoucher') {
      setNotificationSettings(prev => ({
        ...prev,
        newVoucher: {
          enabled: newSettings.enabled,
          recipients: newSettings.recipients || prev.newVoucher.recipients,
          method: newSettings.method || prev.newVoucher.method
        }
      }));
    } else if (settingKey === 'expiration') {
      setNotificationSettings(prev => ({
        ...prev,
        expiration: {
          enabled: newSettings.enabled,
          days: newSettings.days || prev.expiration.days,
          recipients: newSettings.recipients || prev.expiration.recipients
        }
      }));
    } else if (settingKey === 'dailyReport') {
      setNotificationSettings(prev => ({
        ...prev,
        dailyReport: {
          enabled: newSettings.enabled,
          time: newSettings.time || prev.dailyReport.time,
          recipients: newSettings.recipients || prev.dailyReport.recipients
        }
      }));
    }
    
    setNotificationDialogOpen(null);
    toast({
      title: "Cập nhật thành công",
      description: "Cài đặt thông báo đã được cập nhật."
    });
  };

  const renderPermissionDialog = () => {
    if (!permissionDialogOpen) return null;

    const getPermissionSettings = () => {
      switch (permissionDialogOpen) {
        case 'viewAllVouchers':
          return permissionSettings.viewAllVouchers;
        case 'approvalRequired':
          return permissionSettings.approvalRequired;
        case 'reissueVouchers':
          return permissionSettings.reissueVouchers;
        default:
          return null;
      }
    };

    const currentSettings = getPermissionSettings();
    if (!currentSettings) return null;

    return (
      <Dialog open={!!permissionDialogOpen} onOpenChange={() => setPermissionDialogOpen(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {permissionDialogOpen === 'viewAllVouchers' && 'Cấu Hình Quyền Xem Voucher'}
              {permissionDialogOpen === 'approvalRequired' && 'Cấu Hình Phê Duyệt'}
              {permissionDialogOpen === 'reissueVouchers' && 'Cấu Hình Cấp Lại Voucher'}
            </DialogTitle>
            <DialogDescription>
              Điều chỉnh cài đặt quyền hạn cho tính năng này.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Kích hoạt tính năng</Label>
              <Switch
                checked={currentSettings.enabled}
                onCheckedChange={(checked) => {
                  if (permissionDialogOpen === 'viewAllVouchers') {
                    setPermissionSettings(prev => ({
                      ...prev,
                      viewAllVouchers: { ...prev.viewAllVouchers, enabled: checked }
                    }));
                  } else if (permissionDialogOpen === 'approvalRequired') {
                    setPermissionSettings(prev => ({
                      ...prev,
                      approvalRequired: { ...prev.approvalRequired, enabled: checked }
                    }));
                  } else if (permissionDialogOpen === 'reissueVouchers') {
                    setPermissionSettings(prev => ({
                      ...prev,
                      reissueVouchers: { ...prev.reissueVouchers, enabled: checked }
                    }));
                  }
                }}
              />
            </div>

            {permissionDialogOpen === 'approvalRequired' && 'threshold' in currentSettings && (
              <div>
                <Label>Ngưỡng phê duyệt (VNĐ)</Label>
                <Input
                  type="number"
                  value={currentSettings.threshold}
                  onChange={(e) => 
                    setPermissionSettings(prev => ({
                      ...prev,
                      approvalRequired: { ...prev.approvalRequired, threshold: Number(e.target.value) }
                    }))
                  }
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label>Vai trò được phép</Label>
              <Select
                value={
                  ('roles' in currentSettings && currentSettings.roles?.[0]) || 
                  ('approvers' in currentSettings && currentSettings.approvers?.[0]) || 
                  ''
                }
                onValueChange={(value) => {
                  if (permissionDialogOpen === 'approvalRequired') {
                    setPermissionSettings(prev => ({
                      ...prev,
                      approvalRequired: { ...prev.approvalRequired, approvers: [value] }
                    }));
                  } else {
                    const key = permissionDialogOpen as 'viewAllVouchers' | 'reissueVouchers';
                    setPermissionSettings(prev => ({
                      ...prev,
                      [key]: { ...prev[key], roles: [value] }
                    }));
                  }
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                  <SelectItem value="manager">Quản lý</SelectItem>
                  <SelectItem value="telesales">Telesales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPermissionDialogOpen(null)}>
              Hủy
            </Button>
            <Button variant="default" onClick={() => handlePermissionUpdate(permissionDialogOpen, currentSettings)}>
              Lưu Thay Đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const renderNotificationDialog = () => {
    if (!notificationDialogOpen) return null;

    const getNotificationSettings = () => {
      switch (notificationDialogOpen) {
        case 'newVoucher':
          return notificationSettings.newVoucher;
        case 'expiration':
          return notificationSettings.expiration;
        case 'dailyReport':
          return notificationSettings.dailyReport;
        default:
          return null;
      }
    };

    const currentSettings = getNotificationSettings();
    if (!currentSettings) return null;

    return (
      <Dialog open={!!notificationDialogOpen} onOpenChange={() => setNotificationDialogOpen(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {notificationDialogOpen === 'newVoucher' && 'Cấu Hình Thông Báo Voucher Mới'}
              {notificationDialogOpen === 'expiration' && 'Cấu Hình Cảnh Báo Hết Hạn'}
              {notificationDialogOpen === 'dailyReport' && 'Cấu Hình Báo Cáo Hàng Ngày'}
            </DialogTitle>
            <DialogDescription>
              Điều chỉnh cài đặt thông báo cho tính năng này.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Kích hoạt thông báo</Label>
              <Switch
                checked={currentSettings.enabled}
                onCheckedChange={(checked) => {
                  if (notificationDialogOpen === 'newVoucher') {
                    setNotificationSettings(prev => ({
                      ...prev,
                      newVoucher: { ...prev.newVoucher, enabled: checked }
                    }));
                  } else if (notificationDialogOpen === 'expiration') {
                    setNotificationSettings(prev => ({
                      ...prev,
                      expiration: { ...prev.expiration, enabled: checked }
                    }));
                  } else if (notificationDialogOpen === 'dailyReport') {
                    setNotificationSettings(prev => ({
                      ...prev,
                      dailyReport: { ...prev.dailyReport, enabled: checked }
                    }));
                  }
                }}
              />
            </div>

            {notificationDialogOpen === 'expiration' && 'days' in currentSettings && (
              <div>
                <Label>Số ngày cảnh báo trước</Label>
                <Input
                  type="number"
                  value={currentSettings.days}
                  onChange={(e) => 
                    setNotificationSettings(prev => ({
                      ...prev,
                      expiration: { ...prev.expiration, days: Number(e.target.value) }
                    }))
                  }
                  className="mt-1"
                />
              </div>
            )}

            {notificationDialogOpen === 'dailyReport' && 'time' in currentSettings && (
              <div>
                <Label>Thời gian gửi báo cáo</Label>
                <Input
                  type="time"
                  value={currentSettings.time}
                  onChange={(e) => 
                    setNotificationSettings(prev => ({
                      ...prev,
                      dailyReport: { ...prev.dailyReport, time: e.target.value }
                    }))
                  }
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label>Người nhận thông báo</Label>
              <Select
                value={currentSettings.recipients?.[0] || ''}
                onValueChange={(value) => {
                  if (notificationDialogOpen === 'newVoucher') {
                    setNotificationSettings(prev => ({
                      ...prev,
                      newVoucher: { ...prev.newVoucher, recipients: [value] }
                    }));
                  } else if (notificationDialogOpen === 'expiration') {
                    setNotificationSettings(prev => ({
                      ...prev,
                      expiration: { ...prev.expiration, recipients: [value] }
                    }));
                  } else if (notificationDialogOpen === 'dailyReport') {
                    setNotificationSettings(prev => ({
                      ...prev,
                      dailyReport: { ...prev.dailyReport, recipients: [value] }
                    }));
                  }
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn người nhận" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                  <SelectItem value="telesales">Telesales</SelectItem>
                  <SelectItem value="customer">Khách hàng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(notificationDialogOpen === 'newVoucher') && 'method' in currentSettings && (
              <div>
                <Label>Phương thức thông báo</Label>
                <Select
                  value={currentSettings.method || 'email'}
                  onValueChange={(value) => 
                    setNotificationSettings(prev => ({
                      ...prev,
                      newVoucher: { ...prev.newVoucher, method: value }
                    }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="both">Cả email và SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNotificationDialogOpen(null)}>
              Hủy
            </Button>
            <Button variant="default" onClick={() => handleNotificationUpdate(notificationDialogOpen, currentSettings)}>
              Lưu Thay Đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold theme-text">Cài Đặt Module Voucher</h2>
          <p className="theme-text-muted">Cấu hình và tùy chỉnh module voucher</p>
        </div>
        <Button onClick={handleSaveSettings} variant="default">
          <Save className="w-4 h-4 mr-2" />
          Lưu Cài Đặt
        </Button>
      </div>

      <Tabs defaultValue="template-management" className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="template-management">
              Quản Lý Template
            </TabsTrigger>
            <TabsTrigger value="issue-rules">
              Quy Tắc Phát Voucher
            </TabsTrigger>
            <TabsTrigger value="system-config">
              Cấu Hình Hệ Thống
            </TabsTrigger>
            <TabsTrigger value="permissions">
              Quyền Hạn & Thông Báo
            </TabsTrigger>
          </TabsList>
        </div>

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

        <TabsContent value="issue-rules" className="space-y-6">
          <VoucherIssueRulesConditions 
            onSettingsChange={(settings) => {
              console.log('Issue rules settings:', settings);
            }}
          />
        </TabsContent>

        <TabsContent value="system-config" className="space-y-6">
          <VoucherSettingsConfig />
        </TabsContent>

        <TabsContent value="permissions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="voucher-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 theme-text">
                  <Shield className="w-5 h-5 theme-text-primary" />
                  <span>Cài Đặt Quyền Hạn</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="font-medium theme-text">Telesales Có Thể Xem Tất Cả Voucher</label>
                      <p className="text-sm theme-text-muted">Cho phép xem voucher của người khác</p>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          permissionSettings.viewAllVouchers.enabled 
                            ? 'berry-success-light' 
                            : 'berry-error-light'
                        }`}>
                          {permissionSettings.viewAllVouchers.enabled ? 'Đã kích hoạt' : 'Đã tắt'}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPermissionDialogOpen('viewAllVouchers')}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Cập Nhật
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="font-medium theme-text">Yêu Cầu Phê Duyệt Voucher Cao Giá Trị</label>
                      <p className="text-sm theme-text-muted">
                        Voucher trên {permissionSettings.approvalRequired.threshold.toLocaleString()}đ cần phê duyệt
                      </p>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          permissionSettings.approvalRequired.enabled 
                            ? 'berry-warning-light' 
                            : 'berry-info-light'
                        }`}>
                          {permissionSettings.approvalRequired.enabled ? 'Yêu cầu phê duyệt' : 'Không yêu cầu'}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPermissionDialogOpen('approvalRequired')}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Cập Nhật
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="font-medium theme-text">Cho Phép Cấp Lại Voucher</label>
                      <p className="text-sm theme-text-muted">Nhân viên có thể cấp lại voucher</p>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          permissionSettings.reissueVouchers.enabled 
                            ? 'berry-info-light' 
                            : 'berry-error-light'
                        }`}>
                          {permissionSettings.reissueVouchers.enabled ? 'Cho phép' : 'Không cho phép'}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPermissionDialogOpen('reissueVouchers')}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Cập Nhật
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="voucher-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 theme-text">
                  <Bell className="w-5 h-5 theme-text-primary" />
                  <span>Cài Đặt Thông Báo</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="font-medium theme-text">Thông Báo Voucher Mới</label>
                      <p className="text-sm theme-text-muted">Thông báo khi có voucher được phát hành</p>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          notificationSettings.newVoucher.enabled 
                            ? 'berry-success-light' 
                            : 'berry-error-light'
                        }`}>
                          {notificationSettings.newVoucher.enabled ? 'Đã bật' : 'Đã tắt'}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setNotificationDialogOpen('newVoucher')}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Cập Nhật
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="font-medium theme-text">Cảnh Báo Voucher Hết Hạn</label>
                      <p className="text-sm theme-text-muted">
                        Thông báo trước {notificationSettings.expiration.days} ngày khi voucher hết hạn
                      </p>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          notificationSettings.expiration.enabled 
                            ? 'berry-warning-light' 
                            : 'berry-error-light'
                        }`}>
                          {notificationSettings.expiration.enabled ? 'Đã bật cảnh báo' : 'Đã tắt'}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setNotificationDialogOpen('expiration')}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Cập Nhật
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="font-medium theme-text">Báo Cáo Hàng Ngày</label>
                      <p className="text-sm theme-text-muted">
                        Gửi báo cáo tự động lúc {notificationSettings.dailyReport.time}
                      </p>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          notificationSettings.dailyReport.enabled 
                            ? 'berry-info-light' 
                            : 'berry-error-light'
                        }`}>
                          {notificationSettings.dailyReport.enabled ? 'Đã bật' : 'Đã tắt'}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setNotificationDialogOpen('dailyReport')}
                    >
                      <Edit className="w-4 h-4 mr-1" />
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

      {/* Dialogs */}
      {renderPermissionDialog()}
      {renderNotificationDialog()}
    </div>
  );
}
