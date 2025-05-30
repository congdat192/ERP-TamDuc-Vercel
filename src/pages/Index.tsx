
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

export type PageType = 'dashboard' | 'issue-voucher' | 'voucher-list' | 'analytics' | 'leaderboard' | 'customer-list' | 'settings';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        <main className="flex-1 overflow-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default Index;
