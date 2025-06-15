
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plug, ExternalLink, Settings, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function IntegrationsSettings() {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState([
    {
      id: 'kiotviet',
      name: 'KiotViet',
      description: 'Đồng bộ sản phẩm và đơn hàng với KiotViet',
      status: 'connected',
      enabled: true,
      icon: '🏪',
      lastSync: '2024-05-29 14:30'
    },
    {
      id: 'shopee',
      name: 'Shopee',
      description: 'Quản lý đơn hàng và sản phẩm trên Shopee',
      status: 'disconnected',
      enabled: false,
      icon: '🛒',
      lastSync: null
    },
    {
      id: 'lazada',
      name: 'Lazada',
      description: 'Tích hợp với marketplace Lazada',
      status: 'error',
      enabled: true,
      icon: '🛍️',
      lastSync: '2024-05-28 10:15'
    },
    {
      id: 'tiki',
      name: 'Tiki',
      description: 'Đồng bộ catalog và đơn hàng với Tiki',
      status: 'disconnected',
      enabled: false,
      icon: '📦',
      lastSync: null
    }
  ]);

  const handleToggleIntegration = (id: string, enabled: boolean) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id ? { ...integration, enabled } : integration
    ));
    
    toast({
      title: enabled ? 'Đã kích hoạt tích hợp' : 'Đã tắt tích hợp',
      description: `Tích hợp đã được ${enabled ? 'kích hoạt' : 'tắt'}.`
    });
  };

  const handleConnect = (name: string) => {
    toast({
      title: 'Đang kết nối...',
      description: `Đang thiết lập kết nối với ${name}.`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Đã kết nối</Badge>;
      case 'error':
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Lỗi</Badge>;
      default:
        return <Badge variant="secondary">Chưa kết nối</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold theme-text">Tích Hợp Bên Thứ 3</h3>
          <p className="theme-text-muted">Kết nối ERP với các nền tảng và dịch vụ bên ngoài</p>
        </div>
        <Button className="voucher-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          Thêm Tích Hợp
        </Button>
      </div>

      {/* Marketplace Integrations */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plug className="w-5 h-5 theme-text-primary" />
            <span className="theme-text">Marketplace & E-commerce</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between p-4 rounded-lg border theme-border hover:theme-bg-primary/5 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{integration.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium theme-text">{integration.name}</h4>
                      {getStatusBadge(integration.status)}
                    </div>
                    <p className="text-sm theme-text-muted mt-1">{integration.description}</p>
                    {integration.lastSync && (
                      <p className="text-xs theme-text-muted mt-1">
                        Đồng bộ lần cuối: {integration.lastSync}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {integration.status === 'connected' ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`toggle-${integration.id}`} className="text-sm theme-text">
                          Kích hoạt
                        </Label>
                        <Switch
                          id={`toggle-${integration.id}`}
                          checked={integration.enabled}
                          onCheckedChange={(enabled) => handleToggleIntegration(integration.id, enabled)}
                        />
                      </div>
                      <Button variant="ghost" size="sm" className="theme-text hover:theme-bg-primary/10">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={() => handleConnect(integration.name)}
                      className="voucher-button-secondary"
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Kết nối
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Gateways */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plug className="w-5 h-5 theme-text-secondary" />
            <span className="theme-text">Cổng Thanh Toán</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg theme-bg-secondary/5 border theme-border-secondary/20 text-center">
            <h4 className="font-medium theme-text-secondary mb-2">Tích hợp cổng thanh toán</h4>
            <p className="text-sm theme-text-muted mb-4">
              Kết nối với VNPay, MoMo, ZaloPay và các cổng thanh toán khác
            </p>
            <Button variant="outline" className="voucher-button-secondary">
              Cấu hình thanh toán
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Accounting Software */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plug className="w-5 h-5 theme-text-success" />
            <span className="theme-text">Phần Mềm Kế Toán</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg theme-bg-success/5 border theme-border-success/20 text-center">
            <h4 className="font-medium theme-text-success mb-2">Đồng bộ dữ liệu kế toán</h4>
            <p className="text-sm theme-text-muted mb-4">
              Tích hợp với MISA, Fast, Bravo và các phần mềm kế toán phổ biến
            </p>
            <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
              Thiết lập kế toán
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
