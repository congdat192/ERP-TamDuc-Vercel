
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
import { testVihatConnection, createVihatPipeline, updateVihatPipeline } from '@/services/vihatService';
import type { Pipeline } from '@/types/pipeline';

interface VihatIntegrationProps {
  integration?: Pipeline;
  onSave: (config: any) => void;
  onDisconnect: () => void;
}

export function VihatIntegration({ integration, onSave, onDisconnect }: VihatIntegrationProps) {
  const { toast } = useToast();
  
  const [config, setConfig] = useState({
    apiKey: (integration?.config && 'api_key' in integration.config) ? integration.config.api_key : '',
    secretKey: (integration?.config && 'secret_key' in integration.config) ? integration.config.secret_key : ''
  });
  
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [canSave, setCanSave] = useState(integration?.status === 'ACTIVE' || false);
  const [isSaving, setIsSaving] = useState(false);

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
      const result = await testVihatConnection({
        api_key: config.apiKey,
        secret_key: config.secretKey
      });
      
      if (result.success) {
        setTestResult({ success: true, message: result.message });
        setCanSave(true);
        toast({
          title: 'Kết nối thành công',
          description: result.message,
          variant: 'default'
        });
      } else {
        setTestResult({ success: false, message: result.message });
        setCanSave(false);
        toast({
          title: 'Kết nối thất bại',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('🔴 [VihatIntegration] Test connection error:', error);
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

  const handleSave = async () => {
    if (!canSave) {
      toast({
        title: 'Không thể lưu',
        description: 'Vui lòng kiểm tra kết nối thành công trước khi lưu.',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const vihatConfig = {
        api_key: config.apiKey,
        secret_key: config.secretKey
      };

      console.log('🟡 [VihatIntegration] Saving config:', {
        hasIntegration: !!integration,
        integrationId: integration?.id,
        configKeys: Object.keys(vihatConfig)
      });

      if (integration) {
        // Update existing pipeline
        console.log('🔄 [VihatIntegration] Updating existing pipeline:', integration.id);
        const updatePayload = {
          status: 'ACTIVE' as const,
          config: vihatConfig
        };
        console.log('📤 [VihatIntegration] Update payload:', updatePayload);
        
        await updateVihatPipeline(integration.id, updatePayload);
        console.log('✅ [VihatIntegration] Pipeline updated successfully');
      } else {
        // Create new pipeline
        console.log('🆕 [VihatIntegration] Creating new pipeline');
        const createPayload = {
          type: 'VIHAT' as const,
          status: 'ACTIVE' as const,
          config: vihatConfig,
          access_token: {
            token: '',
            refresh_token: ''
          }
        };
        console.log('📤 [VihatIntegration] Create payload:', createPayload);
        
        await createVihatPipeline(createPayload);
        console.log('✅ [VihatIntegration] Pipeline created successfully');
      }

      onSave({
        apiKey: config.apiKey,
        lastSync: new Date().toLocaleString('vi-VN'),
        status: 'connected'
      });
      
      toast({
        title: 'Lưu thành công',
        description: 'Đã cấu hình tích hợp eSMS.vn thành công.',
      });
      
    } catch (error: any) {
      console.error('🔴 [VihatIntegration] Failed to save configuration:', error);
      
      // Enhanced error handling
      let errorMessage = 'Không thể lưu cấu hình. Vui lòng thử lại.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Log detailed error for debugging
      console.error('🔴 [VihatIntegration] Error details:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error?.message
      });
      
      toast({
        title: 'Lỗi lưu cấu hình',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (integration) {
      try {
        console.log('🔄 [VihatIntegration] Disconnecting pipeline:', integration.id);
        await updateVihatPipeline(integration.id, {
          status: 'INACTIVE'
        });
        console.log('✅ [VihatIntegration] Pipeline disconnected successfully');
      } catch (error) {
        console.error('🔴 [VihatIntegration] Failed to disconnect:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể ngắt kết nối. Vui lòng thử lại.',
          variant: 'destructive'
        });
        return;
      }
    }
    
    setConfig({
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
        {integration?.status === 'ACTIVE' && (
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
            <Label htmlFor="api-key">API Key <span className="text-red-500">*</span></Label>
            <Input
              id="api-key"
              value={config.apiKey}
              onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
              placeholder="Nhập API Key từ eSMS.vn"
              disabled={isTestingConnection || isSaving}
              className="voucher-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secret-key">Secret Key <span className="text-red-500">*</span></Label>
            <Input
              id="secret-key"
              type="password"
              value={config.secretKey}
              onChange={(e) => setConfig(prev => ({ ...prev, secretKey: e.target.value }))}
              placeholder="Nhập Secret Key từ eSMS.vn"
              disabled={isTestingConnection || isSaving}
              className="voucher-input"
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
              disabled={isTestingConnection || isSaving || !config.apiKey || !config.secretKey}
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
              disabled={!canSave || isTestingConnection || isSaving}
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

          {integration?.status === 'ACTIVE' && (
            <div className="pt-4 border-t">
              <Button
                onClick={handleDisconnect}
                variant="destructive"
                size="sm"
                disabled={isSaving}
              >
                Ngắt kết nối
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Cập nhật lần cuối: {integration.updated_at ? new Date(integration.updated_at).toLocaleString('vi-VN') : 'Không rõ'}
              </p>
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Lưu ý:</strong> API Key và Secret Key có thể lấy từ trang quản lý tài khoản eSMS.vn của bạn.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
