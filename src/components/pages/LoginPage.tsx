
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mockUsers } from '@/data/erpConfig';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ tài khoản và mật khẩu');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const user = mockUsers.find(u => u.username === username);
      if (user && password === 'demo123') {
        onLogin(username, password);
      } else {
        setError('Tài khoản hoặc mật khẩu không chính xác');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleQuickLogin = (userType: string) => {
    setUsername(userType);
    setPassword('demo123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Company Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ERP System</h1>
          <p className="text-gray-600">Hệ Thống Quản Lý Tổng Hợp Doanh Nghiệp</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Đăng Nhập Hệ Thống
            </CardTitle>
            <p className="text-sm text-gray-600 text-center">
              Chọn loại tài khoản để kiểm tra giao diện và phân quyền
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Tên Đăng Nhập
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mật Khẩu
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 w-11"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Đang Đăng Nhập...' : 'Đăng Nhập'}
              </Button>
            </form>

            {/* Quick Login Options */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">
                Tài khoản demo cho kiểm tra UI và phân quyền:
              </p>
              
              <div className="space-y-2">
                {mockUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    size="sm"
                    className="w-full justify-between text-xs h-auto py-2"
                    onClick={() => handleQuickLogin(user.username)}
                    disabled={isLoading}
                  >
                    <div className="text-left">
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-gray-500">{user.username}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-600">
                        {user.role === 'erp-admin' ? 'Quản Trị ERP' :
                         user.role === 'voucher-admin' ? 'Quản Lý Voucher' :
                         user.role === 'telesales' ? 'Nhân Viên' : 'Tùy Chỉnh'}
                      </div>
                      <div className="text-gray-500">demo123</div>
                    </div>
                  </Button>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  <strong>Lưu ý:</strong> Tất cả tài khoản demo sử dụng mật khẩu "demo123". 
                  Mỗi loại tài khoản có quyền truy cập module khác nhau để kiểm tra phân quyền.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            © 2024 ERP System. Demo UI v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
