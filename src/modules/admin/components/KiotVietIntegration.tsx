import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Building2, CheckCircle2, AlertCircle, Loader2, Wifi, WifiOff, Settings2 } from 'lucide-react';
import { getPipelines, createPipeline, updatePipeline } from '@/services/pipelineService';
import type { Pipeline, KiotVietConfig } from '@/types/pipeline';
import { isKiotVietConfig } from '@/types/pipeline';

interface KiotVietIntegrationProps {
  onSave: (config: any) => void;
  onDisconnect?: () => void;
}

export function KiotVietIntegration({ onSave, onDisconnect }: KiotVietIntegrationProps) {
  const { toast } = useToast();
  
  const [kiotVietPipeline, setKiotVietPipeline] = useState<Pipeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    retailer: '',
    clientId: '',
    clientSecret: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    loadKiotVietPipeline();
  }, []);

  const loadKiotVietPipeline = async () => {
    try {
      setLoading(true);
      const pipelines = await getPipelines();
      const kiotViet = pipelines.find(p => p.type === 'KIOT_VIET');
      setKiotVietPipeline(kiotViet || null);
      
      if (kiotViet && isKiotVietConfig(kiotViet.config)) {
        setFormData({
          retailer: kiotViet.config.retailer,
          clientId: kiotViet.config.client_id,
          clientSecret: ''
        });
      }
    } catch (error) {
      console.error('Failed to load KiotViet pipeline:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin KiotViet. Vui lòng thử lại.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <Card className="w-full max-w-2xl theme-card">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin theme-text-muted" />
          <span className="ml-2 theme-text-muted">Đang tải...</span>
        </CardContent>
      </Card>
    );
  }

  // If already connected and active, show connection status
  if (kiotVietPipeline?.status === 'ACTIVE') {
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
                'Ngắt kết nối'
              )}
            </Button>
            <Button 
              onClick={() => window.location.reload()} 
              className="flex-1 voucher-button-primary"
            >
              <Settings2 className="w-4 h-4 mr-2" />
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
              disabled={isProcessing}
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
              disabled={isProcessing}
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
              disabled={isProcessing}
              className="voucher-input"
            />
          </div>
        </div>

        {/* Action Button */}
        <div>
          <Button
            onClick={handleSaveConfiguration}
            disabled={isProcessing}
            className="w-full voucher-button-primary"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 mr-2" />
                Lưu cấu hình
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}