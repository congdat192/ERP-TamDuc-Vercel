
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Search, Filter, Eye } from 'lucide-react';
import { affiliateService } from '../services/affiliateService';
import { F0User } from '../types';

export function F0ApprovalPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: f0Users, isLoading } = useQuery({
    queryKey: ['all-f0-users'],
    queryFn: affiliateService.getAllF0Users,
  });

  const filteredUsers = f0Users?.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  const handleApprove = (f0Id: string) => {
    console.log('Approving F0:', f0Id);
    // Mock approval action
  };

  const handleReject = (f0Id: string) => {
    console.log('Rejecting F0:', f0Id);
    // Mock rejection action
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Duyệt F0</h1>
        <p className="text-muted-foreground">Quản lý và duyệt các F0 đăng ký tham gia chương trình</p>
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
                  placeholder="Tìm kiếm theo tên, email, SĐT..."
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
                <SelectItem value="pending">Chờ duyệt</SelectItem>
                <SelectItem value="approved">Đã duyệt</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* F0 List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách F0 ({filteredUsers?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thông tin F0</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
                <TableHead>Tổng F1</TableHead>
                <TableHead>Hoa hồng</TableHead>
                <TableHead>Voucher</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers?.map((f0) => (
                <TableRow key={f0.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{f0.name}</div>
                      <div className="text-sm text-muted-foreground">{f0.email}</div>
                      <div className="text-sm text-muted-foreground">{f0.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{f0.registrationDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{f0.totalF1}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{f0.totalCommission.toLocaleString()} VND</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{f0.totalVouchers}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(f0.status)}>
                      {getStatusText(f0.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {f0.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleApprove(f0.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReject(f0.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
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
