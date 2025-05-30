
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Building2, Eye, EyeOff } from 'lucide-react';
import { User as UserType } from '@/types/auth';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
  mockUsers: UserType[];
}

export function LoginPage({ onLogin, mockUsers }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username, password);
    }
  };

  const handleQuickLogin = (userType: string) => {
    const user = mockUsers.find(u => u.username === userType);
    if (user) {
      setUsername(user.username);
      setPassword('demo');
      onLogin(user.username, 'demo');
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'erp-admin': return 'Quản Trị ERP';
      case 'voucher-admin': return 'Quản Lý Voucher';
      case 'telesales': return 'Nhân Viên Telesales';
      case 'custom': return 'Vai Trò Tùy Chỉnh';
      default: return 'Người Dùng';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'erp-admin': return 'bg-red-100 text-red-800';
      case 'voucher-admin': return 'bg-blue-100 text-blue-800';
      case 'telesales': return 'bg-green-100 text-green-800';
      case 'custom': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">ERP System</h1>
          </div>
          <h2 className="text-xl text-gray-600 mb-4">
            Hệ Thống Quản Lý Doanh Nghiệp
          </h2>
          <p className="text-gray-500 mb-8">
            Giải pháp quản lý toàn diện với kiến trúc modular, 
            hỗ trợ đa vai trò và phân quyền chi tiết.
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Quản lý voucher/khuyến mãi</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Phân quyền theo vai trò</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Giao diện responsive</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Kiến trúc modular</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Đăng Nhập</CardTitle>
            <CardDescription className="text-center">
              Chọn tài khoản demo hoặc đăng nhập thủ công
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Login Options */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Đăng Nhập Nhanh (Demo)</h3>
              <div className="grid grid-cols-1 gap-2">
                {mockUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    onClick={() => handleQuickLogin(user.username)}
                    className="justify-between h-auto p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4" />
                      <div className="text-left">
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-xs text-gray-500">{user.username}</div>
                      </div>
                    </div>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Hoặc</span>
              </div>
            </div>

            {/* Manual Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tên Đăng Nhập</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mật Khẩu</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Đăng Nhập
              </Button>
            </form>

            <div className="text-center text-xs text-gray-500">
              <p>Demo: Sử dụng bất kỳ mật khẩu nào</p>
              <p>Usernames: admin, voucher_admin, telesales, custom</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
