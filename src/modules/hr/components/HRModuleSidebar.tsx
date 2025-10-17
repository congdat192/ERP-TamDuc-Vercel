import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Clock, 
  DollarSign, 
  UserPlus, 
  GraduationCap, 
  Target, 
  Gift, 
  FileText,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HRModuleSidebarProps {
  currentUser: any;
  onBackToModules: () => void;
}

const hrPages = [
  { id: 'hr-dashboard', path: '/ERP/HR/Dashboard', label: 'Báo Cáo & Analytics', icon: BarChart3 },
  { id: 'hris', path: '/ERP/HR/HRIS', label: 'Hồ Sơ Nhân Sự', icon: Users },
  { id: 'time-attendance', path: '/ERP/HR/TimeAttendance', label: 'Ca Làm & Chấm Công', icon: Clock },
  { id: 'payroll', path: '/ERP/HR/Payroll', label: 'Tính Lương (3P)', icon: DollarSign },
  { id: 'recruitment', path: '/ERP/HR/Recruitment', label: 'Tuyển Dụng', icon: UserPlus },
  { id: 'training', path: '/ERP/HR/Training', label: 'Đào Tạo & Năng Lực', icon: GraduationCap },
  { id: 'performance', path: '/ERP/HR/Performance', label: 'OKR/KPI & 360°', icon: Target },
  { id: 'benefits', path: '/ERP/HR/Benefits', label: 'Phúc Lợi & Kỷ Luật', icon: Gift },
  { id: 'administration', path: '/ERP/HR/Administration', label: 'Hồ Sơ Hành Chính', icon: FileText },
];

export function HRModuleSidebar({ currentUser, onBackToModules }: HRModuleSidebarProps) {
  const navigate = useNavigate();

  return (
    <div className="w-64 border-r theme-border-primary flex flex-col h-full theme-card">
      {/* Header */}
      <div className="p-4 border-b theme-border-primary">
        <Button
          variant="ghost"
          onClick={() => navigate('/ERP')}
          className="w-full justify-start gap-2 mb-3"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Quay lại ERP</span>
        </Button>
        <h2 className="font-semibold text-lg theme-text">HR Module</h2>
        <p className="text-sm theme-text-secondary">Quản lý nhân sự</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {hrPages.map((page) => {
            const Icon = page.icon;
            return (
              <NavLink
                key={page.id}
                to={page.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                    'theme-text hover:theme-bg-accent',
                    isActive && 'theme-bg-accent theme-text font-medium border-l-3 border-primary'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn('h-4 w-4', isActive && 'theme-text-primary')} />
                    <span>{page.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t theme-border-primary">
        <p className="text-xs theme-text-secondary">
          HR Management System v1.0
        </p>
      </div>
    </div>
  );
}
