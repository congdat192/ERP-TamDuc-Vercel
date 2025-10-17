import { GraduationCap, Award, BookOpen, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrainingCourse } from '../types';

const dummyCourses: TrainingCourse[] = [
  {
    id: '1',
    courseName: 'Kỹ Năng Bán Hàng Chuyên Nghiệp',
    instructor: 'Nguyễn Văn A',
    duration: '2 tuần',
    startDate: '2024-02-01',
    participants: 15,
    status: 'upcoming',
  },
  {
    id: '2',
    courseName: 'Quản Lý Thời Gian Hiệu Quả',
    instructor: 'Trần Thị B',
    duration: '1 tuần',
    startDate: '2024-01-15',
    participants: 20,
    status: 'ongoing',
  },
];

const competencyLevels = [
  { level: 1, name: 'Mới vào nghề', color: 'bg-red-500' },
  { level: 2, name: 'Đã làm quen', color: 'bg-orange-500' },
  { level: 3, name: 'Thành thạo', color: 'bg-yellow-500' },
  { level: 4, name: 'Chuyên gia', color: 'bg-blue-500' },
  { level: 5, name: 'Master', color: 'bg-purple-500' },
];

export function TrainingPage() {
  const getStatusBadge = (status: TrainingCourse['status']) => {
    const statusMap = {
      upcoming: { label: 'Sắp diễn ra', variant: 'secondary' as const },
      ongoing: { label: 'Đang diễn ra', variant: 'default' as const },
      completed: { label: 'Hoàn thành', variant: 'outline' as const },
    };
    const config = statusMap[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold theme-text">Đào Tạo & Khung Năng Lực</h1>
          <p className="theme-text-secondary mt-1">Quản lý đào tạo và phát triển năng lực nhân viên</p>
        </div>
        <Button className="gap-2">
          <BookOpen className="h-4 w-4" />
          Tạo Khóa Học Mới
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 theme-text-primary" />
              <div>
                <p className="text-sm theme-text-secondary">Khóa Học</p>
                <p className="text-2xl font-bold theme-text">{dummyCourses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="theme-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm theme-text-secondary">Đang Diễn Ra</p>
                <p className="text-2xl font-bold theme-text">
                  {dummyCourses.filter(c => c.status === 'ongoing').length}
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
                <p className="text-sm theme-text-secondary">Học Viên</p>
                <p className="text-2xl font-bold theme-text">
                  {dummyCourses.reduce((sum, c) => sum + c.participants, 0)}
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
                <p className="text-sm theme-text-secondary">Tỷ Lệ Hoàn Thành</p>
                <p className="text-2xl font-bold theme-text">0%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competency Framework */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="theme-text">Khung Năng Lực 5 Bậc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {competencyLevels.map((level) => (
              <Card key={level.level} className="theme-card border-2">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 rounded-full ${level.color} text-white flex items-center justify-center text-xl font-bold mx-auto mb-3`}>
                    {level.level}
                  </div>
                  <h3 className="font-semibold theme-text mb-2">{level.name}</h3>
                  <p className="text-xs theme-text-secondary">Bậc {level.level}/5</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training Courses */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="theme-text">Danh Sách Khóa Học</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Khóa Học</TableHead>
                <TableHead>Giảng Viên</TableHead>
                <TableHead>Thời Lượng</TableHead>
                <TableHead>Ngày Bắt Đầu</TableHead>
                <TableHead>Học Viên</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Tiến Độ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="theme-text font-medium">{course.courseName}</TableCell>
                  <TableCell className="theme-text">{course.instructor}</TableCell>
                  <TableCell className="theme-text">{course.duration}</TableCell>
                  <TableCell className="theme-text">{course.startDate}</TableCell>
                  <TableCell className="theme-text">{course.participants}</TableCell>
                  <TableCell>{getStatusBadge(course.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={course.status === 'ongoing' ? 50 : 0} className="w-20" />
                      <span className="text-sm theme-text-secondary">
                        {course.status === 'ongoing' ? '50%' : '0%'}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Competency Matrix */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="theme-text">Ma Trận Năng Lực Nhân Viên</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 theme-text-secondary">
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Ma trận năng lực chi tiết</p>
              <p className="text-sm mt-2">Chức năng đang được phát triển</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
