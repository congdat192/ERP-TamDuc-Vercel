import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InvitationAuthFormProps {
  invitationEmail: string;
  businessName: string;
  roleName: string;
  onAuthSuccess: () => void;
}

export function InvitationAuthForm({
  invitationEmail,
  businessName,
  roleName,
  onAuthSuccess,
}: InvitationAuthFormProps) {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Register form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Login form state
  const [loginPassword, setLoginPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!fullName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập họ tên",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu phải có ít nhất 6 ký tự",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Sign up with Supabase
      const { error: signUpError } = await supabase.auth.signUp({
        email: invitationEmail,
        password: password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          toast({
            title: "Email đã được đăng ký",
            description: "Vui lòng chuyển sang tab Đăng Nhập",
            variant: "destructive",
          });
          setActiveTab('login');
          return;
        }
        throw signUpError;
      }

      toast({
        title: "Đăng ký thành công",
        description: "Đang xử lý lời mời...",
      });

      // Wait a bit for auth state to update
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Trigger accept invitation
      onAuthSuccess();
    } catch (error: any) {
      console.error('Register error:', error);
      toast({
        title: "Lỗi đăng ký",
        description: error.message || 'Có lỗi xảy ra khi đăng ký',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginPassword) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mật khẩu",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: invitationEmail,
        password: loginPassword,
      });

      if (signInError) {
        throw signInError;
      }

      toast({
        title: "Đăng nhập thành công",
        description: "Đang xử lý lời mời...",
      });

      // Wait a bit for auth state to update
      await new Promise(resolve => setTimeout(resolve, 500));

      // Trigger accept invitation
      onAuthSuccess();
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Lỗi đăng nhập",
        description: error.message || 'Email hoặc mật khẩu không đúng',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Alert>
        <Building2 className="h-4 w-4" />
        <AlertDescription>
          <div className="font-semibold mb-1">Bạn được mời tham gia</div>
          <div><strong>{businessName}</strong> với vai trò <strong>{roleName}</strong></div>
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'register' | 'login')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="register">Đăng Ký</TabsTrigger>
          <TabsTrigger value="login">Đăng Nhập</TabsTrigger>
        </TabsList>

        <TabsContent value="register" className="space-y-4 mt-4">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên *</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={invitationEmail}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email này được chỉ định trong lời mời
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912345678"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                disabled={isLoading}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Đang xử lý...
                </>
              ) : (
                'Đăng Ký và Chấp Nhận Lời Mời'
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="login" className="space-y-4 mt-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loginEmail">Email *</Label>
              <Input
                id="loginEmail"
                type="email"
                value={invitationEmail}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email này được chỉ định trong lời mời
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loginPassword">Mật khẩu *</Label>
              <Input
                id="loginPassword"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                disabled={isLoading}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Đang xử lý...
                </>
              ) : (
                'Đăng Nhập và Chấp Nhận Lời Mời'
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
