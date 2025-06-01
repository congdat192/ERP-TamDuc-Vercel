
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X,
  Info,
  AlertCircle
} from 'lucide-react';
import { 
  ConditionValueMapping as ConditionValueMappingType, 
  CONDITION_TYPES, 
  MOCK_CONDITION_VALUES,
  MOCK_VALUE_MAPPINGS 
} from '../types/conditionBuilder';

interface ConditionValueMappingProps {
  onMappingsChange?: (mappings: ConditionValueMappingType[]) => void;
}

export function ConditionValueMapping({ onMappingsChange }: ConditionValueMappingProps) {
  const [mappings, setMappings] = useState<ConditionValueMappingType[]>(MOCK_VALUE_MAPPINGS);
  const [selectedConditionType, setSelectedConditionType] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newMapping, setNewMapping] = useState({
    value: '',
    label: '',
    code: ''
  });

  const handleAddMapping = () => {
    if (!selectedConditionType || !newMapping.value || !newMapping.code) return;

    const mapping: ConditionValueMappingType = {
      id: `mapping-${Date.now()}`,
      conditionType: selectedConditionType as any,
      value: newMapping.value,
      label: newMapping.label || newMapping.value,
      code: newMapping.code.toUpperCase(),
      active: true
    };

    const updatedMappings = [...mappings, mapping];
    setMappings(updatedMappings);
    onMappingsChange?.(updatedMappings);
    
    setNewMapping({ value: '', label: '', code: '' });
    setSelectedConditionType('');
  };

  const handleUpdateMapping = (id: string, updates: Partial<ConditionValueMappingType>) => {
    const updatedMappings = mappings.map(m => 
      m.id === id ? { ...m, ...updates } : m
    );
    setMappings(updatedMappings);
    onMappingsChange?.(updatedMappings);
  };

  const handleDeleteMapping = (id: string) => {
    const updatedMappings = mappings.filter(m => m.id !== id);
    setMappings(updatedMappings);
    onMappingsChange?.(updatedMappings);
  };

  const handleToggleActive = (id: string) => {
    const mapping = mappings.find(m => m.id === id);
    if (mapping) {
      handleUpdateMapping(id, { active: !mapping.active });
    }
  };

  const getConditionTypeLabel = (type: string) => {
    return CONDITION_TYPES.find(t => t.value === type)?.label || type;
  };

  const getAvailableValues = () => {
    if (!selectedConditionType) return [];
    return MOCK_CONDITION_VALUES[selectedConditionType as keyof typeof MOCK_CONDITION_VALUES] || [];
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Thiết Lập Mapping Giá Trị Điều Kiện</span>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Mapping các giá trị điều kiện thành mã code ngắn để tạo prefix voucher</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Mapping */}
          <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="font-medium text-gray-900">Thêm Mapping Mới</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Nhóm Điều Kiện</Label>
                <Select value={selectedConditionType} onValueChange={setSelectedConditionType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn nhóm..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Giá Trị</Label>
                <Select 
                  value={newMapping.value} 
                  onValueChange={(value) => {
                    const option = getAvailableValues().find(v => v.value === value);
                    setNewMapping({
                      ...newMapping,
                      value,
                      label: option?.label || value
                    });
                  }}
                  disabled={!selectedConditionType}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn giá trị..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableValues().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Mã Code (1-2 ký tự)</Label>
                <Input
                  value={newMapping.code}
                  onChange={(e) => setNewMapping({
                    ...newMapping,
                    code: e.target.value.slice(0, 2).toUpperCase()
                  })}
                  placeholder="VD: V, VIP"
                  className="mt-1"
                  maxLength={2}
                />
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={handleAddMapping}
                  disabled={!selectedConditionType || !newMapping.value || !newMapping.code}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm
                </Button>
              </div>
            </div>
          </div>

          {/* Mappings Table */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Danh Sách Mapping Hiện Tại</h4>
            
            {mappings.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Chưa có mapping nào được thiết lập. Thêm mapping đầu tiên để bắt đầu.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {CONDITION_TYPES.map((type) => {
                  const typeMappings = mappings.filter(m => m.conditionType === type.value);
                  if (typeMappings.length === 0) return null;

                  return (
                    <div key={type.value} className="border border-gray-200 rounded-lg">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-gray-900">{type.label}</h5>
                          <Badge variant="secondary">
                            {typeMappings.filter(m => m.active).length} active
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-3">
                        {typeMappings.map((mapping) => (
                          <div key={mapping.id} className="flex items-center space-x-4 p-3 border border-gray-100 rounded bg-white">
                            <div className="flex-1 grid grid-cols-3 gap-4">
                              <div>
                                <span className="text-sm text-gray-600">Giá trị:</span>
                                <div className="font-medium">{mapping.label}</div>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600">Code:</span>
                                <div className="font-mono font-bold text-blue-600">{mapping.code}</div>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600">Trạng thái:</span>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={mapping.active}
                                    onCheckedChange={() => handleToggleActive(mapping.id)}
                                    size="sm"
                                  />
                                  <span className="text-sm">
                                    {mapping.active ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteMapping(mapping.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Usage Instructions */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-1">Hướng Dẫn Mapping</div>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Mỗi giá trị điều kiện cần được mapping thành 1-2 ký tự code</li>
                  <li>Code này sẽ được dùng để tạo prefix cho mã voucher</li>
                  <li>Ví dụ: VIP → V, Premium → P, Website → W</li>
                  <li>Chỉ những mapping được đánh dấu "Active" mới được sử dụng</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
