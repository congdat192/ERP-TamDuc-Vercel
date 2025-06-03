
import { useState } from 'react';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { VoucherDashboard } from './pages/VoucherDashboard';
import { VoucherIssue } from './pages/VoucherIssue';
import { VoucherList } from './pages/VoucherList';
import { VoucherAnalytics } from './pages/VoucherAnalytics';
import { VoucherLeaderboard } from './pages/VoucherLeaderboard';
import { VoucherSettings } from './pages/VoucherSettings';
import { CampaignManagement } from './pages/CampaignManagement';
import { VoucherFeature } from '@/types/auth';
import { 
  LayoutDashboard, 
  Megaphone, 
  Gift, 
  List, 
  BarChart3, 
  Trophy, 
  Settings 
} from 'lucide-react';

interface VoucherModuleProps {
  currentUser: any;
  onBackToModules: () => void;
}

export function VoucherModule({ currentUser, onBackToModules }: VoucherModuleProps) {
  const [currentPage, setCurrentPage] = useState<VoucherFeature>('voucher-dashboard');

  const sidebarItems = [
    {
      id: 'voucher-dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      onClick: () => setCurrentPage('voucher-dashboard'),
      isActive: currentPage === 'voucher-dashboard'
    },
    {
      id: 'campaign-management',
      label: 'Quản Lý Chiến Dịch',
      icon: Megaphone,
      onClick: () => setCurrentPage('campaign-management'),
      isActive: currentPage === 'campaign-management'
    },
    {
      id: 'issue-voucher',
      label: 'Phát Hành Voucher',
      icon: Gift,
      onClick: () => setCurrentPage('issue-voucher'),
      isActive: currentPage === 'issue-voucher'
    },
    {
      id: 'voucher-list',
      label: 'Danh Sách Voucher',
      icon: List,
      onClick: () => setCurrentPage('voucher-list'),
      isActive: currentPage === 'voucher-list'
    },
    {
      id: 'voucher-analytics',
      label: 'Phân Tích',
      icon: BarChart3,
      onClick: () => setCurrentPage('voucher-analytics'),
      isActive: currentPage === 'voucher-analytics'
    },
    {
      id: 'voucher-leaderboard',
      label: 'Bảng Xếp Hạng',
      icon: Trophy,
      onClick: () => setCurrentPage('voucher-leaderboard'),
      isActive: currentPage === 'voucher-leaderboard'
    },
    {
      id: 'voucher-settings',
      label: 'Cài Đặt',
      icon: Settings,
      onClick: () => setCurrentPage('voucher-settings'),
      isActive: currentPage === 'voucher-settings'
    }
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'voucher-dashboard':
        return <VoucherDashboard />;
      case 'campaign-management':
        return <CampaignManagement />;
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
  };

  const getCurrentPageTitle = () => {
    const currentItem = sidebarItems.find(item => item.isActive);
    return currentItem ? currentItem.label : 'Voucher Module';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <UnifiedSidebar
        title="Voucher Module"
        subtitle="Quản lý voucher và chiến dịch"
        items={sidebarItems}
        currentUser={currentUser}
        onBackToModules={onBackToModules}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">{getCurrentPageTitle()}</h1>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
