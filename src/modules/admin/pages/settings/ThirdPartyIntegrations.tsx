
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { 
  Building2, 
  ShoppingCart, 
  MessageCircle, 
  Calculator, 
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Settings,
  Copy,
  Eye,
  EyeOff,
  ExternalLink
} from 'lucide-react';
import { ThirdPartyIntegration } from '../../types/settings';

// Mock data for Vietnamese market integrations
const mockIntegrations: ThirdPartyIntegration[] = [
  {
    id: 'kiotviet',
    name: 'KiotViet',
    description: 'Hệ thống POS và quản lý bán hàng toàn diện',
    category: 'pos',
    status: 'connected',
    color: '#2563eb',
    lastSync: '15/01/2024 14:30',
    features: ['Đồng bộ sản phẩm', 'Quản lý đơn hàng', 'Báo cáo bán hàng'],
    isSupported: true,
    apiKey: 'kv_live_abc123...'
  },
  {
    id: 'sapo',
    name: 'Sapo',
    description: 'Nền tảng bán lẻ đa kênh cho doanh nghiệp',
    category: 'ecommerce',
    status: 'disconnected',
    color: '#059669',
    features: ['Quản lý kho', 'Đồng bộ khách hàng', 'Tích hợp website'],
    isSupported: true
  },
  {
    id: 'zalo-oa',
    name: 'Zalo OA',
    description: 'Tài khoản chính thức Zalo cho doanh nghiệp',
    category: 'communication',
    status: 'connected',
    color: '#0084ff',
    lastSync: '15/01/2024 16:45',
    features: ['Gửi thông báo', 'Chat với khách hàng', 'Marketing tự động'],
    isSupported: true,
    apiKey: 'zoa_token_xyz789...'
  },
  {
    id: 'misa',
    name: 'MISA',
    description: 'Phần mềm kế toán và quản lý doanh nghiệp',
    category: 'accounting',
    status: 'disconnected',
    color: '#dc2626',
    features: ['Đồng bộ hóa đơn', 'Báo cáo tài chính', 'Quản lý thuế'],
    isSupported: true
  },
  {
    id: 'pos365',
    name: 'POS365',
    description: 'Giải pháp POS và quản lý chuỗi cửa hàng',
    category: 'pos',
    status: 'error',
    color: '#7c3aed',
    lastSync: '10/01/2024 09:15',
    features: ['Quản lý cửa hàng', 'Báo cáo tồn kho', 'CRM'],
    isSupported: true
  },
  {
    id: 'haravan',
    name: 'Haravan',
    description: 'Nền tảng thương mại điện tử Việt Nam',
    category: 'ecommerce',
    status: 'disconnected',
    color: '#ea580c',
    features: ['Quản lý shop online', 'Đồng bộ đơn hàng', 'Marketing'],
    isSupported: true
  },
  {
    id: 'vnpay',
    name: 'VNPay',
    description: 'Cổng thanh toán điện tử hàng đầu Việt Nam',
    category: 'payment',
    status: 'coming-soon',
    color: '#0891b2',
    features: ['Thanh toán online', 'QR Code', 'Ví điện tử'],
    isSupported: false
  },
  {
    id: 'momo',
    name: 'MoMo',
    description: 'Ví điện tử và thanh toán di động',
    category: 'payment',
    status: 'coming-soon',
    color: '#d946ef',
    features: ['Thanh toán MoMo', 'QR Payment', 'Cashback'],
    isSupported: false
  }
];

const categoryIcons = {
  pos: Building2,
  ecommerce: ShoppingCart,
  communication: MessageCircle,
  accounting: Calculator,
  payment: CreditCard
};

const statusConfig = {
  connected: {
    label: 'Đã kết nối',
    variant: 'default' as const,
    icon: CheckCircle2,
    color: 'text-green-600'
  },
  disconnected: {
    label: 'Chưa kết nối',
    variant: 'secondary' as const,
    icon: AlertCircle,
    color: 'text-gray-600'
  },
  error: {
    label: 'Lỗi kết nối',
    variant: 'destructive' as const,
    icon: AlertCircle,
    color: 'text-red-600'
  },
  'coming-soon': {
    label: 'Sắp có',
    variant: 'outline' as const,
    icon: Clock,
    color: 'text-blue-600'
  }
};

