
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Dashboard } from '@/components/pages/Dashboard';
import { IssueVoucher } from '@/components/pages/IssueVoucher';
import { VoucherList } from '@/components/pages/VoucherList';
import { Analytics } from '@/components/pages/Analytics';
import { Leaderboard } from '@/components/pages/Leaderboard';
import { CustomerList } from '@/components/pages/CustomerList';
import { Settings } from '@/components/pages/Settings';
import { UserManagement } from '@/components/pages/admin/UserManagement';
import { SystemSettings } from '@/components/pages/admin/SystemSettings';
import { AuditLog } from '@/components/pages/admin/AuditLog';
import { RolePermissions } from '@/components/pages/admin/RolePermissions';
import { LoginPage } from '@/components/pages/LoginPage';

export type PageType = 'dashboard' | 'issue-voucher' | 'voucher-list' | 'analytics' | 'leaderboard' | 'customer-list' | 'settings' | 'user-management' | 'system-settings' | 'audit-log' | 'role-permissions';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Mock user data - in real app this would come from auth context
  const [currentUser, setCurrentUser] = useState({
    username: 'admin',
    role: 'admin' as 'admin' | 'telesales',
    fullName: 'Nguyễn Văn Quản'
  });

  const handleLogin = (username: string, password: string) => {
    // Mock login logic
    if (username && password) {
      setIsLoggedIn(true);
      if (username === 'admin') {
        setCurrentUser({
          username: 'admin',
          role: 'admin',
          fullName: 'Nguyễn Văn Quản'
        });
      } else {
        setCurrentUser({
          username: username,
          role: 'telesales',
          fullName: 'Trần Thị Nhân'
        });
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'issue-voucher':
        return <IssueVoucher />;
      case 'voucher-list':
        return <VoucherList />;
      case 'analytics':
        return <Analytics />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'customer-list':
        return <CustomerList />;
      case 'settings':
        return <Settings />;
      case 'user-management':
        return <UserManagement />;
      case 'system-settings':
        return <SystemSettings />;
      case 'audit-log':
        return <AuditLog />;
      case 'role-permissions':
        return <RolePermissions />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        userRole={currentUser.role}
        currentUser={currentUser}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
        <main className="flex-1 overflow-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default Index;
