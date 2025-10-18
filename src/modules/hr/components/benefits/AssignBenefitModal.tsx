import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { BenefitsService } from '../../services/benefitsService';
import type { Benefit } from '../../types/benefits';
import { EmployeeSelector } from '../shared/EmployeeSelector';

interface AssignBenefitModalProps {
  isOpen: boolean;
  onClose: () => void;
  benefit: Benefit;
  onSuccess: () => void;
}

export function AssignBenefitModal({ isOpen, onClose, benefit, onSuccess }: AssignBenefitModalProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeId || !startDate) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await BenefitsService.assignBenefitToEmployee(
        benefit.id,
        employeeId,
        startDate,
        endDate || undefined
      );
      toast({
        title: 'Thành công',
        description: 'Đã gán phúc lợi cho nhân viên',
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gán Phúc Lợi: {benefit.benefit_name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">
              Nhân Viên <span className="text-destructive">*</span>
            </Label>
            <EmployeeSelector
              value={employeeId}
              onValueChange={setEmployeeId}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">
              Ngày Bắt Đầu <span className="text-destructive">*</span>
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Ngày Kết Thúc</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang gán...' : 'Gán Phúc Lợi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
