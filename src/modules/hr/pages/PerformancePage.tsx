import { Target, TrendingUp, Award, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PerformanceRecord } from '../types';

const dummyPerformance: PerformanceRecord[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Nguyễn Văn An',
    objective: 'Tăng doanh thu vùng miền Bắc',
    keyResults: ['Đạt 5 tỷ doanh thu', 'Tuyển 3 nhân viên mới', 'Mở 2 chi nhánh mới'],
    progress: 75,
    quarter: 'Q1 2024',
    kpiScore: 85,
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Trần Thị Bình',
    objective: 'Hoàn thiện quy trình HR',
    keyResults: ['Số hóa 100% hồ sơ', 'Triển khai HRIS', 'Đào tạo 50 nhân viên'],
    progress: 60,
    quarter: 'Q1 2024',
    kpiScore: 90,
  },
];

export function PerformancePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold theme-text">OKR/KPI & 360° Feedback</h1>
          <p className="theme-text-secondary mt-1">Đánh giá hiệu suất và phản hồi toàn diện</p>
        </div>
        <Button className="gap-2">
          <Target className="h-4 w-4" />
          Thiết Lập OKR Mới
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 theme-text-primary" />
              <div>
                <p className="text-sm theme-text-secondary">KPI Trung Bình</p>
                <p className="text-2xl font-bold theme-text">
                  {(dummyPerformance.reduce((sum, p) => sum + p.kpiScore, 0) / dummyPerformance.length).toFixed(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm theme-text-secondary">OKR Đạt Mục Tiêu</p>
                <p className="text-2xl font-bold theme-text">
                  {dummyPerformance.filter(p => p.progress >= 70).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm theme-text-secondary">Top Performer</p>
                <p className="text-2xl font-bold theme-text">
                  {dummyPerformance.filter(p => p.kpiScore >= 85).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm theme-text-secondary">360° Feedback</p>
                <p className="text-2xl font-bold theme-text">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="okr" className="space-y-4">
        <TabsList>
          <TabsTrigger value="okr">OKR Tracking</TabsTrigger>
          <TabsTrigger value="kpi">KPI Scorecard</TabsTrigger>
          <TabsTrigger value="360">360° Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="okr">
          <Card className="theme-card">
            <CardHeader>
              <CardTitle className="theme-text">OKR Q1 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nhân Viên</TableHead>
                    <TableHead>Objective</TableHead>
                    <TableHead>Key Results</TableHead>
                    <TableHead>Tiến Độ</TableHead>
                    <TableHead>KPI Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyPerformance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="theme-text font-medium">{record.employeeName}</TableCell>
                      <TableCell className="theme-text max-w-xs">{record.objective}</TableCell>
                      <TableCell>
                        <ul className="text-sm theme-text-secondary space-y-1">
                          {record.keyResults.map((kr, idx) => (
                            <li key={idx}>• {kr}</li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={record.progress} className="w-24" />
                          <span className="text-sm theme-text font-medium">{record.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold theme-text">{record.kpiScore}</span>
                          <span className="text-sm theme-text-secondary">/100</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kpi">
          <Card className="theme-card">
            <CardHeader>
              <CardTitle className="theme-text">KPI Scorecard - Q1 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 theme-card rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold theme-text mb-1">Doanh Thu</h4>
                    <p className="text-sm theme-text-secondary">Target: 10 tỷ VND</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={75} className="w-32" />
                    <span className="font-bold text-lg theme-text">75%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 theme-card rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold theme-text mb-1">Số Khách Hàng Mới</h4>
                    <p className="text-sm theme-text-secondary">Target: 100 khách</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={60} className="w-32" />
                    <span className="font-bold text-lg theme-text">60%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 theme-card rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold theme-text mb-1">Tỷ Lệ Hài Lòng</h4>
                    <p className="text-sm theme-text-secondary">Target: 90%</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={85} className="w-32" />
                    <span className="font-bold text-lg theme-text">85%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="360">
          <Card className="theme-card">
            <CardHeader>
              <CardTitle className="theme-text">360° Feedback System</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 theme-text-secondary">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Hệ thống đánh giá 360°</p>
                  <p className="text-sm mt-2">Chức năng đang được phát triển</p>
                  <Button className="mt-4" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Tạo Đánh Giá Mới
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
