import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DisciplineService } from '../../services/disciplineService';
import type { DisciplineRecord, UpdateDisciplineData } from '../../types/benefits';

interface EditDisciplineModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: DisciplineRecord;
  onSuccess: () => void;
}

export function EditDisciplineModal({ isOpen, onClose, record, onSuccess }: EditDisciplineModalProps) {
  const [formData, setFormData] = useState<UpdateDisciplineData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (record) {
      setFormData({
        violation_type: record.violation_type,
        violation_date: record.violation_date,
        description: record.description,
        severity: record.severity,
        penalty: record.penalty,
        penalty_amount: record.penalty_amount,
        notes: record.notes,
      });
    }
  }, [record]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description?.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập mô tả vi phạm',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await DisciplineService.updateRecord(record.id, formData);
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật hồ sơ kỷ luật',
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Hồ Sơ Kỷ Luật</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Record Code (Read-only) */}
          <div className="space-y-2">
            <Label>Mã Hồ Sơ</Label>
            <Input value={record.record_code} disabled />
          </div>

          {/* Violation Type & Severity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="violation_type">Loại Vi Phạm</Label>
              <Select
                value={formData.violation_type}
                onValueChange={(value: any) => setFormData({ ...formData, violation_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="late">Đi Trễ</SelectItem>
                  <SelectItem value="absent">Vắng Mặt</SelectItem>
                  <SelectItem value="policy-violation">Vi Phạm Quy Định</SelectItem>
                  <SelectItem value="misconduct">Hành Vi Sai Trái</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Mức Độ</Label>
              <Select
                value={formData.severity}
                onValueChange={(value: any) => setFormData({ ...formData, severity: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warning">Nhắc Nhở</SelectItem>
                  <SelectItem value="minor">Nhẹ</SelectItem>
                  <SelectItem value="major">Nghiêm Trọng</SelectItem>
                  <SelectItem value="critical">Cực Kỳ Nghiêm Trọng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Violation Date */}
          <div className="space-y-2">
            <Label htmlFor="violation_date">Ngày Vi Phạm</Label>
            <Input
              id="violation_date"
              type="date"
              value={formData.violation_date || ''}
              onChange={(e) => setFormData({ ...formData, violation_date: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Mô Tả Vi Phạm <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Penalty */}
          <div className="space-y-2">
            <Label htmlFor="penalty">Hình Thức Xử Lý</Label>
            <Textarea
              id="penalty"
              value={formData.penalty || ''}
              onChange={(e) => setFormData({ ...formData, penalty: e.target.value })}
              rows={2}
            />
          </div>

          {/* Penalty Amount */}
          <div className="space-y-2">
            <Label htmlFor="penalty_amount">Mức Phạt (VNĐ)</Label>
            <Input
              id="penalty_amount"
              type="number"
              value={formData.penalty_amount || ''}
              onChange={(e) => setFormData({ ...formData, penalty_amount: parseFloat(e.target.value) || undefined })}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi Chú</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang cập nhật...' : 'Cập Nhật'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
