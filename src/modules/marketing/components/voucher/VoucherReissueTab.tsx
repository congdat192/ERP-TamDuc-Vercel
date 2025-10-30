import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { voucherService, VoucherReissueResponse } from '../../services/voucherService';
import { VoucherReissueDisplay } from './VoucherReissueDisplay';
import { useToast } from '@/hooks/use-toast';

export function VoucherReissueTab() {
  const [voucherCode, setVoucherCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VoucherReissueResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleReissue = async () => {
    if (!voucherCode.trim()) {
      setError('Vui lòng nhập mã voucher');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await voucherService.reissueVoucher(voucherCode.trim());
      
      if (response.success) {
        setResult(response);
        toast({
          title: 'Thành công',
          description: response.message,
        });
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Có lỗi xảy ra khi cấp lại voucher';
      setError(errorMessage);
      toast({
        title: 'Lỗi',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setVoucherCode('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Cấp lại Voucher</CardTitle>
          <CardDescription>
            Nhập mã voucher cũ đã sử dụng để cấp lại voucher mới
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="Nhập mã voucher cũ (VD: ABC123)"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    handleReissue();
                  }
                }}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleReissue}
                disabled={!voucherCode.trim() || isLoading}
                className="min-w-[140px]"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cấp lại voucher
              </Button>
            </div>
            
            {result && (
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full"
              >
                Cấp lại voucher khác
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Result */}
      {result?.success && (
        <VoucherReissueDisplay
          originalCode={voucherCode}
          newCode={result.reissue_1_code || result.reissue_2_code || ''}
          isSecondReissue={!!result.reissue_2_code}
        />
      )}
    </div>
  );
}
