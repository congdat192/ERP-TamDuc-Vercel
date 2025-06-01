
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Info,
  Save,
  X
} from 'lucide-react';
import { 
  ConditionValueMapping, 
  CONDITION_TYPES, 
  MOCK_CONDITION_VALUES,
  MOCK_VALUE_MAPPINGS 
} from '../types/conditionBuilder';

interface ConditionValueMappingProps {
  onMappingsChange?: (mappings: ConditionValueMapping[]) => void;
}

export function ConditionValueMapping({ onMappingsChange }: ConditionValueMappingProps) {
  const [mappings, setMappings] = useState<ConditionValueMapping[]>(MOCK_VALUE_MAPPINGS);
  const [selectedGroup, setSelectedGroup] = useState<string>('customerType');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCode, setEditingCode] = useState('');

  const handleMappingUpdate = (id: string, updates: Partial<ConditionValueMapping>) => {
    const newMappings = mappings.map(mapping => 
      mapping.id === id ? { ...mapping, ...updates } : mapping
    );
    setMappings(newMappings);
    onMappingsChange?.(newMappings);
  };

  const handleAddMapping = () => {
    const availableValues = MOCK_CONDITION_VALUES[selectedGroup as keyof typeof MOCK_CONDITION_VALUES] || [];
    const mappedValues = mappings
      .filter(m => m.conditionType === selectedGroup)
      .map(m => m.value);
    
    const unmappedValue = availableValues.find(v => !mappedValues.includes(v.value));
    
    if (unmappedValue) {
      const newMapping: ConditionValueMapping = {
        id: `mapping-${Date.now()}`,
        conditionType: selectedGroup as any,
        value: unmappedValue.value,
        label: unmappedValue.label,
        code: unmappedValue.label.charAt(0).toUpperCase(),
        active: true
      };
      
      const newMappings = [...mappings, newMapping];
      setMappings(newMappings);
      onMappingsChange?.(newMappings);
    }
  };

  const handleDeleteMapping = (id: string) => {
    const newMappings = mappings.filter(m => m.id !== id);
    setMappings(newMappings);
    onMappingsChange?.(newMappings);
  };

  const startEdit = (mapping: ConditionValueMapping) => {
    setEditingId(mapping.id);
    setEditingCode(mapping.code);
  };

  const saveEdit = () => {
    if (editingId && editingCode.trim()) {
      handleMappingUpdate(editingId, { code: editingCode.trim().toUpperCase() });
      setEditingId(null);
      setEditingCode('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingCode('');
  };

  const filteredMappings = mappings.filter(m => m.conditionType === selectedGroup);
  const groupLabel = CONDITION_TYPES.find(t => t.value === selectedGroup)?.label || selectedGroup;

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Thiết Lập Giá Trị Điều Kiện</span>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Gán mã 1-2 ký tự cho mỗi giá trị điều kiện để tạo prefix cho voucher code</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Group Selection */}
          <div className="flex items-center space-x-4">
            <div className="space-y-2">
              <Label>Chọn nhóm điều kiện</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1" />
            
            <Button onClick={handleAddMapping} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Thêm Mapping
            </Button>
          </div>

          {/* Mapping Table */}
          <div className="border rounded-lg">
            <div className="p-4 bg-gray-50 border-b">
              <h4 className="font-medium">Mapping cho: {groupLabel}</h4>
              <p className="text-sm text-gray-600">
                Gán mã ký tự ngắn (1-2 ký tự) cho mỗi giá trị để tạo prefix tự động
              </p>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Giá Trị</TableHead>
                  <TableHead>Nhãn Hiển Thị</TableHead>
                  <TableHead>Mã Ký Tự</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMappings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Chưa có mapping nào cho nhóm này
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMappings.map((mapping) => (
                    <TableRow key={mapping.id}>
                      <TableCell className="font-mono text-sm">
                        {mapping.value}
                      </TableCell>
                      <TableCell>{mapping.label}</TableCell>
                      <TableCell>
                        {editingId === mapping.id ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              value={editingCode}
                              onChange={(e) => setEditingCode(e.target.value.slice(0, 2))}
                              className="w-16 text-center font-mono"
                              placeholder="AB"
                              maxLength={2}
                            />
                            <Button size="sm" onClick={saveEdit}>
                              <Save className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={cancelEdit}>
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <Badge variant="secondary" className="font-mono">
                            {mapping.code}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={mapping.active}
                          onCheckedChange={(checked) => 
                            handleMappingUpdate(mapping.id, { active: checked })
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => startEdit(mapping)}
                          >
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Preview Section */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Preview Mapping</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {filteredMappings.filter(m => m.active).map(mapping => (
                <div key={mapping.id} className="text-sm">
                  <span className="text-gray-600">{mapping.label}:</span>
                  <span className="ml-1 font-mono font-bold text-blue-600">{mapping.code}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
