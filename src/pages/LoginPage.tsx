
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginPage as LoginComponent } from '@/components/pages/LoginPage';
import { useAuth } from '@/components/auth/AuthContext';
import { useEffect } from 'react';

export function LoginPage() {
  const { isAuthenticated, currentUser, login, loginAttempts } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
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
      loginAttempts={loginAttempts}
    />
  );
}
