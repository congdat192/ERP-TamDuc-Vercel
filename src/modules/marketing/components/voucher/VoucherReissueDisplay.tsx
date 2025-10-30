import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Copy } from 'lucide-react';
import QRCode from 'qrcode';
import { useToast } from '@/hooks/use-toast';

interface VoucherReissueDisplayProps {
  originalCode: string;
  newCode: string;
  isSecondReissue: boolean;
}

export function VoucherReissueDisplay({
  originalCode,
  newCode,
  isSecondReissue,
}: VoucherReissueDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (newCode) {
      QRCode.toDataURL(newCode, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }).then(setQrCodeUrl);
    }
  }, [newCode]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(newCode);
      toast({
        title: 'Đã copy!',
        description: `Mã voucher ${newCode} đã được copy vào clipboard`,
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể copy mã voucher',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            Cấp lại voucher thành công
          </CardTitle>
          {isSecondReissue && (
            <Badge variant="destructive" className="ml-auto">
              Lần cấp lại 2 (lần cuối)
            </Badge>
          )}
          {!isSecondReissue && (
            <Badge variant="secondary" className="ml-auto">
              Lần cấp lại 1
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: Info */}
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Mã voucher cũ
              </div>
              <div className="text-base font-mono text-muted-foreground line-through">
                {originalCode}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Mã voucher mới
              </div>
              <div className="text-3xl font-bold font-mono text-green-700 tracking-wider">
                {newCode}
              </div>
            </div>

            <Button
              onClick={handleCopyCode}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy mã voucher
            </Button>

            {isSecondReissue && (
              <div className="text-sm text-red-600 font-medium border border-red-200 bg-red-50 rounded-md p-3">
                ⚠️ Đây là lần cấp lại cuối cùng, voucher này không thể cấp lại nữa
              </div>
            )}
          </div>

          {/* Right: QR Code */}
          <div className="flex items-center justify-center">
            {qrCodeUrl ? (
              <div className="border-4 border-green-500 rounded-lg p-3 bg-white shadow-lg">
                <img
                  src={qrCodeUrl}
                  alt={`QR Code for ${newCode}`}
                  className="w-full h-auto"
                />
              </div>
            ) : (
              <div className="w-[300px] h-[300px] border-4 border-green-300 rounded-lg flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
