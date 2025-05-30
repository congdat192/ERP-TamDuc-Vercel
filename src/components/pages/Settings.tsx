
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  User, 
  Bell, 
  Shield, 
  Key,
  Save,
  Eye,
  EyeOff,
  Camera
} from 'lucide-react';

export function Settings() {
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    desktop: true,
    voucherExpiry: true,
    newCustomer: false
  });

  const [profile, setProfile] = useState({
    fullName: 'Nguyễn Văn Quản',
    email: 'nguyen.van.quan@company.com',
    phone: '0901234567',
    position: 'Quản Trị Viên',
    department: 'Bộ Phận IT',
    bio: 'Quản trị viên hệ thống với 5 năm kinh nghiệm trong lĩnh vực CRM và telesales.'
  });

  const handleSaveProfile = () => {
    toast({
      title: "Cập Nhật Thành Công",
      description: "Thông tin cá nhân đã được lưu.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Cài Đặt Đã Lưu",
      description: "Tùy chọn thông báo đã được cập nhật.",
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Đổi Mật Khẩu Thành Công",
      description: "Mật khẩu của bạn đã được thay đổi.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Cài Đặt Cá Nhân</h2>
        <p className="text-gray-600">Quản lý thông tin tài khoản và tùy chọn cá nhân</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Hồ Sơ</TabsTrigger>
          <TabsTrigger value="notifications">Thông Báo</TabsTrigger>
          <TabsTrigger value="security">Bảo Mật</TabsTrigger>
          <TabsTrigger value="preferences">Tùy Chọn</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Thông Tin Cá Nhân</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                      QT
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
                  <h3 className="text-lg font-semibold">{profile.fullName}</h3>
                  <p className="text-gray-600">{profile.position}</p>
                  <Badge variant="secondary" className="mt-1">
                    {profile.department}
                  </Badge>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Họ và Tên</Label>
                    <Input
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Số Điện Thoại</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="position">Chức Vụ</Label>
                    <Input
                      id="position"
                      value={profile.position}
                      onChange={(e) => setProfile({...profile, position: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="department">Bộ Phận</Label>
                    <Select value={profile.department} onValueChange={(value) => 
                      setProfile({...profile, department: value})
                    }>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bộ Phận IT">Bộ Phận IT</SelectItem>
                        <SelectItem value="Bộ Phận Telesales">Bộ Phận Telesales</SelectItem>
                        <SelectItem value="Bộ Phận Quản Lý">Bộ Phận Quản Lý</SelectItem>
                        <SelectItem value="Bộ Phận Marketing">Bộ Phận Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Giới Thiệu</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleSaveProfile}>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu Thay Đổi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Cài Đặt Thông Báo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Thông Báo Email</h4>
                    <p className="text-sm text-gray-600">Nhận thông báo qua email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, email: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Thông Báo SMS</h4>
                    <p className="text-sm text-gray-600">Nhận thông báo qua tin nhắn</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, sms: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Thông Báo Màn Hình</h4>
                    <p className="text-sm text-gray-600">Hiển thị thông báo trên trình duyệt</p>
                  </div>
                  <Switch
                    checked={notifications.desktop}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, desktop: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Cảnh Báo Voucher Hết Hạn</h4>
                    <p className="text-sm text-gray-600">Thông báo khi voucher sắp hết hạn</p>
                  </div>
                  <Switch
                    checked={notifications.voucherExpiry}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, voucherExpiry: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Khách Hàng Mới</h4>
                    <p className="text-sm text-gray-600">Thông báo khi có khách hàng mới đăng ký</p>
                  </div>
                  <Switch
                    checked={notifications.newCustomer}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, newCustomer: checked})
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleSaveNotifications}>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu Cài Đặt
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="w-5 h-5" />
                  <span>Đổi Mật Khẩu</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Mật Khẩu Hiện Tại</Label>
                  <div className="relative mt-1">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu hiện tại"
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

                <div>
                  <Label htmlFor="newPassword">Mật Khẩu Mới</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Xác Nhận Mật Khẩu</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    className="mt-1"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={handleChangePassword}>
                    <Key className="w-4 h-4 mr-2" />
                    Đổi Mật Khẩu
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Bảo Mật Tài Khoản</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Xác Thực Hai Bước</h4>
                    <p className="text-sm text-gray-600">Tăng cường bảo mật với xác thực qua SMS</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Đăng Xuất Tự Động</h4>
                    <p className="text-sm text-gray-600">Tự động đăng xuất sau 30 phút không hoạt động</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Lịch Sử Đăng Nhập</h4>
                    <p className="text-sm text-gray-600">Ghi lại các lần đăng nhập vào hệ thống</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Tùy Chọn Cá Nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="language">Ngôn Ngữ</Label>
                  <Select defaultValue="vi">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Múi Giờ</Label>
                  <Select defaultValue="asia-ho-chi-minh">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-ho-chi-minh">Hồ Chí Minh (GMT+7)</SelectItem>
                      <SelectItem value="asia-bangkok">Bangkok (GMT+7)</SelectItem>
                      <SelectItem value="asia-singapore">Singapore (GMT+8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dateFormat">Định Dạng Ngày</Label>
                  <Select defaultValue="dd-mm-yyyy">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="currency">Đơn Vị Tiền Tệ</Label>
                  <Select defaultValue="vnd">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vnd">VND (đ)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Giao Diện Tối</h4>
                    <p className="text-sm text-gray-600">Sử dụng giao diện tối cho hệ thống</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Âm Thanh Thông Báo</h4>
                    <p className="text-sm text-gray-600">Phát âm thanh khi có thông báo mới</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu Tùy Chọn
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
