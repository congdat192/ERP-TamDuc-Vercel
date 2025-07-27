
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Check, X, Eye } from 'lucide-react';

export function ApproveF0Page() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const pendingF0s = [
    {
      id: '1',
      fullName: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'nguyenvana@email.com',
      registrationDate: '2024-01-15',
      status: 'pending'
    },
    {
      id: '2',
      fullName: 'Trần Thị B',
      phone: '0912345678',
      email: 'tranthib@email.com',
      registrationDate: '2024-01-14',
      status: 'pending'
    }
  ];

  const handleApprove = (id: string) => {
    console.log('Approve F0:', id);
  };

  const handleReject = (id: string) => {
    console.log('Reject F0:', id);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold theme-text">Duyệt F0</h1>
          <p className="theme-text-muted">Xem xét và duyệt đăng ký F0 mới</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 theme-text-muted" />
              <Input
                placeholder="Tìm kiếm theo tên, SĐT, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>SĐT</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingF0s.map((f0) => (
                <TableRow key={f0.id}>
                  <TableCell className="font-medium">{f0.fullName}</TableCell>
                  <TableCell>{f0.phone}</TableCell>
                  <TableCell>{f0.email}</TableCell>
                  <TableCell>{f0.registrationDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-yellow-600">
                      Chờ duyệt
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(f0.id)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(f0.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
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
