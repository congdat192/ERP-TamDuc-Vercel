
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Voucher } from '../types';
import { Copy, Eye, MoreVertical } from 'lucide-react';

interface VoucherCardProps {
  voucher: Voucher;
  onView?: (voucher: Voucher) => void;
  onCopy?: (code: string) => void;
}

export function VoucherCard({ voucher, onView, onCopy }: VoucherCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'berry-success-light';
      case 'used': return 'berry-info-light';
      case 'expired': return 'berry-error-light';
      case 'cancelled': return 'berry-warning-light';
      default: return 'berry-info-light';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Đang Hoạt Động';
      case 'used': return 'Đã Sử Dụng';
      case 'expired': return 'Hết Hạn';
      case 'cancelled': return 'Đã Hủy';
      default: return 'Không Xác Định';
    }
  };

  return (
    <Card className="voucher-card hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-mono font-bold text-lg theme-text">{voucher.code}</h3>
            <p className="text-2xl font-bold theme-text-primary">{voucher.value}</p>
          </div>
          <Badge className={getStatusColor(voucher.status)}>
            {getStatusText(voucher.status)}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm theme-text-muted">
          <div className="flex justify-between">
            <span>Khách hàng:</span>
            <span className="font-medium theme-text">{voucher.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span>Điện thoại:</span>
            <span className="font-medium theme-text">{voucher.customerPhone}</span>
          </div>
          <div className="flex justify-between">
            <span>Ngày phát hành:</span>
            <span>{voucher.issueDate}</span>
          </div>
          <div className="flex justify-between">
            <span>Hết hạn:</span>
            <span>{voucher.expiryDate}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-3 border-t theme-border-primary/20">
          <span className="text-xs theme-text-muted">
            Bởi: {voucher.issuedBy}
          </span>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy?.(voucher.code)}
              className="hover:theme-bg-primary/5"
            >
              <Copy className="w-4 h-4 theme-text-primary" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView?.(voucher)}
              className="hover:theme-bg-primary/5"
            >
              <Eye className="w-4 h-4 theme-text-primary" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
