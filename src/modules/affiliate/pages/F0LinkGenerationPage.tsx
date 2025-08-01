
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Link2, 
  Copy, 
  Share2, 
  Eye, 
  Users, 
  TrendingUp,
  Gift,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function F0LinkGenerationPage() {
  const [customName, setCustomName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateLink = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const link = `https://matkinhtamduc.xyz/ref/${customName || 'default'}?f0=USER123`;
      setGeneratedLink(link);
      toast({
        title: "Thành công",
        description: "Link giới thiệu đã được tạo!"
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: "Đã sao chép",
      description: "Link đã được sao chép vào clipboard"
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tạo Link Giới Thiệu</h1>
        <p className="text-muted-foreground mt-2">Tạo link cá nhân hóa để chia sẻ với bạn bè</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form tạo link */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Tạo Link Mới
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Gift className="h-4 w-4" />
              <AlertDescription>
                <strong>Ưu đãi đặc biệt:</strong> Khách hàng đăng ký qua link của bạn sẽ nhận ngay voucher 200.000 VND cho đơn hàng đầu tiên!
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customName">Tên link tùy chỉnh (không bắt buộc)</Label>
                <Input
                  id="customName"
                  placeholder="vi-du: ban-than-cua-toi"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Link sẽ có dạng: matkinhtamduc.xyz/ref/ban-than-cua-toi
                </p>
              </div>

              <Button 
                onClick={handleGenerateLink} 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Đang tạo..." : "Tạo Link Giới Thiệu"}
              </Button>
            </div>

            {/* Link đã tạo */}
            {generatedLink && (
              <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Link đã được tạo thành công!</h3>
                </div>
                
                <div className="space-y-2">
                  <Label>Link giới thiệu của bạn:</Label>
                  <div className="flex gap-2">
                    <Input value={generatedLink} readOnly className="bg-white" />
                    <Button variant="outline" size="sm" onClick={handleCopyLink}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-green-700">
                  <p><strong>Hướng dẫn sử dụng:</strong></p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Chia sẻ link này với bạn bè qua Facebook, Zalo, SMS</li>
                    <li>Khi có người đăng ký qua link, bạn sẽ nhận thông báo</li>
                    <li>Hoa hồng sẽ được tính khi F1 thực hiện đơn hàng đầu tiên</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lợi ích */}
        <Card>
          <CardHeader>
            <CardTitle>Lợi Ích Khi Sử Dụng Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Theo dõi hiệu suất</h4>
                <p className="text-sm text-muted-foreground">Xem số lượt click và tỷ lệ chuyển đổi</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Tự động ghi nhận</h4>
                <p className="text-sm text-muted-foreground">F1 sẽ tự động được gán cho bạn</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">Tối ưu chia sẻ</h4>
                <p className="text-sm text-muted-foreground">Link ngắn gọn, dễ nhớ và chia sẻ</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hiệu suất link */}
      <Card>
        <CardHeader>
          <CardTitle>Hiệu Suất Link Gần Đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold theme-text-primary">0</div>
              <div className="text-sm text-muted-foreground">Lượt click</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-muted-foreground">Đăng ký thành công</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-muted-foreground">F1 đã mua hàng</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">0%</div>
              <div className="text-sm text-muted-foreground">Tỷ lệ chuyển đổi</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
