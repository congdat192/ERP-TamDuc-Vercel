import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoginPage as LoginComponent } from '@/components/pages/LoginPage';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function LoginPage() {
  const { isAuthenticated, currentUser, login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Show success message if just verified email
  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      toast({
        title: "Xác thực thành công",
        description: "Email của bạn đã được xác thực. Vui lòng đăng nhập.",
        duration: 6000,
      });
      // Clear query params for clean URL
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, toast]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Check for redirect URL first
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        console.log('🔄 [LoginPage] Redirecting to saved URL:', redirectUrl);
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectUrl);
        return;
      }

      // Redirect directly to ERP Dashboard (single-tenant)
      navigate('/ERP/Dashboard');
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleLogin = async (email: string, password: string, rememberMe?: boolean) => {
    const success = await login(email, password);
    if (success) {
      // Navigation will be handled by useEffect
    }
  };

  return (
    <LoginComponent 
      onLogin={handleLogin}
    />
  );
}
