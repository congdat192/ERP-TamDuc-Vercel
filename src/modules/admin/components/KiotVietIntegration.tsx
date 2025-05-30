import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading';
import { FormError, FormSuccess } from '@/components/ui/form-errors';
import { toast } from '@/hooks/use-toast';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader, 
  Building2, 
  Shield,
  Clock,
  Users,
  ShoppingCart,
  FileText,
  Package,
  CreditCard
} from 'lucide-react';
import type { KiotVietIntegration as KiotVietIntegrationType, KiotVietApiGroup, ConnectionTestResult } from '../types/settings';

const availableApiGroups: KiotVietApiGroup[] = [
  {
    id: 'customers',
    name: 'Khách hàng',
    description: 'Đồng bộ thông tin khách hàng và lịch sử mua hàng',
    enabled: false
  },
  {
    id: 'orders',
    name: 'Đơn hàng',
    description: 'Đồng bộ đơn hàng và trạng thái xử lý',
    enabled: false
  },
  {
    id: 'invoices',
    name: 'Hóa đơn',
    description: 'Đồng bộ hóa đơn bán hàng và thanh toán',
    enabled: false
  },
  {
    id: 'products',
    name: 'Sản phẩm',
    description: 'Đồng bộ danh mục sản phẩm và tồn kho',
    enabled: false
  },
  {
    id: 'payments',
    name: 'Thanh toán',
    description: 'Đồng bộ thông tin thanh toán và giao dịch',
    enabled: false
  }
];

const apiGroupIcons = {
  customers: Users,
  orders: ShoppingCart,
  invoices: FileText,
  products: Package,
  payments: CreditCard
};

interface KiotVietIntegrationProps {
  integration?: KiotVietIntegrationType;
  onSave: (config: Partial<KiotVietIntegrationType>) => void;
  onDisconnect?: () => void;
}

