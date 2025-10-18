import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
  action: 'approve' | 'reject';
  isLoading: boolean;
}

export function ApprovalDialog({
  isOpen,
  onClose,
  onSubmit,
  action,
  isLoading,
}: ApprovalDialogProps) {
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    onSubmit(note.trim());
    setNote('');
  };

  const handleClose = () => {
    setNote('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === 'approve' ? 'Phê Duyệt Văn Bản' : 'Từ Chối Văn Bản'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="approval_note">
              {action === 'approve' ? 'Ghi chú phê duyệt' : 'Lý do từ chối'}
            </Label>
            <Textarea
              id="approval_note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                action === 'approve'
                  ? 'Nhập ghi chú (tùy chọn)...'
                  : 'Nhập lý do từ chối...'
              }
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {note.length} / 1000 ký tự
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            variant={action === 'approve' ? 'default' : 'destructive'}
          >
            {isLoading
              ? 'Đang xử lý...'
              : action === 'approve'
              ? 'Xác Nhận Phê Duyệt'
              : 'Xác Nhận Từ Chối'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
