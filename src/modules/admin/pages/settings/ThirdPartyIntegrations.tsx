
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Settings
} from 'lucide-react';
import type { ThirdPartyIntegration, KiotVietIntegration } from '../../types/settings';
import { KiotVietIntegration as KiotVietIntegrationComponent } from '../../components/KiotVietIntegration';

// Service logos mapping
const serviceLogos = {
  kiotviet: 'https://miniapp.bestbuysaigon.com/image/kiotviet.jpg',
  sapo: 'https://miniapp.bestbuysaigon.com/image/nhanh.jpg', // Using nhanh as placeholder for sapo
  'zalo-oa': 'https://miniapp.bestbuysaigon.com/image/zalo.jpg',
  misa: 'https://miniapp.bestbuysaigon.com/image/vihat.jpg', // Using vihat as placeholder for misa
  pos365: 'https://miniapp.bestbuysaigon.com/image/kiotviet.jpg', // Using kiotviet as placeholder for pos365
  haravan: 'https://miniapp.bestbuysaigon.com/image/nhanh.jpg', // Using nhanh as placeholder for haravan
  vnpay: 'https://miniapp.bestbuysaigon.com/image/vihat.jpg', // Using vihat as placeholder for vnpay
  momo: 'https://miniapp.bestbuysaigon.com/image/zalo.jpg' // Using zalo as placeholder for momo
};

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
  const [kiotVietConfig, setKiotVietConfig] = useState<KiotVietIntegration | null>(null);

  const handleIntegrationClick = (integration: ThirdPartyIntegration) => {
    if (!integration.isSupported) {
      toast({
        title: "Tính năng sắp có",
        description: `Tích hợp ${integration.name} đang được phát triển và sẽ có sớm.`,
      });
      return;
    }

    setSelectedIntegration(integration);
    setIsSetupDialogOpen(true);
  };

  const handleKiotVietSave = (config: Partial<KiotVietIntegration>) => {
    setKiotVietConfig({
      id: 'kiotviet',
      retailerName: config.retailerName || '',
      clientId: config.clientId || '',
      isConnected: config.isConnected || false,
      connectedApiGroups: config.connectedApiGroups || [],
      connectionStatus: config.connectionStatus || 'disconnected',
      lastSync: config.lastSync
    });
    
    setIsSetupDialogOpen(false);
  };

  const handleKiotVietDisconnect = () => {
    setKiotVietConfig(null);
    toast({
      title: "Đã ngắt kết nối",
      description: "KiotViet đã được ngắt kết nối khỏi hệ thống.",
    });
  };

  const renderIntegrationDialog = () => {
    if (!selectedIntegration) return null;

    if (selectedIntegration.id === 'kiotviet') {
      return (
        <KiotVietIntegrationComponent
          integration={kiotVietConfig || undefined}
          onSave={handleKiotVietSave}
          onDisconnect={handleKiotVietDisconnect}
        />
      );
    }

    // Default dialog for other integrations
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <img 
              src={serviceLogos[selectedIntegration.id as keyof typeof serviceLogos]} 
              alt={`${selectedIntegration.name} logo`}
              className="w-8 h-8 rounded-lg object-cover"
            />
            <h4 className="font-medium text-gray-900">Về {selectedIntegration.name}</h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">{selectedIntegration.description}</p>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Tính năng hỗ trợ:</div>
            <div className="flex flex-wrap gap-2">
              {selectedIntegration.features.map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
          <p className="text-sm text-gray-600">
            Tích hợp {selectedIntegration.name} đang được phát triển.
            <br />
            Vui lòng quay lại sau để sử dụng tính năng này.
          </p>
        </div>

        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setIsSetupDialogOpen(false)}>
            Đóng
          </Button>
        </div>
      </div>
    );
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
              
              // Check if this integration has custom configuration
              const isKiotVietConnected = integration.id === 'kiotviet' && kiotVietConfig?.isConnected;
              const currentStatus = isKiotVietConnected ? 'connected' : integration.status;
              const currentStatusConfig = statusConfig[currentStatus];
              
              // Determine icon opacity based on status
              const isConnected = currentStatus === 'connected';
              const iconOpacity = isConnected || integration.isSupported ? 'opacity-100' : 'opacity-50';
              
              return (
                <Card 
                  key={integration.id}
                  className={`
                    cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105
                    ${currentStatus === 'connected' ? 'ring-2 ring-green-200 bg-green-50/50' : ''}
                    ${!integration.isSupported ? 'opacity-60' : ''}
                  `}
                  onClick={() => handleIntegrationClick(integration)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={serviceLogos[integration.id as keyof typeof serviceLogos]} 
                          alt={`${integration.name} logo`}
                          className={`w-10 h-10 rounded-lg object-cover ${iconOpacity}`}
                        />
                        <div>
                          <CardTitle className="text-base font-semibold">
                            {integration.name}
                            {integration.id === 'kiotviet' && kiotVietConfig?.retailerName && (
                              <span className="text-sm font-normal text-gray-600 block">
                                {kiotVietConfig.retailerName}
                              </span>
                            )}
                          </CardTitle>
                        </div>
                      </div>
                      <Badge variant={currentStatusConfig.variant} className="text-xs">
                        <currentStatusConfig.icon className="w-3 h-3 mr-1" />
                        {currentStatusConfig.label}
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
                      
                      {(integration.lastSync || (integration.id === 'kiotviet' && kiotVietConfig?.lastSync)) && (
                        <p className="text-xs text-gray-500">
                          Đồng bộ cuối: {integration.id === 'kiotviet' && kiotVietConfig?.lastSync 
                            ? kiotVietConfig.lastSync 
                            : integration.lastSync}
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
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              {selectedIntegration && (
                <>
                  <img 
                    src={serviceLogos[selectedIntegration.id as keyof typeof serviceLogos]} 
                    alt={`${selectedIntegration.name} logo`}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <span>Cấu hình {selectedIntegration.name}</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {renderIntegrationDialog()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
