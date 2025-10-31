import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { voucherService, VoucherReissueResponse } from '../../services/voucherService';
import { VoucherReissueDisplay } from './VoucherReissueDisplay';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const voucherCodeSchema = z.string()
  .trim()
  .toUpperCase()
  .min(5, 'Mã voucher phải có ít nhất 5 ký tự')
  .max(32, 'Mã voucher không được quá 32 ký tự')
  .regex(/^[A-Z0-9-]+$/, 'Mã voucher chỉ được chứa chữ in hoa, số và dấu gạch ngang');

export function VoucherReissueTab() {
  const [voucherCode, setVoucherCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VoucherReissueResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleReissue = async () => {
    // Validate input with zod
    const validationResult = voucherCodeSchema.safeParse(voucherCode);
    
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || 'Mã voucher không hợp lệ';
      setError(errorMessage);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await voucherService.reissueVoucher(validationResult.data);
      
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
    <div className="max-w-4xl mx-auto space-y-6">
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
            <div className="flex flex-col sm:flex-row gap-3">
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
                className="w-full sm:w-auto sm:min-w-[140px]"
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
