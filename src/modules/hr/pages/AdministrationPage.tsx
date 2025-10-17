import { FileText, File, Bell, FolderOpen } from 'lucide-react';
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
import { Document } from '../types';

const dummyDocuments: Document[] = [
  {
    id: '1',
    docType: 'decision',
    docNo: 'QĐ-001/2024',
    subject: 'Quyết định bổ nhiệm Giám đốc Sales',
    issueDate: '2024-01-15',
    status: 'published',
  },
  {
    id: '2',
    docType: 'notice',
    docNo: 'TB-002/2024',
    subject: 'Thông báo nghỉ Tết Nguyên Đán 2024',
    issueDate: '2024-01-20',
    status: 'published',
  },
  {
    id: '3',
    docType: 'form',
    docNo: 'BM-003/2024',
    subject: 'Biểu mẫu đơn xin nghỉ phép',
    issueDate: '2024-01-10',
    status: 'published',
  },
];

export function AdministrationPage() {
  const getDocTypeBadge = (type: Document['docType']) => {
    const typeMap = {
      decision: { label: 'Quyết định', color: 'bg-purple-500' },
      contract: { label: 'Hợp đồng', color: 'bg-blue-500' },
      notice: { label: 'Thông báo', color: 'bg-green-500' },
      form: { label: 'Biểu mẫu', color: 'bg-yellow-500' },
    };
    const config = typeMap[type];
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: Document['status']) => {
    const statusMap = {
      draft: { label: 'Nháp', variant: 'outline' as const },
      published: { label: 'Đã ban hành', variant: 'default' as const },
      archived: { label: 'Lưu trữ', variant: 'secondary' as const },
    };
    const config = statusMap[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold theme-text">Hồ Sơ Hành Chính</h1>
          <p className="theme-text-secondary mt-1">Quản lý văn bản, biểu mẫu và tài liệu hành chính</p>
        </div>
        <Button className="gap-2">
          <FileText className="h-4 w-4" />
          Tạo Văn Bản Mới
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 theme-text-primary" />
              <div>
                <p className="text-sm theme-text-secondary">Tổng Văn Bản</p>
                <p className="text-2xl font-bold theme-text">{dummyDocuments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <File className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm theme-text-secondary">Quyết Định</p>
                <p className="text-2xl font-bold theme-text">
                  {dummyDocuments.filter(d => d.docType === 'decision').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm theme-text-secondary">Thông Báo</p>
                <p className="text-2xl font-bold theme-text">
                  {dummyDocuments.filter(d => d.docType === 'notice').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FolderOpen className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm theme-text-secondary">Biểu Mẫu</p>
                <p className="text-2xl font-bold theme-text">
                  {dummyDocuments.filter(d => d.docType === 'form').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tất Cả Văn Bản</TabsTrigger>
          <TabsTrigger value="decisions">Quyết Định</TabsTrigger>
          <TabsTrigger value="contracts">Hợp Đồng</TabsTrigger>
          <TabsTrigger value="forms">Biểu Mẫu</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card className="theme-card">
            <CardHeader>
              <CardTitle className="theme-text">Danh Sách Văn Bản</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loại</TableHead>
                    <TableHead>Số Văn Bản</TableHead>
                    <TableHead>Tiêu Đề</TableHead>
                    <TableHead>Ngày Ban Hành</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead className="text-right">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{getDocTypeBadge(doc.docType)}</TableCell>
                      <TableCell className="theme-text font-medium">{doc.docNo}</TableCell>
                      <TableCell className="theme-text">{doc.subject}</TableCell>
                      <TableCell className="theme-text">{doc.issueDate}</TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Xem</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions">
          <Card className="theme-card">
            <CardHeader>
              <CardTitle className="theme-text">Quyết Định</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Số Quyết Định</TableHead>
                    <TableHead>Nội Dung</TableHead>
                    <TableHead>Ngày Ban Hành</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyDocuments
                    .filter(d => d.docType === 'decision')
                    .map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="theme-text font-medium">{doc.docNo}</TableCell>
                        <TableCell className="theme-text">{doc.subject}</TableCell>
                        <TableCell className="theme-text">{doc.issueDate}</TableCell>
                        <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts">
          <Card className="theme-card">
            <CardHeader>
              <CardTitle className="theme-text">Hợp Đồng Mẫu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 theme-text-secondary">
                <div className="text-center">
                  <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa có hợp đồng mẫu nào</p>
                  <Button className="mt-4" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Tạo Hợp Đồng Mẫu
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms">
          <Card className="theme-card">
            <CardHeader>
              <CardTitle className="theme-text">Biểu Mẫu Công Ty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="theme-card cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 theme-text-primary" />
                    <h4 className="font-semibold theme-text mb-2">Đơn Xin Nghỉ Phép</h4>
                    <p className="text-sm theme-text-secondary">Biểu mẫu nghỉ phép chuẩn</p>
                    <Button size="sm" className="mt-3">Tải Về</Button>
                  </CardContent>
                </Card>
                <Card className="theme-card cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 theme-text-primary" />
                    <h4 className="font-semibold theme-text mb-2">Hợp Đồng Lao Động</h4>
                    <p className="text-sm theme-text-secondary">Mẫu hợp đồng có logo</p>
                    <Button size="sm" className="mt-3">Tải Về</Button>
                  </CardContent>
                </Card>
                <Card className="theme-card cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 theme-text-primary" />
                    <h4 className="font-semibold theme-text mb-2">Giấy Xác Nhận</h4>
                    <p className="text-sm theme-text-secondary">Mẫu giấy xác nhận</p>
                    <Button size="sm" className="mt-3">Tải Về</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
