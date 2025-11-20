import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Search, UserPlus } from 'lucide-react';

const mockCustomers = [
    { id: 101, name: 'Nguyễn Văn A', phone: '0909123456', totalSpent: 5000000, lastVisit: '2025-11-15' },
    { id: 102, name: 'Trần Thị B', phone: '0918888999', totalSpent: 1200000, lastVisit: '2025-10-20' },
    { id: 103, name: 'Lê Văn C', phone: '0987654321', totalSpent: 3500000, lastVisit: '2025-11-01' },
    { id: 104, name: 'Phạm Thị D', phone: '0933444555', totalSpent: 800000, lastVisit: '2025-09-15' },
    { id: 105, name: 'Hoàng Văn E', phone: '0999888777', totalSpent: 15000000, lastVisit: '2025-11-18' },
];

export function CustomerListPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCustomers = mockCustomers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    return (
        <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/crm')}>
                        <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Danh Sách Khách Hàng</h1>
                        <p className="text-gray-500">Quản lý hồ sơ và lịch sử mua hàng.</p>
                    </div>
                </div>
                <Button>
                    <UserPlus className="h-4 w-4 mr-2" /> Thêm khách hàng
                </Button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow flex gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Tìm kiếm tên hoặc SĐT..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Họ Tên</TableHead>
                            <TableHead>Số Điện Thoại</TableHead>
                            <TableHead>Tổng Chi Tiêu</TableHead>
                            <TableHead>Lần Cuối Ghé</TableHead>
                            <TableHead className="text-right">Hành Động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCustomers.map((customer) => (
                            <TableRow
                                key={customer.id}
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => navigate(`/crm/customer/${customer.id}`)}
                            >
                                <TableCell>{customer.id}</TableCell>
                                <TableCell className="font-medium">{customer.name}</TableCell>
                                <TableCell>{customer.phone}</TableCell>
                                <TableCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(customer.totalSpent)}</TableCell>
                                <TableCell>{customer.lastVisit}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">Xem chi tiết</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
