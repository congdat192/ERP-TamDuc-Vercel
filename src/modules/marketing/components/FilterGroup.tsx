
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Copy } from 'lucide-react';
import { FilterGroup as FilterGroupType, FilterCondition as FilterConditionType, FilterField } from '../types/filter';
import { FilterCondition } from './FilterCondition';

interface FilterGroupProps {
  group: FilterGroupType;
  fields: FilterField[];
  onUpdate: (group: FilterGroupType) => void;
  onRemove?: () => void;
  onDuplicate?: () => void;
  showRemove?: boolean;
  level?: number;
}

export function FilterGroup({ 
  group, 
  fields, 
  onUpdate, 
  onRemove, 
  onDuplicate,
  showRemove = true, 
  level = 0 
}: FilterGroupProps) {
  const addCondition = () => {
    const newCondition: FilterConditionType = {
      id: Date.now().toString(),
      field: '',
      operator: 'equals',
      value: ''
    };

    onUpdate({
      ...group,
      conditions: [...group.conditions, newCondition]
    });
  };

  const updateCondition = (conditionId: string, updatedCondition: FilterConditionType) => {
    onUpdate({
      ...group,
      conditions: group.conditions.map(c => 
        c.id === conditionId ? updatedCondition : c
      )
    });
  };

  const removeCondition = (conditionId: string) => {
    onUpdate({
      ...group,
      conditions: group.conditions.filter(c => c.id !== conditionId)
    });
  };

  const addSubGroup = () => {
    const newGroup: FilterGroupType = {
      id: Date.now().toString(),
      logic: 'and',
      conditions: []
    };

    onUpdate({
      ...group,
      groups: [...(group.groups || []), newGroup]
    });
  };

  const updateSubGroup = (groupId: string, updatedGroup: FilterGroupType) => {
    onUpdate({
      ...group,
      groups: (group.groups || []).map(g => 
        g.id === groupId ? updatedGroup : g
      )
    });
  };

  const removeSubGroup = (groupId: string) => {
    onUpdate({
      ...group,
      groups: (group.groups || []).filter(g => g.id !== groupId)
    });
  };

  const duplicateSubGroup = (groupToDuplicate: FilterGroupType) => {
    const duplicatedGroup: FilterGroupType = {
      ...groupToDuplicate,
      id: Date.now().toString(),
      conditions: groupToDuplicate.conditions.map(c => ({
        ...c,
        id: Date.now().toString() + Math.random()
      })),
      groups: groupToDuplicate.groups?.map(g => ({
        ...g,
        id: Date.now().toString() + Math.random()
      }))
    };

    onUpdate({
      ...group,
      groups: [...(group.groups || []), duplicatedGroup]
    });
  };

  const totalItems = group.conditions.length + (group.groups?.length || 0);
  const borderColor = level === 0 ? 'theme-border-primary' : level === 1 ? 'border-blue-200' : 'border-green-200';
  const bgColor = level === 0 ? 'theme-bg-primary/5' : level === 1 ? 'bg-blue-50' : 'bg-green-50';

  return (
    <div className={`p-4 rounded-lg border-2 ${borderColor} ${bgColor} space-y-4`}>
      {/* Group Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {totalItems > 1 && (
            <Select 
              value={group.logic} 
              onValueChange={(value: 'and' | 'or') => onUpdate({ ...group, logic: value })}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="and">TẤT CẢ</SelectItem>
                <SelectItem value="or">BẤT KỲ</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          <span className="text-sm font-medium theme-text">
            {totalItems > 1 
              ? `${group.logic === 'and' ? 'Thỏa mãn tất cả' : 'Thỏa mãn bất kỳ'} ${totalItems} điều kiện`
              : 'Nhóm điều kiện'
            }
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {onDuplicate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDuplicate}
              className="text-blue-600 hover:text-blue-700"
            >
              <Copy className="w-4 h-4" />
            </Button>
          )}
          
          {showRemove && onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Conditions */}
      <div className="space-y-3">
        {group.conditions.map((condition, index) => (
          <FilterCondition
            key={condition.id}
            condition={condition}
            fields={fields}
            onUpdate={(updatedCondition) => updateCondition(condition.id, updatedCondition)}
            onRemove={() => removeCondition(condition.id)}
            showRemove={group.conditions.length > 1 || (group.groups?.length || 0) > 0}
          />
        ))}
      </div>

      {/* Sub Groups */}
      {group.groups && group.groups.length > 0 && (
        <div className="space-y-3">
          {group.groups.map((subGroup) => (
            <FilterGroup
              key={subGroup.id}
              group={subGroup}
              fields={fields}
              onUpdate={(updatedGroup) => updateSubGroup(subGroup.id, updatedGroup)}
              onRemove={() => removeSubGroup(subGroup.id)}
              onDuplicate={() => duplicateSubGroup(subGroup)}
              level={level + 1}
            />
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 pt-2 border-t theme-border-primary/10">
        <Button
          variant="outline"
          size="sm"
          onClick={addCondition}
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <Plus className="w-4 h-4 mr-1" />
          Thêm điều kiện
        </Button>

        {level < 2 && (
          <Button
            variant="outline"
            size="sm"
            onClick={addSubGroup}
            className="text-green-600 border-green-200 hover:bg-green-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Thêm nhóm
          </Button>
        )}
      </div>
    </div>
  );
}
