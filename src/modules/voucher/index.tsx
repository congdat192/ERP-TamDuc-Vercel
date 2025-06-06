
import { useState } from 'react';
import { VoucherDashboard } from './pages/VoucherDashboard';
import { VoucherIssue } from './pages/VoucherIssue';
import { VoucherList } from './pages/VoucherList';
import { VoucherAnalytics } from './pages/VoucherAnalytics';
import { VoucherLeaderboard } from './pages/VoucherLeaderboard';
import { VoucherSettings } from './pages/VoucherSettings';
import { CampaignManagement } from './pages/CampaignManagement';
import { VoucherFeature } from '@/types/auth';
import { VoucherModuleSidebar } from '@/components/layout/VoucherModuleSidebar';

interface VoucherModuleProps {
  currentUser: any;
  onBackToModules: () => void;
}

export function VoucherModule({ currentUser, onBackToModules }: VoucherModuleProps) {
  const [currentPage, setCurrentPage] = useState<VoucherFeature>('voucher-dashboard');

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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Voucher Module Sidebar - Always visible */}
      <VoucherModuleSidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        currentUser={currentUser}
        onBackToModules={onBackToModules}
      />
      
      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {renderPage()}
      </div>
    </div>
  );
}
