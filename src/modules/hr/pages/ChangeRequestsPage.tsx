import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp, Check, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ChangeRequest {
  id: string;
  employee_id: string;
  request_type: string;
  changes: any;
  status: string;
  requested_at: string;
  employees: {
    id: string;
    employee_code: string;
    full_name: string;
    position: string;
    department: string;
  };
}

export function ChangeRequestsPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('employee_change_requests')
        .select(`
          *,
          employees (
            id,
            employee_code,
            full_name,
            position,
            department
          )
        `)
        .eq('status', 'pending')
        .order('requested_at', { ascending: false });

      if (error) throw error;

      setRequests(data || []);
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

  const handleOpenModal = (request: ChangeRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    setReviewNote('');
    setIsModalOpen(true);
  };

  const handleProcessRequest = async () => {
    if (!selectedRequest) return;

    setIsProcessing(true);
    try {
      const { error } = await supabase.functions.invoke('approve-change-request', {
        body: {
          requestId: selectedRequest.id,
          approved: actionType === 'approve',
          reviewNote: reviewNote || null
        }
      });

      if (error) throw error;

      toast({
        title: actionType === 'approve' ? "Đã Phê Duyệt" : "Đã Từ Chối",
        description: actionType === 'approve'
          ? "Thông tin nhân viên đã được cập nhật."
          : "Yêu cầu đã bị từ chối.",
      });

      await fetchRequests();
      setIsModalOpen(false);
      setSelectedRequest(null);
      setReviewNote('');
    } catch (error: any) {
      console.error('Error processing request:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xử lý yêu cầu",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Yêu Cầu Thay Đổi Thông Tin</h1>
          <p className="text-muted-foreground mt-1">
            Phê duyệt hoặc từ chối yêu cầu thay đổi thông tin từ nhân viên
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {requests.length} yêu cầu chờ duyệt
        </Badge>
      </div>

      <Card>
        <CardContent className="p-0">
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Không có yêu cầu chờ duyệt</h3>
              <p className="text-muted-foreground">
                Tất cả yêu cầu thay đổi đã được xử lý
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nhân Viên</TableHead>
                  <TableHead>Phòng Ban</TableHead>
                  <TableHead>Ngày Gửi</TableHead>
                  <TableHead>Số Trường</TableHead>
                  <TableHead>Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <ChangeRequestAdminRow
                    key={req.id}
                    request={req}
                    onApprove={() => handleOpenModal(req, 'approve')}
                    onReject={() => handleOpenModal(req, 'reject')}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Approve/Reject Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Phê Duyệt' : 'Từ Chối'} Yêu Cầu Thay Đổi
            </DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <>
                  Nhân viên: <strong>{selectedRequest.employees.full_name}</strong> ({selectedRequest.employees.employee_code})
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="border rounded-md p-4 bg-muted/30">
                <h4 className="font-semibold mb-3">Chi Tiết Thay Đổi:</h4>
                <div className="space-y-2">
                  {Object.entries(selectedRequest.changes).map(([field, values]: [string, any]) => (
                    <div key={field} className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium min-w-[200px]">{formatFieldName(field)}:</span>
                      <span className="text-red-600 line-through">{formatValue(values.old)}</span>
                      <span>→</span>
                      <span className="text-green-600 font-medium">{formatValue(values.new)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="review_note">Ghi Chú (Tùy Chọn)</Label>
                <Textarea
                  id="review_note"
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Nhập ghi chú về quyết định của bạn..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isProcessing}>
              Hủy
            </Button>
            <Button
              onClick={handleProcessRequest}
              disabled={isProcessing}
              variant={actionType === 'approve' ? 'default' : 'destructive'}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  {actionType === 'approve' ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Phê Duyệt
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Từ Chối
                    </>
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ChangeRequestAdminRow({
  request,
  onApprove,
  onReject
}: {
  request: ChangeRequest;
  onApprove: () => void;
  onReject: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const changesCount = Object.keys(request.changes).length;

  return (
    <>
      <TableRow>
        <TableCell>
          <div>
            <div className="font-medium">{request.employees.full_name}</div>
            <div className="text-sm text-muted-foreground">{request.employees.employee_code}</div>
          </div>
        </TableCell>
        <TableCell>{request.employees.department}</TableCell>
        <TableCell>
          {format(new Date(request.requested_at), 'dd/MM/yyyy HH:mm')}
        </TableCell>
        <TableCell>{changesCount} trường</TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={onApprove}
            >
              <Check className="w-4 h-4 mr-1" />
              Duyệt
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onReject}
            >
              <X className="w-4 h-4 mr-1" />
              Từ Chối
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow>
          <TableCell colSpan={5} className="bg-muted/30">
            <div className="p-4 space-y-2">
              <h4 className="font-semibold text-sm">Chi Tiết:</h4>
              {Object.entries(request.changes).map(([field, values]: [string, any]) => (
                <div key={field} className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium min-w-[200px]">{formatFieldName(field)}:</span>
                  <span className="text-red-600 line-through">{formatValue(values.old)}</span>
                  <span>→</span>
                  <span className="text-green-600 font-medium">{formatValue(values.new)}</span>
                </div>
              ))}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function formatFieldName(field: string): string {
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
}

function formatValue(value: any): string {
  if (value === null || value === undefined || value === '') return '(Trống)';
  if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
    return format(new Date(value), 'dd/MM/yyyy');
  }
  return String(value);
}
