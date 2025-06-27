
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { FilterCondition as FilterConditionType, FilterField, FilterOperator } from '../types/filter';
import { getFieldById } from '../utils/filterFields';

interface FilterConditionProps {
  condition: FilterConditionType;
  fields: FilterField[];
  onUpdate: (condition: FilterConditionType) => void;
  onRemove: () => void;
  showRemove?: boolean;
}

const OPERATOR_LABELS: Record<FilterOperator, string> = {
  equals: 'Bằng',
  not_equals: 'Không bằng',
  contains: 'Chứa',
  not_contains: 'Không chứa',
  starts_with: 'Bắt đầu bằng',
  ends_with: 'Kết thúc bằng',
  greater_than: 'Lớn hơn',
  less_than: 'Nhỏ hơn',
  greater_equal: 'Lớn hơn hoặc bằng',
  less_equal: 'Nhỏ hơn hoặc bằng',
  in: 'Thuộc',
  not_in: 'Không thuộc',
  in_list: 'Thuộc',
  not_in_list: 'Không thuộc',
  between: 'Trong khoảng',
  is_null: 'Trống',
  is_not_null: 'Không trống',
  is_empty: 'Trống',
  is_not_empty: 'Không trống'
};

export function FilterCondition({ 
  condition, 
  fields, 
  onUpdate, 
  onRemove, 
  showRemove = true 
}: FilterConditionProps) {
  const selectedField = getFieldById(condition.field);
  const availableOperators = selectedField?.operators || [];

  const handleFieldChange = (fieldId: string) => {
    const field = getFieldById(fieldId);
    const defaultOperator = field?.operators[0] || 'equals';
    
    onUpdate({
      ...condition,
      field: fieldId,
      operator: defaultOperator,
      value: ''
    });
  };

  const handleOperatorChange = (operator: FilterOperator) => {
    onUpdate({
      ...condition,
      operator,
      value: ''
    });
  };

  const handleValueChange = (value: any) => {
    onUpdate({
      ...condition,
      value
    });
  };

  const renderValueInput = () => {
    if (!selectedField) return null;

    if (condition.operator === 'is_null' || condition.operator === 'is_not_null' || 
        condition.operator === 'is_empty' || condition.operator === 'is_not_empty') {
      return null;
    }

    switch (selectedField.type) {
      case 'select':
        return (
          <Select value={String(condition.value)} onValueChange={handleValueChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn giá trị" />
            </SelectTrigger>
            <SelectContent>
              {selectedField.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        return (
          <Select value={String(condition.value)} onValueChange={handleValueChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn giá trị" />
            </SelectTrigger>
            <SelectContent>
              {selectedField.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'number':
        if (condition.operator === 'between') {
          const rangeValue = condition.value as { from?: string; to?: string } || {};
          return (
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Từ"
                value={rangeValue.from || ''}
                onChange={(e) => handleValueChange({ 
                  ...rangeValue, 
                  from: e.target.value 
                })}
              />
              <Input
                type="number"
                placeholder="Đến"
                value={rangeValue.to || ''}
                onChange={(e) => handleValueChange({ 
                  ...rangeValue, 
                  to: e.target.value 
                })}
              />
            </div>
          );
        }
        return (
          <Input
            type="number"
            placeholder="Nhập số"
            value={String(condition.value)}
            onChange={(e) => handleValueChange(e.target.value)}
          />
        );

      case 'date':
        if (condition.operator === 'between') {
          const rangeValue = condition.value as { from?: string; to?: string } || {};
          return (
            <div className="flex space-x-2">
              <Input
                type="date"
                value={rangeValue.from || ''}
                onChange={(e) => handleValueChange({ 
                  ...rangeValue, 
                  from: e.target.value 
                })}
              />
              <Input
                type="date"
                value={rangeValue.to || ''}
                onChange={(e) => handleValueChange({ 
                  ...rangeValue, 
                  to: e.target.value 
                })}
              />
            </div>
          );
        }
        return (
          <Input
            type="date"
            value={String(condition.value)}
            onChange={(e) => handleValueChange(e.target.value)}
          />
        );

      default:
        return (
          <Input
            type="text"
            placeholder="Nhập giá trị"
            value={String(condition.value)}
            onChange={(e) => handleValueChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="flex items-center space-x-3 p-3 theme-card rounded-lg border theme-border-primary/20">
      {/* Field Selector */}
      <div className="min-w-[200px]">
        <Select value={condition.field} onValueChange={handleFieldChange}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn trường" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <div className="text-xs font-semibold theme-text-muted uppercase mb-2">Khách hàng</div>
              {fields.filter(f => f.category === 'customer').map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.label}
                </SelectItem>
              ))}
            </div>
            <div className="p-2">
              <div className="text-xs font-semibold theme-text-muted uppercase mb-2">Hóa đơn</div>
              {fields.filter(f => f.category === 'invoice').map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.label}
                </SelectItem>
              ))}
            </div>
            <div className="p-2">
              <div className="text-xs font-semibold theme-text-muted uppercase mb-2">Sản phẩm</div>
              {fields.filter(f => f.category === 'product').map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.label}
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>

      {/* Operator Selector */}
      <div className="min-w-[160px]">
        <Select value={condition.operator} onValueChange={handleOperatorChange}>
          <SelectTrigger>
            <SelectValue placeholder="Điều kiện" />
          </SelectTrigger>
          <SelectContent>
            {availableOperators.map((operator) => (
              <SelectItem key={operator} value={operator}>
                {OPERATOR_LABELS[operator]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Value Input */}
      <div className="flex-1 min-w-[200px]">
        {renderValueInput()}
      </div>

      {/* Remove Button */}
      {showRemove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
