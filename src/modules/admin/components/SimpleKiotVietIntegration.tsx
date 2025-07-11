
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';
import { Building2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { 
  createPipeline, 
  updatePipeline, 
  syncPipeline,
  cleanupTestPipelines 
} from '@/services/pipelineService';
import type { Pipeline, PipelineConfig } from '@/types/pipeline';

interface SimpleKiotVietIntegrationProps {
  integration?: Pipeline;
  onSave: (config: any) => void;
  onDisconnect?: () => void;
}

export function SimpleKiotVietIntegration({ integration, onSave, onDisconnect }: SimpleKiotVietIntegrationProps) {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    retailer: (integration?.config && 'retailer' in integration.config) ? integration.config.retailer : '',
    clientId: (integration?.config && 'client_id' in integration.config) ? integration.config.client_id : '',
    clientSecret: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);

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

    setIsSaving(true);

    try {
      let savedPipeline: Pipeline;

      if (integration) {
        // Update existing pipeline
        savedPipeline = await updatePipeline(integration.id, {
          status: 'ACTIVE',
          config: {
            client_id: formData.clientId,
            client_secret: formData.clientSecret,
            retailer: formData.retailer
          }
        });
      } else {
        // Create new pipeline
        savedPipeline = await createPipeline({
          type: 'KIOT_VIET',
          status: 'ACTIVE',
          config: {
            client_id: formData.clientId,
            client_secret: formData.clientSecret,
            retailer: formData.retailer
          },
          access_token: {
            token: '',
            refresh_token: ''
          }
        });
      }

      onSave({
        retailer: formData.retailer,
        clientId: formData.clientId,
        status: 'connected',
        pipelineId: savedPipeline.id
      });
      
      toast({
        title: 'Lưu thành công',
        description: `Đã cấu hình tích hợp KiotViet cho cửa hàng "${formData.retailer}". Bạn có thể đồng bộ dữ liệu khi sẵn sàng.`,
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

  const handleSyncData = async () => {
    if (!integration?.id) {
      toast({
        title: 'Lỗi',
        description: 'Không tìm thấy pipeline để đồng bộ. Vui lòng lưu cấu hình trước.',
        variant: 'destructive'
      });
      return;
    }

    setIsSyncing(true);
    setSyncResult(null);

    try {
      await syncPipeline(integration.id);
      
      const successMessage = 'Đồng bộ dữ liệu thành công! Dữ liệu từ KiotViet đã được cập nhật vào hệ thống.';
      
      setSyncResult({
        success: true,
        message: successMessage,
        details: {
          syncTime: new Date().toLocaleString('vi-VN'),
          status: 'completed'
        }
      });
      
      toast({
        title: 'Đồng bộ thành công',
        description: successMessage,
      });
      
    } catch (error: any) {
      console.error('Failed to sync data:', error);
      
      let errorMessage = 'Không thể đồng bộ dữ liệu. Vui lòng kiểm tra kết nối và thử lại.';
      
      if (error.message) {
        if (error.message.includes('unauthorized') || error.message.includes('401')) {
          errorMessage = 'Thông tin xác thực không hợp lệ. Vui lòng cập nhật cấu hình.';
        } else if (error.message.includes('server') || error.message.includes('500')) {
          errorMessage = 'Lỗi máy chủ KiotViet. Vui lòng thử lại sau.';
        }
      }
      
      setSyncResult({
        success: false,
        message: errorMessage
      });
      
      toast({
        title: 'Đồng bộ thất bại',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (integration && onDisconnect) {
      try {
        await updatePipeline(integration.id, {
          status: 'INACTIVE'
        });
        
        // Clear sync result when disconnecting
        setSyncResult(null);
        
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

  const handleFormReset = () => {
    setSyncResult(null);
    setFormData({
      retailer: '',
      clientId: '',
      clientSecret: ''
    });
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
                KiotViet - {(integration.config && 'retailer' in integration.config) ? integration.config.retailer : 'Unknown'}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="success" className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Đã kết nối
                </Badge>
                <span className="text-sm theme-text-muted">
                  Client ID: {(integration.config && 'client_id' in integration.config) ? integration.config.client_id : 'Unknown'}
                </span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Sync Result */}
          {syncResult && (
            <div className={`flex items-center space-x-2 p-3 rounded-lg ${
              syncResult.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              {syncResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              <div className="flex-1">
                <span className={`text-sm ${
                  syncResult.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {syncResult.message}
                </span>
                {syncResult.details?.syncTime && (
                  <div className="text-xs text-green-600 mt-1">
                    Thời gian đồng bộ: {syncResult.details.syncTime}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button 
              onClick={handleSyncData}
              disabled={isSyncing}
              className="voucher-button-primary"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang đồng bộ...
                </>
              ) : (
                'Đồng bộ dữ liệu'
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleDisconnect}
            >
              Ngắt kết nối
            </Button>
            
            <Button 
              onClick={handleFormReset} 
              variant="outline"
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
              disabled={isSaving}
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
              disabled={isSaving}
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
              disabled={isSaving}
              className="voucher-input"
            />
          </div>
        </div>

        {/* Action Button */}
        <div>
          <Button
            onClick={handleSaveConfiguration}
            disabled={isSaving}
            className="w-full voucher-button-primary"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu cấu hình...
              </>
            ) : (
              'Lưu cấu hình'
            )}
          </Button>
        </div>

        {/* Reset Form Button */}
        {(formData.retailer || formData.clientId || formData.clientSecret) && (
          <div className="pt-2 border-t theme-border">
            <Button
              onClick={handleFormReset}
              variant="ghost"
              className="w-full text-sm theme-text-muted hover:theme-text"
              disabled={isSaving}
            >
              Xóa form và làm lại
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
