
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
      case 'active': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-mono font-bold text-lg">{voucher.code}</h3>
            <p className="text-2xl font-bold text-green-600">{voucher.value}</p>
          </div>
          <Badge className={getStatusColor(voucher.status)}>
            {getStatusText(voucher.status)}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Khách hàng:</span>
            <span className="font-medium">{voucher.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span>Điện thoại:</span>
            <span className="font-medium">{voucher.customerPhone}</span>
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
        
        <div className="flex justify-between items-center mt-4 pt-3 border-t">
          <span className="text-xs text-gray-500">
            Bởi: {voucher.issuedBy}
          </span>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy?.(voucher.code)}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView?.(voucher)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
