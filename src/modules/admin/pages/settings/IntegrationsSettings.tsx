import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plug, 
  ExternalLink, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Store,
  ShoppingCart,
  Globe,
  Users,
  CreditCard
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { KiotVietIntegration } from '../../components/KiotVietIntegration';
import type { KiotVietIntegration as KiotVietIntegrationType } from '../../types/settings';

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  enabled: boolean;
  icon: string;
  lastSync: string | null;
  category: 'pos' | 'ecommerce' | 'web' | 'social' | 'payment';
}

export function IntegrationsSettings() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  
  const [integrations, setIntegrations] = useState<Integration[]>([
    // Nền tảng bán hàng - POS
    {
      id: 'kiotviet',
      name: 'KiotViet',
      description: 'Đồng bộ sản phẩm và đơn hàng với KiotViet POS',
      status: 'connected',
      enabled: true,
      icon: '🏪',
      lastSync: '2024-05-29 14:30',
      category: 'pos'
    },
    {
      id: 'nhanh',
      name: 'Nhanh.vn',
      description: 'Tích hợp với hệ thống quản lý Nhanh.vn',
      status: 'disconnected',
      enabled: false,
      icon: '⚡',
      lastSync: null,
      category: 'pos'
    },
    {
      id: 'sapa',
      name: 'Sapa',
      description: 'Kết nối với nền tảng POS Sapa',
      status: 'disconnected',
      enabled: false,
      icon: '🎯',
      lastSync: null,
      category: 'pos'
    },
    
    // Thương mại điện tử
    {
      id: 'shopee',
      name: 'Shopee',
      description: 'Quản lý đơn hàng và sản phẩm trên Shopee',
      status: 'disconnected',
      enabled: false,
      icon: '🛒',
      lastSync: null,
      category: 'ecommerce'
    },
    {
      id: 'lazada',
      name: 'Lazada',
      description: 'Tích hợp với marketplace Lazada',
      status: 'error',
      enabled: true,
      icon: '🛍️',
      lastSync: '2024-05-28 10:15',
      category: 'ecommerce'
    },
    {
      id: 'tiktok',
      name: 'TikTok Shop',
      description: 'Đồng bộ sản phẩm và đơn hàng TikTok Shop',
      status: 'disconnected',
      enabled: false,
      icon: '🎵',
      lastSync: null,
      category: 'ecommerce'
    },
    
    // Web Platform
    {
      id: 'website',
      name: 'Website',
      description: 'Tích hợp với website thương mại điện tử',
      status: 'connected',
      enabled: true,
      icon: '🌐',
      lastSync: '2024-05-29 16:45',
      category: 'web'
    },
    
    // Mạng xã hội
    {
      id: 'zalo_oa',
      name: 'Zalo OA',
      description: 'Kết nối với Zalo Official Account',
      status: 'connected',
      enabled: true,
      icon: '💬',
      lastSync: '2024-05-29 13:20',
      category: 'social'
    },
    {
      id: 'fanpage',
      name: 'Facebook Fanpage',
      description: 'Tích hợp với Facebook Business Page',
      status: 'disconnected',
      enabled: false,
      icon: '📘',
      lastSync: null,
      category: 'social'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Đồng bộ với Instagram Business Account',
      status: 'disconnected',
      enabled: false,
      icon: '📸',
      lastSync: null,
      category: 'social'
    },
    
    // Cổng thanh toán
    {
      id: 'vnpay',
      name: 'VNPay',
      description: 'Cổng thanh toán VNPay',
      status: 'connected',
      enabled: true,
      icon: '💳',
      lastSync: '2024-05-29 15:30',
      category: 'payment'
    },
    {
      id: 'momo',
      name: 'MoMo',
      description: 'Ví điện tử MoMo',
      status: 'disconnected',
      enabled: false,
      icon: '🎀',
      lastSync: null,
      category: 'payment'
    },
    {
      id: 'zalopay',
      name: 'ZaloPay',
      description: 'Ví điện tử ZaloPay',
      status: 'disconnected',
      enabled: false,
      icon: '⚡',
      lastSync: null,
      category: 'payment'
    }
  ]);

  const [kiotVietConfig, setKiotVietConfig] = useState<KiotVietIntegrationType | null>(null);

  const handleToggleIntegration = (id: string, enabled: boolean) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id ? { ...integration, enabled } : integration
    ));
    
    toast({
      title: enabled ? 'Đã kích hoạt tích hợp' : 'Đã tắt tích hợp',
      description: `Tích hợp đã được ${enabled ? 'kích hoạt' : 'tắt'}.`
    });
  };

  const handleConnect = (integrationId: string, name: string) => {
    if (integrationId === 'kiotviet') {
      setSelectedIntegration(integrationId);
      setDialogOpen(true);
    } else {
      toast({
        title: 'Đang kết nối...',
        description: `Đang thiết lập kết nối với ${name}.`
      });
    }
  };

  const handleSettings = (integrationId: string) => {
    if (integrationId === 'kiotviet') {
      setSelectedIntegration(integrationId);
      setDialogOpen(true);
    }
  };

  const handleKiotVietSave = (config: Partial<KiotVietIntegrationType>) => {
    // Update the integration status
    setIntegrations(prev => prev.map(integration => 
      integration.id === 'kiotviet' 
        ? { 
            ...integration, 
            status: 'connected', 
            enabled: true,
            lastSync: config.lastSync || new Date().toLocaleString('vi-VN')
          } 
        : integration
    ));

    // Save KiotViet specific config
    setKiotVietConfig(prev => ({ ...prev, ...config } as KiotVietIntegrationType));
    setDialogOpen(false);
    
    toast({
      title: 'Cấu hình thành công',
      description: 'Đã lưu cấu hình tích hợp KiotViet.'
    });
  };

  const handleKiotVietDisconnect = () => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === 'kiotviet' 
        ? { ...integration, status: 'disconnected', enabled: false, lastSync: null }
        : integration
    ));
    setKiotVietConfig(null);
    setDialogOpen(false);
    
    toast({
      title: 'Đã ngắt kết nối',
      description: 'Đã ngắt kết nối với KiotViet.'
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

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'pos':
        return {
          title: 'Nền Tảng Bán Hàng - POS',
          icon: Store,
          colorClass: 'theme-text-primary',
          bgClass: 'theme-bg-primary/5',
          borderClass: 'theme-border-primary/20'
        };
      case 'ecommerce':
        return {
          title: 'Thương Mại Điện Tử',
          icon: ShoppingCart,
          colorClass: 'theme-text-secondary',
          bgClass: 'theme-bg-secondary/5',
          borderClass: 'theme-border-secondary/20'
        };
      case 'web':
        return {
          title: 'Web Platform',
          icon: Globe,
          colorClass: 'theme-text-primary',
          bgClass: 'theme-bg-primary/5',
          borderClass: 'theme-border-primary/20'
        };
      case 'social':
        return {
          title: 'Mạng Xã Hội',
          icon: Users,
          colorClass: 'theme-text-secondary',
          bgClass: 'theme-bg-secondary/5',
          borderClass: 'theme-border-secondary/20'
        };
      case 'payment':
        return {
          title: 'Cổng Thanh Toán',
          icon: CreditCard,
          colorClass: 'theme-text-primary',
          bgClass: 'theme-bg-primary/5',
          borderClass: 'theme-border-primary/20'
        };
      default:
        return {
          title: 'Khác',
          icon: Plug,
          colorClass: 'theme-text',
          bgClass: 'theme-bg-primary/5',
          borderClass: 'theme-border'
        };
    }
  };

  const categories = ['pos', 'ecommerce', 'web', 'social', 'payment'];

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

      {/* Integration Categories */}
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryIntegrations = integrations.filter(integration => integration.category === category);
          const config = getCategoryConfig(category);
          const IconComponent = config.icon;
          
          return (
            <Card key={category} className="theme-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <IconComponent className={`w-5 h-5 ${config.colorClass}`} />
                  <span className="theme-text">{config.title}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {categoryIntegrations.length} tích hợp
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {categoryIntegrations.map((integration) => (
                    <div key={integration.id} className={`flex items-center justify-between p-4 rounded-lg border ${config.borderClass} ${config.bgClass} hover:shadow-sm transition-all duration-200`}>
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
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="theme-text hover:theme-bg-primary/10"
                              onClick={() => handleSettings(integration.id)}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <Button 
                            onClick={() => handleConnect(integration.id, integration.name)}
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
          );
        })}
      </div>

      {/* KiotViet Integration Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cấu hình tích hợp KiotViet</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <KiotVietIntegration
              integration={kiotVietConfig}
              onSave={handleKiotVietSave}
              onDisconnect={handleKiotVietDisconnect}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
