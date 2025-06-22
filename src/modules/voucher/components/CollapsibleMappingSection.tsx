
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Info,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  GripVertical
} from 'lucide-react';
import { 
  ConditionValueMapping as ConditionValueMappingType, 
  ConditionGroupPriority,
  CONDITION_TYPES, 
  MOCK_CONDITION_VALUES
} from '../types/conditionBuilder';
import { toast } from '@/hooks/use-toast';

interface CollapsibleMappingSectionProps {
  valueMappings: ConditionValueMappingType[];
  groupPriorities: ConditionGroupPriority[];
  onMappingsChange?: (mappings: ConditionValueMappingType[]) => void;
  onPriorityChange?: (priorities: ConditionGroupPriority[]) => void;
  codeLength?: number;
}

export function CollapsibleMappingSection({ 
  valueMappings = [], 
  groupPriorities = [],
  onMappingsChange,
  onPriorityChange,
  codeLength = 8 
}: CollapsibleMappingSectionProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'mapping': true,
    'priority': false
  });
  const [selectedConditionType, setSelectedConditionType] = useState('');
  const [newMapping, setNewMapping] = useState({
    value: '',
    label: '',
    code: ''
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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

    const updatedMappings = [...valueMappings, mapping];
    onMappingsChange?.(updatedMappings);
    
    setNewMapping({ value: '', label: '', code: '' });
    setSelectedConditionType('');
    
    toast({
      title: "Thành công",
      description: "Đã thêm mapping mới."
    });
  };

  const handleUpdateMapping = (id: string, updates: Partial<ConditionValueMappingType>) => {
    const updatedMappings = valueMappings.map(m => 
      m.id === id ? { ...m, ...updates } : m
    );
    onMappingsChange?.(updatedMappings);
  };

  const handleDeleteMapping = (id: string) => {
    const updatedMappings = valueMappings.filter(m => m.id !== id);
    onMappingsChange?.(updatedMappings);
    
    toast({
      title: "Đã xóa",
      description: "Đã xóa mapping khỏi danh sách."
    });
  };

  const handlePriorityUpdate = (id: string, updates: Partial<ConditionGroupPriority>) => {
    const newPriorities = groupPriorities.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    onPriorityChange?.(newPriorities);
  };

  const movePriority = (id: string, direction: 'up' | 'down') => {
    const index = groupPriorities.findIndex(p => p.id === id);
    if ((direction === 'up' && index > 0) || (direction === 'down' && index < groupPriorities.length - 1)) {
      const newPriorities = [...groupPriorities];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newPriorities[index], newPriorities[swapIndex]] = [newPriorities[swapIndex], newPriorities[index]];
      
      // Update priority numbers
      newPriorities.forEach((p, i) => {
        p.priority = i + 1;
      });
      
      onPriorityChange?.(newPriorities);
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
    <div className="space-y-3">
      {/* Quản Lý Mapping */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle 
            className="flex items-center justify-between cursor-pointer text-sm"
            onClick={() => toggleSection('mapping')}
          >
            <span>Quản Lý Mapping Điều Kiện</span>
            {expandedSections.mapping ? 
              <ChevronUp className="w-4 h-4" /> : 
              <ChevronDown className="w-4 h-4" />
            }
          </CardTitle>
        </CardHeader>
        {expandedSections.mapping && (
          <CardContent className="space-y-4 pt-0">
            {/* Thêm mapping mới */}
            <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-900 text-sm mb-3">Thêm Mapping Mới</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <Label className="text-sm">Nhóm Điều Kiện</Label>
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
                  <Label className="text-sm">Giá Trị</Label>
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
                  <Label className="text-sm">Mã Code</Label>
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
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm
                  </Button>
                </div>
              </div>
            </div>

            {/* Danh sách mapping */}
            <div className="space-y-2">
              {CONDITION_TYPES.map((type) => {
                const typeMappings = valueMappings.filter(m => m.conditionType === type.value);
                if (typeMappings.length === 0) return null;

                return (
                  <div key={type.value} className="border border-gray-200 rounded-lg">
                    <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900 text-sm">{type.label}</h5>
                        <Badge variant="secondary" className="text-xs">
                          {typeMappings.filter(m => m.active).length} hoạt động
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-2 space-y-1">
                      {typeMappings.map((mapping) => (
                        <div key={mapping.id} className="flex items-center justify-between p-2 border border-gray-100 rounded bg-white">
                          <div className="flex-1 grid grid-cols-3 gap-3 text-sm">
                            <div>
                              <span className="text-xs text-gray-500">Giá trị:</span>
                              <div className="font-medium">{mapping.label}</div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Code:</span>
                              <div className="font-mono font-bold text-blue-600">{mapping.code}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={mapping.active}
                                onCheckedChange={(checked) => handleUpdateMapping(mapping.id, { active: checked })}
                              />
                              <span className="text-xs">
                                {mapping.active ? 'Hoạt động' : 'Tắt'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-1 ml-3">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toast({ description: "Tính năng đang phát triển" })}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteMapping(mapping.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Thứ Tự Ưu Tiên */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle 
            className="flex items-center justify-between cursor-pointer text-sm"
            onClick={() => toggleSection('priority')}
          >
            <span>Thứ Tự Ưu Tiên Tạo Mã</span>
            {expandedSections.priority ? 
              <ChevronUp className="w-4 h-4" /> : 
              <ChevronDown className="w-4 h-4" />
            }
          </CardTitle>
        </CardHeader>
        {expandedSections.priority && (
          <CardContent className="space-y-3 pt-0">
            <div className="text-sm text-gray-600">
              Kéo thả hoặc sử dụng nút để sắp xếp thứ tự ưu tiên.
            </div>

            <div className="space-y-2">
              {groupPriorities.map((priority, index) => (
                <div
                  key={priority.id}
                  className={`flex items-center space-x-3 p-3 border rounded-lg ${
                    priority.active ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                      {priority.priority}
                    </Badge>
                  </div>

                  <div className="flex-1">
                    <div className="font-medium text-sm">{priority.label}</div>
                    <div className="text-xs text-gray-500">
                      {valueMappings.filter(m => m.conditionType === priority.type && m.active).length} giá trị
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={priority.active}
                      onCheckedChange={(checked) => 
                        handlePriorityUpdate(priority.id, { active: checked })
                      }
                    />
                    
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => movePriority(priority.id, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => movePriority(priority.id, 'down')}
                        disabled={index === groupPriorities.length - 1}
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
