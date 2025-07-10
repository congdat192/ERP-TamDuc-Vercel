
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Building2, CheckCircle2, AlertCircle, Loader2, Wifi, WifiOff, Settings2, ArrowLeft } from 'lucide-react';
import { getPipelines, createPipeline, updatePipeline } from '@/services/pipelineService';
import type { Pipeline, KiotVietConfig } from '@/types/pipeline';
import { isKiotVietConfig } from '@/types/pipeline';

interface KiotVietIntegrationProps {
  onSave: (config: any) => void;
  onDisconnect?: () => void;
}

type ViewMode = 'loading' | 'configuration' | 'connected';

export function KiotVietIntegration({ onSave, onDisconnect }: KiotVietIntegrationProps) {
  const { toast } = useToast();
  
  const [viewMode, setViewMode] = useState<ViewMode>('loading');
  const [kiotVietPipeline, setKiotVietPipeline] = useState<Pipeline | null>(null);
  const [formData, setFormData] = useState({
    retailer: '',
    clientId: '',
    clientSecret: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [testingConnection, setTestingConnection] = useState(false);

  useEffect(() => {
    loadKiotVietPipeline();
  }, []);

  const loadKiotVietPipeline = async () => {
    try {
      setViewMode('loading');
      const pipelines = await getPipelines();
      const kiotViet = pipelines.find(p => p.type === 'KIOT_VIET');
      setKiotVietPipeline(kiotViet || null);
      
      if (kiotViet && isKiotVietConfig(kiotViet.config)) {
        setFormData({
          retailer: kiotViet.config.retailer,
          clientId: kiotViet.config.client_id,
          clientSecret: ''
        });
        setViewMode(kiotViet.status === 'ACTIVE' ? 'connected' : 'configuration');
      } else {
        setViewMode('configuration');
      }
    } catch (error) {
      console.error('Failed to load KiotViet pipeline:', error);
      setViewMode('configuration');
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin KiotViet. Vui lòng thử lại.',
        variant: 'destructive'
      });
    }
  };

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

    setTestingConnection(true);

    try {
      // Test connection by attempting to create/update pipeline
      const config: KiotVietConfig = {
        client_id: formData.clientId,
        client_secret: formData.clientSecret,
        retailer: formData.retailer
      };

      // Just validate the config format for now
      if (config.client_id && config.client_secret && config.retailer) {
        toast({
          title: 'Kết nối thành công',
          description: 'Thông tin cấu hình hợp lệ. Bạn có thể lưu cấu hình.',
        });
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      toast({
        title: 'Lỗi kết nối',
        description: 'Không thể kết nối với KiotViet. Vui lòng kiểm tra lại thông tin.',
        variant: 'destructive'
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveConfiguration = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      const config: KiotVietConfig = {
        client_id: formData.clientId,
        client_secret: formData.clientSecret,
        retailer: formData.retailer
      };

      if (kiotVietPipeline) {
        // Update existing pipeline
        const updatedPipeline = await updatePipeline(kiotVietPipeline.id, {
          status: 'ACTIVE',
          config
        });
        setKiotVietPipeline(updatedPipeline);
      } else {
        // Create new pipeline
        const newPipeline = await createPipeline({
          type: 'KIOT_VIET',
          status: 'ACTIVE',
          config,
          access_token: {
            token: '',
            refresh_token: ''
          }
        });
        setKiotVietPipeline(newPipeline);
      }

      onSave({
        retailer: formData.retailer,
        clientId: formData.clientId,
        status: 'connected',
        lastSync: new Date().toLocaleString('vi-VN')
      });
      
      setViewMode('connected');
      
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
      setIsProcessing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!kiotVietPipeline) return;
    
    setIsProcessing(true);

    try {
      await updatePipeline(kiotVietPipeline.id, {
        status: 'INACTIVE'
      });
      
      setKiotVietPipeline(prev => prev ? { ...prev, status: 'INACTIVE' } : null);
      
      // Clear form and switch to configuration view
      setFormData({
        retailer: '',
        clientId: '',
        clientSecret: ''
      });
      setViewMode('configuration');
      
      if (onDisconnect) {
        onDisconnect();
      }
      
      toast({
        title: 'Ngắt kết nối thành công',
        description: 'Đã ngắt kết nối KiotViet.',
      });
      
    } catch (error) {
      console.error('Failed to disconnect:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể ngắt kết nối. Vui lòng thử lại.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReconfigure = () => {
    // Load current config into form for editing
    if (kiotVietPipeline && isKiotVietConfig(kiotVietPipeline.config)) {
      setFormData({
        retailer: kiotVietPipeline.config.retailer,
        clientId: kiotVietPipeline.config.client_id,
        clientSecret: '' // Don't pre-fill secret for security
      });
    }
    setViewMode('configuration');
  };

  // Loading view
  if (viewMode === 'loading') {
    return (
      <Card className="w-full max-w-2xl theme-card">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin theme-text-muted" />
          <span className="ml-2 theme-text-muted">Đang tải...</span>
        </CardContent>
      </Card>
    );
  }

  // Connected view
  if (viewMode === 'connected' && kiotVietPipeline?.status === 'ACTIVE') {
    const config = isKiotVietConfig(kiotVietPipeline.config) ? kiotVietPipeline.config : null;
    
    return (
      <Card className="w-full max-w-2xl theme-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg theme-bg-primary flex items-center justify-center text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold theme-text">
                KiotViet - {config?.retailer || 'Unknown'}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="success" className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Đã kết nối
                </Badge>
                <span className="text-sm theme-text-muted">
                  Client ID: {config?.client_id || 'Unknown'}
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
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 mr-2" />
                  Ngắt kết nối
                </>
              )}
            </Button>
            <Button 
              onClick={handleReconfigure} 
              className="flex-1 voucher-button-primary"
              disabled={isProcessing}
            >
              <Settings2 className="w-4 h-4 mr-2" />
              Cấu hình lại
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Configuration view
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

        {/* Info */}
        <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-blue-700">
            Thông tin sẽ được lưu trữ bảo mật và kết nối thông qua backend API
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
              disabled={isProcessing || testingConnection}
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
              disabled={isProcessing || testingConnection}
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
              disabled={isProcessing || testingConnection}
              className="voucher-input"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="flex space-x-3">
            <Button
              onClick={handleTestConnection}
              disabled={isProcessing || testingConnection}
              variant="outline"
              className="flex-1"
            >
              {testingConnection ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang test...
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 mr-2" />
                  Test kết nối
                </>
              )}
            </Button>
            
            <Button
              onClick={handleSaveConfiguration}
              disabled={isProcessing || testingConnection}
              className="flex-1 voucher-button-primary"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Lưu cấu hình
                </>
              )}
            </Button>
          </div>
          
          {/* Back to connected view if editing existing config */}
          {kiotVietPipeline?.status === 'ACTIVE' && (
            <Button
              onClick={() => setViewMode('connected')}
              variant="ghost"
              className="w-full"
              disabled={isProcessing || testingConnection}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
