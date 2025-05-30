
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Ticket, 
  FileText, 
  BarChart3, 
  Trophy, 
  Settings,
  ChevronLeft
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
  { id: 'issue-voucher' as VoucherFeature, label: 'Phát Hành Voucher', icon: Ticket },
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
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Module Header */}
      <div className="p-4 border-b border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToModules}
          className="mb-3 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Quay Lại Modules
        </Button>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <Ticket className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Module Voucher</h3>
            <p className="text-sm text-gray-500">Quản lý voucher và khuyến mãi</p>
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
                variant={currentPage === page.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-left h-10",
                  currentPage === page.id 
                    ? "bg-orange-50 text-orange-700 border-r-2 border-orange-600" 
                    : "text-gray-700 hover:bg-gray-50"
                )}
                onClick={() => onPageChange(page.id)}
              >
                <Icon className="w-4 h-4 mr-3" />
                {page.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
