
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { FormError, FormSuccess, FormLoadingState } from '@/components/ui/form-errors';
import { LoadingSpinner } from '@/components/ui/loading';
import { 
  Settings, 
  Building2, 
  Mail, 
  Shield, 
  Database, 
  Plug, 
  Save,
  Upload,
  Download,
  Camera,
  TestTube,
  Eye,
  EyeOff,
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export function SystemSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lastSaved, setLastSaved] = useState('15:30 - 20/12/2024');

  // Mock settings state
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'VoucherCRM Pro',
    companySlogan: 'Giải pháp quản lý voucher chuyên nghiệp',
    companyEmail: 'admin@vouchercrm.com',
    companyPhone: '0901234567',
    companyAddress: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
    timezone: 'Asia/Ho_Chi_Minh',
    language: 'vi',
    dateFormat: 'DD/MM/YYYY',
    currency: 'VND',
    logo: null
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'noreply@vouchercrm.com',
    smtpPassword: '',
    smtpEncryption: 'TLS',
    senderName: 'VoucherCRM Pro',
    senderEmail: 'noreply@vouchercrm.com',
    testEmail: ''
  });

  const [securitySettings, setSecuritySettings] = useState({
    minPasswordLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    enable2FA: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    forcePasswordChange: false,
    allowMultipleSessions: true
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    retentionDays: 30,
    includeFiles: true,
    compressionEnabled: true,
    lastBackup: '20/12/2024 02:00'
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    apiEnabled: true,
    apiRateLimit: 1000,
    webhookUrl: '',
    webhookSecret: '',
    enableLogging: true,
    debugMode: false
  });

  const [featureFlags, setFeatureFlags] = useState({
    voucherModule: true,
    analyticsModule: true,
    reportingModule: true,
    apiAccess: true,
    mobileApp: false,
    advancedReports: true,
    bulkOperations: true,
    dataExport: true
  });

  const handleSaveSettings = async (category: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLastSaved(new Date().toLocaleString('vi-VN'));
      toast({
        title: "Cài Đặt Đã Lưu",
        description: `Cài đặt ${category} đã được cập nhật thành công.`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu cài đặt. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestEmail = async () => {
    if (!emailSettings.testEmail) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập địa chỉ email để kiểm tra.",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Email Kiểm Tra Đã Gửi",
        description: `Email kiểm tra đã được gửi đến ${emailSettings.testEmail}`,
      });
    } catch (error) {
      toast({
        title: "Lỗi Gửi Email",
        description: "Không thể gửi email kiểm tra. Vui lòng kiểm tra cấu hình SMTP.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleExportSettings = () => {
    const settings = {
      general: generalSettings,
      email: emailSettings,
      security: securitySettings,
      backup: backupSettings,
      integration: integrationSettings,
      features: featureFlags
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast({
      title: "Xuất Cài Đặt Thành Công",
      description: "File cài đặt đã được tải xuống.",
    });
  };

  const handleImportSettings = () => {
    toast({
      title: "Chức Năng Sắp Ra Mắt",
      description: "Tính năng nhập cài đặt đang được phát triển.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Settings className="w-6 h-6" />
            <span>Cài Đặt Hệ Thống</span>
          </h2>
          <p className="text-gray-600">Quản lý cấu hình và tham số hệ thống</p>
          <p className="text-sm text-gray-500 mt-1">Lần lưu cuối: {lastSaved}</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleImportSettings}>
            <Upload className="w-4 h-4 mr-2" />
            Nhập Cài Đặt
          </Button>
          <Button variant="outline" onClick={handleExportSettings}>
            <Download className="w-4 h-4 mr-2" />
            Xuất Cài Đặt
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Chung</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Bảo Mật</TabsTrigger>
          <TabsTrigger value="backup">Sao Lưu</TabsTrigger>
          <TabsTrigger value="integration">Tích Hợp</TabsTrigger>
          <TabsTrigger value="features">Tính Năng</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <FormLoadingState isLoading={isLoading} loadingText="Đang lưu cài đặt chung...">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5" />
                    <span>Thông Tin Công Ty</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Company Logo */}
                  <div className="space-y-4">
                    <Label>Logo Công Ty</Label>
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                            VCM
                          </AvatarFallback>
                        </Avatar>
                        <Button 
                          size="sm" 
                          className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          Tải lên logo
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG tối đa 2MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Tên Công Ty</Label>
                      <Input
                        id="companyName"
                        value={generalSettings.companyName}
                        onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companySlogan">Slogan</Label>
                      <Input
                        id="companySlogan"
                        value={generalSettings.companySlogan}
                        onChange={(e) => setGeneralSettings({...generalSettings, companySlogan: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyEmail">Email Công Ty</Label>
                      <Input
                        id="companyEmail"
                        type="email"
                        value={generalSettings.companyEmail}
                        onChange={(e) => setGeneralSettings({...generalSettings, companyEmail: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyPhone">Số Điện Thoại</Label>
                      <Input
                        id="companyPhone"
                        value={generalSettings.companyPhone}
                        onChange={(e) => setGeneralSettings({...generalSettings, companyPhone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyAddress">Địa Chỉ Công Ty</Label>
                    <Textarea
                      id="companyAddress"
                      value={generalSettings.companyAddress}
                      onChange={(e) => setGeneralSettings({...generalSettings, companyAddress: e.target.value})}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cài Đặt Khu Vực</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Múi Giờ</Label>
                      <Select value={generalSettings.timezone} onValueChange={(value) => 
                        setGeneralSettings({...generalSettings, timezone: value})
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Ho_Chi_Minh">Hồ Chí Minh (GMT+7)</SelectItem>
                          <SelectItem value="Asia/Bangkok">Bangkok (GMT+7)</SelectItem>
                          <SelectItem value="Asia/Singapore">Singapore (GMT+8)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Ngôn Ngữ</Label>
                      <Select value={generalSettings.language} onValueChange={(value) => 
                        setGeneralSettings({...generalSettings, language: value})
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vi">Tiếng Việt</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Định Dạng Ngày</Label>
                      <Select value={generalSettings.dateFormat} onValueChange={(value) => 
                        setGeneralSettings({...generalSettings, dateFormat: value})
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Đơn Vị Tiền Tệ</Label>
                      <Select value={generalSettings.currency} onValueChange={(value) => 
                        setGeneralSettings({...generalSettings, currency: value})
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VND">VND (đ)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('chung')} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu Cài Đặt Chung
                </Button>
              </div>
            </div>
          </FormLoadingState>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <FormLoadingState isLoading={isLoading} loadingText="Đang lưu cài đặt email...">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Cấu Hình SMTP</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Cấu hình máy chủ SMTP để gửi email thông báo, xác thực và báo cáo từ hệ thống.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">Máy Chủ SMTP</Label>
                      <Input
                        id="smtpHost"
                        value={emailSettings.smtpHost}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">Cổng</Label>
                      <Input
                        id="smtpPort"
                        value={emailSettings.smtpPort}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpUsername">Tên Đăng Nhập</Label>
                      <Input
                        id="smtpUsername"
                        value={emailSettings.smtpUsername}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">Mật Khẩu</Label>
                      <div className="relative">
                        <Input
                          id="smtpPassword"
                          type={showPassword ? "text" : "password"}
                          value={emailSettings.smtpPassword}
                          onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtpEncryption">Mã Hóa</Label>
                      <Select value={emailSettings.smtpEncryption} onValueChange={(value) => 
                        setEmailSettings({...emailSettings, smtpEncryption: value})
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TLS">TLS</SelectItem>
                          <SelectItem value="SSL">SSL</SelectItem>
                          <SelectItem value="NONE">Không</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="senderName">Tên Người Gửi</Label>
                      <Input
                        id="senderName"
                        value={emailSettings.senderName}
                        onChange={(e) => setEmailSettings({...emailSettings, senderName: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderEmail">Email Người Gửi</Label>
                      <Input
                        id="senderEmail"
                        type="email"
                        value={emailSettings.senderEmail}
                        onChange={(e) => setEmailSettings({...emailSettings, senderEmail: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TestTube className="w-5 h-5" />
                    <span>Kiểm Tra Email</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="testEmail">Email Kiểm Tra</Label>
                      <Input
                        id="testEmail"
                        type="email"
                        placeholder="test@example.com"
                        value={emailSettings.testEmail}
                        onChange={(e) => setEmailSettings({...emailSettings, testEmail: e.target.value})}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        onClick={handleTestEmail} 
                        disabled={isTesting || !emailSettings.testEmail}
                      >
                        {isTesting ? <LoadingSpinner size="sm" className="mr-2" /> : <TestTube className="w-4 h-4 mr-2" />}
                        Gửi Email Thử
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('email')} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu Cài Đặt Email
                </Button>
              </div>
            </div>
          </FormLoadingState>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <FormLoadingState isLoading={isLoading} loadingText="Đang lưu cài đặt bảo mật...">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Chính Sách Mật Khẩu</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="minPasswordLength">Độ Dài Tối Thiểu</Label>
                      <Input
                        id="minPasswordLength"
                        type="number"
                        min="6"
                        max="50"
                        value={securitySettings.minPasswordLength}
                        onChange={(e) => setSecuritySettings({...securitySettings, minPasswordLength: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Yêu Cầu Chữ Hoa</h4>
                        <p className="text-sm text-gray-600">Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa</p>
                      </div>
                      <Switch
                        checked={securitySettings.requireUppercase}
                        onCheckedChange={(checked) => 
                          setSecuritySettings({...securitySettings, requireUppercase: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Yêu Cầu Số</h4>
                        <p className="text-sm text-gray-600">Mật khẩu phải chứa ít nhất 1 số</p>
                      </div>
                      <Switch
                        checked={securitySettings.requireNumbers}
                        onCheckedChange={(checked) => 
                          setSecuritySettings({...securitySettings, requireNumbers: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Yêu Cầu Ký Tự Đặc Biệt</h4>
                        <p className="text-sm text-gray-600">Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt</p>
                      </div>
                      <Switch
                        checked={securitySettings.requireSpecialChars}
                        onCheckedChange={(checked) => 
                          setSecuritySettings({...securitySettings, requireSpecialChars: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Bắt Buộc Đổi Mật Khẩu</h4>
                        <p className="text-sm text-gray-600">Yêu cầu người dùng đổi mật khẩu mỗi 90 ngày</p>
                      </div>
                      <Switch
                        checked={securitySettings.forcePasswordChange}
                        onCheckedChange={(checked) => 
                          setSecuritySettings({...securitySettings, forcePasswordChange: checked})
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Xác Thực & Phiên Làm Việc</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Thời Gian Phiên (phút)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        min="5"
                        max="480"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxLoginAttempts">Số Lần Đăng Nhập Tối Đa</Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        min="3"
                        max="10"
                        value={securitySettings.maxLoginAttempts}
                        onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lockoutDuration">Thời Gian Khóa (phút)</Label>
                      <Input
                        id="lockoutDuration"
                        type="number"
                        min="5"
                        max="60"
                        value={securitySettings.lockoutDuration}
                        onChange={(e) => setSecuritySettings({...securitySettings, lockoutDuration: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Xác Thực Hai Bước (2FA)</h4>
                        <p className="text-sm text-gray-600">Yêu cầu xác thực qua SMS hoặc ứng dụng</p>
                      </div>
                      <Switch
                        checked={securitySettings.enable2FA}
                        onCheckedChange={(checked) => 
                          setSecuritySettings({...securitySettings, enable2FA: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Cho Phép Nhiều Phiên</h4>
                        <p className="text-sm text-gray-600">Người dùng có thể đăng nhập từ nhiều thiết bị</p>
                      </div>
                      <Switch
                        checked={securitySettings.allowMultipleSessions}
                        onCheckedChange={(checked) => 
                          setSecuritySettings({...securitySettings, allowMultipleSessions: checked})
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('bảo mật')} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu Cài Đặt Bảo Mật
                </Button>
              </div>
            </div>
          </FormLoadingState>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup">
          <FormLoadingState isLoading={isLoading} loadingText="Đang lưu cài đặt sao lưu...">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="w-5 h-5" />
                    <span>Sao Lưu Tự Động</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Kích Hoạt Sao Lưu Tự Động</h4>
                      <p className="text-sm text-gray-600">Tự động sao lưu dữ liệu theo lịch trình</p>
                    </div>
                    <Switch
                      checked={backupSettings.autoBackup}
                      onCheckedChange={(checked) => 
                        setBackupSettings({...backupSettings, autoBackup: checked})
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">Tần Suất Sao Lưu</Label>
                      <Select value={backupSettings.backupFrequency} onValueChange={(value) => 
                        setBackupSettings({...backupSettings, backupFrequency: value})
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hàng giờ</SelectItem>
                          <SelectItem value="daily">Hàng ngày</SelectItem>
                          <SelectItem value="weekly">Hàng tuần</SelectItem>
                          <SelectItem value="monthly">Hàng tháng</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="backupTime">Thời Gian Sao Lưu</Label>
                      <Input
                        id="backupTime"
                        type="time"
                        value={backupSettings.backupTime}
                        onChange={(e) => setBackupSettings({...backupSettings, backupTime: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="retentionDays">Lưu Trữ (ngày)</Label>
                      <Input
                        id="retentionDays"
                        type="number"
                        min="7"
                        max="365"
                        value={backupSettings.retentionDays}
                        onChange={(e) => setBackupSettings({...backupSettings, retentionDays: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Bao Gồm File Đính Kèm</h4>
                        <p className="text-sm text-gray-600">Sao lưu cả file upload và hình ảnh</p>
                      </div>
                      <Switch
                        checked={backupSettings.includeFiles}
                        onCheckedChange={(checked) => 
                          setBackupSettings({...backupSettings, includeFiles: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Nén Dữ Liệu</h4>
                        <p className="text-sm text-gray-600">Nén file sao lưu để tiết kiệm dung lượng</p>
                      </div>
                      <Switch
                        checked={backupSettings.compressionEnabled}
                        onCheckedChange={(checked) => 
                          setBackupSettings({...backupSettings, compressionEnabled: checked})
                        }
                      />
                    </div>
                  </div>

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Lần sao lưu cuối: {backupSettings.lastBackup}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Tải Bản Sao Lưu
                </Button>
                <Button onClick={() => handleSaveSettings('sao lưu')} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu Cài Đặt Sao Lưu
                </Button>
              </div>
            </div>
          </FormLoadingState>
        </TabsContent>

        {/* Integration Settings */}
        <TabsContent value="integration">
          <FormLoadingState isLoading={isLoading} loadingText="Đang lưu cài đặt tích hợp...">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plug className="w-5 h-5" />
                    <span>API & Webhook</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Kích Hoạt API</h4>
                      <p className="text-sm text-gray-600">Cho phép truy cập qua REST API</p>
                    </div>
                    <Switch
                      checked={integrationSettings.apiEnabled}
                      onCheckedChange={(checked) => 
                        setIntegrationSettings({...integrationSettings, apiEnabled: checked})
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="apiRateLimit">Giới Hạn Request/giờ</Label>
                      <Input
                        id="apiRateLimit"
                        type="number"
                        value={integrationSettings.apiRateLimit}
                        onChange={(e) => setIntegrationSettings({...integrationSettings, apiRateLimit: parseInt(e.target.value)})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="webhookUrl">Webhook URL</Label>
                      <Input
                        id="webhookUrl"
                        placeholder="https://your-app.com/webhook"
                        value={integrationSettings.webhookUrl}
                        onChange={(e) => setIntegrationSettings({...integrationSettings, webhookUrl: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="webhookSecret">Webhook Secret</Label>
                      <Input
                        id="webhookSecret"
                        type="password"
                        value={integrationSettings.webhookSecret}
                        onChange={(e) => setIntegrationSettings({...integrationSettings, webhookSecret: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Ghi Log API</h4>
                        <p className="text-sm text-gray-600">Lưu trữ log các request API</p>
                      </div>
                      <Switch
                        checked={integrationSettings.enableLogging}
                        onCheckedChange={(checked) => 
                          setIntegrationSettings({...integrationSettings, enableLogging: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Chế Độ Debug</h4>
                        <p className="text-sm text-gray-600">Hiển thị thông tin debug chi tiết</p>
                      </div>
                      <Switch
                        checked={integrationSettings.debugMode}
                        onCheckedChange={(checked) => 
                          setIntegrationSettings({...integrationSettings, debugMode: checked})
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('tích hợp')} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu Cài Đặt Tích Hợp
                </Button>
              </div>
            </div>
          </FormLoadingState>
        </TabsContent>

        {/* Feature Flags */}
        <TabsContent value="features">
          <FormLoadingState isLoading={isLoading} loadingText="Đang lưu cài đặt tính năng...">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quản Lý Tính Năng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Bật/tắt các tính năng của hệ thống. Một số thay đổi có thể yêu cầu khởi động lại.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Module Voucher</h4>
                        <p className="text-sm text-gray-600">Quản lý voucher và telesales</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={featureFlags.voucherModule ? "default" : "secondary"}>
                          {featureFlags.voucherModule ? "Hoạt động" : "Tắt"}
                        </Badge>
                        <Switch
                          checked={featureFlags.voucherModule}
                          onCheckedChange={(checked) => 
                            setFeatureFlags({...featureFlags, voucherModule: checked})
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Module Phân Tích</h4>
                        <p className="text-sm text-gray-600">Dashboard và báo cáo</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={featureFlags.analyticsModule ? "default" : "secondary"}>
                          {featureFlags.analyticsModule ? "Hoạt động" : "Tắt"}
                        </Badge>
                        <Switch
                          checked={featureFlags.analyticsModule}
                          onCheckedChange={(checked) => 
                            setFeatureFlags({...featureFlags, analyticsModule: checked})
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Module Báo Cáo</h4>
                        <p className="text-sm text-gray-600">Tạo và xuất báo cáo</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={featureFlags.reportingModule ? "default" : "secondary"}>
                          {featureFlags.reportingModule ? "Hoạt động" : "Tắt"}
                        </Badge>
                        <Switch
                          checked={featureFlags.reportingModule}
                          onCheckedChange={(checked) => 
                            setFeatureFlags({...featureFlags, reportingModule: checked})
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Truy Cập API</h4>
                        <p className="text-sm text-gray-600">API cho ứng dụng bên ngoài</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={featureFlags.apiAccess ? "default" : "secondary"}>
                          {featureFlags.apiAccess ? "Hoạt động" : "Tắt"}
                        </Badge>
                        <Switch
                          checked={featureFlags.apiAccess}
                          onCheckedChange={(checked) => 
                            setFeatureFlags({...featureFlags, apiAccess: checked})
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Ứng Dụng Mobile</h4>
                        <p className="text-sm text-gray-600">Hỗ trợ ứng dụng di động</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={featureFlags.mobileApp ? "default" : "secondary"}>
                          {featureFlags.mobileApp ? "Hoạt động" : "Tắt"}
                        </Badge>
                        <Switch
                          checked={featureFlags.mobileApp}
                          onCheckedChange={(checked) => 
                            setFeatureFlags({...featureFlags, mobileApp: checked})
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Báo Cáo Nâng Cao</h4>
                        <p className="text-sm text-gray-600">Báo cáo chi tiết và tùy chỉnh</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={featureFlags.advancedReports ? "default" : "secondary"}>
                          {featureFlags.advancedReports ? "Hoạt động" : "Tắt"}
                        </Badge>
                        <Switch
                          checked={featureFlags.advancedReports}
                          onCheckedChange={(checked) => 
                            setFeatureFlags({...featureFlags, advancedReports: checked})
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Thao Tác Hàng Loạt</h4>
                        <p className="text-sm text-gray-600">Xử lý nhiều bản ghi cùng lúc</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={featureFlags.bulkOperations ? "default" : "secondary"}>
                          {featureFlags.bulkOperations ? "Hoạt động" : "Tắt"}
                        </Badge>
                        <Switch
                          checked={featureFlags.bulkOperations}
                          onCheckedChange={(checked) => 
                            setFeatureFlags({...featureFlags, bulkOperations: checked})
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Xuất Dữ Liệu</h4>
                        <p className="text-sm text-gray-600">Xuất dữ liệu ra Excel, CSV</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={featureFlags.dataExport ? "default" : "secondary"}>
                          {featureFlags.dataExport ? "Hoạt động" : "Tắt"}
                        </Badge>
                        <Switch
                          checked={featureFlags.dataExport}
                          onCheckedChange={(checked) => 
                            setFeatureFlags({...featureFlags, dataExport: checked})
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('tính năng')} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu Cài Đặt Tính Năng
                </Button>
              </div>
            </div>
          </FormLoadingState>
        </TabsContent>
      </Tabs>
    </div>
  );
}