export function ThirdPartyIntegrations() {
  const [selectedIntegration, setSelectedIntegration] = useState<ThirdPartyIntegration | null>(null);
  const [isSetupDialogOpen, setIsSetupDialogOpen] = useState(false);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleIntegrationClick = (integration: ThirdPartyIntegration) => {
    if (!integration.isSupported) {
      toast({
        title: "Tính năng sắp có",
        description: `Tích hợp ${integration.name} đang được phát triển và sẽ có sớm.`,
      });
      return;
    }

    setSelectedIntegration(integration);
    setApiKey(integration.apiKey || '');
    setIsSetupDialogOpen(true);
  };

  const handleConnect = () => {
    if (!selectedIntegration || !apiKey.trim()) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập API Key để kết nối.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Đang kết nối",
      description: `Đang thiết lập kết nối với ${selectedIntegration.name}...`,
    });

    // Simulate connection
    setTimeout(() => {
      toast({
        title: "Kết nối thành công",
        description: `${selectedIntegration.name} đã được kết nối thành công.`,
      });
      setIsSetupDialogOpen(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    if (!selectedIntegration) return;

    toast({
      title: "Đã ngắt kết nối",
      description: `${selectedIntegration.name} đã được ngắt kết nối.`,
    });
    setIsSetupDialogOpen(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Đã sao chép",
      description: "Thông tin đã được sao chép vào clipboard.",
    });
  };

  const getIntegrationsByCategory = () => {
    const categories = {
      pos: 'Hệ thống POS',
      ecommerce: 'Thương mại điện tử',
      communication: 'Liên lạc & Marketing',
      accounting: 'Kế toán',
      payment: 'Thanh toán'
    };

    return Object.entries(categories).map(([key, label]) => ({
      key,
      label,
      integrations: mockIntegrations.filter(i => i.category === key)
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tích Hợp Bên Thứ 3</h2>
        <p className="text-gray-600">Kết nối với các nền tảng và dịch vụ bên thứ 3 để mở rộng chức năng hệ thống</p>
      </div>

      {getIntegrationsByCategory().map(({ key, label, integrations }) => (
        <div key={key} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            {label}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {integrations.map((integration) => {
              const StatusIcon = statusConfig[integration.status].icon;
              const CategoryIcon = categoryIcons[integration.category];
              
              return (
                <Card 
                  key={integration.id}
                  className={`
                    cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105
                    ${integration.status === 'connected' ? 'ring-2 ring-green-200 bg-green-50/50' : ''}
                    ${!integration.isSupported ? 'opacity-60' : ''}
                  `}
                  onClick={() => handleIntegrationClick(integration)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: integration.color }}
                        >
                          <CategoryIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-semibold">
                            {integration.name}
                          </CardTitle>
                        </div>
                      </div>
                      <Badge variant={statusConfig[integration.status].variant} className="text-xs">
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[integration.status].label}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {integration.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {integration.features.slice(0, 2).map((feature, index) => (
                          <span 
                            key={index}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                        {integration.features.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{integration.features.length - 2} khác
                          </span>
                        )}
                      </div>
                      
                      {integration.lastSync && (
                        <p className="text-xs text-gray-500">
                          Đồng bộ cuối: {integration.lastSync}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {/* Setup Dialog */}
      <Dialog open={isSetupDialogOpen} onOpenChange={setIsSetupDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              {selectedIntegration && (
                <>
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: selectedIntegration.color }}
                  >
                    {React.createElement(categoryIcons[selectedIntegration.category], { className: "w-4 h-4" })}
                  </div>
                  <span>Cấu hình {selectedIntegration.name}</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedIntegration && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Về {selectedIntegration.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{selectedIntegration.description}</p>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tính năng hỗ trợ:</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedIntegration.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key / Token</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="apiKey"
                      type={apiKeyVisible ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Nhập API Key từ dashboard của bạn"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setApiKeyVisible(!apiKeyVisible)}
                    >
                      {apiKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    {apiKey && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <ExternalLink className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Hướng dẫn lấy API Key</p>
                      <p className="text-sm text-blue-700">
                        Truy cập dashboard {selectedIntegration.name} → Cài đặt → API/Tích hợp → Tạo API Key mới
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t">
                {selectedIntegration.status === 'connected' ? (
                  <>
                    <Button variant="outline" onClick={handleDisconnect} className="flex-1">
                      Ngắt kết nối
                    </Button>
                    <Button onClick={handleConnect} className="flex-1">
                      <Settings className="w-4 h-4 mr-2" />
                      Cập nhật cấu hình
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setIsSetupDialogOpen(false)} className="flex-1">
                      Hủy
                    </Button>
                    <Button onClick={handleConnect} className="flex-1">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Kết nối ngay
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
