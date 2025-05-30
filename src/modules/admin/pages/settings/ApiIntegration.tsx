
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { 
  Key, 
  Globe, 
  Webhook, 
  Eye, 
  EyeOff, 
  Copy, 
  RefreshCw,
  Plus,
  Trash2,
  Settings
} from 'lucide-react';

// Mock data for API integrations
const mockIntegrations = [
  {
    id: 'kiotviet',
    name: 'KiotViet',
    description: 'Tích hợp hệ thống POS KiotViet',
    status: 'connected' as const,
    lastSync: '2024-01-15 14:30',
    features: ['Đồng bộ sản phẩm', 'Đồng bộ đơn hàng', 'Báo cáo bán hàng']
  },
  {
    id: 'sapo',
    name: 'Sapo',
    description: 'Tích hợp hệ thống bán lẻ Sapo',
    status: 'disconnected' as const,
    lastSync: null,
    features: ['Quản lý kho', 'Đồng bộ khách hàng']
  },
  {
    id: 'zalo-oa',
    name: 'Zalo OA',
    description: 'Gửi thông báo qua Zalo Official Account',
    status: 'connected' as const,
    lastSync: '2024-01-15 16:45',
    features: ['Gửi thông báo', 'Chat với khách hàng']
  }
];

const mockWebhooks = [
  {
    id: '1',
    name: 'Voucher Created',
    url: 'https://api.example.com/webhooks/voucher-created',
    events: ['voucher.created'],
    status: 'active' as const,
    lastTriggered: '2024-01-15 15:30'
  },
  {
    id: '2',
    name: 'Customer Registration',
    url: 'https://api.example.com/webhooks/customer-registration',
    events: ['customer.created'],
    status: 'inactive' as const,
    lastTriggered: null
  }
];

export function ApiIntegration() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    primary: 'vck_live_1234567890abcdef',
    secondary: 'vck_test_abcdef1234567890'
  });

  const generateNewKey = (keyType: 'primary' | 'secondary') => {
    const newKey = `vck_${keyType === 'primary' ? 'live' : 'test'}_${Math.random().toString(36).substring(2, 18)}`;
    setApiKeys(prev => ({ ...prev, [keyType]: newKey }));
    toast({
      title: "API Key Đã Được Tạo Mới",
      description: `${keyType === 'primary' ? 'Primary' : 'Secondary'} API key đã được cập nhật.`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Đã Sao Chép",
      description: "API key đã được sao chép vào clipboard.",
    });
  };

  const connectIntegration = (integrationId: string) => {
    toast({
      title: "Đang Kết Nối",
      description: "Đang thiết lập kết nối với dịch vụ bên thứ 3...",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">API & Kết Nối</h2>
        <p className="text-gray-600">Quản lý API keys, webhooks và tích hợp bên thứ 3</p>
      </div>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="integrations">Tích Hợp Bên Thứ 3</TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="w-5 h-5" />
                <span>Quản Lý API Keys</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary API Key */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Primary API Key (Production)</Label>
                    <p className="text-sm text-gray-600">Sử dụng cho môi trường production</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={apiKeys.primary}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(apiKeys.primary)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateNewKey('primary')}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Secondary API Key */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Secondary API Key (Testing)</Label>
                    <p className="text-sm text-gray-600">Sử dụng cho môi trường test/development</p>
                  </div>
                  <Badge variant="secondary">Test</Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={apiKeys.secondary}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(apiKeys.secondary)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateNewKey('secondary')}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* API Usage Settings */}
              <div className="pt-6 border-t space-y-4">
                <h4 className="font-medium">Cài Đặt API</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Rate Limiting</Label>
                      <p className="text-sm text-gray-600">Giới hạn số request/phút</p>
                    </div>
                    <Input type="number" defaultValue="1000" className="w-24" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>IP Whitelist</Label>
                      <p className="text-sm text-gray-600">Chỉ cho phép IP được chỉ định</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>API Logging</Label>
                      <p className="text-sm text-gray-600">Ghi log tất cả API calls</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Webhook className="w-5 h-5" />
                <span>Quản Lý Webhooks</span>
              </CardTitle>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Thêm Webhook
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead>Lần Cuối</TableHead>
                    <TableHead className="text-right">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockWebhooks.map((webhook) => (
                    <TableRow key={webhook.id}>
                      <TableCell className="font-medium">{webhook.name}</TableCell>
                      <TableCell className="font-mono text-sm">{webhook.url}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {webhook.events.map((event) => (
                            <Badge key={event} variant="outline" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={webhook.status === 'active' ? 'default' : 'secondary'}>
                          {webhook.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {webhook.lastTriggered || 'Chưa có'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Third-party Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockIntegrations.map((integration) => (
              <Card key={integration.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="w-5 h-5" />
                      <span>{integration.name}</span>
                    </CardTitle>
                    <Badge 
                      variant={integration.status === 'connected' ? 'default' : 'secondary'}
                    >
                      {integration.status === 'connected' ? 'Đã kết nối' : 'Chưa kết nối'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{integration.description}</p>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tính năng:</Label>
                    <div className="space-y-1">
                      {integration.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {integration.lastSync && (
                    <div>
                      <Label className="text-sm font-medium">Đồng bộ cuối:</Label>
                      <p className="text-sm text-gray-600">{integration.lastSync}</p>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t">
                    {integration.status === 'connected' ? (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Cài Đặt
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Ngắt Kết Nối
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => connectIntegration(integration.id)}
                      >
                        Kết Nối
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
