import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Props {
  employeeId: string;
  employeeName: string;
}

interface ChangeRequest {
  id: string;
  employee_id: string;
  request_type: string;
  changes: any;
  status: string;
  requested_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_note: string | null;
  reviewer?: {
    id: string;
    profiles: {
      full_name: string;
    };
  };
}

export function EmployeeChangeRequestsTab({ employeeId, employeeName }: Props) {
  const { toast } = useToast();
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, [employeeId]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('employee_change_requests')
        .select('*')
        .eq('employee_id', employeeId)
        .order('requested_at', { ascending: false });

      if (error) throw error;

      setRequests(data as any || []);
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách yêu cầu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch Sử Yêu Cầu Thay Đổi</CardTitle>
        <CardDescription>
          Xem tất cả yêu cầu thay đổi thông tin của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <Send className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có yêu cầu thay đổi nào</h3>
            <p className="text-muted-foreground">
              Khi bạn gửi yêu cầu thay đổi thông tin, chúng sẽ hiển thị ở đây
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày Gửi</TableHead>
                <TableHead>Số Trường</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Người Duyệt</TableHead>
                <TableHead>Ngày Duyệt</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <ChangeRequestRow key={req.id} request={req} />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function ChangeRequestRow({ request }: { request: ChangeRequest }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const changesCount = Object.keys(request.changes).length;
  const reviewerName = request.reviewer?.profiles?.full_name || 'N/A';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">Chờ Duyệt</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">Đã Duyệt</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-500/10 text-red-700 dark:text-red-400">Từ Chối</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatFieldName = (field: string): string => {
    const fieldNames: Record<string, string> = {
      phone: 'Số Điện Thoại',
      current_address: 'Địa Chỉ Hiện Tại',
      birth_date: 'Ngày Sinh',
      emergency_contact_name: 'Tên Người Liên Hệ Khẩn Cấp',
      emergency_contact_phone: 'SĐT Người Liên Hệ Khẩn Cấp',
      emergency_contact_relationship: 'Quan Hệ',
      avatar_path: 'Ảnh Đại Diện',
    };
    return fieldNames[field] || field;
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined || value === '') return '(Trống)';
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      return format(new Date(value), 'dd/MM/yyyy');
    }
    return String(value);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          {format(new Date(request.requested_at), 'dd/MM/yyyy HH:mm')}
        </TableCell>
        <TableCell>{changesCount} trường</TableCell>
        <TableCell>{getStatusBadge(request.status)}</TableCell>
        <TableCell>{reviewerName}</TableCell>
        <TableCell>
          {request.reviewed_at
            ? format(new Date(request.reviewed_at), 'dd/MM/yyyy HH:mm')
            : '-'
          }
        </TableCell>
        <TableCell>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow>
          <TableCell colSpan={6} className="bg-muted/30">
            <div className="p-4 space-y-3">
              <h4 className="font-semibold text-sm">Chi Tiết Thay Đổi:</h4>
              <div className="space-y-2">
                {Object.entries(request.changes).map(([field, values]: [string, any]) => (
                  <div key={field} className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-medium min-w-[200px]">{formatFieldName(field)}:</span>
                    <span className="text-red-600 dark:text-red-400 line-through">
                      {formatValue(values.old)}
                    </span>
                    <span>→</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {formatValue(values.new)}
                    </span>
                  </div>
                ))}
              </div>

              {request.review_note && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                  <span className="font-semibold text-sm">Ghi Chú Từ HR:</span>
                  <p className="text-sm mt-1">{request.review_note}</p>
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
