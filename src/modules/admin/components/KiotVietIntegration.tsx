
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LoadingSpinner } from '@/components/ui/loading';
import { FormError, FormSuccess } from '@/components/ui/form-errors';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader, 
  Building2, 
  Shield,
  Clock,
  Users,
  FileText,
  Package,
  CalendarIcon,
  ChevronDown,
  ChevronUp,
  Settings2
} from 'lucide-react';
import type { 
  KiotVietIntegration as KiotVietIntegrationType, 
  KiotVietApiGroup, 
  ConnectionTestResult, 
  SyncLimitOption,
  DateRange,
  ApiGroupSyncConfig,
  InitialSyncConfig
} from '../types/settings';

const availableApiGroups: KiotVietApiGroup[] = [
  {
    id: 'customers',
    name: 'Khách hàng',
    description: 'Đồng bộ thông tin khách hàng và lịch sử mua hàng',
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
  }
];

const apiGroupIcons = {
  customers: Users,
  invoices: FileText,
  products: Package
};

const syncLimitOptions: SyncLimitOption[] = [
  { value: 50, label: '50 bản ghi' },
  { value: 100, label: '100 bản ghi' },
  { value: 200, label: '200 bản ghi' },
  { value: 500, label: '500 bản ghi' },
  { value: 1000, label: '1000 bản ghi' },
  { value: 'all', label: 'Tất cả dữ liệu' }
];

const syncTimeOptions = [
  { value: 'realtime', label: 'Theo thời gian thực' },
  { value: 'hourly', label: 'Mỗi giờ' },
  { value: 'daily', label: 'Mỗi ngày' },
  { value: 'custom', label: 'Tùy chỉnh' }
];

interface KiotVietIntegrationProps {
  integration?: KiotVietIntegrationType;
  onSave: (config: Partial<KiotVietIntegrationType>) => void;
  onDisconnect?: () => void;
}

interface DatePickerProps {
  date: Date | null;
  onSelect: (date: Date | undefined) => void;
  placeholder: string;
  disabled?: boolean;
}

