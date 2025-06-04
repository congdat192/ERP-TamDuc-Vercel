
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  loginAttempts: number;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    fullName: 'Quản Trị Viên',
    role: 'erp-admin',
    email: 'admin@company.com',
    phone: '0901234567',
    status: 'active',
    notes: 'System Administrator',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-05-29T14:30:00'),
    emailVerified: true,
    permissions: {
      modules: ['dashboard', 'voucher', 'customers', 'sales', 'inventory', 'accounting', 'hr', 'system-settings', 'user-management', 'audit-log', 'role-permissions'],
      voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
      canManageUsers: true,
      canViewAllVouchers: true
    },
    securitySettings: {
      twoFactorEnabled: true,
      loginAttemptLimit: 5,
      passwordChangeRequired: false,
      lastPasswordChange: new Date('2024-01-15'),
      sessionTimeoutMinutes: 480
    },
    activities: []
  },
  {
    id: '2',
    username: 'voucher_admin',
    fullName: 'Quản Lý Voucher',
    role: 'voucher-admin',
    email: 'voucher.admin@company.com',
    phone: '0901234568',
    status: 'active',
    notes: 'Voucher Module Manager',
    createdAt: new Date('2024-02-10'),
    lastLogin: new Date('2024-05-29T16:45:00'),
    emailVerified: true,
    permissions: {
      modules: ['dashboard', 'voucher'],
      voucherFeatures: ['voucher-dashboard', 'campaign-management', 'issue-voucher', 'voucher-list', 'voucher-analytics', 'voucher-leaderboard', 'voucher-settings'],
      canManageUsers: false,
      canViewAllVouchers: true
    },
    securitySettings: {
      twoFactorEnabled: false,
      loginAttemptLimit: 3,
      passwordChangeRequired: false,
      sessionTimeoutMinutes: 240
    },
    activities: []
  },
  {
    id: '3',
    username: 'telesales',
    fullName: 'Nhân Viên Telesales',
    role: 'telesales',
    email: 'telesales@company.com',
    phone: '0901234569',
    status: 'locked',
    notes: 'Telesales Staff - Temporary Lock',
    createdAt: new Date('2024-03-05'),
    lastLogin: new Date('2024-05-25T09:15:00'),
    emailVerified: true,
    permissions: {
      modules: ['dashboard', 'customers', 'sales'],
      voucherFeatures: ['voucher-dashboard', 'issue-voucher', 'voucher-list', 'voucher-leaderboard'],
      canManageUsers: false,
      canViewAllVouchers: false
    },
    securitySettings: {
      twoFactorEnabled: false,
      loginAttemptLimit: 3,
      passwordChangeRequired: true,
      sessionTimeoutMinutes: 120
    },
    activities: []
  },
  {
    id: '4',
    username: 'custom',
    fullName: 'Người Dùng Tùy Chỉnh',
    role: 'custom',
    email: 'custom@company.com',
    phone: '0901234570',
    status: 'pending_verification',
    notes: 'New employee - pending email verification',
    createdAt: new Date('2024-05-28'),
    lastLogin: undefined,
    emailVerified: false,
    permissions: {
      modules: ['dashboard'],
      voucherFeatures: [],
      canManageUsers: false,
      canViewAllVouchers: false
    },
    securitySettings: {
      twoFactorEnabled: false,
      loginAttemptLimit: 3,
      passwordChangeRequired: true,
      sessionTimeoutMinutes: 120
    },
    activities: []
  },
  {
    id: '5',
    username: 'platform_admin',
    fullName: 'Quản Trị Nền Tảng',
    role: 'platform-admin',
    email: 'platform.admin@company.com',
    phone: '0901234571',
    status: 'active',
    notes: 'Platform Super Administrator',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date('2024-05-30T10:00:00'),
    emailVerified: true,
    permissions: {
      modules: ['platform-admin'],
      voucherFeatures: [],
      canManageUsers: true,
      canViewAllVouchers: true
    },
    securitySettings: {
      twoFactorEnabled: true,
      loginAttemptLimit: 5,
      passwordChangeRequired: false,
      lastPasswordChange: new Date('2024-01-01'),
      sessionTimeoutMinutes: 480
    },
    activities: []
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const { toast } = useToast();

  // Check for remembered login on component mount
  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      try {
        const userData = JSON.parse(rememberedUser);
        const user = mockUsers.find(u => u.username === userData.username);
        if (user) {
          setCurrentUser(user);
          setIsLoggedIn(true);
          toast({
            title: "Đăng nhập tự động",
            description: `Chào mừng bạn trở lại, ${user.fullName}!`,
          });
        }
      } catch (error) {
        localStorage.removeItem('rememberedUser');
      }
    }
  }, [toast]);

  const login = async (username: string, password: string, rememberMe?: boolean): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by username for demo purposes
    const user = mockUsers.find(u => u.username === username);
    if (user) {
      // Reset login attempts on successful login
      setLoginAttempts(0);
      setCurrentUser(user);
      setIsLoggedIn(true);
      
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({ username: user.username }));
      }
      
      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng bạn trở lại, ${user.fullName}!`,
      });
      
      setIsLoading(false);
      return true;
    } else {
      // Increment login attempts
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        toast({
          title: "Tài khoản bị khóa",
          description: "Quá nhiều lần đăng nhập thất bại. Tài khoản đã bị khóa tạm thời.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Đăng nhập thất bại",
          description: `Tên đăng nhập hoặc mật khẩu không đúng. Còn lại ${3 - newAttempts} lần thử.`,
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    // Clear remembered login
    localStorage.removeItem('rememberedUser');
    
    setIsLoggedIn(false);
    setCurrentUser(null);
    setLoginAttempts(0);
    
    toast({
      title: "Đăng xuất thành công",
      description: "Bạn đã đăng xuất khỏi hệ thống. Hẹn gặp lại!",
      duration: 3000,
    });
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoggedIn,
      isLoading,
      loginAttempts,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
