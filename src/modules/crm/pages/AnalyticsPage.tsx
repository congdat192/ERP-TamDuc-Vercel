import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const revenueData = [
    { name: 'T1', value: 40000000 },
    { name: 'T2', value: 30000000 },
    { name: 'T3', value: 20000000 },
    { name: 'T4', value: 27800000 },
    { name: 'T5', value: 18900000 },
    { name: 'T6', value: 23900000 },
    { name: 'T7', value: 34900000 },
];

const funnelData = [
    { name: 'Mới', value: 100 },
    { name: 'Tư vấn', value: 80 },
    { name: 'Tiềm năng', value: 50 },
    { name: 'Chốt đơn', value: 30 },
];

const sourceData = [
    { name: 'Facebook', value: 400 },
    { name: 'Google', value: 300 },
    { name: 'Zalo', value: 300 },
    { name: 'Walk-in', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function AnalyticsPage() {
    const navigate = useNavigate();

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/crm')}>
                        <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Phân tích</h1>
                        <p className="text-gray-500">Hiệu suất kinh doanh và chuyển đổi.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <select className="border rounded-md px-3 py-2 text-sm bg-white">
                        <option>7 ngày qua</option>
                        <option>30 ngày qua</option>
                        <option>Tháng này</option>
                        <option>Tháng trước</option>
                    </select>
                    <Button variant="outline">Xuất báo cáo</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Doanh thu theo tháng</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value as number)} />
                                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Funnel Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Phễu chuyển đổi</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={funnelData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={80} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Source Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Nguồn khách hàng</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sourceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {sourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
