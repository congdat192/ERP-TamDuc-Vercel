import { useState } from 'react';
import { Calendar, Clock, Download, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Attendance } from '../types';

const dummyAttendance: Attendance[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Nguyễn Văn An',
    date: '2024-01-15',
    shift: 'Ca Sáng',
    checkIn: '08:00',
    checkOut: '17:00',
    status: 'present',
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Trần Thị Bình',
    date: '2024-01-15',
    shift: 'Ca Sáng',
    checkIn: '08:15',
    checkOut: '17:00',
    status: 'late',
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Lê Minh Châu',
    date: '2024-01-15',
    shift: 'Ca Sáng',
    checkIn: '-',
    checkOut: '-',
    status: 'leave',
  },
];

export function TimeAttendancePage() {
  const [selectedMonth, setSelectedMonth] = useState('2024-01');

  const getStatusBadge = (status: Attendance['status']) => {
    const statusMap = {
      present: { label: 'Có mặt', variant: 'default' as const },
      late: { label: 'Đi trễ', variant: 'secondary' as const },
      absent: { label: 'Vắng', variant: 'destructive' as const },
      leave: { label: 'Nghỉ phép', variant: 'outline' as const },
    };
    const config = statusMap[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold theme-text">Ca Làm & Chấm Công</h1>
          <p className="theme-text-secondary mt-1">Quản lý lịch ca và chấm công nhân viên</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Bộ Lọc
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 theme-text-primary" />
              <div>
                <p className="text-sm theme-text-secondary">Đi Làm Hôm Nay</p>
                <p className="text-2xl font-bold theme-text">
                  {dummyAttendance.filter(a => a.status === 'present' || a.status === 'late').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm theme-text-secondary">Đi Trễ</p>
                <p className="text-2xl font-bold theme-text">
                  {dummyAttendance.filter(a => a.status === 'late').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm theme-text-secondary">Vắng Mặt</p>
                <p className="text-2xl font-bold theme-text">
                  {dummyAttendance.filter(a => a.status === 'absent').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm theme-text-secondary">Nghỉ Phép</p>
                <p className="text-2xl font-bold theme-text">
                  {dummyAttendance.filter(a => a.status === 'leave').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Lịch Ca</TabsTrigger>
          <TabsTrigger value="attendance">Chấm Công</TabsTrigger>
          <TabsTrigger value="leave">Nghỉ Phép</TabsTrigger>
          <TabsTrigger value="summary">Tổng Hợp</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <Card className="theme-card">
            <CardHeader>
              <CardTitle className="theme-text">Lịch Ca Tháng {selectedMonth}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 theme-text-secondary">
                <div className="text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Lịch ca làm việc</p>
                  <p className="text-sm mt-2">Chức năng đang được phát triển</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card className="theme-card">
            <CardHeader>
              <CardTitle className="theme-text">Bảng Chấm Công</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Nhân Viên</TableHead>
                    <TableHead>Ca Làm</TableHead>
                    <TableHead>Giờ Vào</TableHead>
                    <TableHead>Giờ Ra</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyAttendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="theme-text">{record.date}</TableCell>
                      <TableCell className="theme-text font-medium">{record.employeeName}</TableCell>
                      <TableCell className="theme-text">{record.shift}</TableCell>
                      <TableCell className="theme-text">{record.checkIn}</TableCell>
                      <TableCell className="theme-text">{record.checkOut}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave">
          <Card className="theme-card">
            <CardHeader>
              <CardTitle className="theme-text">Quản Lý Nghỉ Phép</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 theme-text-secondary">
                <div className="text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Danh sách đơn nghỉ phép</p>
                  <p className="text-sm mt-2">Chức năng đang được phát triển</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <Card className="theme-card">
            <CardHeader>
              <CardTitle className="theme-text">Tổng Hợp Công</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 theme-text-secondary">
                <div className="text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Bảng tổng hợp công tháng</p>
                  <p className="text-sm mt-2">Chức năng đang được phát triển</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