function DatePicker({ date, onSelect, placeholder, disabled }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "voucher-input justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy", { locale: vi }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={onSelect}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
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

  const [syncFrequency, setSyncFrequency] = useState<string>('daily');
  const [customSyncInterval, setCustomSyncInterval] = useState<number>(24);
  
  // Initial sync configuration state
  const [globalSyncLimit, setGlobalSyncLimit] = useState<number | 'all'>(100);
  const [globalDateRange, setGlobalDateRange] = useState<DateRange>({
    from: null,
    to: null
  });
  
  const [apiGroupConfigs, setApiGroupConfigs] = useState<Record<string, ApiGroupSyncConfig>>({});
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  
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

    if (syncFrequency === 'custom' && (!customSyncInterval || customSyncInterval < 1)) {
      errors.push('Vui lòng nhập khoảng thời gian đồng bộ hợp lệ');
    }

    // Validate date ranges
    if (globalDateRange.from && globalDateRange.to && globalDateRange.from > globalDateRange.to) {
      errors.push('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleTestConnection = async () => {
    if (!validateForm()) return;
    
    setIsTesting(true);
    setTestResult(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
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

    const initialSyncConfig: InitialSyncConfig = {
      globalSyncLimit,
      globalDateRange,
      apiGroupConfigs
    };

    const config: Partial<KiotVietIntegrationType> = {
      retailerName: formData.retailerName,
      clientId: formData.clientId,
      isConnected: true,
      connectedApiGroups: selectedApiGroups,
      connectionStatus: 'connected',
      lastSync: new Date().toLocaleString('vi-VN'),
      initialSyncConfig
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

    // Initialize config for new groups
    if (checked && !apiGroupConfigs[groupId]) {
      setApiGroupConfigs(prev => ({
        ...prev,
        [groupId]: {
          enabled: true,
          syncLimit: globalSyncLimit,
          dateRange: { ...globalDateRange },
          useGlobalConfig: true
        }
      }));
    }
    
    if (testResult) {
      setTestResult(null);
    }
  };

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const updateApiGroupConfig = (groupId: string, config: Partial<ApiGroupSyncConfig>) => {
    setApiGroupConfigs(prev => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        ...config
      }
    }));
  };

  const getSyncFrequencyLabel = () => {
    if (syncFrequency === 'custom') {
      return `Mỗi ${customSyncInterval} giờ`;
    }
    return syncTimeOptions.find(opt => opt.value === syncFrequency)?.label || '';
  };

  const getSyncLimitLabel = (limit: number | 'all') => {
    if (limit === 'all') return 'Tất cả dữ liệu';
    return `${limit} bản ghi`;
  };

  // If already connected, show connection status
  if (integration?.isConnected) {
    return (
      <Card className="w-full max-w-4xl theme-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg theme-bg-primary flex items-center justify-center text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold theme-text">KiotViet - {integration.retailerName}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="success" className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Đã kết nối
                </Badge>
                {integration.lastSync && (
                  <span className="text-sm theme-text-muted flex items-center">
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
            <Label className="text-sm font-medium mb-3 block theme-text">Nhóm API đang đồng bộ:</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {integration.connectedApiGroups.map((groupId) => {
                const group = availableApiGroups.find(g => g.id === groupId);
                const IconComponent = apiGroupIcons[groupId as keyof typeof apiGroupIcons];
                
                return (
                  <div key={groupId} className="flex items-center space-x-3 p-3 theme-bg-primary/10 rounded-lg border theme-border-primary/20">
                    <IconComponent className="w-4 h-4 theme-text-primary" />
                    <div>
                      <span className="text-sm font-medium theme-text-primary">{group?.name}</span>
                      <p className="text-xs theme-text-muted">{group?.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block theme-text">Tần suất đồng bộ:</Label>
            <div className="p-3 theme-bg-primary/10 rounded-lg border theme-border-primary/20">
              <span className="text-sm theme-text-primary font-medium">{getSyncFrequencyLabel()}</span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onDisconnect} className="flex-1">
              Ngắt kết nối
            </Button>
            <Button onClick={() => window.location.reload()} className="flex-1 voucher-button-primary">
              Cấu hình lại
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl theme-card">
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
              <Label htmlFor="retailerName" className="theme-text">Tên cửa hàng *</Label>
              <Input
                id="retailerName"
                value={formData.retailerName}
                onChange={(e) => setFormData(prev => ({ ...prev, retailerName: e.target.value }))}
                placeholder="Nhập tên cửa hàng KiotViet"
                disabled={isTesting}
                className="voucher-input"
              />
            </div>
            
            <div>
              <Label htmlFor="clientId" className="theme-text">Client ID *</Label>
              <Input
                id="clientId"
                value={formData.clientId}
                onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                placeholder="Nhập Client ID từ KiotViet"
                disabled={isTesting}
                className="voucher-input"
              />
            </div>
            
            <div>
              <Label htmlFor="clientSecret" className="theme-text">Client Secret *</Label>
              <Input
                id="clientSecret"
                type="password"
                value={formData.clientSecret}
                onChange={(e) => setFormData(prev => ({ ...prev, clientSecret: e.target.value }))}
                placeholder="Nhập Client Secret từ KiotViet"
                disabled={isTesting}
                className="voucher-input"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-3 block theme-text">Nhóm API cần đồng bộ *</Label>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {availableApiGroups.map((group) => {
                const IconComponent = apiGroupIcons[group.id as keyof typeof apiGroupIcons];
                const isSelected = selectedApiGroups.includes(group.id);
                const isAccessible = testResult?.success && testResult.accessibleGroups?.includes(group.id);
                
                return (
                  <div 
                    key={group.id} 
                    className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                      isSelected ? 'theme-bg-primary/10 theme-border-primary/20' : 'theme-bg-primary/5 theme-border'
                    }`}
                  >
                    <Checkbox
                      id={group.id}
                      checked={isSelected}
                      onCheckedChange={(checked) => handleApiGroupToggle(group.id, checked as boolean)}
                      disabled={isTesting}
                    />
                    <IconComponent className={`w-4 h-4 mt-0.5 ${isSelected ? 'theme-text-primary' : 'theme-text-muted'}`} />
                    <div className="flex-1">
                      <Label htmlFor={group.id} className="text-sm font-medium cursor-pointer theme-text">
                        {group.name}
                        {isAccessible && (
                          <CheckCircle2 className="w-3 h-3 text-green-500 inline ml-1" />
                        )}
                      </Label>
                      <p className="text-xs theme-text-muted mt-1">{group.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Initial Sync Configuration */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Settings2 className="w-5 h-5 theme-text-primary" />
            <Label className="text-sm font-medium theme-text">Cài đặt đồng bộ lần đầu</Label>
          </div>
          
          {/* Global Configuration */}
          <Card className="theme-bg-primary/5 border theme-border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm theme-text">Cấu hình chung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm theme-text">Số lượng đồng bộ</Label>
                  <Select 
                    value={globalSyncLimit.toString()} 
                    onValueChange={(value) => setGlobalSyncLimit(value === 'all' ? 'all' : parseInt(value))}
                    disabled={isTesting}
                  >
                    <SelectTrigger className="voucher-input">
                      <SelectValue placeholder="Chọn số lượng" />
                    </SelectTrigger>
                    <SelectContent>
                      {syncLimitOptions.map((option) => (
                        <SelectItem key={option.value.toString()} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm theme-text">Từ ngày</Label>
                  <DatePicker
                    date={globalDateRange.from}
                    onSelect={(date) => setGlobalDateRange(prev => ({ ...prev, from: date || null }))}
                    placeholder="Chọn ngày bắt đầu"
                    disabled={isTesting}
                  />
                </div>
                
                <div>
                  <Label className="text-sm theme-text">Đến ngày</Label>
                  <DatePicker
                    date={globalDateRange.to}
                    onSelect={(date) => setGlobalDateRange(prev => ({ ...prev, to: date || null }))}
                    placeholder="Chọn ngày kết thúc"
                    disabled={isTesting}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Group Specific Configuration */}
          {selectedApiGroups.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium theme-text">Cấu hình riêng cho từng loại dữ liệu</Label>
              
              {selectedApiGroups.map((groupId) => {
                const group = availableApiGroups.find(g => g.id === groupId);
                const IconComponent = apiGroupIcons[groupId as keyof typeof apiGroupIcons];
                const isExpanded = expandedGroups.includes(groupId);
                const config = apiGroupConfigs[groupId] || {
                  enabled: true,
                  syncLimit: globalSyncLimit,
                  dateRange: { ...globalDateRange },
                  useGlobalConfig: true
                };
                
                return (
                  <Card key={groupId} className="border theme-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-4 h-4 theme-text-primary" />
                          <span className="text-sm font-medium theme-text">{group?.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={config.useGlobalConfig}
                            onCheckedChange={(checked) => 
                              updateApiGroupConfig(groupId, { 
                                useGlobalConfig: checked as boolean,
                                syncLimit: checked ? globalSyncLimit : config.syncLimit,
                                dateRange: checked ? { ...globalDateRange } : config.dateRange
                              })
                            }
                            disabled={isTesting}
                          />
                          <Label className="text-xs theme-text-muted">Dùng cấu hình chung</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleGroupExpansion(groupId)}
                            className="h-6 w-6 p-0"
                            disabled={config.useGlobalConfig}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    {isExpanded && !config.useGlobalConfig && (
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label className="text-xs theme-text">Số lượng</Label>
                            <Select 
                              value={config.syncLimit.toString()} 
                              onValueChange={(value) => 
                                updateApiGroupConfig(groupId, { 
                                  syncLimit: value === 'all' ? 'all' : parseInt(value) 
                                })
                              }
                              disabled={isTesting}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {syncLimitOptions.map((option) => (
                                  <SelectItem key={option.value.toString()} value={option.value.toString()}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-xs theme-text">Từ ngày</Label>
                            <DatePicker
                              date={config.dateRange.from}
                              onSelect={(date) => 
                                updateApiGroupConfig(groupId, { 
                                  dateRange: { ...config.dateRange, from: date || null }
                                })
                              }
                              placeholder="Từ ngày"
                              disabled={isTesting}
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs theme-text">Đến ngày</Label>
                            <DatePicker
                              date={config.dateRange.to}
                              onSelect={(date) => 
                                updateApiGroupConfig(groupId, { 
                                  dateRange: { ...config.dateRange, to: date || null }
                                })
                              }
                              placeholder="Đến ngày"
                              disabled={isTesting}
                            />
                          </div>
                        </div>
                      </CardContent>
                    )}
                    
                    {config.useGlobalConfig && (
                      <CardContent className="pt-0">
                        <div className="text-xs theme-text-muted">
                          Sử dụng: {getSyncLimitLabel(globalSyncLimit)}
                          {globalDateRange.from && globalDateRange.to && (
                            <span> | {format(globalDateRange.from, "dd/MM/yyyy", { locale: vi })} - {format(globalDateRange.to, "dd/MM/yyyy", { locale: vi })}</span>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Sync Time Settings */}
        <div className="space-y-4">
          <Label className="text-sm font-medium theme-text">Cài đặt thời gian đồng bộ</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="syncFrequency" className="text-sm theme-text">Tần suất đồng bộ</Label>
              <Select value={syncFrequency} onValueChange={setSyncFrequency} disabled={isTesting}>
                <SelectTrigger className="voucher-input">
                  <SelectValue placeholder="Chọn tần suất đồng bộ" />
                </SelectTrigger>
                <SelectContent>
                  {syncTimeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {syncFrequency === 'custom' && (
              <div>
                <Label htmlFor="customInterval" className="text-sm theme-text">Khoảng thời gian (giờ)</Label>
                <Input
                  id="customInterval"
                  type="number"
                  min="1"
                  value={customSyncInterval}
                  onChange={(e) => setCustomSyncInterval(parseInt(e.target.value) || 1)}
                  placeholder="Nhập số giờ"
                  disabled={isTesting}
                  className="voucher-input"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 p-4 voucher-alert-warning rounded-lg">
          <Shield className="w-5 h-5" />
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
            <p className="text-xs mt-1 ml-6">
              Dữ liệu của bạn sẽ được bảo mật và chỉ được sử dụng cho mục đích đồng bộ hóa.
            </p>
          </div>
        </div>

        <div className="flex space-x-3 pt-4 border-t theme-border">
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
            className="flex-1 voucher-button-primary"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Lưu cấu hình
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
