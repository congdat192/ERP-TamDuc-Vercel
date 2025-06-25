
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, User, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { CustomerDetailModal } from '../CustomerDetailModal';

interface MarketingCustomer {
  id: string;
  name: string;
  phone: string;
  group: string;
  source: string;
  email: string;
  createdDate: string;
  status: 'active' | 'inactive';
  totalSpent: number;
  voucherCount: number;
}

const mockCustomers: MarketingCustomer[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    group: 'VIP',
    source: 'KiotViet',
    email: 'nguyenvana@email.com',
    createdDate: '2024-06-20',
    status: 'active',
    totalSpent: 2500000,
    voucherCount: 3
  },
  {
    id: '2',
    name: 'Trần Thị B',
    phone: '0912345678',
    group: 'Thường',
    source: 'Voucher Campaign',
    email: 'tranthib@email.com',
    createdDate: '2024-06-18',
    status: 'active',
    totalSpent: 800000,
    voucherCount: 1
  },
  {
    id: '3',
    name: 'Lê Văn C',
    phone: '0923456789',
    group: 'Tiềm năng',
    source: 'Marketing Campaign',
    email: 'levanc@email.com',
    createdDate: '2024-06-15',
    status: 'inactive',
    totalSpent: 0,
    voucherCount: 2
  }
];

export function CustomerListTab() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<MarketingCustomer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newCustomersCount = Math.floor(Math.random() * 5) + 1;
      toast({
        title: "Đồng bộ thành công",
        description: `Đã đồng bộ ${newCustomersCount} khách hàng mới từ các nguồn`,
      });
    } catch (error) {
      toast({
        title: "Đồng bộ thất bại",
        description: "Có lỗi xảy ra khi đồng bộ dữ liệu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerClick = (customer: MarketingCustomer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Không hoạt động</Badge>
    );
  };

  const getSourceBadge = (source: string) => {
    const sourceConfig = {
      'KiotViet': { className: "bg-blue-100 text-blue-800", label: "KiotViet" },
      'Voucher Campaign': { className: "bg-orange-100 text-orange-800", label: "Voucher Campaign" },
      'Marketing Campaign': { className: "bg-purple-100 text-purple-800", label: "Marketing Campaign" }
    };
    const config = sourceConfig[source as keyof typeof sourceConfig] || 
                   { className: "bg-gray-100 text-gray-800", label: source };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 theme-text-primary" />
          <h2 className="text-xl font-semibold theme-text">Danh sách khách hàng</h2>
        </div>
        <Button 
          onClick={handleSync}
          disabled={isLoading}
          className="voucher-button-primary"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Đang đồng bộ...' : 'Đồng bộ'}
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">STT</TableHead>
              <TableHead className="font-medium">Tên khách hàng</TableHead>
              <TableHead className="font-medium">Số điện thoại</TableHead>
              <TableHead className="font-medium">Nhóm KH</TableHead>
              <TableHead className="font-medium">Nguồn KH</TableHead>
              <TableHead className="font-medium">Email</TableHead>
              <TableHead className="font-medium">Ngày tạo</TableHead>
              <TableHead className="font-medium">Trạng thái</TableHead>
              <TableHead className="font-medium">Tổng chi tiêu</TableHead>
              <TableHead className="font-medium">Số voucher</TableHead>
              <TableHead className="font-medium">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer, index) => (
              <TableRow key={customer.id} className="hover:bg-gray-50">
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>
                  <Badge variant="outline">{customer.group}</Badge>
                </TableCell>
                <TableCell>{getSourceBadge(customer.source)}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{new Date(customer.createdDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{getStatusBadge(customer.status)}</TableCell>
                <TableCell>{customer.totalSpent.toLocaleString('vi-VN')}đ</TableCell>
                <TableCell>{customer.voucherCount}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCustomerClick(customer)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
