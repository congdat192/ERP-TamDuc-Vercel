
import { useState } from 'react';
import { QrCode, Shield, Key, Copy, Check, AlertTriangle, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { FormError, FormSuccess } from '@/components/ui/form-errors';
import { TwoFactorAuth } from '@/types/security';

interface TwoFactorAuthManagerProps {
  twoFactorAuth: TwoFactorAuth;
  onEnable2FA: (code: string) => void;
  onDisable2FA: () => void;
  onGenerateNewCodes: () => void;
}

export const TwoFactorAuthManager = ({
  twoFactorAuth,
  onEnable2FA,
  onDisable2FA,
  onGenerateNewCodes
}: TwoFactorAuthManagerProps) => {
  const [setupDialogOpen, setSetupDialogOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleEnable2FA = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Vui lòng nhập mã xác thực 6 chữ số');
      return;
    }

    setError('');
    onEnable2FA(verificationCode);
    setSuccess('Xác thực 2 bước đã được kích hoạt thành công!');
    setVerificationCode('');
    
    setTimeout(() => {
      setSetupDialogOpen(false);
      setSuccess('');
    }, 2000);
  };

  const handleDisable2FA = () => {
    onDisable2FA();
    setSuccess('Xác thực 2 bước đã được tắt');
    setTimeout(() => setSuccess(''), 3000);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleGenerateNewCodes = () => {
    onGenerateNewCodes();
    setSuccess('Mã dự phòng mới đã được tạo');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="space-y-6">
      {success && <FormSuccess message={success} />}
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                twoFactorAuth.enabled ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Shield className={`w-5 h-5 ${
                  twoFactorAuth.enabled ? 'text-green-600' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <CardTitle className="text-lg">Xác Thực 2 Bước (2FA)</CardTitle>
                <CardDescription>
                  Tăng cường bảo mật tài khoản bằng xác thực 2 bước
                </CardDescription>
              </div>
            </div>
            <Badge variant={twoFactorAuth.enabled ? "default" : "secondary"}>
              {twoFactorAuth.enabled ? 'Đã Kích Hoạt' : 'Chưa Kích Hoạt'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Cách hoạt động:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Quét mã QR bằng ứng dụng Google Authenticator hoặc Authy</li>
                  <li>Nhập mã 6 chữ số từ ứng dụng khi đăng nhập</li>
                  <li>Lưu mã dự phòng ở nơi an toàn</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            {!twoFactorAuth.enabled ? (
              <Dialog open={setupDialogOpen} onOpenChange={setSetupDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Shield className="w-4 h-4 mr-2" />
                    Kích Hoạt 2FA
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Thiết Lập Xác Thực 2 Bước</DialogTitle>
                    <DialogDescription>
                      Làm theo các bước dưới đây để kích hoạt xác thực 2 bước
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="qr" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="qr">Quét Mã QR</TabsTrigger>
                      <TabsTrigger value="manual">Nhập Thủ Công</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="qr" className="space-y-4">
                      <div className="text-center">
                        <div className="bg-white p-4 rounded-lg border inline-block">
                          <img 
                            src={twoFactorAuth.qrCodeUrl} 
                            alt="QR Code for 2FA setup"
                            className="w-48 h-48 mx-auto"
                          />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Quét mã QR này bằng ứng dụng Google Authenticator
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="manual" className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <Label className="text-sm font-medium">Mã Bí Mật:</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="bg-white px-2 py-1 rounded text-sm font-mono flex-1">
                            JBSWY3DPEHPK3PXP
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard('JBSWY3DPEHPK3PXP')}
                          >
                            {copiedCode === 'JBSWY3DPEHPK3PXP' ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          Nhập mã này vào ứng dụng xác thực của bạn
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="verification-code">Mã Xác Thực (6 chữ số)</Label>
                      <Input
                        id="verification-code"
                        type="text"
                        placeholder="123456"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Nhập mã 6 chữ số từ ứng dụng xác thực
                      </p>
                    </div>
                    
                    {error && <FormError message={error} />}
                    {success && <FormSuccess message={success} />}
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSetupDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button onClick={handleEnable2FA}>
                      Kích Hoạt 2FA
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Shield className="w-4 h-4 mr-2" />
                    Tắt 2FA
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <span>Tắt Xác Thực 2 Bước</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn tắt xác thực 2 bước? 
                      Điều này sẽ làm giảm bảo mật tài khoản của bạn.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDisable2FA}>
                      Tắt 2FA
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>

      {twoFactorAuth.enabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>Mã Dự Phòng</span>
            </CardTitle>
            <CardDescription>
              Lưu các mã này ở nơi an toàn. Bạn có thể sử dụng chúng để đăng nhập khi không có thiết bị xác thực.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {twoFactorAuth.backupCodes.map((code, index) => (
                <div key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                  <code className="font-mono text-sm flex-1">{code}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(code)}
                    className="h-6 w-6 p-0"
                  >
                    {copiedCode === code ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
            
            <Button variant="outline" onClick={handleGenerateNewCodes}>
              <Key className="w-4 h-4 mr-2" />
              Tạo Mã Mới
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
