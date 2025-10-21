import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrainingEnrollmentService, TrainingEnrollment } from '../../services/trainingEnrollmentService';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function EnrollmentListTab() {
  const { toast } = useToast();
  const [enrollments, setEnrollments] = useState<TrainingEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const data = await TrainingEnrollmentService.getEnrollments();
      setEnrollments(data);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      enrolled: 'default',
      in_progress: 'secondary',
      completed: 'success',
      failed: 'destructive',
      dropped: 'secondary'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh Sách Học Viên</CardTitle>
      </CardHeader>
      <CardContent>
        {enrollments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chưa có học viên nào</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhân Viên</TableHead>
                <TableHead>Lớp Học</TableHead>
                <TableHead>Loại Ghi Danh</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Ngày Ghi Danh</TableHead>
                <TableHead>Điểm</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map(enrollment => (
                <TableRow key={enrollment.id}>
                  <TableCell>
                    {enrollment.employees?.full_name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {enrollment.training_sessions?.session_name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{enrollment.enrollment_type}</Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(enrollment.status)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(enrollment.enrolled_date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    {enrollment.final_score ? 
                      <span className="font-medium">{enrollment.final_score}%</span> : 
                      <span className="text-muted-foreground">-</span>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
