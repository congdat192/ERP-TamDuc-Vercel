import React, { useState } from 'react';
import { AdvancedFilterBuilder } from '../AdvancedFilterBuilder';
import { AdvancedFilter, FilterResult } from '../../types/filter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Save, RotateCcw, History, Share } from 'lucide-react';
import { CustomerDetailModal } from '../CustomerDetailModal';
import { toast } from '@/hooks/use-toast';

interface FilteredCustomer {
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

const initialFilter: AdvancedFilter = {
  id: 'new-filter',
  logic: 'and',
  groups: [{
    id: 'group-1',
    logic: 'and',
    conditions: [{
      id: 'condition-1',
      field: '',
      operator: 'equals',
      value: ''
    }]
  }],
  createdAt: new Date().toISOString()
};

export function CustomerFilterTab() {
  const [filter, setFilter] = useState<AdvancedFilter>(initialFilter);
  const [isExecuting, setIsExecuting] = useState(false);
  const [filterResults, setFilterResults] = useState<FilteredCustomer[]>([]);
  const [resultCount, setResultCount] = useState<number>();
  const [selectedCustomer, setSelectedCustomer] = useState<FilteredCustomer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const executeFilter = async () => {
    setIsExecuting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock filtered results
      const mockResults: FilteredCustomer[] = [
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
        }
      ];

      setFilterResults(mockResults);
      setResultCount(mockResults.length);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSave = () => {
    toast({
      title: "Lưu bộ lọc",
      description: "Bộ lọc đã được lưu thành công",
    });
  };

  const handleReset = () => {
    setFilter(initialFilter);
    setFilterResults([]);
    setResultCount(undefined);
    toast({
      title: "Đặt lại bộ lọc",
      description: "Đã xóa tất cả điều kiện lọc",
    });
  };

  const handleHistory = () => {
    toast({
      title: "Lịch sử bộ lọc",
      description: "Hiển thị lịch sử các bộ lọc đã áp dụng",
    });
  };

  const handleShare = () => {
    toast({
      title: "Chia sẻ bộ lọc",
      description: "Tạo liên kết chia sẻ bộ lọc",
    });
  };

  const handleExport = () => {
    const csvContent = filterResults.map(customer => 
      `${customer.name},${customer.phone},${customer.email},${customer.group}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered-customers.csv';
    a.click();
    
    toast({
      title: "Xuất dữ liệu thành công",
      description: `Đã xuất ${filterResults.length} khách hàng`,
    });
  };

  const handleCustomerClick = (customer: FilteredCustomer) => {
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
        <h2 className="text-xl font-semibold theme-text">Bộ lọc khách hàng nâng cao</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleHistory} variant="outline" size="sm">
            <History className="w-4 h-4 mr-2" />
            Lịch sử
          </Button>
          <Button onClick={handleShare} variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Chia sẻ
          </Button>
          <Button onClick={handleReset} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Đặt lại
          </Button>
          <Button onClick={handleSave} variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Lưu bộ lọc
          </Button>
        </div>
      </div>

      <AdvancedFilterBuilder
        filter={filter}
        onUpdate={setFilter}
        onExecute={executeFilter}
        onSave={handleSave}
        onExport={handleExport}
        isExecuting={isExecuting}
        resultCount={resultCount}
        customerIds={filterResults.map(c => c.id)}
      />

      {filterResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold theme-text">Kết quả lọc</h3>
          
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
                  <TableHead className="font-medium">Trạng thái</TableHead>
                  <TableHead className="font-medium">Tổng chi tiêu</TableHead>
                  <TableHead className="font-medium">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterResults.map((customer, index) => (
                  <TableRow key={customer.id} className="hover:bg-gray-50">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{customer.group}</Badge>
                    </TableCell>
                    <TableCell>{getSourceBadge(customer.source)}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
                    <TableCell>{customer.totalSpent.toLocaleString('vi-VN')}đ</TableCell>
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
        </div>
      )}

      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
