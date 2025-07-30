
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, CreditCard, DollarSign, User, Building } from 'lucide-react';
import { WithdrawalRequest } from '../types';

interface WithdrawalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  withdrawal: WithdrawalRequest | null;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onProcess?: (id: string) => void;
}

export function WithdrawalDetailModal({ 
  isOpen, 
  onClose, 
  withdrawal, 
  onApprove, 
  onReject, 
  onProcess 
}: WithdrawalDetailModalProps) {
  if (!withdrawal) return null;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'processed': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      case 'processed': return 'Đã chuyển';
      default: return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Chi tiết yêu cầu rút tiền
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">F0:</span>
                <span>{withdrawal.f0Name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Ngày yêu cầu:</span>
                <span>{withdrawal.requestDate}</span>
              </div>
              {withdrawal.processedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Ngày xử lý:</span>
                  <span>{withdrawal.processedDate}</span>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium">Số tiền:</span>
                <span className="text-xl font-bold text-green-600">
                  {withdrawal.amount.toLocaleString()} VND
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Trạng thái:</span>
                <Badge variant={getStatusBadgeVariant(withdrawal.status)}>
                  {getStatusText(withdrawal.status)}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Bank Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-medium">
              <Building className="h-5 w-5" />
              Thông tin ngân hàng
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="font-medium">Ngân hàng:</span>
                  <span>{withdrawal.bankInfo.bankName}</span>
                </div>
                <div>
                  <span className="font-medium">Số tài khoản:</span>
                  <span className="ml-2 font-mono">{withdrawal.bankInfo.accountNumber}</span>
                </div>
              </div>
              <div>
                <span className="font-medium">Tên chủ tài khoản:</span>
                <span className="ml-2">{withdrawal.bankInfo.accountName}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <Separator />
          <div className="flex gap-3 justify-end">
            {withdrawal.status === 'pending' && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => onReject?.(withdrawal.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Từ chối
                </Button>
                <Button 
                  onClick={() => onApprove?.(withdrawal.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Duyệt
                </Button>
              </>
            )}
            {withdrawal.status === 'approved' && (
              <Button 
                onClick={() => onProcess?.(withdrawal.id)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Chuyển tiền
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
