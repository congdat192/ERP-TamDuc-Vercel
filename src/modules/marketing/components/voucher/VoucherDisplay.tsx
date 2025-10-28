import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

interface VoucherDisplayProps {
  voucherData: {
    code: string;
    campaign_code: string;
    expired_at: string;
    activation_status: string;
    recipient_phone: string;
    customer_type: 'new' | 'old';
    customer_source: string;
    campaign_id: number;
    created_at: string;
    activated_at: string;
    creator_phone: string;
    success: boolean;
    meta: {
      request_id: string;
      duration_ms: number;
    };
  };
}

export function VoucherDisplay({ voucherData }: VoucherDisplayProps) {
  const voucherRef = useRef<HTMLDivElement>(null);

  const handleCopyText = () => {
    const text = `
🎁 MÃ VOUCHER: ${voucherData.code}
📋 Mã chiến dịch: ${voucherData.campaign_code}
📞 SĐT khách hàng: ${voucherData.recipient_phone}
👤 Loại khách: ${voucherData.customer_type === 'new' ? 'Khách mới' : 'Khách cũ'}
📍 Nguồn: ${voucherData.customer_source}
⏰ Hết hạn: ${new Date(voucherData.expired_at).toLocaleString('vi-VN')}
📞 Hotline: 1900-xxx-xxx
    `.trim();

    navigator.clipboard.writeText(text);
    toast.success('Đã copy nội dung voucher!');
  };

  const handleExportImage = async () => {
    if (!voucherRef.current) return;

    try {
      const canvas = await html2canvas(voucherRef.current, {
        backgroundColor: '#ffffff',
        scale: 2
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/png');
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voucher-${voucherData.code}.png`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Đã tải xuống ảnh voucher!');
    } catch (error) {
      toast.error('Không thể xuất ảnh');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin Voucher</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voucher Visual */}
        <div 
          ref={voucherRef}
          className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-dashed border-green-500"
        >
          <div className="text-center space-y-3">
            <div className="text-sm text-muted-foreground">Mã chiến dịch: {voucherData.campaign_code}</div>
            <div className="text-3xl font-bold text-green-600">{voucherData.code}</div>
            <div className="text-lg font-semibold">
              {voucherData.customer_type === 'new' ? '🆕 Khách mới' : '🔄 Khách cũ'} • {voucherData.customer_source}
            </div>
            <div className="text-xs text-muted-foreground">
              Hết hạn: {new Date(voucherData.expired_at).toLocaleString('vi-VN')}
            </div>
            <div className="text-xs text-muted-foreground">
              SĐT: {voucherData.recipient_phone}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleCopyText} variant="outline" className="flex-1">
            <Copy className="w-4 h-4 mr-2" />
            Copy Text
          </Button>
          <Button onClick={handleExportImage} variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Tải ảnh
          </Button>
        </div>

        {/* Details */}
        <div className="text-sm text-muted-foreground space-y-1">
          <div><strong>Trạng thái:</strong> {voucherData.activation_status}</div>
        </div>
      </CardContent>
    </Card>
  );
}
