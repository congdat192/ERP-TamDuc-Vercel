
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  UserPlus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Info 
} from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-states';
import { useToast } from '@/hooks/use-toast';

export function F0ReferralPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
    // Simulate API call
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
        <p className="text-muted-foreground mt-2">Giới thiệu khách hàng mới và nhận hoa hồng</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Referral Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Gửi Lời Mời Giới Thiệu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Nhập số điện thoại khách hàng để gửi lời mời. Mỗi số điện thoại chỉ có thể được giới thiệu một lần.
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
                disabled={isLoading}
              >
                {isLoading ? "Đang gửi..." : "Gửi Lời Mời"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Daily Limits */}
        <Card>
          <CardHeader>
            <CardTitle>Giới Hạn Hôm Nay</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold theme-text-primary">10</div>
              <div className="text-sm text-muted-foreground">Lượt còn lại</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Đã sử dụng</span>
                <span>0/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="theme-bg-primary h-2 rounded-full" style={{width: '0%'}}></div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Giới hạn được reset vào 00:00 hàng ngày
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>Lời Mời Gần Đây</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="Chưa có lời mời nào"
            description="Các lời mời bạn gửi sẽ hiển thị ở đây"
          />
        </CardContent>
      </Card>
    </div>
  );
}
