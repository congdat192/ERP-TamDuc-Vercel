import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { KiotVietService } from '@/services/kiotvietService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, XCircle, Info, RefreshCw, Store, Key, CreditCard } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export function KiotVietSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    retailerName: '',
    clientId: '',
    clientSecret: ''
  });

  // Get existing credentials
  const { data: credential, isLoading: credentialLoading } = useQuery({
    queryKey: ['kiotviet-credential'],
    queryFn: KiotVietService.getActiveCredential
  });

  // Save credentials mutation
  const saveMutation = useMutation({
    mutationFn: KiotVietService.saveCredentials,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kiotviet-credential'] });
      toast({ 
        title: 'Kết nối thành công', 
        description: 'Đã lưu thông tin kết nối KiotViet. Token đã được mã hóa an toàn.',
      });
      // Clear client secret field for security
      setFormData(prev => ({ ...prev, clientSecret: '' }));
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Lỗi kết nối', 
        description: error.message, 
        variant: 'destructive' 
      });
    }
  });

  // Get sync logs
  const { data: syncLogs } = useQuery({
    queryKey: ['kiotviet-sync-logs'],
    queryFn: () => KiotVietService.getSyncLogs(10),
    refetchInterval: 30000 // Refresh every 30s
  });

  // Get product stats
  const { data: stats } = useQuery({
    queryKey: ['kiotviet-stats'],
    queryFn: KiotVietService.getProductStats,
    enabled: !!credential
  });

  const handleSave = () => {
    if (!formData.retailerName || !formData.clientId || !formData.clientSecret) {
      toast({
        title: 'Thiếu thông tin',
        description: 'Vui lòng điền đầy đủ tất cả các trường',
        variant: 'destructive'
      });
      return;
    }
    saveMutation.mutate(formData);
  };

  const isConnected = credential?.is_active;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Tích hợp KiotViet</h2>
        <p className="text-muted-foreground mt-1">
          Kết nối với KiotViet để đồng bộ sản phẩm, tồn kho và đơn hàng
        </p>
      </div>

      {/* Connection Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Thông tin kết nối
            </span>
            {isConnected ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Đã kết nối
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <XCircle className="h-3 w-3" />
                Chưa kết nối
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Nhập thông tin từ KiotViet Developer Console
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Info Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Bảo mật:</strong> Client Secret sẽ được dùng để lấy Access Token từ KiotViet.
              Access Token sẽ được mã hóa AES-256-GCM trước khi lưu trữ.
            </AlertDescription>
          </Alert>

          {/* Current Connection Info */}
          {isConnected && credential && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tên cửa hàng:</span>
                <span className="text-sm font-medium">{credential.retailer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Client ID:</span>
                <span className="text-sm font-mono">{credential.client_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Kết nối lúc:</span>
                <span className="text-sm">
                  {formatDistanceToNow(new Date(credential.created_at), { 
                    addSuffix: true,
                    locale: vi 
                  })}
                </span>
              </div>
            </div>
          )}

          {/* Connection Form */}
          <div className="space-y-4 pt-2">
            <div>
              <Label htmlFor="retailerName" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Tên cửa hàng (Retailer)
              </Label>
              <Input
                id="retailerName"
                value={formData.retailerName}
                onChange={(e) => setFormData(prev => ({ ...prev, retailerName: e.target.value }))}
                placeholder="vd: mystore"
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tên retailer trong KiotViet (không có khoảng trắng)
              </p>
            </div>
            
            <div>
              <Label htmlFor="clientId" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Client ID
              </Label>
              <Input
                id="clientId"
                value={formData.clientId}
                onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                placeholder="Nhập Client ID"
                className="mt-1.5"
              />
            </div>
            
            <div>
              <Label htmlFor="clientSecret" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Client Secret (Mã bảo mật)
              </Label>
              <Input
                id="clientSecret"
                type="password"
                value={formData.clientSecret}
                onChange={(e) => setFormData(prev => ({ ...prev, clientSecret: e.target.value }))}
                placeholder="Nhập Client Secret"
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Mã bảo mật sẽ được dùng để lấy Access Token từ KiotViet
              </p>
            </div>

            <Button 
              onClick={handleSave} 
              disabled={saveMutation.isPending}
              className="w-full"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang kết nối...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {isConnected ? 'Cập nhật kết nối' : 'Kết nối KiotViet'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      {isConnected && stats && (
        <Card>
          <CardHeader>
            <CardTitle>Thống kê dữ liệu</CardTitle>
            <CardDescription>Dữ liệu đã đồng bộ từ KiotViet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Tổng sản phẩm</p>
                <p className="text-2xl font-bold mt-1">{stats.totalProducts}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Đang bán</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{stats.activeProducts}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Ngừng bán</p>
                <p className="text-2xl font-bold mt-1 text-gray-600">{stats.inactiveProducts}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Nhóm hàng</p>
                <p className="text-2xl font-bold mt-1">{stats.totalCategories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sync History Card */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Lịch sử đồng bộ
            </CardTitle>
            <CardDescription>10 lần đồng bộ gần nhất</CardDescription>
          </CardHeader>
          <CardContent>
            {!syncLogs || syncLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <RefreshCw className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Chưa có lịch sử đồng bộ</p>
                <p className="text-sm mt-1">Vào trang Products và nhấn "Đồng bộ KiotViet"</p>
              </div>
            ) : (
              <div className="space-y-2">
                {syncLogs.map(log => (
                  <div key={log.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium capitalize">{log.syncType}</p>
                        {log.status === 'success' ? (
                          <Badge variant="default" className="text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Thành công
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            <XCircle className="h-3 w-3 mr-1" />
                            Thất bại
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {log.recordsSynced} bản ghi • {formatDistanceToNow(new Date(log.startedAt), { 
                          addSuffix: true,
                          locale: vi 
                        })}
                      </p>
                      {log.errorMessage && (
                        <p className="text-xs text-destructive mt-1">{log.errorMessage}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Help Card */}
      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn lấy thông tin kết nối</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <p><strong>Bước 1:</strong> Đăng nhập vào KiotViet với tài khoản Admin</p>
            <p><strong>Bước 2:</strong> Vào <strong>Thiết lập cửa hàng</strong> → <strong>Thiết lập kết nối API</strong></p>
            <p><strong>Bước 3:</strong> Copy <strong>Tên gian hàng</strong>, <strong>Client ID</strong> và <strong>Client Secret (Mã bảo mật)</strong></p>
            <p><strong>Bước 4:</strong> Paste vào form trên và nhấn "Kết nối"</p>
            <p className="text-muted-foreground text-xs mt-2">Hệ thống sẽ tự động lấy Access Token từ KiotViet OAuth API</p>
          </div>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Lưu ý:</strong> Access Token sẽ được tự động gia hạn khi hết hạn. 
              Nếu gặp lỗi kết nối, vui lòng kiểm tra lại Client Secret.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
