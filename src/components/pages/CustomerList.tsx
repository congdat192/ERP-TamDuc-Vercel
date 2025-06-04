import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Eye,
  Edit,
  UserPlus,
  Phone,
  Mail,
  Calendar,
  Receipt,
  Download
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const customerData = [
  {
    id: 1,
    name: 'Nguyễn Thị Hoa',
    phone: '0901234567',
    email: 'nguyen.thi.hoa@email.com',
    type: 'VIP',
    source: 'Website',
    totalVouchers: 8,
    totalValue: '4.500.000đ',
    lastVoucherDate: '20/01/2024',
    registrationDate: '15/12/2023',
    status: 'Hoạt động'
  },
  {
    id: 2,
    name: 'Trần Văn Nam',
    phone: '0907654321',
    email: 'tran.van.nam@email.com',
    type: 'Premium',
    source: 'Cuộc Gọi',
    totalVouchers: 5,
    totalValue: '2.750.000đ',
    lastVoucherDate: '19/01/2024',
    registrationDate: '10/01/2024',
    status: 'Hoạt động'
  },
  {
    id: 3,
    name: 'Lê Thị Minh',
    phone: '0909876543',
    email: 'le.thi.minh@email.com',
    type: 'Thường',
    source: 'Giới Thiệu',
    totalVouchers: 3,
    totalValue: '1.200.000đ',
    lastVoucherDate: '18/01/2024',
    registrationDate: '05/01/2024',
    status: 'Hoạt động'
  },
  {
    id: 4,
    name: 'Phạm Văn Tuấn',
    phone: '0902468135',
    email: 'pham.van.tuan@email.com',
    type: 'Mới',
    source: 'Mạng Xã Hội',
    totalVouchers: 1,
    totalValue: '300.000đ',
    lastVoucherDate: '01/01/2024',
    registrationDate: '01/01/2024',
    status: 'Không hoạt động'
  },
  {
    id: 5,
    name: 'Vũ Thị Nga',
    phone: '0905432109',
    email: 'vu.thi.nga@email.com',
    type: 'Premium',
    source: 'Website',
    totalVouchers: 6,
    totalValue: '3.250.000đ',
    lastVoucherDate: '17/01/2024',
    registrationDate: '20/12/2023',
    status: 'Hoạt động'
  }
];

export function CustomerList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'VIP':
        return 'bg-purple-100 text-purple-800';
      case 'Premium':
        return 'bg-blue-100 text-blue-800';
      case 'Thường':
        return 'bg-green-100 text-green-800';
      case 'Mới':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Hoạt động' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const filteredCustomers = customerData.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || customer.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleViewDetails = (customer: any) => {
    setSelectedCustomer(customer);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Danh Sách Khách Hàng</h2>
          <p className="text-gray-600">Quản lý thông tin và lịch sử khách hàng</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất File
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Thêm Khách Hàng
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tên, số điện thoại hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <ScrollArea className="w-full md:w-auto">
              <div className="flex space-x-4 md:space-x-4">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48 min-w-48">
                    <SelectValue placeholder="Loại khách hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất Cả Loại</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Thường">Thường</SelectItem>
                    <SelectItem value="Mới">Mới</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48 min-w-48">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất Cả Trạng Thái</SelectItem>
                    <SelectItem value="Hoạt động">Hoạt động</SelectItem>
                    <SelectItem value="Không hoạt động">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Tổng Khách Hàng</p>
                <p className="text-2xl font-bold text-gray-900">{customerData.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Khách Hàng VIP</p>
                <p className="text-2xl font-bold text-gray-900">{customerData.filter(c => c.type === 'VIP').length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Receipt className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Hoạt Động</p>
                <p className="text-2xl font-bold text-gray-900">{customerData.filter(c => c.status === 'Hoạt động').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Khách Mới Tháng Này</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Khách Hàng ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách Hàng</TableHead>
                  <TableHead>Liên Hệ</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Nguồn</TableHead>
                  <TableHead>Voucher</TableHead>
                  <TableHead>Tổng Giá Trị</TableHead>
                  <TableHead>Voucher Cuối</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead>Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {customer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-500">Đăng ký: {customer.registrationDate}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(customer.type)}>
                        {customer.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{customer.source}</TableCell>
                    <TableCell className="text-center font-medium">
                      {customer.totalVouchers}
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {customer.totalValue}
                    </TableCell>
                    <TableCell>{customer.lastVoucherDate}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(customer)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Customer Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chi Tiết Khách Hàng</DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Header */}
              <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                    {selectedCustomer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{selectedCustomer.name}</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge className={getTypeColor(selectedCustomer.type)}>
                      {selectedCustomer.type}
                    </Badge>
                    <Badge className={getStatusColor(selectedCustomer.status)}>
                      {selectedCustomer.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Thông Tin Liên Hệ</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span>Đăng ký: {selectedCustomer.registrationDate}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Thống Kê Voucher</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng số voucher:</span>
                      <span className="font-medium">{selectedCustomer.totalVouchers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng giá trị:</span>
                      <span className="font-medium text-green-600">{selectedCustomer.totalValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Voucher cuối:</span>
                      <span className="font-medium">{selectedCustomer.lastVoucherDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nguồn khách:</span>
                      <span className="font-medium">{selectedCustomer.source}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline">
                  <Receipt className="w-4 h-4 mr-2" />
                  Phát Hành Voucher
                </Button>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh Sửa Thông Tin
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