export function KiotVietIntegration({ integration, onSave, onDisconnect }: KiotVietIntegrationProps) {
  const [formData, setFormData] = useState({
    retailerName: integration?.retailerName || '',
    clientId: integration?.clientId || '',
    clientSecret: ''
  });
  
  const [selectedApiGroups, setSelectedApiGroups] = useState<string[]>(
    integration?.connectedApiGroups || []
  );
  
  const [securityConfirmed, setSecurityConfirmed] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!formData.retailerName.trim()) {
      errors.push('Vui lòng nhập tên cửa hàng');
    }
    
    if (!formData.clientId.trim()) {
      errors.push('Vui lòng nhập Client ID');
    }
    
    if (!formData.clientSecret.trim()) {
      errors.push('Vui lòng nhập Client Secret');
    }
    
    if (selectedApiGroups.length === 0) {
      errors.push('Vui lòng chọn ít nhất một nhóm API để đồng bộ');
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleTestConnection = async () => {
    if (!validateForm()) return;
    
    setIsTesting(true);
    setTestResult(null);

    try {
      // Simulate API call to test KiotViet connection
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock successful response
      const mockResult: ConnectionTestResult = {
        success: true,
        accessibleGroups: selectedApiGroups
      };
      
      setTestResult(mockResult);
      
      toast({
        title: "Kết nối thành công",
        description: "Thông tin xác thực KiotViet hợp lệ. Bạn có thể lưu cấu hình.",
      });
      
    } catch (error) {
      const errorResult: ConnectionTestResult = {
        success: false,
        errorMessage: "Không thể kết nối đến KiotViet. Vui lòng kiểm tra lại thông tin."
      };
      
      setTestResult(errorResult);
      
      toast({
        title: "Kết nối thất bại",
        description: errorResult.errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfiguration = () => {
    if (!testResult?.success) {
      toast({
        title: "Lỗi",
        description: "Vui lòng kiểm tra kết nối trước khi lưu.",
        variant: "destructive"
      });
      return;
    }

    if (!securityConfirmed) {
      toast({
        title: "Chưa xác nhận bảo mật",
        description: "Vui lòng đồng ý với điều khoản bảo mật để tiếp tục.",
        variant: "destructive"
      });
      return;
    }

    const config: Partial<KiotVietIntegrationType> = {
      retailerName: formData.retailerName,
      clientId: formData.clientId,
      isConnected: true,
      connectedApiGroups: selectedApiGroups,
      connectionStatus: 'connected',
      lastSync: new Date().toLocaleString('vi-VN')
    };

    onSave(config);
    
    toast({
      title: "Lưu thành công",
      description: `Đã cấu hình tích hợp KiotViet cho cửa hàng "${formData.retailerName}".`,
    });
  };

  const handleApiGroupToggle = (groupId: string, checked: boolean) => {
    setSelectedApiGroups(prev => 
      checked 
        ? [...prev, groupId]
        : prev.filter(id => id !== groupId)
    );
    
    // Reset test result when changing API groups
    if (testResult) {
      setTestResult(null);
    }
  };

  // If already connected, show connection status
  if (integration?.isConnected) {
    return (
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">KiotViet - {integration.retailerName}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Đã kết nối
                </Badge>
                {integration.lastSync && (
                  <span className="text-sm text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Đồng bộ cuối: {integration.lastSync}
                  </span>
                )}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-3 block">Nhóm API đang đồng bộ:</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {integration.connectedApiGroups.map((groupId) => {
                const group = availableApiGroups.find(g => g.id === groupId);
                const IconComponent = apiGroupIcons[groupId as keyof typeof apiGroupIcons];
                
                return (
                  <div key={groupId} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <IconComponent className="w-4 h-4 text-green-600" />
                    <div>
                      <span className="text-sm font-medium text-green-800">{group?.name}</span>
                      <p className="text-xs text-green-600">{group?.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onDisconnect} className="flex-1">
              Ngắt kết nối
            </Button>
            <Button onClick={() => window.location.reload()} className="flex-1">
              Cấu hình lại
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Cấu hình tích hợp KiotViet</h3>
            <p className="text-sm text-gray-600">Kết nối hệ thống ERP với tài khoản KiotViet của bạn</p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {formErrors.length > 0 && (
          <FormError message={formErrors.join(', ')} />
        )}
        
        {testResult && !testResult.success && (
          <FormError message={testResult.errorMessage || "Có lỗi xảy ra khi kiểm tra kết nối"} />
        )}
        
        {testResult?.success && (
          <FormSuccess message="Kết nối thành công! Bạn có thể lưu cấu hình." />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="retailerName">Tên cửa hàng *</Label>
              <Input
                id="retailerName"
                value={formData.retailerName}
                onChange={(e) => setFormData(prev => ({ ...prev, retailerName: e.target.value }))}
                placeholder="Nhập tên cửa hàng KiotViet"
                disabled={isTesting}
              />
            </div>
            
            <div>
              <Label htmlFor="clientId">Client ID *</Label>
              <Input
                id="clientId"
                value={formData.clientId}
                onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                placeholder="Nhập Client ID từ KiotViet"
                disabled={isTesting}
              />
            </div>
            
            <div>
              <Label htmlFor="clientSecret">Client Secret *</Label>
              <Input
                id="clientSecret"
                type="password"
                value={formData.clientSecret}
                onChange={(e) => setFormData(prev => ({ ...prev, clientSecret: e.target.value }))}
                placeholder="Nhập Client Secret từ KiotViet"
                disabled={isTesting}
              />
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-3 block">Nhóm API cần đồng bộ *</Label>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {availableApiGroups.map((group) => {
                const IconComponent = apiGroupIcons[group.id as keyof typeof apiGroupIcons];
                const isSelected = selectedApiGroups.includes(group.id);
                const isAccessible = testResult?.success && testResult.accessibleGroups?.includes(group.id);
                
                return (
                  <div 
                    key={group.id} 
                    className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                      isSelected ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <Checkbox
                      id={group.id}
                      checked={isSelected}
                      onCheckedChange={(checked) => handleApiGroupToggle(group.id, checked as boolean)}
                      disabled={isTesting}
                    />
                    <IconComponent className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                    <div className="flex-1">
                      <Label htmlFor={group.id} className="text-sm font-medium cursor-pointer">
                        {group.name}
                        {isAccessible && (
                          <CheckCircle2 className="w-3 h-3 text-green-500 inline ml-1" />
                        )}
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">{group.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <Shield className="w-5 h-5 text-yellow-600" />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="securityConfirm"
                checked={securityConfirmed}
                onCheckedChange={(checked) => setSecurityConfirmed(checked as boolean)}
                disabled={isTesting}
              />
              <Label htmlFor="securityConfirm" className="text-sm font-medium cursor-pointer">
                Tôi đồng ý cấp quyền cho hệ thống ERP này truy cập dữ liệu KiotViet của tôi. *
              </Label>
            </div>
            <p className="text-xs text-yellow-700 mt-1 ml-6">
              Dữ liệu của bạn sẽ được bảo mật và chỉ được sử dụng cho mục đích đồng bộ hóa.
            </p>
          </div>
        </div>

        <div className="flex space-x-3 pt-4 border-t">
          <Button
            onClick={handleTestConnection}
            variant="outline"
            disabled={isTesting}
            className="flex-1"
          >
            {isTesting ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Đang kiểm tra...
              </>
            ) : (
              'Kiểm tra kết nối'
            )}
          </Button>
          
          <Button
            onClick={handleSaveConfiguration}
            disabled={!testResult?.success || !securityConfirmed || isTesting}
            className="flex-1"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Lưu cấu hình
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
