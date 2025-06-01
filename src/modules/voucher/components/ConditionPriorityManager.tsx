
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ArrowUp, 
  ArrowDown, 
  GripVertical, 
  Info,
  Eye
} from 'lucide-react';
import { 
  ConditionGroupPriority, 
  ConditionValueMapping,
  MOCK_GROUP_PRIORITIES 
} from '../types/conditionBuilder';
import { cn } from '@/lib/utils';

interface ConditionPriorityManagerProps {
  valueMappings: ConditionValueMapping[];
  onPriorityChange?: (priorities: ConditionGroupPriority[]) => void;
  codeLength?: number;
}

export function ConditionPriorityManager({ 
  valueMappings = [], 
  onPriorityChange,
  codeLength = 8 
}: ConditionPriorityManagerProps) {
  const [priorities, setPriorities] = useState<ConditionGroupPriority[]>(MOCK_GROUP_PRIORITIES);
  const [showPreview, setShowPreview] = useState(true);

  const handlePriorityUpdate = (id: string, updates: Partial<ConditionGroupPriority>) => {
    const newPriorities = priorities.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    setPriorities(newPriorities);
    onPriorityChange?.(newPriorities);
  };

  const moveUp = (id: string) => {
    const index = priorities.findIndex(p => p.id === id);
    if (index > 0) {
      const newPriorities = [...priorities];
      [newPriorities[index], newPriorities[index - 1]] = [newPriorities[index - 1], newPriorities[index]];
      
      // Update priority numbers
      newPriorities.forEach((p, i) => {
        p.priority = i + 1;
      });
      
      setPriorities(newPriorities);
      onPriorityChange?.(newPriorities);
    }
  };

  const moveDown = (id: string) => {
    const index = priorities.findIndex(p => p.id === id);
    if (index < priorities.length - 1) {
      const newPriorities = [...priorities];
      [newPriorities[index], newPriorities[index + 1]] = [newPriorities[index + 1], newPriorities[index]];
      
      // Update priority numbers
      newPriorities.forEach((p, i) => {
        p.priority = i + 1;
      });
      
      setPriorities(newPriorities);
      onPriorityChange?.(newPriorities);
    }
  };

  const generatePreviewCode = () => {
    const activePriorities = priorities.filter(p => p.active).sort((a, b) => a.priority - b.priority);
    
    // Get first active mapping from each priority group
    const prefixParts: string[] = [];
    
    activePriorities.forEach(priority => {
      const mapping = valueMappings.find(m => 
        m.conditionType === priority.type && m.active
      );
      if (mapping) {
        prefixParts.push(mapping.code);
      }
    });
    
    const prefix = prefixParts.join('');
    const remainingLength = Math.max(1, codeLength - prefix.length);
    const randomPart = 'X'.repeat(remainingLength);
    
    return `${prefix}${randomPart}`;
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GripVertical className="w-5 h-5" />
              <span>Thiết Lập Thứ Tự Ưu Tiên Tạo Mã</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Thứ tự này xác định cách ghép prefix từ các điều kiện để tạo mã voucher</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-4 h-4 mr-1" />
              {showPreview ? 'Ẩn' : 'Hiện'} Preview
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Kéo thả hoặc sử dụng nút để sắp xếp thứ tự ưu tiên. Thứ tự càng cao, prefix càng được ưu tiên tạo trước.
          </div>

          {/* Priority List */}
          <div className="space-y-3">
            {priorities.map((priority, index) => (
              <div
                key={priority.id}
                className={cn(
                  "flex items-center space-x-4 p-4 border rounded-lg",
                  priority.active ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100"
                )}
              >
                <div className="flex items-center space-x-2">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                    {priority.priority}
                  </Badge>
                </div>

                <div className="flex-1">
                  <div className="font-medium">{priority.label}</div>
                  <div className="text-sm text-gray-500">
                    {priority.type} - 
                    {valueMappings.filter(m => m.conditionType === priority.type && m.active).length} values mapped
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
                      onClick={() => moveUp(priority.id)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveDown(priority.id)}
                      disabled={index === priorities.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Live Preview */}
          {showPreview && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-3">Live Preview Mã Voucher</h4>
              
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-600">Thứ tự ưu tiên hiện tại:</span>
                  <div className="mt-1">
                    {priorities
                      .filter(p => p.active)
                      .sort((a, b) => a.priority - b.priority)
                      .map((p, index) => (
                        <span key={p.id} className="text-sm">
                          {index > 0 && ' → '}
                          <span className="font-medium">{p.label}</span>
                        </span>
                      ))}
                  </div>
                </div>
                
                <div className="text-sm">
                  <span className="text-gray-600">Preview code:</span>
                  <code className="ml-2 bg-white px-2 py-1 rounded font-mono text-blue-600 font-bold">
                    {generatePreviewCode()}
                  </code>
                </div>
                
                <div className="text-xs text-gray-500">
                  * Preview sử dụng giá trị đầu tiên từ mỗi nhóm điều kiện đã mapping
                </div>
              </div>
            </div>
          )}

          {/* Fallback Notice */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-yellow-800">Điều kiện Fallback</div>
                <div className="text-yellow-700">
                  Khi không có điều kiện nào khớp, hệ thống sẽ sử dụng prefix/suffix mặc định 
                  được thiết lập trong phần "Điều kiện tạo mã".
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
