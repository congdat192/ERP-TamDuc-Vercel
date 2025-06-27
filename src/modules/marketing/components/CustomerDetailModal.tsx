
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, Phone, Mail, Calendar, MapPin, Tag, 
  ShoppingCart, MessageSquare, FileText, Gift,
  Star, Eye, Download, Edit
} from 'lucide-react';

interface Customer {
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

interface CustomerDetailModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

// Mock data cho các tab
const mockVoucherHistory = [
  {
    id: '1',
    code: 'VOUCHER001',
    type: 'Giảm giá %',
    value: '10%',
    status: 'Đã sử dụng',
    usedDate: '2024-06-20',
    orderValue: 500000,
    discount: 50000
  },
  {
    id: '2',
    code: 'VOUCHER002',
    type: 'Giảm tiền mặt',
    value: '100,000đ',
    status: 'Chưa sử dụng',
    expiryDate: '2024-07-30',
    orderValue: 0,
    discount: 0
  }
];

const mockInteractionHistory = [
  {
    id: '1',
    type: 'Zalo',
    content: 'Gửi thông báo khuyến mãi cuối tháng',
    date: '2024-06-20',
    status: 'Đã gửi',
    response: 'Đã xem'
  },
  {
    id: '2',
    type: 'SMS',
    content: 'Nhắc nhở sử dụng voucher sắp hết hạn',
    date: '2024-06-18',
    status: 'Đã gửi',
    response: 'Không phản hồi'
  }
];

const mockOrderHistory = [
  {
    id: '1',
    orderCode: 'DH001',
    date: '2024-06-20',
    products: 'Áo thun nam, Quần jean',
    total: 500000,
    status: 'Hoàn thành',
    voucherUsed: 'VOUCHER001'
  },
  {
    id: '2',
    orderCode: 'DH002',
    date: '2024-06-15',
    products: 'Giày sneaker',
    total: 800000,
    status: 'Hoàn thành',
    voucherUsed: null
  }
];

const mockNotes = [
  {
    id: '1',
    content: 'Khách hàng quan tâm đến sản phẩm thời trang nam',
    author: 'Nguyễn Văn A',
    date: '2024-06-20',
    type: 'Ghi chú bán hàng'
  },
  {
    id: '2',
    content: 'Đã liên hệ tư vấn về chương trình VIP',
    author: 'Trần Thị B',
    date: '2024-06-18',
    type: 'Ghi chú chăm sóc'
  }
];

export function CustomerDetailModal({ customer, isOpen, onClose }: CustomerDetailModalProps) {
  const [activeSection, setActiveSection] = useState('overview');

  if (!customer) return null;

  const menuItems = [
    { id: 'overview', label: 'Thông tin tổng quan', icon: User },
    { id: 'vouchers', label: 'Lịch sử voucher', icon: Tag },
    { id: 'interactions', label: 'Lịch sử tương tác', icon: MessageSquare },
    { id: 'orders', label: 'Lịch sử đơn hàng', icon: ShoppingCart },
    { id: 'notes', label: 'Ghi chú nội bộ', icon: FileText }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <User className="w-5 h-5 mr-2" />
              Thông tin cá nhân
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Tên khách hàng:</label>
                <p className="font-semibold text-lg">{customer.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Số điện thoại:</label>
                <p className="font-semibold flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  {customer.phone}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email:</label>
                <p className="font-semibold flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  {customer.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Ngày tham gia:</label>
                <p className="font-semibold flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {new Date(customer.createdDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Thông tin phân khúc
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Nhóm khách hàng:</label>
                <Badge variant="outline" className="mt-1">{customer.group}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Nguồn khách hàng:</label>
                <Badge className="bg-blue-100 text-blue-800 mt-1">{customer.source}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Trạng thái:</label>
                <Badge className={`mt-1 ${customer.status === 'active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                  {customer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Tổng chi tiêu</p>
                <p className="text-2xl font-bold text-green-700">
                  {customer.totalSpent.toLocaleString('vi-VN')}đ
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Số voucher</p>
                <p className="text-2xl font-bold text-blue-700">{customer.voucherCount}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Gift className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Đơn hàng</p>
                <p className="text-2xl font-bold text-purple-700">{mockOrderHistory.length}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderVouchers = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-lg">Lịch sử voucher</h4>
        <Badge variant="secondary">{mockVoucherHistory.length} voucher</Badge>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã voucher</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Giá trị</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày sử dụng</TableHead>
            <TableHead>Giá trị đơn</TableHead>
            <TableHead>Giảm giá</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockVoucherHistory.map((voucher) => (
            <TableRow key={voucher.id}>
              <TableCell className="font-medium">{voucher.code}</TableCell>
              <TableCell>{voucher.type}</TableCell>
              <TableCell>{voucher.value}</TableCell>
              <TableCell>
                <Badge variant={voucher.status === 'Đã sử dụng' ? 'default' : 'secondary'}>
                  {voucher.status}
                </Badge>
              </TableCell>
              <TableCell>
                {voucher.usedDate ? new Date(voucher.usedDate).toLocaleDateString('vi-VN') : 
                 voucher.expiryDate ? `Hết hạn: ${new Date(voucher.expiryDate).toLocaleDateString('vi-VN')}` : '-'}
              </TableCell>
              <TableCell>{voucher.orderValue.toLocaleString('vi-VN')}đ</TableCell>
              <TableCell className="text-green-600 font-medium">
                {voucher.discount.toLocaleString('vi-VN')}đ
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderInteractions = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-lg">Lịch sử tương tác</h4>
        <Badge variant="secondary">{mockInteractionHistory.length} tương tác</Badge>
      </div>
      <div className="space-y-3">
        {mockInteractionHistory.map((interaction) => (
          <Card key={interaction.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{interaction.type}</Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(interaction.date).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{interaction.content}</p>
                  <div className="flex items-center space-x-4">
                    <Badge variant={interaction.status === 'Đã gửi' ? 'default' : 'secondary'}>
                      {interaction.status}
                    </Badge>
                    <Badge variant="outline">{interaction.response}</Badge>
                  </div>
                </div>
                <MessageSquare className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-lg">Lịch sử đơn hàng</h4>
        <Badge variant="secondary">{mockOrderHistory.length} đơn hàng</Badge>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn</TableHead>
            <TableHead>Ngày đặt</TableHead>
            <TableHead>Sản phẩm</TableHead>
            <TableHead>Tổng tiền</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Voucher sử dụng</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockOrderHistory.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.orderCode}</TableCell>
              <TableCell>{new Date(order.date).toLocaleDateString('vi-VN')}</TableCell>
              <TableCell className="max-w-xs truncate">{order.products}</TableCell>
              <TableCell className="font-semibold">{order.total.toLocaleString('vi-VN')}đ</TableCell>
              <TableCell>
                <Badge variant="default">{order.status}</Badge>
              </TableCell>
              <TableCell>
                {order.voucherUsed ? (
                  <Badge variant="outline">{order.voucherUsed}</Badge>
                ) : (
                  <span className="text-gray-400">Không sử dụng</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderNotes = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-lg">Ghi chú nội bộ</h4>
        <Badge variant="secondary">{mockNotes.length} ghi chú</Badge>
      </div>
      <div className="space-y-3">
        {mockNotes.map((note) => (
          <Card key={note.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Badge variant="outline">{note.type}</Badge>
                <span className="text-sm text-gray-500">
                  {new Date(note.date).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <p className="text-sm mb-2">{note.content}</p>
              <div className="flex items-center text-xs text-gray-500">
                <User className="w-3 h-3 mr-1" />
                {note.author}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'vouchers': return renderVouchers();
      case 'interactions': return renderInteractions();
      case 'orders': return renderOrders();
      case 'notes': return renderNotes();
      default: return renderOverview();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Chi tiết khách hàng: {customer.name}</span>
            <div className="flex items-center space-x-2">
              <Badge className={customer.status === 'active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {customer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
              </Badge>
              <Badge variant="outline">{customer.group}</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 border-r bg-gray-50 p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
