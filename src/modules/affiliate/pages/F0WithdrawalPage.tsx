
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wallet, 
  DollarSign, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-states';
import { useToast } from '@/hooks/use-toast';

export function F0WithdrawalPage() {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số tiền muốn rút",
        variant: "destructive"
      });
      return;
    }

    const withdrawAmount = Number(amount);
    if (withdrawAmount < 100000) {
      toast({
        title: "Lỗi",
        description: "Số tiền rút tối thiểu là 100,000 VND",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Thành công",
        description: "Yêu cầu rút tiền đã được gửi!"
      });
      setAmount('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rút Tiền Hoa Hồng</h1>
        <p className="text-muted-foreground mt-2">Rút tiền hoa hồng về tài khoản ngân hàng</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <Card className="theme-bg-primary text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <DollarSign className="h-5 w-5" />
              Số Dư Hiện Tại
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0 ₫</div>
            <div className="text-white/80 text-sm mt-2">Có thể rút: 0 ₫</div>
          </CardContent>
        </Card>

        {/* Withdrawal Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Yêu Cầu Rút Tiền
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Bạn cần hoàn thành thông tin tài khoản ngân hàng trước khi có thể rút tiền lần đầu!
              </AlertDescription>
            </Alert>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Số tiền rút tối thiểu: 100,000 VND. Thời gian xử lý: 1-3 ngày làm việc.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Số tiền muốn rút (VND) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="100000"
                  min="100000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Gửi Yêu Cầu"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal History */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch Sử Rút Tiền</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="Chưa có yêu cầu rút tiền nào"
            description="Các yêu cầu rút tiền của bạn sẽ hiển thị ở đây"
          />
        </CardContent>
      </Card>
    </div>
  );
}
