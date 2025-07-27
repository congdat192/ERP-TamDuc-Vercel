
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Search, Filter, Eye, CreditCard } from 'lucide-react';
import { affiliateService } from '../services/affiliateService';
import { WithdrawalRequest } from '../types';

export function WithdrawalManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: withdrawals, isLoading } = useQuery({
    queryKey: ['all-withdrawal-requests'],
    queryFn: affiliateService.getAllWithdrawalRequests,
  });

  const filteredWithdrawals = withdrawals?.filter(withdrawal => {
    const matchesSearch = withdrawal.f0Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.bankInfo.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.bankInfo.accountNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || withdrawal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'processed': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      case 'processed': return 'Đã chuyển';
      default: return status;
    }
  };

  const handleApprove = (withdrawalId: string) => {
    console.log('Approving withdrawal:', withdrawalId);
    // Mock approval action
  };

  const handleReject = (withdrawalId: string) => {
    console.log('Rejecting withdrawal:', withdrawalId);
    // Mock rejection action
  };

  const handleProcess = (withdrawalId: string) => {
    console.log('Processing withdrawal:', withdrawalId);
    // Mock processing action
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quản Lý Rút Tiền</h1>
        <p className="text-muted-foreground">Xử lý các yêu cầu rút tiền hoa hồng</p>
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
                  placeholder="Tìm kiếm theo tên F0, ngân hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="approved">Đã duyệt</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
                <SelectItem value="processed">Đã chuyển</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu rút tiền ({filteredWithdrawals?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>F0</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Thông tin ngân hàng</TableHead>
                <TableHead>Ngày yêu cầu</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWithdrawals?.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell>
                    <div className="font-medium">{withdrawal.f0Name}</div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-lg">{withdrawal.amount.toLocaleString()} VND</span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="font-medium">{withdrawal.bankInfo.bankName}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {withdrawal.bankInfo.accountNumber}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {withdrawal.bankInfo.accountName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{withdrawal.requestDate}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(withdrawal.status)}>
                      {getStatusText(withdrawal.status)}
                    </Badge>
                    {withdrawal.processedDate && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Xử lý: {withdrawal.processedDate}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {withdrawal.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleApprove(withdrawal.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReject(withdrawal.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {withdrawal.status === 'approved' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleProcess(withdrawal.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Chuyển tiền
                        </Button>
                      )}
                    </div>
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
