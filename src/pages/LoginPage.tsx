import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoginPage as LoginComponent } from '@/components/pages/LoginPage';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
      const checkEmployeeTypeAndRedirect = async () => {
        try {
          // Check if user is an employee-only account
          const { data: employee } = await supabase
            .from('employees')
            .select('is_employee_only')
            .eq('user_id', currentUser.id)
            .maybeSingle();
          
          // If employee-only, redirect to ESS
          if (employee?.is_employee_only === true) {
            console.log('👤 [LoginPage] Employee-only user, redirecting to /my-profile');
            navigate('/my-profile');
            return;
          }
          
          // Check for redirect URL first
          const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
          if (redirectUrl) {
            console.log('🔄 [LoginPage] Redirecting to saved URL:', redirectUrl);
            sessionStorage.removeItem('redirectAfterLogin');
            navigate(redirectUrl);
            return;
          }

          // Redirect to ERP Dashboard for admins/users
          console.log('👨‍💼 [LoginPage] Admin/User account, redirecting to /ERP/Dashboard');
          navigate('/ERP/Dashboard');
        } catch (error) {
          console.error('❌ [LoginPage] Error checking employee type:', error);
          // Fallback to dashboard on error
          navigate('/ERP/Dashboard');
        }
      };
      
      checkEmployeeTypeAndRedirect();
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
