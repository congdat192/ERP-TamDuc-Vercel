
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Save, Crown, Star, Zap } from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  plan: 'free' | 'pro' | 'enterprise';
  category: string;
}

export function FeaturesPlans() {
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: 'advanced-analytics',
      name: 'Báo Cáo Nâng Cao',
      description: 'Phân tích chi tiết và báo cáo tùy chỉnh',
      enabled: true,
      plan: 'pro',
      category: 'Báo Cáo'
    },
    {
      id: 'bulk-operations',
      name: 'Thao Tác Hàng Loạt',
      description: 'Phát hành và quản lý voucher hàng loạt',
      enabled: true,
      plan: 'free',
      category: 'Quản Lý'
    },
    {
      id: 'api-access',
      name: 'API Access',
      description: 'Kết nối với hệ thống bên ngoài qua API',
      enabled: false,
      plan: 'enterprise',
      category: 'Tích Hợp'
    },
    {
      id: 'multi-location',
      name: 'Đa Chi Nhánh',
      description: 'Quản lý voucher cho nhiều chi nhánh',
      enabled: true,
      plan: 'pro',
      category: 'Quản Lý'
    },
    {
      id: 'white-label',
      name: 'White Label',
      description: 'Tùy chỉnh thương hiệu và giao diện',
      enabled: false,
      plan: 'enterprise',
      category: 'Giao Diện'
    },
    {
      id: 'advanced-security',
      name: 'Bảo Mật Nâng Cao',
      description: 'Xác thực 2FA, audit log chi tiết',
      enabled: true,
      plan: 'pro',
      category: 'Bảo Mật'
    }
  ]);

  const handleToggleFeature = (featureId: string) => {
    setFeatures(prev => prev.map(feature => 
      feature.id === featureId 
        ? { ...feature, enabled: !feature.enabled }
        : feature
    ));
  };

  const handleSave = () => {
    toast({
      title: "Đã Lưu Thành Công",
      description: "Cài đặt tính năng đã được cập nhật.",
    });
  };

  const getPlanBadge = (plan: Feature['plan']) => {
    switch (plan) {
      case 'free':
        return <Badge variant="secondary">Miễn Phí</Badge>;
      case 'pro':
        return <Badge className="bg-blue-100 text-blue-800">Pro</Badge>;
      case 'enterprise':
        return <Badge className="bg-purple-100 text-purple-800">Enterprise</Badge>;
    }
  };

  const getPlanIcon = (plan: Feature['plan']) => {
    switch (plan) {
      case 'free':
        return <Star className="w-4 h-4 text-gray-500" />;
      case 'pro':
        return <Zap className="w-4 h-4 text-blue-600" />;
      case 'enterprise':
        return <Crown className="w-4 h-4 text-purple-600" />;
    }
  };

  const groupedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tính Năng & Gói Dịch Vụ</h2>
        <p className="text-gray-600">Quản lý tính năng và gói dịch vụ của hệ thống</p>
      </div>

      {/* Plan Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-6 h-6 text-gray-600" />
            </div>
            <CardTitle>Miễn Phí</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600">
              Các tính năng cơ bản cho doanh nghiệp nhỏ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Pro</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600">
              Tính năng nâng cao cho doanh nghiệp vừa
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <Crown className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle>Enterprise</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600">
              Giải pháp toàn diện cho doanh nghiệp lớn
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features by Category */}
      {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryFeatures.map((feature) => (
              <div key={feature.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getPlanIcon(feature.plan)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{feature.name}</h4>
                      {getPlanBadge(feature.plan)}
                    </div>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
                
                <Switch
                  checked={feature.enabled}
                  onCheckedChange={() => handleToggleFeature(feature.id)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Feature Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Thống Kê Sử Dụng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {features.filter(f => f.enabled).length}
              </div>
              <p className="text-sm text-gray-600">Tính Năng Đang Bật</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {features.filter(f => f.plan === 'free' && f.enabled).length}
              </div>
              <p className="text-sm text-gray-600">Tính Năng Miễn Phí</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {features.filter(f => f.plan === 'enterprise' && f.enabled).length}
              </div>
              <p className="text-sm text-gray-600">Tính Năng Enterprise</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Lưu Cài Đặt
        </Button>
      </div>
    </div>
  );
}
