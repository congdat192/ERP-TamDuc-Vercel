import { useState, useEffect } from 'react';
import { ERPLayout } from '@/components/layout/ERPLayout';
import { LoginPage } from '@/components/pages/LoginPage';
import { ERPHome } from './ERPHome';
import { ModuleEmptyState } from '@/components/pages/ModuleEmptyState';

// Platform Admin module
import { PlatformAdmin } from '@/modules/platform-admin';

// Voucher module pages
import { VoucherDashboard } from '@/modules/voucher/pages/VoucherDashboard';
import { VoucherIssue } from '@/modules/voucher/pages/VoucherIssue';
import { VoucherList } from '@/modules/voucher/pages/VoucherList';
import { VoucherAnalytics } from '@/modules/voucher/pages/VoucherAnalytics';
import { VoucherLeaderboard } from '@/modules/voucher/pages/VoucherLeaderboard';
import { VoucherSettings } from '@/modules/voucher/pages/VoucherSettings';

// Admin module pages
import { AuditLog } from '@/modules/admin/pages/AuditLog';
import { RolePermissions } from '@/modules/admin/pages/RolePermissions';
import { SystemSettings } from '@/modules/admin/pages/SystemSettings';
import { UserManagement } from '@/modules/admin/pages/UserManagement';
import { SecuritySettings } from '@/modules/admin/pages/SecuritySettings';

import { ERPModule, VoucherFeature, User } from '@/types/auth';
import { DEFAULT_PERMISSIONS } from '@/constants/permissions';
import { useKeyboardShortcuts } from '@/components/ui/keyboard-shortcuts';
import { PageTransition } from '@/components/ui/page-transitions';
import { useToast } from '@/hooks/use-toast';

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
    permissions: DEFAULT_PERMISSIONS['erp-admin'],
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
    permissions: DEFAULT_PERMISSIONS['voucher-admin'],
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
    permissions: DEFAULT_PERMISSIONS['telesales'],
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
    permissions: DEFAULT_PERMISSIONS['custom'],
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
    permissions: DEFAULT_PERMISSIONS['platform-admin'],
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

const Index = () => {
  const [currentModule, setCurrentModule] = useState<ERPModule>('dashboard');
  const [currentVoucherPage, setCurrentVoucherPage] = useState<VoucherFeature>('voucher-dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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
          setCurrentModule('dashboard');
          toast({
            title: "Đăng nhập tự động",
            description: `Chào mừng bạn trở lại, ${user.fullName}!`,
          });
        }
      } catch (error) {
        localStorage.removeItem('rememberedUser');
      }
    }
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+h': () => {
      if (isLoggedIn) {
        setCurrentModule('dashboard');
        toast({
          title: "Điều hướng",
          description: "Đã chuyển về trang chủ",
        });
      }
    },
    'ctrl+d': () => {
      if (isLoggedIn) {
        setCurrentModule('dashboard');
        toast({
          title: "Điều hướng", 
          description: "Đã mở Dashboard",
        });
      }
    },
    'ctrl+u': () => {
      if (isLoggedIn && currentUser?.permissions.modules.includes('user-management')) {
        setCurrentModule('user-management');
        toast({
          title: "Điều hướng",
          description: "Đã mở Quản lý người dùng",
        });
      }
    },
    'ctrl+v': () => {
      if (isLoggedIn && currentUser?.permissions.modules.includes('voucher')) {
        setCurrentModule('voucher');
        toast({
          title: "Điều hướng",
          description: "Đã mở Module Voucher",
        });
      }
    },
    'ctrl+s': () => {
      if (isLoggedIn && currentUser?.permissions.modules.includes('system-settings')) {
        setCurrentModule('system-settings');
        toast({
          title: "Điều hướng",
          description: "Đã mở Cài đặt hệ thống",
        });
      }
    },
    '?': () => {
      if (isLoggedIn) {
        // This will be handled by the KeyboardShortcutsDialog component
      }
    }
  });

  const handleLogin = async (username: string, password: string, rememberMe?: boolean) => {
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
      setCurrentModule('dashboard');
      
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({ username: user.username }));
      }
      
      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng bạn trở lại, ${user.fullName}!`,
      });
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
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    // Clear remembered login
    localStorage.removeItem('rememberedUser');
    
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentModule('dashboard');
    setLoginAttempts(0); // Reset login attempts on logout
    
    toast({
      title: "Đăng xuất thành công",
      description: "Bạn đã đăng xuất khỏi hệ thống. Hẹn gặp lại!",
      duration: 3000,
    });
  };

  const handleModuleChange = async (module: ERPModule) => {
    setIsLoading(true);
    
    // Simulate loading for module transition
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCurrentModule(module);
    if (module === 'voucher') {
      setCurrentVoucherPage('voucher-dashboard');
    }
    
    setIsLoading(false);
  };

  if (!isLoggedIn || !currentUser) {
    return (
      <PageTransition isLoading={isLoading}>
        <LoginPage 
          onLogin={handleLogin} 
          mockUsers={mockUsers}
          loginAttempts={loginAttempts}
        />
      </PageTransition>
    );
  }

  // Platform Admin Interface - only for platform-admin role
  if (currentUser.role === 'platform-admin') {
    return (
      <PageTransition isLoading={isLoading} type="fade">
        <PlatformAdmin />
      </PageTransition>
    );
  }

  // Regular ERP Interface - for all other roles
  const renderMainContent = () => {
    if (currentModule === 'dashboard') {
      return <ERPHome currentUser={currentUser} onModuleChange={handleModuleChange} />;
    }

    if (currentModule === 'voucher') {
      switch (currentVoucherPage) {
        case 'voucher-dashboard':
          return <VoucherDashboard />;
        case 'issue-voucher':
          return <VoucherIssue />;
        case 'voucher-list':
          return <VoucherList currentUser={currentUser} />;
        case 'voucher-analytics':
          return <VoucherAnalytics />;
        case 'voucher-leaderboard':
          return <VoucherLeaderboard />;
        case 'voucher-settings':
          return <VoucherSettings />;
        default:
          return <VoucherDashboard />;
      }
    }

    // Admin module pages
    if (currentModule === 'system-settings') {
      return <SystemSettings />;
    }
    if (currentModule === 'user-management') {
      return <UserManagement />;
    }

    // Security Settings module
    if (currentModule === 'security-settings') {
      return <SecuritySettings currentUser={currentUser} onLogout={handleLogout} />;
    }

    // Other modules show empty state
    return <ModuleEmptyState module={currentModule} onBackToDashboard={() => setCurrentModule('dashboard')} />;
  };

  return (
    <ERPLayout
      currentUser={currentUser}
      currentModule={currentModule}
      currentVoucherPage={currentModule === 'voucher' ? currentVoucherPage : undefined}
      onModuleChange={handleModuleChange}
      onVoucherPageChange={currentModule === 'voucher' ? setCurrentVoucherPage : undefined}
      onLogout={handleLogout}
    >
      <PageTransition isLoading={isLoading} type="fade">
        {renderMainContent()}
      </PageTransition>
    </ERPLayout>
  );
};

export default Index;
