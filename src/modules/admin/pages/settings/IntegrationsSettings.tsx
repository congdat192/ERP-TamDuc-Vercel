
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, Settings, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  logo?: string;
  config?: any;
}

const availableIntegrations: Integration[] = [
  {
    id: 'kiotviet',
    name: 'KiotViet',
    description: 'Đồng bộ sản phẩm, đơn hàng và khách hàng từ KiotViet',
    status: 'connected',
    lastSync: '2024-05-29 14:30',
    config: {
      apiUrl: 'https://public.kiotapi.com',
      retailer: 'your-retailer-name',
      syncProducts: true,
      syncOrders: true,
      syncCustomers: true
    }
  },
  {
    id: 'nhanh',
    name: 'Nhanh.vn',
    description: 'Tích hợp với hệ thống quản lý bán hàng Nhanh.vn',
    status: 'disconnected',
    lastSync: 'Chưa đồng bộ',
    config: null
  },
  {
    id: 'sapo',
    name: 'Sapo',
    description: 'Kết nối với nền tảng bán hàng đa kênh Sapo',
    status: 'error',
    lastSync: '2024-05-28 10:15',
    config: {
      apiUrl: 'https://api.sapo.vn',
      domain: 'your-shop.mysapo.net',
      syncInterval: '30'
    }
  }
];

export function IntegrationsSettings() {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>(availableIntegrations);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [configData, setConfigData] = useState<any>({});

  const handleOpenConfig = (integration: Integration) => {
    setSelectedIntegration(integration);
    setConfigData(integration.config || {});
    setIsConfigModalOpen(true);
  };

  const handleSaveConfig = () => {
    if (!selectedIntegration) return;

    setIntegrations(prev => prev.map(integration => 
      integration.id === selectedIntegration.id 
        ? { 
            ...integration, 
            config: configData,
            status: 'connected' as const,
            lastSync: new Date().toLocaleString('vi-VN')
          }
        : integration
    ));

    setIsConfigModalOpen(false);
    toast({
      title: 'Đã lưu cấu hình',
      description: `Tích hợp với ${selectedIntegration.name} đã được cập nhật.`
    });
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'disconnected' as const, config: null }
        : integration
    ));

    toast({
      title: 'Đã ngắt kết nối',
      description: 'Tích hợp đã được ngắt kết nối thành công.'
    });
  };

  const handleTestConnection = async (integration: Integration) => {
    toast({
      title: 'Đang kiểm tra kết nối...',
      description: `Đang thử kết nối với ${integration.name}`
    });

    // Simulate API test
    setTimeout(() => {
      toast({
        title: 'Kết nối thành công',
        description: `Kết nối với ${integration.name} hoạt động bình thường.`
      });
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã kết nối
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Lỗi kết nối
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            Chưa kết nối
          </Badge>
        );
    }
  };

  const renderKiotVietConfig = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>API URL</Label>
        <Input
          value={configData.apiUrl || 'https://public.kiotapi.com'}
          onChange={(e) => setConfigData(prev => ({ ...prev, apiUrl: e.target.value }))}
          placeholder="https://public.kiotapi.com"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Retailer</Label>
        <Input
          value={configData.retailer || ''}
          onChange={(e) => setConfigData(prev => ({ ...prev, retailer: e.target.value }))}
          placeholder="Tên retailer của bạn"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Client ID</Label>
        <Input
          value={configData.clientId || ''}
          onChange={(e) => setConfigData(prev => ({ ...prev, clientId: e.target.value }))}
          placeholder="Client ID từ KiotViet"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Client Secret</Label>
        <Input
          type="password"
          value={configData.clientSecret || ''}
          onChange={(e) => setConfigData(prev => ({ ...prev, clientSecret: e.target.value }))}
          placeholder="Client Secret từ KiotViet"
        />
      </div>

      <div className="space-y-3">
        <Label>Tùy Chọn Đồng Bộ</Label>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Đồng bộ sản phẩm</span>
            <Switch
              checked={configData.syncProducts || false}
              onCheckedChange={(checked) => setConfigData(prev => ({ ...prev, syncProducts: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Đồng bộ đơn hàng</span>
            <Switch
              checked={configData.syncOrders || false}
              onCheckedChange={(checked) => setConfigData(prev => ({ ...prev, syncOrders: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Đồng bộ khách hàng</span>
            <Switch
              checked={configData.syncCustomers || false}
              onCheckedChange={(checked) => setConfigData(prev => ({ ...prev, syncCustomers: checked }))}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNhanhConfig = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>API URL</Label>
        <Input
          value={configData.apiUrl || 'https://open.nhanh.vn'}
          onChange={(e) => setConfigData(prev => ({ ...prev, apiUrl: e.target.value }))}
          placeholder="https://open.nhanh.vn"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Store ID</Label>
        <Input
          value={configData.storeId || ''}
          onChange={(e) => setConfigData(prev => ({ ...prev, storeId: e.target.value }))}
          placeholder="ID của store trên Nhanh.vn"
        />
      </div>
      
      <div className="space-y-2">
        <Label>API Key</Label>
        <Input
          type="password"
          value={configData.apiKey || ''}
          onChange={(e) => setConfigData(prev => ({ ...prev, apiKey: e.target.value }))}
          placeholder="API Key từ Nhanh.vn"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Secret Key</Label>
        <Input
          type="password"
          value={configData.secretKey || ''}
          onChange={(e) => setConfigData(prev => ({ ...prev, secretKey: e.target.value }))}
          placeholder="Secret Key từ Nhanh.vn"
        />
      </div>
    </div>
  );

  const renderSapoConfig = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Shop Domain</Label>
        <Input
          value={configData.domain || ''}
          onChange={(e) => setConfigData(prev => ({ ...prev, domain: e.target.value }))}
          placeholder="your-shop.mysapo.net"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Access Token</Label>
        <Input
          type="password"
          value={configData.accessToken || ''}
          onChange={(e) => setConfigData(prev => ({ ...prev, accessToken: e.target.value }))}
          placeholder="Access Token từ Sapo"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Thời Gian Đồng Bộ (phút)</Label>
        <Input
          type="number"
          value={configData.syncInterval || '30'}
          onChange={(e) => setConfigData(prev => ({ ...prev, syncInterval: e.target.value }))}
          placeholder="30"
        />
      </div>
    </div>
  );

  const renderConfigContent = () => {
    if (!selectedIntegration) return null;

    switch (selectedIntegration.id) {
      case 'kiotviet':
        return renderKiotVietConfig();
      case 'nhanh':
        return renderNhanhConfig();
      case 'sapo':
        return renderSapoConfig();
      default:
        return <div>Cấu hình chưa có sẵn cho tích hợp này.</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Tích Hợp Bên Thứ 3</h3>
          <p className="text-gray-600">Kết nối với các nền tảng bán hàng và hệ thống quản lý khác</p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Link className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{integration.name}</h4>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                </CardTitle>
                {getStatusBadge(integration.status)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <strong>Lần đồng bộ cuối:</strong> {integration.lastSync}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenConfig(integration)}
                  className="flex-1"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {integration.status === 'connected' ? 'Cấu hình' : 'Kết nối'}
                </Button>
                
                {integration.status === 'connected' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection(integration)}
                    >
                      Kiểm tra
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(integration.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Ngắt
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Configuration Modal */}
      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Cấu hình {selectedIntegration?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {renderConfigContent()}
            
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleSaveConfig} className="flex-1">
                Lưu & Kết Nối
              </Button>
              <Button variant="outline" onClick={() => setIsConfigModalOpen(false)}>
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
