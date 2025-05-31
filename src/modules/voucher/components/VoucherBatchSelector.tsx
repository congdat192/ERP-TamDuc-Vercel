
import { useState } from 'react';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Mock voucher batch data - will be replaced with API data later
const mockVoucherBatches: ComboboxOption[] = [
  { 
    value: 'PHVC000407', 
    label: 'PHVC000407', 
    description: 'Batch ngày 15/12/2024 - 100.000đ' 
  },
  { 
    value: 'PHVC000408', 
    label: 'PHVC000408', 
    description: 'Batch ngày 16/12/2024 - 250.000đ' 
  },
  { 
    value: 'PHVC000409', 
    label: 'PHVC000409', 
    description: 'Batch ngày 17/12/2024 - 500.000đ' 
  },
  { 
    value: 'PHVC000410', 
    label: 'PHVC000410', 
    description: 'Batch ngày 18/12/2024 - 100.000đ' 
  },
  { 
    value: 'PHVC000411', 
    label: 'PHVC000411', 
    description: 'Batch ngày 19/12/2024 - 1.000.000đ' 
  },
  { 
    value: 'PHVC000412', 
    label: 'PHVC000412', 
    description: 'Batch ngày 20/12/2024 - 250.000đ' 
  },
  { 
    value: 'PHVC000413', 
    label: 'PHVC000413', 
    description: 'Batch ngày 21/12/2024 - 500.000đ' 
  },
  { 
    value: 'PHVC000414', 
    label: 'PHVC000414', 
    description: 'Batch ngày 22/12/2024 - 100.000đ' 
  }
];

interface VoucherBatchSelectorProps {
  selectedBatch?: string;
  onBatchChange: (batch: string) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function VoucherBatchSelector({
  selectedBatch,
  onBatchChange,
  disabled = false,
  label = "Voucher Batch",
  placeholder = "Chọn mã batch voucher...",
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

  const selectedBatchInfo = mockVoucherBatches.find(batch => batch.value === selectedValue);

  return (
    <div className={`space-y-3 ${className || ''}`}>
      <div className="flex items-center space-x-2">
        <Label htmlFor="voucher-batch-selector">{label} *</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Chọn mã batch voucher để cấu hình quy trình phát hành voucher. 
                Mỗi batch có thông tin về ngày tạo và mệnh giá voucher.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Combobox
          options={mockVoucherBatches}
          value={selectedValue}
          onValueChange={handleBatchSelect}
          placeholder={placeholder}
          searchPlaceholder="Tìm kiếm mã batch..."
          emptyMessage="Không tìm thấy batch nào."
          disabled={disabled}
          className="w-full"
        />

        {selectedValue && selectedBatchInfo && (
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {selectedBatchInfo.label}
              </Badge>
              <span className="text-sm text-gray-600">
                {selectedBatchInfo.description}
              </span>
            </div>
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
        )}
      </div>

      {!selectedValue && (
        <p className="text-sm text-gray-500">
          Vui lòng chọn mã batch voucher để tiếp tục cấu hình.
        </p>
      )}
    </div>
  );
}
