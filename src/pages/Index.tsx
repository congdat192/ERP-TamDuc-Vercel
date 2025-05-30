import { useState } from 'react';
import { ERPMainSidebar } from '@/components/layout/ERPMainSidebar';
import { VoucherModuleSidebar } from '@/components/layout/VoucherModuleSidebar';
import { Header } from '@/components/layout/Header';
import { ERPDashboard } from '@/components/pages/ERPDashboard';
import { ModuleEmptyState } from '@/components/pages/ModuleEmptyState';
import { Dashboard } from '@/components/pages/Dashboard';
import { IssueVoucher } from '@/components/pages/IssueVoucher';
import { VoucherList } from '@/components/pages/VoucherList';
import { Analytics } from '@/components/pages/Analytics';
import { Leaderboard } from '@/components/pages/Leaderboard';
import { CustomerList } from '@/components/pages/CustomerList';
import { Settings } from '@/components/pages/Settings';
import { LoginPage } from '@/components/pages/LoginPage';
import { ERPModule, VoucherSubPage, User } from '@/types/erp';
import { mockUsers } from '@/data/erpConfig';

export type PageType = 'dashboard' | 'issue-voucher' | 'voucher-list' | 'analytics' | 'leaderboard' | 'customer-list' | 'settings' | 'user-management' | 'system-settings' | 'audit-log' | 'role-permissions';

const Index = () => {
  const [currentModule, setCurrentModule] = useState<ERPModule>('dashboard');
  const [currentVoucherPage, setCurrentVoucherPage] = useState<VoucherSubPage>('voucher-dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderMainContent = () => {
    if (currentModule === 'dashboard') {
      return <ERPDashboard currentUser={currentUser} onModuleChange={handleModuleChange} />;
    }

    if (currentModule === 'voucher') {
      switch (currentVoucherPage) {
        case 'voucher-dashboard':
          return <Dashboard />;
        case 'issue-voucher':
          return <IssueVoucher />;
        case 'voucher-list':
          return <VoucherList currentUser={currentUser} />;
        case 'voucher-analytics':
          return <Analytics />;
        case 'voucher-leaderboard':
          return <Leaderboard />;
        case 'voucher-settings':
          return <Settings />;
        default:
          return <Dashboard />;
      }
    }

    // Other modules show empty state
    return <ModuleEmptyState module={currentModule} onBackToDashboard={() => setCurrentModule('dashboard')} />;
  };

  const getPageTitle = () => {
    if (currentModule === 'dashboard') {
      return 'Tổng Quan ERP';
    }
    
    if (currentModule === 'voucher') {
      const pageTitles = {
        'voucher-dashboard': 'Tổng Quan Voucher',
        'issue-voucher': 'Phát Hành Voucher',
        'voucher-list': 'Danh Sách Voucher',
        'voucher-analytics': 'Báo Cáo Voucher',
        'voucher-leaderboard': 'Bảng Xếp Hạng',
        'voucher-settings': 'Cài Đặt Voucher'
      };
      return pageTitles[currentVoucherPage] || 'Module Voucher';
    }

    const moduleTitles = {
      customers: 'Khách Hàng',
      sales: 'Bán Hàng',
      inventory: 'Kho Hàng',
      accounting: 'Kế Toán',
      hr: 'Nhân Sự',
      'system-settings': 'Cài Đặt Hệ Thống',
      'user-management': 'Quản Lý Người Dùng'
    };
    
    return moduleTitles[currentModule as keyof typeof moduleTitles] || 'ERP System';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <ERPMainSidebar 
        currentModule={currentModule}
        onModuleChange={handleModuleChange}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentUser={currentUser}
      />
      
      {/* Voucher Module Secondary Sidebar */}
      {currentModule === 'voucher' && (
        <VoucherModuleSidebar
          currentPage={currentVoucherPage}
          onPageChange={setCurrentVoucherPage}
          currentUser={currentUser}
          onBackToModules={() => setCurrentModule('dashboard')}
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          currentPage={getPageTitle()}
          onPageChange={() => {}} // Not used in ERP mode
          onLogout={handleLogout}
          currentUser={currentUser}
        />
        <main className="flex-1 overflow-auto p-6">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
