import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { DisciplineService } from '../../services/disciplineService';
import type { DisciplineRecord } from '../../types/benefits';

interface ResolveDisciplineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  record: DisciplineRecord;
  onSuccess: () => void;
}

export function ResolveDisciplineDialog({ isOpen, onClose, record, onSuccess }: ResolveDisciplineDialogProps) {
  const [resolutionNote, setResolutionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleResolve = async () => {
    if (!resolutionNote.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập ghi chú xử lý',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await DisciplineService.resolveRecord(record.id, resolutionNote);
      toast({
        title: 'Thành công',
        description: 'Đã xử lý hồ sơ kỷ luật',
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityLabel = (severity: string) => {
    const labels: Record<string, string> = {
      warning: 'Nhắc Nhở',
      minor: 'Nhẹ',
      major: 'Nghiêm Trọng',
      critical: 'Cực Kỳ Nghiêm Trọng',
    };
    return labels[severity] || severity;
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Xử Lý Hồ Sơ Kỷ Luật</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Record Info */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Mã Hồ Sơ:</span>
              <span className="text-sm">{record.record_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Nhân Viên:</span>
              <span className="text-sm">{record.employee?.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Ngày Vi Phạm:</span>
              <span className="text-sm">{format(new Date(record.violation_date), 'dd/MM/yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Mức Độ:</span>
              <span className="text-sm font-semibold">{getSeverityLabel(record.severity)}</span>
            </div>
            {record.penalty && (
              <div>
                <span className="text-sm font-medium">Hình Thức Xử Lý:</span>
                <p className="text-sm mt-1">{record.penalty}</p>
              </div>
            )}
            {record.penalty_amount && (
              <div className="flex justify-between">
                <span className="text-sm font-medium">Mức Phạt:</span>
                <span className="text-sm font-semibold text-red-600">
                  {formatCurrency(record.penalty_amount)}
                </span>
              </div>
            )}
            <div>
              <span className="text-sm font-medium">Mô Tả:</span>
              <p className="text-sm mt-1">{record.description}</p>
            </div>
          </div>

          {/* Resolution Note */}
          <div className="space-y-2">
            <Label htmlFor="resolutionNote">
              Ghi Chú Xử Lý <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="resolutionNote"
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="Nhập ghi chú về cách xử lý, kết quả, hoặc thỏa thuận với nhân viên..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button onClick={handleResolve} disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : 'Xác Nhận Xử Lý'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
