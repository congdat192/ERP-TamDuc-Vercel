
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginPage as LoginComponent } from '@/components/pages/LoginPage';
import { useAuth } from '@/components/auth/AuthContext';
import { useEffect } from 'react';

export function LoginPage() {
  const { isAuthenticated, currentUser, login } = useAuth();
  const navigate = useNavigate();

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

      // Redirect based on user role
      if (currentUser.role === 'platform-admin') {
        navigate('/platformadmin');
      } else {
        // Redirect to business selection page instead of direct ERP
        navigate('/business-selection');
      }
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
