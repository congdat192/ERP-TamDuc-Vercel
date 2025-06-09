
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';

interface ConditionsSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function ConditionsSelector({ value, onChange }: ConditionsSelectorProps) {
  const [newCondition, setNewCondition] = useState('');

  const addCondition = () => {
    if (newCondition.trim() && !value.includes(newCondition.trim())) {
      onChange([...value, newCondition.trim()]);
      setNewCondition('');
    }
  };

  const removeCondition = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const commonConditions = [
    'Áp dụng cho đơn hàng từ 500,000 VNĐ',
    'Không áp dụng cùng khuyến mãi khác',
    'Có hiệu lực trong 30 ngày',
    'Chỉ sử dụng 1 lần/khách hàng',
    'Không áp dụng cho sản phẩm đã giảm giá'
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold theme-text">Điều Kiện Sử Dụng</h3>
      <Card className="voucher-card">
        <CardContent className="p-6 space-y-4">
          {/* Quick add common conditions */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium theme-text">Điều kiện phổ biến:</h4>
            <div className="flex flex-wrap gap-2">
              {commonConditions.map((condition, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!value.includes(condition)) {
                      onChange([...value, condition]);
                    }
                  }}
                  disabled={value.includes(condition)}
                  className="voucher-button-outline"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {condition}
                </Button>
              ))}
            </div>
          </div>

          {/* Add custom condition */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium theme-text">Thêm điều kiện tùy chỉnh:</h4>
            <div className="flex gap-2">
              <Textarea
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Nhập điều kiện sử dụng..."
                className="flex-1 voucher-input"
                rows={2}
              />
              <Button 
                onClick={addCondition} 
                disabled={!newCondition.trim()}
                className="voucher-button-primary"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Selected conditions */}
          {value.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium theme-text">Điều kiện đã chọn:</h4>
              <div className="space-y-2">
                {value.map((condition, index) => (
                  <div key={index} className="flex items-center justify-between p-2 theme-bg-primary/5 rounded-md theme-border-primary/20 border">
                    <span className="text-sm theme-text flex-1">{condition}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCondition(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
