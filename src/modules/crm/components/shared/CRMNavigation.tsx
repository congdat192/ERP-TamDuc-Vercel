import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Activity, Calendar, Zap, Workflow, BarChart, Users } from 'lucide-react';

interface NavItem {
    path: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
    { path: '/crm', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/crm/pipeline', label: 'Sales Pipeline', icon: Activity },
    { path: '/crm/booking', label: 'Booking', icon: Calendar },
    { path: '/crm/campaign', label: 'Chiến dịch', icon: Zap },
    { path: '/crm/automation', label: 'Automation', icon: Workflow },
    { path: '/crm/analytics', label: 'Báo cáo', icon: BarChart },
    { path: '/crm/customer', label: 'Khách hàng 360', icon: Users },
];

export function CRMNavigation() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/crm') {
            return location.pathname === '/crm';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="border-b bg-white">
            <div className="flex items-center overflow-x-auto px-6">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2',
                                active
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
