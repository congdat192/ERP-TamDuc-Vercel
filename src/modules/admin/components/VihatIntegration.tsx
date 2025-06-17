
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { VihatIntegration as VihatIntegrationType } from '../types/settings';

interface VihatIntegrationProps {
  integration?: VihatIntegrationType;
  onSave: (config: Partial<VihatIntegrationType>) => void;
  onDisconnect: () => void;
}

// Mock function để test connection
const mockTestConnection = async (apiKey: string, secretKey: string, endpoint: string): Promise<{ success: boolean; errorMessage?: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock validation logic
  if (!apiKey || !secretKey) {
    return { success: false, errorMessage: 'API Key và Secret Key không được để trống' };
  }
  
  if (apiKey.length < 10) {
    return { success: false, errorMessage: 'API Key không hợp lệ (quá ngắn)' };
  }
  
  if (secretKey.length < 10) {
    return { success: false, errorMessage: 'Secret Key không hợp lệ (quá ngắn)' };
  }
  
  // Mock success/failure based on API key pattern
  if (apiKey.toLowerCase().includes('test') || apiKey.toLowerCase().includes('demo')) {
    return { success: true };
  }
  
  return { success: false, errorMessage: 'Không thể kết nối đến eSMS.vn. Vui lòng kiểm tra lại thông tin.' };
};

export function VihatIntegration({ integration, onSave, onDisconnect }: VihatIntegrationProps) {
  const { toast } = useToast();
  
  const [config, setConfig] = useState({
    apiEndpoint: integration?.apiEndpoint || 'https://api.esms.vn/MainService.svc/json/',
    apiKey: integration?.apiKey || '',
    secretKey: integration?.secretKey || ''
  });
  
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [canSave, setCanSave] = useState(integration?.isConnected || false);

  const handleTestConnection = async () => {
    if (!config.apiKey || !config.secretKey) {
      toast({
        title: 'Thiếu thông tin',
        description: 'Vui lòng nhập đầy đủ API Key và Secret Key.',
        variant: 'destructive'
      });
      return;
    }

    setIsTestingConnection(true);
    setTestResult(null);
    
    try {
      const result = await mockTestConnection(config.apiKey, config.secretKey, config.apiEndpoint);
      
      if (result.success) {
        setTestResult({ success: true, message: 'Kết nối thành công! API credentials hợp lệ.' });
        setCanSave(true);
        toast({
          title: 'Kết nối thành công',
          description: 'Đã xác thực thành công với eSMS.vn.',
          variant: 'default'
        });
      } else {
        setTestResult({ success: false, message: result.errorMessage || 'Kết nối thất bại' });
        setCanSave(false);
        toast({
          title: 'Kết nối thất bại',
          description: result.errorMessage,
          variant: 'destructive'
        });
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Lỗi kết nối. Vui lòng thử lại.' });
      setCanSave(false);
      toast({
        title: 'Lỗi kết nối',
        description: 'Không thể kiểm tra kết nối. Vui lòng thử lại.',
        variant: 'destructive'
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSave = () => {
    if (!canSave) {
      toast({
        title: 'Không thể lưu',
        description: 'Vui lòng kiểm tra kết nối thành công trước khi lưu.',
        variant: 'destructive'
      });
      return;
    }

    const savedConfig: Partial<VihatIntegrationType> = {
      ...config,
      isConnected: true,
      connectionStatus: 'connected',
      lastTestDate: new Date().toLocaleString('vi-VN')
    };

    onSave(savedConfig);
  };

  const handleDisconnect = () => {
    setConfig({
      apiEndpoint: 'https://api.esms.vn/MainService.svc/json/',
      apiKey: '',
      secretKey: ''
    });
    setTestResult(null);
    setCanSave(false);
    onDisconnect();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Vihat (eSMS.vn)</h3>
          <p className="text-sm text-gray-600">Nền tảng gửi SMS và ZNS chuyên nghiệp</p>
        </div>
        {integration?.isConnected && (
          <Badge variant="default" className="ml-auto">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã kết nối
          </Badge>
        )}
      </div>

      <Separator />

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cấu hình API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-endpoint">API Endpoint</Label>
            <Input
              id="api-endpoint"
              value={config.apiEndpoint}
              onChange={(e) => setConfig(prev => ({ ...prev, apiEndpoint: e.target.value }))}
              placeholder="https://api.esms.vn/MainService.svc/json/"
            />
            <p className="text-xs text-gray-500">URL endpoint của eSMS.vn API</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              value={config.apiKey}
              onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
              placeholder="Nhập API Key từ eSMS.vn"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secret-key">Secret Key</Label>
            <Input
              id="secret-key"
              type="password"
              value={config.secretKey}
              onChange={(e) => setConfig(prev => ({ ...prev, secretKey: e.target.value }))}
              placeholder="Nhập Secret Key từ eSMS.vn"
            />
          </div>

          {/* Test Connection Result */}
          {testResult && (
            <div className={`p-3 rounded-lg border ${
              testResult.success 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center space-x-2">
                {testResult.success ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {testResult.success ? 'Kết nối thành công' : 'Kết nối thất bại'}
                </span>
              </div>
              <p className="text-xs mt-1">{testResult.message}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleTestConnection}
              disabled={isTestingConnection || !config.apiKey || !config.secretKey}
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
                  <Settings className="w-4 h-4 mr-2" />
                  Kiểm tra kết nối
                </>
              )}
            </Button>

            <Button
              onClick={handleSave}
              disabled={!canSave}
              className="flex-1"
            >
              Lưu cấu hình
            </Button>
          </div>

          {integration?.isConnected && (
            <div className="pt-4 border-t">
              <Button
                onClick={handleDisconnect}
                variant="destructive"
                size="sm"
              >
                Ngắt kết nối
              </Button>
              {integration.lastTestDate && (
                <p className="text-xs text-gray-500 mt-2">
                  Kiểm tra lần cuối: {integration.lastTestDate}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hướng dẫn</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-gray-600 space-y-2">
            <p>1. Đăng ký tài khoản tại <a href="https://esms.vn" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">eSMS.vn <ExternalLink className="w-3 h-3 ml-1" /></a></p>
            <p>2. Lấy API Key và Secret Key từ dashboard eSMS.vn</p>
            <p>3. Nhập thông tin và kiểm tra kết nối</p>
            <p>4. Lưu cấu hình để sử dụng trong module Marketing</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Lưu ý:</strong> Để test trong môi trường demo, hãy sử dụng API Key có chứa từ "test" hoặc "demo"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
