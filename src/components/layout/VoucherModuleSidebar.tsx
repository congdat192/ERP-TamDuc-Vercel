
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Ticket, 
  FileText, 
  BarChart3, 
  Trophy, 
  Settings,
  Target,
  Plus
} from 'lucide-react';
import { VoucherFeature, User } from '@/types/auth';

interface VoucherModuleSidebarProps {
  currentPage: VoucherFeature;
  onPageChange: (page: VoucherFeature) => void;
  currentUser: User;
  onBackToModules: () => void;
}

const voucherPages = [
  { id: 'voucher-dashboard' as VoucherFeature, label: 'Tổng Quan', icon: LayoutDashboard },
  { id: 'campaign-management' as VoucherFeature, label: 'Quản Lý Chiến Dịch', icon: Target },
  { id: 'issue-voucher' as VoucherFeature, label: 'Phát Hành Voucher', icon: Plus },
  { id: 'voucher-list' as VoucherFeature, label: 'Danh Sách Voucher', icon: FileText },
  { id: 'voucher-analytics' as VoucherFeature, label: 'Báo Cáo Phân Tích', icon: BarChart3 },
  { id: 'voucher-leaderboard' as VoucherFeature, label: 'Bảng Xếp Hạng', icon: Trophy },
  { id: 'voucher-settings' as VoucherFeature, label: 'Cài Đặt', icon: Settings },
];

export function VoucherModuleSidebar({ 
  currentPage, 
  onPageChange, 
  currentUser,
  onBackToModules 
}: VoucherModuleSidebarProps) {
  const allowedPages = voucherPages.filter(page => 
    currentUser.permissions.voucherFeatures?.includes(page.id)
  );

  return (
    <div className="w-64 theme-card border-r theme-border-primary/20 flex flex-col h-full">
      {/* Module Header */}
      <div className="p-4 border-b theme-border-primary/20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 theme-bg-primary/10 rounded-lg flex items-center justify-center">
            <Ticket className="w-5 h-5 theme-text-primary" />
          </div>
          <div>
            <h3 className="font-semibold theme-text">Module Voucher</h3>
            <p className="text-sm theme-text-muted">Quản lý voucher và khuyến mãi</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {allowedPages.map((page) => {
            const Icon = page.icon;
            return (
              <Button
                key={page.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left h-11 transition-all duration-200",
                  currentPage === page.id 
                    ? "voucher-sidebar-active font-medium" 
                    : "theme-text hover:theme-bg-primary/5 hover:theme-text-primary"
                )}
                onClick={() => onPageChange(page.id)}
              >
                <Icon className={cn(
                  "w-4 h-4 mr-3",
                  currentPage === page.id ? "theme-text-primary" : "theme-text-muted"
                )} />
                {page.label}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t theme-border-primary/20">
        <div className="text-xs theme-text-muted text-center">
          Voucher Module • v1.0.0
        </div>
      </div>
    </div>
  );
}
