import { useState } from 'react';
import { ERPLayout } from '@/components/layout/ERPLayout';
import { LoginPage } from '@/components/pages/LoginPage';
import { ERPHome } from './ERPHome';
import { ModuleEmptyState } from '@/components/pages/ModuleEmptyState';

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

import { ERPModule, VoucherFeature, User } from '@/types/auth';
import { DEFAULT_PERMISSIONS } from '@/constants/permissions';

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
  }
];

const Index = () => {
  const [currentModule, setCurrentModule] = useState<ERPModule>('dashboard');
  const [currentVoucherPage, setCurrentVoucherPage] = useState<VoucherFeature>('voucher-dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (username: string, password: string) => {
    // Find user by username for demo purposes
    const user = mockUsers.find(u => u.username === username);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setCurrentModule('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentModule('dashboard');
  };

  const handleModuleChange = (module: ERPModule) => {
    setCurrentModule(module);
    if (module === 'voucher') {
      setCurrentVoucherPage('voucher-dashboard');
    }
  };

  if (!isLoggedIn || !currentUser) {
    return <LoginPage onLogin={handleLogin} mockUsers={mockUsers} />;
  }

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
      {renderMainContent()}
    </ERPLayout>
  );
};

export default Index;
