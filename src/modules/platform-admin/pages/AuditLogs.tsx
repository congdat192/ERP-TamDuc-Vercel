
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  User,
  Activity
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockAuditLogs } from '../utils/mockData';

export function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterResult, setFilterResult] = useState('all');

  const auditLogs = mockAuditLogs();

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Thành công</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Thất bại</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Cảnh báo</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'USER_LOGIN': return 'Đăng nhập';
      case 'USER_LOGOUT': return 'Đăng xuất';
      case 'TENANT_CREATED': return 'Tạo khách hàng';
      case 'TENANT_UPDATED': return 'Cập nhật khách hàng';
      case 'TENANT_SUSPENDED': return 'Tạm ngưng khách hàng';
      case 'PAYMENT_PROCESSED': return 'Xử lý thanh toán';
      case 'USER_CREATED': return 'Tạo người dùng';
      case 'USER_UPDATED': return 'Cập nhật người dùng';
      case 'SYSTEM_SETTINGS_CHANGED': return 'Thay đổi cài đặt hệ thống';
      default: return action;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nhật Ký Hệ Thống</h1>
          <p className="text-gray-600 mt-1">Theo dõi tất cả hoạt động và thay đổi trong hệ thống</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Xuất CSV
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Chọn Thời Gian
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Tổng Hoạt Động</p>
                <p className="text-2xl font-bold">2,847</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Đăng Nhập Hôm Nay</p>
                <p className="text-2xl font-bold">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Eye className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Lỗi Hệ Thống</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Thay Đổi Cài Đặt</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lịch Sử Hoạt Động</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm người dùng, hành động..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Loại hành động" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="USER_LOGIN">Đăng nhập</SelectItem>
                  <SelectItem value="TENANT_CREATED">Tạo khách hàng</SelectItem>
                  <SelectItem value="PAYMENT_PROCESSED">Thanh toán</SelectItem>
                  <SelectItem value="SYSTEM_SETTINGS_CHANGED">Cài đặt</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterResult} onValueChange={setFilterResult}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Kết quả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="success">Thành công</SelectItem>
                  <SelectItem value="failed">Thất bại</SelectItem>
                  <SelectItem value="warning">Cảnh báo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thời Gian</TableHead>
                <TableHead>Người Dùng</TableHead>
                <TableHead>Hành Động</TableHead>
                <TableHead>Khách Hàng</TableHead>
                <TableHead>Chi Tiết</TableHead>
                <TableHead>Kết Quả</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{log.timestamp.toLocaleDateString('vi-VN')}</p>
                      <p className="text-gray-500">{log.timestamp.toLocaleTimeString('vi-VN')}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{log.user}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getActionText(log.action)}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{log.tenant || 'Hệ thống'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-900 max-w-xs truncate block">
                      {log.details}
                    </span>
                  </TableCell>
                  <TableCell>{getResultBadge(log.result)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
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
