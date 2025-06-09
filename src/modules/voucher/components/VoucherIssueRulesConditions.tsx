
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Settings, 
  Calendar, 
  Users, 
  MapPin, 
  Tag,
  Info,
  Clock,
  Gift
} from 'lucide-react';

interface VoucherIssueRulesConditionsProps {
  onRulesChange?: (rules: any) => void;
}

export function VoucherIssueRulesConditions({ onRulesChange }: VoucherIssueRulesConditionsProps) {
  const [activeRules, setActiveRules] = useState({
    timeRestriction: false,
    locationRestriction: false,
    customerTypeRestriction: false,
    usageLimit: false,
    campaignIntegration: false
  });

  const handleRuleToggle = (ruleName: string, enabled: boolean) => {
    const newRules = { ...activeRules, [ruleName]: enabled };
    setActiveRules(newRules);
    onRulesChange?.(newRules);
  };

  const ruleConfigs = [
    {
      id: 'timeRestriction',
      title: 'Giới Hạn Thời Gian',
      description: 'Thiết lập thời gian sử dụng voucher',
      icon: Clock,
      color: 'primary'
    },
    {
      id: 'locationRestriction', 
      title: 'Giới Hạn Vị Trí',
      description: 'Áp dụng cho địa điểm cụ thể',
      icon: MapPin,
      color: 'secondary'
    },
    {
      id: 'customerTypeRestriction',
      title: 'Loại Khách Hàng',
      description: 'Phân loại theo nhóm khách hàng',
      icon: Users,
      color: 'primary'
    },
    {
      id: 'usageLimit',
      title: 'Giới Hạn Sử Dụng',
      description: 'Số lần sử dụng tối đa',
      icon: Tag,
      color: 'secondary'
    },
    {
      id: 'campaignIntegration',
      title: 'Tích Hợp Chiến Dịch',
      description: 'Kết nối với các chiến dịch marketing',
      icon: Gift,
      color: 'primary'
    }
  ];

  return (
    <div className="space-y-6">
      <Alert className="voucher-alert-info">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Cấu hình các điều kiện và quy tắc phát hành voucher để đảm bảo kiểm soát chính xác việc sử dụng.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="basic-rules" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger 
            value="basic-rules" 
            className="voucher-tabs-trigger"
          >
            <Settings className="w-4 h-4 mr-2" />
            Quy Tắc Cơ Bản
          </TabsTrigger>
          <TabsTrigger 
            value="advanced-conditions"
            className="voucher-tabs-trigger"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Điều Kiện Nâng Cao
          </TabsTrigger>
          <TabsTrigger 
            value="integration"
            className="voucher-tabs-trigger"
          >
            <Gift className="w-4 h-4 mr-2" />
            Tích Hợp
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic-rules" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ruleConfigs.slice(0, 3).map((rule) => {
              const Icon = rule.icon;
              const isActive = activeRules[rule.id as keyof typeof activeRules];
              
              return (
                <Card 
                  key={rule.id} 
                  className={`voucher-card transition-all duration-200 ${
                    isActive ? 'border-2 theme-border-primary' : ''
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          rule.color === 'primary' ? 'theme-bg-primary' : 'theme-bg-secondary'
                        }`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-sm theme-text">{rule.title}</CardTitle>
                          <p className="text-xs theme-text-muted">{rule.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={isActive}
                        onCheckedChange={(checked) => handleRuleToggle(rule.id, checked)}
                      />
                    </div>
                  </CardHeader>
                  {isActive && (
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <Badge 
                          variant={rule.color === 'primary' ? 'default' : 'secondary'}
                          className="theme-badge-primary"
                        >
                          Đã Kích Hoạt
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full theme-text-primary border-current"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Cấu Hình Chi Tiết
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="advanced-conditions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ruleConfigs.slice(3).map((rule) => {
              const Icon = rule.icon;
              const isActive = activeRules[rule.id as keyof typeof activeRules];
              
              return (
                <Card 
                  key={rule.id} 
                  className={`voucher-card transition-all duration-200 ${
                    isActive ? 'border-2 theme-border-secondary' : ''
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          rule.color === 'primary' ? 'theme-bg-primary' : 'theme-bg-secondary'
                        }`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-sm theme-text">{rule.title}</CardTitle>
                          <p className="text-xs theme-text-muted">{rule.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={isActive}
                        onCheckedChange={(checked) => handleRuleToggle(rule.id, checked)}
                      />
                    </div>
                  </CardHeader>
                  {isActive && (
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <Badge 
                          variant="secondary"
                          className="theme-badge-secondary"
                        >
                          Nâng Cao
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full theme-text-secondary border-current"
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Tùy Chỉnh
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card className="voucher-card">
            <CardHeader>
              <CardTitle className="theme-text flex items-center">
                <Gift className="h-5 w-5 mr-2 theme-text-primary" />
                Tích Hợp Chiến Dịch Marketing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="theme-text-primary border-current">
                  Kết Nối Campaign
                </Button>
                <Button variant="secondary">
                  Thiết Lập Automation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary */}
      <Card className="voucher-card">
        <CardHeader>
          <CardTitle className="text-sm theme-text">Tóm Tắt Quy Tắc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeRules).map(([key, enabled]) => {
              if (!enabled) return null;
              const rule = ruleConfigs.find(r => r.id === key);
              return (
                <Badge 
                  key={key} 
                  variant="default"
                  className="theme-badge-primary"
                >
                  {rule?.title}
                </Badge>
              );
            })}
            {Object.values(activeRules).every(v => !v) && (
              <span className="text-sm theme-text-muted">Chưa có quy tắc nào được kích hoạt</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
