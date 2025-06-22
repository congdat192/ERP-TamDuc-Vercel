
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConditionValueMapping } from './ConditionValueMapping';
import { ConditionPriorityManager } from './ConditionPriorityManager';
import { CustomerSourceManager } from './CustomerSourceManager';
import { CustomerTypeManager } from './CustomerTypeManager';
import { StaffTypeSelector } from './StaffTypeSelector';
import { CustomerTargetSelector } from './CustomerTargetSelector';
import { 
  ConditionValueMapping as ConditionValueMappingType,
  ConditionGroupPriority
} from '../types/conditionBuilder';
import { StaffType, CustomerTargetType } from '../types/campaign';
import { 
  MapPin, 
  ArrowUpDown, 
  Users, 
  UserCheck, 
  Building2,
  Info,
  Settings
} from 'lucide-react';

type CodeGenerationMethod = 'manual' | 'mapping' | 'combined';

interface AdvancedMappingConfigurationProps {
  generationMethod: CodeGenerationMethod;
  valueMappings: ConditionValueMappingType[];
  groupPriorities: ConditionGroupPriority[];
  onMappingsChange: (mappings: ConditionValueMappingType[]) => void;
  onPriorityChange: (priorities: ConditionGroupPriority[]) => void;
  codeLength: number;
}

