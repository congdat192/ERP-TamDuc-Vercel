import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Building2, CheckCircle2, AlertCircle, Loader2, Wifi, WifiOff } from 'lucide-react';
import { createPipeline, updatePipeline, testKiotVietConnection } from '@/services/pipelineService';
import type { Pipeline, KiotVietConfig, isKiotVietConfig } from '@/types/pipeline';

interface SimpleKiotVietIntegrationProps {
  integration?: Pipeline;
  onSave: (config: any) => void;
  onDisconnect?: () => void;
}

export function SimpleKiotVietIntegration({ integration, onSave, onDisconnect }: SimpleKiotVietIntegrationProps) {
  const { toast } = useToast();
  
  // Type-safe config extraction
  const getKiotVietConfig = (integration?: Pipeline): KiotVietConfig => {
    if (integration?.config && isKiotVietConfig(integration.config)) {
      return integration.config;
    }
    return { retailer: '', client_id: '', client_secret: '' };
  };

  const kiotVietConfig = getKiotVietConfig(integration);
  
  const [formData, setFormData] = useState({
    retailer: kiotVietConfig.retailer,
    clientId: kiotVietConfig.client_id,
    clientSecret: ''
  });
  
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!formData.retailer.trim()) {
      errors.push('Vui lòng nhập tên cửa hàng');
    }
    
    if (!formData.clientId.trim()) {
      errors.push('Vui lòng nhập Client ID');
    }
    
    if (!formData.clientSecret.trim()) {
      errors.push('Vui lòng nhập Client Secret');
    }
    
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleTestConnection = async () => {
    if (!validateForm()) return;
    
    setIsTestingConnection(true);
    setTestResult(null);

    try {
      const config: KiotVietConfig = {
        client_id: formData.clientId,
        client_secret: formData.clientSecret,
        retailer: formData.retailer
      };

      const result = await testKiotVietConnection(config);
      
      setTestResult({
        success: result.success,
        message: result.message
      });
      
      if (result.success) {
        toast({
          title: 'Kết nối thành công',
          description: result.message || 'Thông tin xác thực KiotViet hợp lệ. Bạn có thể lưu cấu hình.',
        });
      } else {
        toast({
          title: 'Kết nối thất bại',
          description: result.message,
          variant: 'destructive'
        });
      }
      
    } catch (error) {
      console.error('Connection test error:', error);
      const errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.';
      
      setTestResult({
        success: false,
        message: errorMessage
      });
      
      toast({
        title: 'Lỗi kết nối',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSaveConfiguration = async () => {
    if (!testResult?.success) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng kiểm tra kết nối thành công trước khi lưu.',
        variant: 'destructive'
      });
      return;
    }

    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const config: KiotVietConfig = {
        client_id: formData.clientId,
        client_secret: formData.clientSecret,
        retailer: formData.retailer
      };

      if (integration) {
        // Update existing pipeline
        await updatePipeline(integration.id, {
          status: 'ACTIVE',
          config
        });
      } else {
        // Create new pipeline
        await createPipeline({
          type: 'KIOT_VIET',
          status: 'ACTIVE',
          config,
          access_token: {
            token: '',
            refresh_token: ''
          }
        });
      }

      onSave({
        retailer: formData.retailer,
        clientId: formData.clientId,
        lastSync: new Date().toLocaleString('vi-VN'),
        status: 'connected'
      });
      
      toast({
        title: 'Lưu thành công',
        description: `Đã cấu hình tích hợp KiotViet cho cửa hàng "${formData.retailer}".`,
      });
      
    } catch (error) {
      console.error('Failed to save KiotViet configuration:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu cấu hình. Vui lòng thử lại.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (integration && onDisconnect) {
      try {
        await updatePipeline(integration.id, {
          status: 'INACTIVE'
        });
        onDisconnect();
      } catch (error) {
        console.error('Failed to disconnect:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể ngắt kết nối. Vui lòng thử lại.',
          variant: 'destructive'
        });
      }
    }
  };

  // If already connected, show connection status
  if (integration?.status === 'ACTIVE') {
    return (
      <Card className="w-full max-w-2xl theme-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg theme-bg-primary flex items-center justify-center text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold theme-text">
                KiotViet - {kiotVietConfig.retailer || 'Unknown'}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="success" className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Đã kết nối
                </Badge>
                <span className="text-sm theme-text-muted">
                  Client ID: {kiotVietConfig.client_id || 'Unknown'}
                </span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={handleDisconnect}
              className="flex-1"
            >
              Ngắt kết nối
            </Button>
            <Button 
              onClick={() => window.location.reload()} 
              className="flex-1 voucher-button-primary"
            >
              Cấu hình lại
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl theme-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg theme-bg-primary flex items-center justify-center text-white">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold theme-text">Cấu hình tích hợp KiotViet</h3>
            <p className="text-sm theme-text-muted">Kết nối hệ thống ERP với tài khoản KiotViet của bạn</p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Form Errors */}
        {formErrors.length > 0 && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">{formErrors.join(', ')}</span>
          </div>
        )}
        
        {/* Test Result */}
        {testResult && (
          <div className={`flex items-center space-x-2 p-3 rounded-lg ${
            testResult.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {testResult.success ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-500" />
                <AlertCircle className="w-4 h-4 text-red-500" />
              </>
            )}
            <span className={`text-sm ${
              testResult.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {testResult.message}
            </span>
          </div>
        )}

        {/* Connection Status Info */}
        <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-blue-700">
            Kết nối trực tiếp đến KiotViet API qua proxy bảo mật
          </span>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="retailer" className="theme-text">
              Tên cửa hàng <span className="text-red-500">*</span>
            </Label>
            <Input
              id="retailer"
              value={formData.retailer}
              onChange={(e) => setFormData(prev => ({ ...prev, retailer: e.target.value }))}
              placeholder="Nhập tên cửa hàng KiotViet"
              disabled={isTestingConnection || isSaving}
              className="voucher-input"
            />
          </div>
          
          <div>
            <Label htmlFor="clientId" className="theme-text">
              Client ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="clientId"
              value={formData.clientId}
              onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
              placeholder="Nhập Client ID từ KiotViet"
              disabled={isTestingConnection || isSaving}
              className="voucher-input"
            />
          </div>
          
          <div>
            <Label htmlFor="clientSecret" className="theme-text">
              Client Secret <span className="text-red-500">*</span>
            </Label>
            <Input
              id="clientSecret"
              type="password"
              value={formData.clientSecret}
              onChange={(e) => setFormData(prev => ({ ...prev, clientSecret: e.target.value }))}
              placeholder="Nhập Client Secret từ KiotViet"
              disabled={isTestingConnection || isSaving}
              className="voucher-input"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={handleTestConnection}
            disabled={isTestingConnection || isSaving}
            variant="outline"
            className="flex-1"
          >
            {isTestingConnection ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang kiểm tra...
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 mr-2" />
                Kiểm tra kết nối
              </>
            )}
          </Button>
          
          <Button
            onClick={handleSaveConfiguration}
            disabled={!testResult?.success || isTestingConnection || isSaving}
            className="flex-1 voucher-button-primary"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              'Lưu cấu hình'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
