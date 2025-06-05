
import { useState } from 'react';
import { VoucherDashboard } from './pages/VoucherDashboard';
import { VoucherIssue } from './pages/VoucherIssue';
import { VoucherList } from './pages/VoucherList';
import { VoucherAnalytics } from './pages/VoucherAnalytics';
import { VoucherLeaderboard } from './pages/VoucherLeaderboard';
import { VoucherSettings } from './pages/VoucherSettings';
import { CampaignManagement } from './pages/CampaignManagement';
import { VoucherFeature } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Megaphone, 
  Plus, 
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

  const voucherPages = [
    { id: 'voucher-dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'campaign-management', label: 'Quản Lý Chiến Dịch', icon: Megaphone },
    { id: 'issue-voucher', label: 'Phát Hành Voucher', icon: Plus },
    { id: 'voucher-list', label: 'Danh Sách Voucher', icon: List },
    { id: 'voucher-analytics', label: 'Thống Kê', icon: BarChart3 },
    { id: 'voucher-leaderboard', label: 'Bảng Xếp Hạng', icon: Trophy },
    { id: 'voucher-settings', label: 'Cài Đặt', icon: Settings },
  ] as const;

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
    <div className="min-h-screen bg-gray-50">
      {/* Voucher Module Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Module Voucher</h2>
        </div>
        
        {/* Navigation tabs */}
        <div className="flex space-x-1 overflow-x-auto">
          {voucherPages.map((page) => {
            const Icon = page.icon;
            return (
              <Button
                key={page.id}
                variant={currentPage === page.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(page.id as VoucherFeature)}
                className="flex items-center space-x-2 whitespace-nowrap"
              >
                <Icon className="w-4 h-4" />
                <span>{page.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {renderPage()}
      </div>
    </div>
  );
}