export function AdvancedMappingConfiguration({
  generationMethod,
  valueMappings,
  groupPriorities,
  onMappingsChange,
  onPriorityChange,
  codeLength
}: AdvancedMappingConfigurationProps) {
  const [activeTab, setActiveTab] = useState('mappings');
  const [selectedStaffTypes, setSelectedStaffTypes] = useState<StaffType[]>(['cskh']);
  const [selectedCustomerTargets, setSelectedCustomerTargets] = useState<CustomerTargetType[]>(['new']);

  const renderMappingMethodInfo = () => (
    <Alert className="voucher-alert-info mb-6">
      <Info className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <div className="font-medium theme-text">
            Phương thức: {generationMethod === 'mapping' ? 'Mapping Điều Kiện' : 'Kết Hợp'}
          </div>
          <p className="text-sm theme-text-muted">
            {generationMethod === 'mapping' 
              ? 'Mã voucher sẽ được tạo hoàn toàn dựa trên các quy tắc mapping bạn cấu hình.'
              : 'Mã voucher sẽ kết hợp prefix thủ công và các quy tắc mapping điều kiện.'
            }
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );

  const renderActiveConditionsOverview = () => {
    const activeMappings = valueMappings.filter(m => m.active);
    const activePriorities = groupPriorities.filter(p => p.active);

    return (
      <Card className="voucher-card mb-6">
        <CardHeader>
          <CardTitle className="text-sm theme-text flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Tóm Tắt Mapping Đang Hoạt Động</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="theme-text-muted">Value mappings đang hoạt động:</span>
              <div className="mt-1 space-x-1">
                {activeMappings.length > 0 ? (
                  activeMappings.map(m => (
                    <Badge key={m.id} variant="secondary" className="theme-badge-secondary text-xs">
                      {m.conditionType}: {m.code}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs theme-text-muted italic">Chưa có mapping nào được kích hoạt</span>
                )}
              </div>
            </div>
            <div>
              <span className="theme-text-muted">Priority groups đang hoạt động:</span>
              <div className="mt-1 space-x-1">
                {activePriorities.length > 0 ? (
                  activePriorities.map(p => (
                    <Badge key={p.id} variant="outline" className="text-xs">
                      #{p.priority} {p.type}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs theme-text-muted italic">Chưa có group nào được kích hoạt</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {renderMappingMethodInfo()}
      {renderActiveConditionsOverview()}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger 
            value="mappings" 
            className="voucher-tabs-trigger flex items-center space-x-2"
          >
            <MapPin className="w-4 h-4" />
            <span>Value Mapping</span>
          </TabsTrigger>
          <TabsTrigger 
            value="priorities" 
            className="voucher-tabs-trigger flex items-center space-x-2"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>Thứ Tự Ưu Tiên</span>
          </TabsTrigger>
          <TabsTrigger 
            value="customer-rules" 
            className="voucher-tabs-trigger flex items-center space-x-2"
          >
            <Users className="w-4 h-4" />
            <span>Quy Tắc KH</span>
          </TabsTrigger>
          <TabsTrigger 
            value="staff-rules" 
            className="voucher-tabs-trigger flex items-center space-x-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Quy Tắc NV</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mappings" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium theme-text">Cấu Hình Value Mapping</h3>
              <Badge variant="outline" className="text-xs">
                {valueMappings.filter(m => m.active).length} / {valueMappings.length} đang hoạt động
              </Badge>
            </div>
            <ConditionValueMapping 
              onMappingsChange={onMappingsChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="priorities" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium theme-text">Cấu Hình Thứ Tự Ưu Tiên</h3>
              <Badge variant="outline" className="text-xs">
                {groupPriorities.filter(p => p.active).length} / {groupPriorities.length} đang hoạt động
              </Badge>
            </div>
            <ConditionPriorityManager
              valueMappings={valueMappings}
              onPriorityChange={onPriorityChange}
              codeLength={codeLength}
            />
          </div>
        </TabsContent>

        <TabsContent value="customer-rules" className="space-y-4">
          <div className="space-y-6">
            <h3 className="font-medium theme-text">Quy Tắc Khách Hàng</h3>
            
            <Card className="voucher-card">
              <CardHeader>
                <CardTitle className="text-sm theme-text">Nguồn Khách Hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomerSourceManager />
              </CardContent>
            </Card>

            <Card className="voucher-card">
              <CardHeader>
                <CardTitle className="text-sm theme-text">Loại Khách Hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomerTypeManager />
              </CardContent>
            </Card>

            <Card className="voucher-card">
              <CardHeader>
                <CardTitle className="text-sm theme-text">Đối Tượng Khách Hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomerTargetSelector
                  value={selectedCustomerTargets}
                  onChange={setSelectedCustomerTargets}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="staff-rules" className="space-y-4">
          <div className="space-y-6">
            <h3 className="font-medium theme-text">Quy Tắc Nhân Viên</h3>
            
            <Card className="voucher-card">
              <CardHeader>
                <CardTitle className="text-sm theme-text">Loại Nhân Viên</CardTitle>
              </CardHeader>
              <CardContent>
                <StaffTypeSelector
                  value={selectedStaffTypes}
                  onChange={setSelectedStaffTypes}
                />
              </CardContent>
            </Card>

            <Alert className="voucher-alert-info">
              <Building2 className="h-4 w-4" />
              <AlertDescription>
                <div className="text-sm">
                  <div className="font-medium mb-1">Cấu Hình Theo Nhân Viên</div>
                  <p className="theme-text-muted">
                    Mã voucher sẽ được tạo khác nhau tùy theo loại nhân viên thực hiện giao dịch. 
                    Điều này giúp phân biệt và theo dõi hiệu quả bán hàng theo từng bộ phận.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
      </Tabs>

      {/* Configuration Status Summary */}
      <Card className="voucher-card">
        <CardHeader>
          <CardTitle className="text-sm theme-text">Trạng Thái Cấu Hình</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="theme-text-muted">Value mappings:</span>
              <span className="ml-2 font-medium theme-text">
                {valueMappings.filter(m => m.active).length} hoạt động
              </span>
            </div>
            <div>
              <span className="theme-text-muted">Priority groups:</span>
              <span className="ml-2 font-medium theme-text">
                {groupPriorities.filter(p => p.active).length} hoạt động
              </span>
            </div>
            <div>
              <span className="theme-text-muted">Staff types:</span>
              <span className="ml-2 font-medium theme-text">
                {selectedStaffTypes.length} đã chọn
              </span>
            </div>
            <div>
              <span className="theme-text-muted">Customer targets:</span>
              <span className="ml-2 font-medium theme-text">
                {selectedCustomerTargets.length} đã chọn
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
