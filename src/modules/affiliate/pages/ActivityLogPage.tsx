
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Activity, User, UserCheck, Wallet, Gift, FileText } from 'lucide-react';

// Mock data for activity logs
const mockActivities = [
  {
    id: '1',
    userId: 'f0_001',
    userType: 'f0' as const,
    userName: 'Nguyễn Văn A',
    action: 'f0_registration',
    description: 'Đăng ký tham gia chương trình affiliate',
    timestamp: '2024-01-25T10:30:00Z',
    metadata: { phone: '0901234567', email: 'nguyenvana@example.com' }
  },
  {
    id: '2',
    userId: 'f1_001',
    userType: 'f1' as const,
    userName: 'Phạm Văn D',
    action: 'f1_invited',
    description: 'Được mời tham gia bởi F0: Nguyễn Văn A',
    timestamp: '2024-01-25T11:15:00Z',
    metadata: { f0Id: 'f0_001', f0Name: 'Nguyễn Văn A' }
  },
  {
    id: '3',
    userId: 'f1_001',
    userType: 'f1' as const,
    userName: 'Phạm Văn D',
    action: 'first_order',
    description: 'Thực hiện đơn hàng đầu tiên với giá trị 1.500.000 VND',
    timestamp: '2024-01-25T14:20:00Z',
    metadata: { orderId: 'ORD001', orderValue: 1500000 }
  },
  {
    id: '4',
    userId: 'f0_001',
    userType: 'f0' as const,
    userName: 'Nguyễn Văn A',
    action: 'commission_earned',
    description: 'Nhận hoa hồng 150.000 VND từ đơn hàng ORD001',
    timestamp: '2024-01-25T14:21:00Z',
    metadata: { commissionAmount: 150000, orderId: 'ORD001' }
  },
  {
    id: '5',
    userId: 'admin_001',
    userType: 'admin' as const,
    userName: 'Admin System',
    action: 'f0_approved',
    description: 'Duyệt F0: Nguyễn Văn A tham gia chương trình',
    timestamp: '2024-01-25T09:00:00Z',
    metadata: { f0Id: 'f0_001', f0Name: 'Nguyễn Văn A' }
  },
  {
    id: '6',
    userId: 'f0_002',
    userType: 'f0' as const,
    userName: 'Trần Thị B',
    action: 'withdrawal_request',
    description: 'Yêu cầu rút tiền 1.000.000 VND',
    timestamp: '2024-01-25T16:45:00Z',
    metadata: { amount: 1000000, bankName: 'Vietcombank' }
  },
  {
    id: '7',
    userId: 'f0_001',
    userType: 'f0' as const,
    userName: 'Nguyễn Văn A',
    action: 'voucher_issued',
    description: 'Được cấp voucher AFF-VCH-001 giá trị 10%',
    timestamp: '2024-01-25T12:30:00Z',
    metadata: { voucherCode: 'AFF-VCH-001', voucherValue: '10%' }
  }
];

export function ActivityLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = activity.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUserType = userTypeFilter === 'all' || activity.userType === userTypeFilter;
    const matchesAction = actionFilter === 'all' || activity.action === actionFilter;
    return matchesSearch && matchesUserType && matchesAction;
  });

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'f0': return <UserCheck className="h-4 w-4" />;
      case 'f1': return <User className="h-4 w-4" />;
      case 'admin': return <Activity className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'f0_registration':
      case 'f0_approved':
      case 'f1_invited':
        return <UserCheck className="h-4 w-4" />;
      case 'commission_earned':
      case 'withdrawal_request':
        return <Wallet className="h-4 w-4" />;
      case 'voucher_issued':
        return <Gift className="h-4 w-4" />;
      case 'first_order':
        return <FileText className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getUserTypeBadgeVariant = (userType: string) => {
    switch (userType) {
      case 'f0': return 'default';
      case 'f1': return 'secondary';
      case 'admin': return 'outline';
      default: return 'outline';
    }
  };

  const getUserTypeText = (userType: string) => {
    switch (userType) {
      case 'f0': return 'F0';
      case 'f1': return 'F1';
      case 'admin': return 'Admin';
      default: return userType;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('vi-VN');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nhật Ký Hoạt Động</h1>
        <p className="text-muted-foreground">Theo dõi các hoạt động trong hệ thống affiliate</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên người dùng, mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Loại người dùng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="f0">F0</SelectItem>
                <SelectItem value="f1">F1</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Loại hoạt động" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="f0_registration">Đăng ký F0</SelectItem>
                <SelectItem value="f0_approved">Duyệt F0</SelectItem>
                <SelectItem value="f1_invited">Mời F1</SelectItem>
                <SelectItem value="commission_earned">Nhận hoa hồng</SelectItem>
                <SelectItem value="withdrawal_request">Yêu cầu rút tiền</SelectItem>
                <SelectItem value="voucher_issued">Cấp voucher</SelectItem>
                <SelectItem value="first_order">Đơn hàng đầu tiên</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử hoạt động ({filteredActivities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thời gian</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Hoạt động</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Chi tiết</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {formatTimestamp(activity.timestamp)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getUserTypeIcon(activity.userType)}
                      <div>
                        <div className="font-medium">{activity.userName}</div>
                        <Badge variant={getUserTypeBadgeVariant(activity.userType)} className="text-xs">
                          {getUserTypeText(activity.userType)}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(activity.action)}
                      <Badge variant="outline">{activity.action}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{activity.description}</div>
                  </TableCell>
                  <TableCell>
                    {activity.metadata && (
                      <div className="text-xs text-muted-foreground space-y-1">
                        {Object.entries(activity.metadata).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span> {JSON.stringify(value)}
                          </div>
                        ))}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
