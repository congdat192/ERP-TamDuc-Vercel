
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterPage as RegisterComponent } from '@/components/pages/RegisterPage';
import { registerUser } from '@/services/registerService';
import { useToast } from '@/hooks/use-toast';

export function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
  }) => {
    setIsLoading(true);
    
    try {
      const response = await registerUser(data);
      
      toast({
        title: "Đăng ký thành công!",
        description: "Vui lòng kiểm tra email và nhấn vào link xác thực để kích hoạt tài khoản của bạn.",
      });
      
      console.log('Registration successful:', response);
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      console.error('Registration failed:', error);
      
      toast({
        title: "Đăng ký thất bại",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterComponent 
      onRegister={handleRegister}
      isLoading={isLoading}
    />
  );
}
