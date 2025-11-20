import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CRMPage() {
    const navigate = useNavigate();

    const modules = [
        {
            title: 'Sales Pipeline',
            description: 'Quản lý cơ hội bán hàng và quy trình chốt đơn.',
            icon: <Activity className="h-8 w-8 text-blue-500" />,
            path: '/crm/pipeline',
            color: 'bg-blue-50 hover:bg-blue-100',
        },
        {
            title: 'Booking & Lịch hẹn',
            description: 'Quản lý lịch đo mắt và bảo hành tại cửa hàng.',
            icon: <Calendar className="h-8 w-8 text-purple-500" />,
            path: '/crm/booking',
            color: 'bg-purple-50 hover:bg-purple-100',
        },
        {
            title: 'Chiến dịch & Voucher',
            description: 'Automation marketing và quản lý khuyến mãi.',
            icon: <Zap className="h-8 w-8 text-yellow-500" />,
            path: '/crm/campaign',
            color: 'bg-yellow-50 hover:bg-yellow-100',
        },
        {
            title: 'Automation Workflow',
            description: 'Thiết kế quy trình tự động hóa (Visual Builder).',
            icon: <Zap className="h-8 w-8 text-orange-500" />,
            path: '/crm/automation',
            color: 'bg-orange-50 hover:bg-orange-100',
        },
        {
            title: 'Báo cáo & Phân tích',
            description: 'Biểu đồ doanh thu và phễu chuyển đổi.',
            icon: <Activity className="h-8 w-8 text-indigo-500" />,
            path: '/crm/analytics',
            color: 'bg-indigo-50 hover:bg-indigo-100',
        },
        {
            title: 'Khách hàng 360°',
            description: 'Quản lý hồ sơ và lịch sử khách hàng.',
            icon: <Users className="h-8 w-8 text-green-500" />,
            path: '/crm/customer',
            color: 'bg-green-50 hover:bg-green-100',
        },
    ];

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
                <p className="text-gray-500 mt-2">Trung tâm quản lý Khách hàng & Doanh thu (Premium Module)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {modules.map((module) => (
                    <Card
                        key={module.path}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-none ${module.color}`}
                        onClick={() => navigate(module.path)}
                    >
                        <CardHeader className="pb-2">
                            <div className="mb-2">{module.icon}</div>
                            <CardTitle className="text-xl">{module.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">{module.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
