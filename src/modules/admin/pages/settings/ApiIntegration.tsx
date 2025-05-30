
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Save, Plus, Key, Link, RefreshCw, Trash2 } from 'lucide-react';
import { ApiIntegration as ApiIntegrationType } from '../../types/settings';

const mockIntegrations: ApiIntegrationType[] = [
  {
    id: '1',
    name: 'KiotViet POS',
    description: 'Đồng bộ dữ liệu với hệ thống KiotViet',
    status: 'connected',
    apiKey: 'kv_****_****_1234',
    lastSync: '2024-01-15 10:30:00',
    features: ['Đồng bộ sản phẩm', 'Đồng bộ đơn hàng', 'Báo cáo bán hàng']
  },
  {
    id: '2',
    name: 'Sapo Web',
    description: 'Kết nối với nền tảng Sapo',
    status: 'disconnected',
    features: ['Quản lý kho', 'Đồng bộ khách hàng']
  },
  {
    id: '3',
    name: 'Zalo Official Account',
    description: 'Gửi thông báo qua Zalo OA',
    status: 'error',
    apiKey: 'zalo_****_****_5678',
    lastSync: '2024-01-10 14:20:00',
    features: ['Gửi thông báo', 'Tin nhắn tự động']
  }
];

export function ApiIntegration() {
  const [integrations, setIntegrations] = useState<ApiIntegrationType[]>(mockIntegrations);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getStatusBadge = (status: ApiIntegrationType['status']) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-100 text-green-800">Đã Kết Nối</Badge>;
      case 'disconnected':
        return <Badge variant="secondary">Chưa Kết Nối</Badge>;
      case 'error':
        return <Badge variant="destructive">Lỗi</Badge>;
      default:
        return <Badge variant="secondary">Không Xác Định</Badge>;
    }
  };

  const handleConnect = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, status: 'connected' as const, lastSync: new Date().toLocaleString('vi-VN') }
        : integration
    ));
    toast({
      title: "Kết Nối Thành Công",
      description: "Đã kết nối với dịch vụ bên thứ ba.",
    });
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, status: 'disconnected' as const, apiKey: undefined, lastSync: undefined }
        : integration
    ));
    toast({
      title: "Đã Ngắt Kết Nối",
      description: "Đã ngắt kết nối với dịch vụ bên thứ ba.",
    });
  };

  const handleRegenerateKey = (id: string) => {
    toast({
      title: "API Key Đã Được Tạo Mới",
      description: "Vui lòng cập nhật API key mới trong ứng dụng của bạn.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">API & Kết Nối</h2>
          <p className="text-gray-600">Quản lý kết nối với các dịch vụ bên thứ ba</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm Kết Nối
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm Kết Nối Mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tên dịch vụ</Label>
                <Input placeholder="VD: Shopee API, Lazada..." />
              </div>
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input placeholder="Nhập API key..." />
              </div>
              <div className="space-y-2">
                <Label>API Secret</Label>
                <Input type="password" placeholder="Nhập API secret..." />
              </div>
              <div className="flex space-x-2 pt-4">
                <Button className="flex-1">Thêm Kết Nối</Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Integration List */}
      <div className="space-y-4">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Link className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                </div>
                {getStatusBadge(integration.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integration.apiKey && (
                  <div>
                    <Label className="text-sm font-medium">API Key</Label>
                    <p className="text-sm text-gray-600 font-mono">{integration.apiKey}</p>
                  </div>
                )}
                
                {integration.lastSync && (
                  <div>
                    <Label className="text-sm font-medium">Đồng Bộ Lần Cuối</Label>
                    <p className="text-sm text-gray-600">{integration.lastSync}</p>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Tính Năng</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {integration.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-2 border-t">
                {integration.status === 'connected' ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDisconnect(integration.id)}
                    >
                      Ngắt Kết Nối
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRegenerateKey(integration.id)}
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Tạo Lại Key
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="sm"
                    onClick={() => handleConnect(integration.id)}
                  >
                    <Link className="w-4 h-4 mr-1" />
                    Kết Nối
                  </Button>
                )}
                
                <Button variant="ghost" size="sm" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* API Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5" />
            <span>Cài Đặt API</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                value="https://api.yourcompany.com/webhook"
                placeholder="https://api.yourcompany.com/webhook"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apiTimeout">API Timeout (giây)</Label>
              <Input
                id="apiTimeout"
                type="number"
                defaultValue="30"
                placeholder="30"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Lưu Cài Đặt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
