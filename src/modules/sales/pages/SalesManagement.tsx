
import { useState } from 'react';
import { ArrowLeft, Search, Filter, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SalesManagementProps {
  currentUser: any;
  onBackToModules: () => void;
}

export function SalesManagement({ currentUser, onBackToModules }: SalesManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [timePeriod, setTimePeriod] = useState('this-month');
  const [statusFilters, setStatusFilters] = useState({
    completed: true,
    canceled: false
  });

  // Mock data for sales
  const salesData = [
    {
      id: 'HD001',
      date: '10/06/2024 14:30',
      returnCode: '',
      customer: 'Nguyễn Văn A',
      totalAmount: 1500000,
      discount: 50000,
      paidAmount: 1450000,
      status: 'Hoàn thành'
    },
    {
      id: 'HD002', 
      date: '10/06/2024 15:45',
      returnCode: 'TH001',
      customer: 'Trần Thị B',
      totalAmount: 2200000,
      discount: 100000,
      paidAmount: 2100000,
      status: 'Hoàn thành'
    },
    {
      id: 'HD003',
      date: '09/06/2024 09:15',
      returnCode: '',
      customer: 'Lê Văn C',
      totalAmount: 800000,
      discount: 0,
      paidAmount: 800000,
      status: 'Đã hủy'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  const totalSales = salesData.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalDiscount = salesData.reduce((sum, item) => sum + item.discount, 0);
  const totalPaid = salesData.reduce((sum, item) => sum + item.paidAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToModules}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay về ERP
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Bán Hàng</h1>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar - Filters */}
        <div className="w-80 bg-white border-r p-6 space-y-6">
          <h3 className="font-semibold text-gray-900 text-lg">Bộ lọc</h3>
          
          {/* Branch Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Chi nhánh</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Chọn chi nhánh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                <SelectItem value="branch1">Chi nhánh 1</SelectItem>
                <SelectItem value="branch2">Chi nhánh 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Period */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Thời gian</label>
            <RadioGroup value={timePeriod} onValueChange={setTimePeriod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="this-month" id="this-month" />
                <label htmlFor="this-month" className="text-sm">Tháng này</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <label htmlFor="custom" className="text-sm">Tùy chỉnh</label>
              </div>
            </RadioGroup>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Trạng thái</label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="completed"
                  checked={statusFilters.completed}
                  onCheckedChange={(checked) => 
                    setStatusFilters(prev => ({ ...prev, completed: checked as boolean }))
                  }
                />
                <label htmlFor="completed" className="text-sm">Hoàn thành</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="canceled"
                  checked={statusFilters.canceled}
                  onCheckedChange={(checked) => 
                    setStatusFilters(prev => ({ ...prev, canceled: checked as boolean }))
                  }
                />
                <label htmlFor="canceled" className="text-sm">Đã hủy</label>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Phương thức thanh toán</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Chọn phương thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Tiền mặt</SelectItem>
                <SelectItem value="card">Thẻ</SelectItem>
                <SelectItem value="transfer">Chuyển khoản</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Creator */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Người tạo</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Chọn người tạo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user1">Nguyễn Văn A</SelectItem>
                <SelectItem value="user2">Trần Thị B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Seller */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Người bán</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Chọn người bán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seller1">Lê Văn C</SelectItem>
                <SelectItem value="seller2">Phạm Thị D</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price List */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Bảng giá</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Chọn bảng giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Bảng giá chuẩn</SelectItem>
                <SelectItem value="vip">Bảng giá VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sales Channel */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Kênh bán hàng</label>
            <div className="space-y-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn kênh bán hàng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="store">Cửa hàng</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="phone">Điện thoại</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="link" className="text-sm p-0 h-auto text-blue-600">
                Tạo mới
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Search and Actions */}
          <div className="bg-white rounded-lg border p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm theo mã hóa đơn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Bộ lọc
                </Button>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Hóa đơn
              </Button>
            </div>

            {/* Summary Row */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-gray-600">Tổng doanh thu</div>
                <div className="font-semibold text-lg">{formatCurrency(totalSales)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Tổng giảm giá</div>
                <div className="font-semibold text-lg text-red-600">{formatCurrency(totalDiscount)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Khách thanh toán</div>
                <div className="font-semibold text-lg text-green-600">{formatCurrency(totalPaid)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Số hóa đơn</div>
                <div className="font-semibold text-lg">{salesData.length}</div>
              </div>
            </div>
          </div>

          {/* Sales Table */}
          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã hóa đơn</TableHead>
                  <TableHead>Ngày/Giờ</TableHead>
                  <TableHead>Mã trả hàng</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Giảm giá</TableHead>
                  <TableHead>Khách thanh toán</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesData.map((sale) => (
                  <TableRow key={sale.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>
                      {sale.returnCode && (
                        <Badge variant="outline" className="text-orange-600">
                          {sale.returnCode}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell>{formatCurrency(sale.totalAmount)}</TableCell>
                    <TableCell className="text-red-600">
                      {sale.discount > 0 ? formatCurrency(sale.discount) : '-'}
                    </TableCell>
                    <TableCell className="text-green-600">
                      {formatCurrency(sale.paidAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={sale.status === 'Hoàn thành' ? 'default' : 'destructive'}
                        className={sale.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {sale.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
