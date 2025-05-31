
import { useState } from 'react';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Mock voucher batch data with codes and names
const mockVoucherBatches: ComboboxOption[] = [
  { 
    value: 'PHVC000407', 
    label: 'PHVC000407'
  },
  { 
    value: 'PHVC000408', 
    label: 'PHVC000408'
  },
  { 
    value: 'PHVC000409', 
    label: 'PHVC000409'
  },
  { 
    value: 'PHVC000410', 
    label: 'PHVC000410'
  },
  { 
    value: 'PHVC000411', 
    label: 'PHVC000411'
  },
  { 
    value: 'PHVC000412', 
    label: 'PHVC000412'
  },
  { 
    value: 'PHVC000413', 
    label: 'PHVC000413'
  },
  { 
    value: 'PHVC000414', 
    label: 'PHVC000414'
  }
];

// Mock batch names mapping
const batchNames: Record<string, string> = {
  'PHVC000407': 'Quà tặng Minigame Hanvis – 1 cặp tròng Kodak Clean&Clear FSV UV400 1.56',
  'PHVC000408': 'Chương trình khuyến mãi Black Friday 2024',
  'PHVC000409': 'Ưu đãi đặc biệt khách hàng VIP',
  'PHVC000410': 'Voucher sinh nhật khách hàng tháng 12',
  'PHVC000411': 'Chương trình tri ân khách hàng thân thiết',
  'PHVC000412': 'Ưu đãi cuối năm 2024',
  'PHVC000413': 'Khuyến mãi mua 1 tặng 1',
  'PHVC000414': 'Voucher welcome cho khách hàng mới'
};

interface VoucherBatchSelectorProps {
  selectedBatch?: string;
  onBatchChange: (batch: string) => void;
  disabled?: boolean;
  className?: string;
}

export function VoucherBatchSelector({
  selectedBatch,
  onBatchChange,
  disabled = false,
  className
}: VoucherBatchSelectorProps) {
  const [selectedValue, setSelectedValue] = useState(selectedBatch || '');

  const handleBatchSelect = (value: string) => {
    setSelectedValue(value);
    onBatchChange(value);
  };

  const handleClearSelection = () => {
    setSelectedValue('');
    onBatchChange('');
  };

  const selectedBatchName = selectedValue ? batchNames[selectedValue] : '';

  return (
    <div className={`space-y-3 ${className || ''}`}>
      <div className="flex items-center space-x-2">
        <Label htmlFor="voucher-batch-selector">Mã đợt phát hành *</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Chọn mã đợt phát hành voucher để cấu hình quy trình phát hành voucher.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-3">
        <Combobox
          options={mockVoucherBatches}
          value={selectedValue}
          onValueChange={handleBatchSelect}
          placeholder="Chọn mã đợt phát hành..."
          searchPlaceholder="Tìm kiếm mã đợt..."
          emptyMessage="Không tìm thấy đợt phát hành nào."
          disabled={disabled}
          className="w-full"
        />

        {selectedValue && selectedBatchName && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {selectedValue}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  disabled={disabled}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="pl-3">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Tên đợt phát hành:</span> {selectedBatchName}
              </p>
            </div>
          </div>
        )}
      </div>

      {!selectedValue && (
        <p className="text-sm text-gray-500">
          Vui lòng chọn mã đợt phát hành để tiếp tục cấu hình.
        </p>
      )}
    </div>
  );
}
