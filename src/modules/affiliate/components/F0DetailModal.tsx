
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, Mail, Phone, User, Users, DollarSign, Gift } from 'lucide-react';
import { F0User } from '../types';

interface F0DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  f0User: F0User | null;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function F0DetailModal({ isOpen, onClose, f0User, onApprove, onReject }: F0DetailModalProps) {
  if (!f0User) return null;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Chi tiết F0: {f0User.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Họ tên:</span>
                <span>{f0User.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <span>{f0User.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Số điện thoại:</span>
                <span>{f0User.phone}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Ngày đăng ký:</span>
                <span>{f0User.registrationDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Trạng thái:</span>
                <Badge variant={getStatusBadgeVariant(f0User.status)}>
                  {getStatusText(f0User.status)}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Tổng F1</span>
              </div>
              <div className="text-2xl font-bold">{f0User.totalF1}</div>
            </div>
            <div className="text-center p-4 rounded-lg border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <span className="font-medium">Hoa hồng</span>
              </div>
              <div className="text-2xl font-bold">{f0User.totalCommission.toLocaleString()} VND</div>
            </div>
            <div className="text-center p-4 rounded-lg border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-purple-500" />
                <span className="font-medium">Voucher</span>
              </div>
              <div className="text-2xl font-bold">{f0User.totalVouchers}</div>
            </div>
          </div>

          {/* Actions */}
          {f0User.status === 'pending' && (
            <>
              <Separator />
              <div className="flex gap-3 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => onReject?.(f0User.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Từ chối
                </Button>
                <Button 
                  onClick={() => onApprove?.(f0User.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Duyệt F0
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
