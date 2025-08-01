
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  UserPlus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Info,
  Gift,
  Timer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function F0ReferralPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock data
  const dailyLimit = { used: 3, total: 5 };
  const resetTime = "23:45:30"; // Hours:Minutes:Seconds until reset

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số điện thoại",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Thành công",
        description: "Lời mời đã được gửi thành công!"
      });
      setPhoneNumber('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Giới Thiệu Khách Hàng</h1>
        <p className="text-muted-foreground mt-2">Giới thiệu khách hàng mới và nhận hoa hồng hấp dẫn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Voucher Info Card */}
        <Card className="lg:col-span-2 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Gift className="h-5 w-5" />
              Ưu Đãi Đặc Biệt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">200.000 ₫</div>
              <p className="text-blue-800 font-medium">Voucher cho khách hàng mới</p>
              <p className="text-sm text-blue-600 mt-2">
                Áp dụng cho đơn hàng từ 500.000 ₫ trở lên
              </p>
            </div>

            <Alert className="bg-yellow-50 border-yellow-200">
              <Info className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Lưu ý:</strong> Khách hàng sẽ nhận voucher ngay sau khi đăng ký thành công. 
                Bạn nhận hoa hồng khi họ sử dụng voucher mua hàng lần đầu.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại khách hàng *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0987654321"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || dailyLimit.used >= dailyLimit.total}
              >
                {isLoading ? "Đang gửi..." : "Gửi Lời Mời & Voucher"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Hạn Mức Hôm Nay */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Hạn Mức Hôm Nay
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold theme-text-primary">
                {dailyLimit.used}/{dailyLimit.total}
              </div>
              <div className="text-sm text-muted-foreground">Lượt còn lại</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Đã sử dụng</span>
                <span>{dailyLimit.used}/{dailyLimit.total}</span>
              </div>
              <Progress 
                value={(dailyLimit.used / dailyLimit.total) * 100} 
                className="h-2" 
              />
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-orange-800 mb-1">
                <Timer className="h-4 w-4" />
                <span className="font-medium">Reset sau:</span>
              </div>
              <div className="text-2xl font-mono font-bold text-orange-600">
                {resetTime}
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Hạn mức được reset vào 00:00 hàng ngày
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lời Mời Gần Đây */}
      <Card>
        <CardHeader>
          <CardTitle>Lời Mời Gần Đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">0987654321</p>
                  <p className="text-sm text-muted-foreground">Đã đăng ký & sử dụng voucher</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
                <p className="text-xs text-muted-foreground mt-1">2 giờ trước</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">0912345678</p>
                  <p className="text-sm text-muted-foreground">Đã đăng ký, chờ sử dụng voucher</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-yellow-100 text-yellow-800">Chờ mua hàng</Badge>
                <p className="text-xs text-muted-foreground mt-1">5 giờ trước</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <UserPlus className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">0901234567</p>
                  <p className="text-sm text-muted-foreground">Lời mời đã gửi, chờ đăng ký</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-blue-100 text-blue-800">Chờ đăng ký</Badge>
                <p className="text-xs text-muted-foreground mt-1">1 ngày trước</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">0898765432</p>
                  <p className="text-sm text-muted-foreground">Voucher đã hết hạn</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-red-100 text-red-800">Hết hạn</Badge>
                <p className="text-xs text-muted-foreground mt-1">3 ngày trước</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
