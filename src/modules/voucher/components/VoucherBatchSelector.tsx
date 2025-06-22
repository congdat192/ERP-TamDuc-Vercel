
import { useState } from 'react';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { X, Info, Search, RefreshCw, ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Extended mock voucher batch data with more details
const mockVoucherBatches: ComboboxOption[] = [
  { 
    value: 'PHVC000407', 
    label: 'PHVC000407 - Quà tặng Minigame Hanvis'
  },
  { 
    value: 'PHVC000408', 
    label: 'PHVC000408 - Black Friday 2024'
  },
  { 
    value: 'PHVC000409', 
    label: 'PHVC000409 - Ưu đãi VIP Q4'
  },
  { 
    value: 'PHVC000410', 
    label: 'PHVC000410 - Sinh nhật khách hàng T12'
  },
  { 
    value: 'PHVC000411', 
    label: 'PHVC000411 - Tri ân khách hàng thân thiết'
  },
  { 
    value: 'PHVC000412', 
    label: 'PHVC000412 - Ưu đãi cuối năm 2024'
  },
  { 
    value: 'PHVC000413', 
    label: 'PHVC000413 - Khuyến mãi mua 1 tặng 1'
  },
  { 
    value: 'PHVC000414', 
    label: 'PHVC000414 - Welcome khách hàng mới'
  }
];

// Enhanced batch details with more KiotViet-specific information
const batchDetails: Record<string, {
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'scheduled';
  startDate: string;
  endDate: string;
  totalVouchers: number;
  usedVouchers: number;
  voucherValue: string;
  conditions: string[];
}> = {
  'PHVC000407': {
    name: 'Quà tặng Minigame Hanvis – 1 cặp tròng Kodak Clean&Clear FSV UV400 1.56',
    description: 'Chương trình quà tặng minigame cho khách hàng Hanvis',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    totalVouchers: 1000,
    usedVouchers: 245,
    voucherValue: 'Sản phẩm',
    conditions: ['Chơi minigame', 'Tối thiểu 500k', 'Khách hàng mới']
  },
  'PHVC000408': {
    name: 'Chương trình khuyến mãi Black Friday 2024',
    description: 'Ưu đãi đặc biệt dịp Black Friday với giảm giá lên đến 50%',
    status: 'active',
    startDate: '2024-11-29',
    endDate: '2024-12-02',
    totalVouchers: 5000,
    usedVouchers: 1250,
    voucherValue: '10% - 50%',
    conditions: ['Hóa đơn từ 1tr', 'Áp dụng online', 'Số lượng có hạn']
  },
  'PHVC000409': {
    name: 'Ưu đãi đặc biệt khách hàng VIP',
    description: 'Chương trình ưu đãi dành riêng cho khách hàng VIP',
    status: 'active',
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    totalVouchers: 500,
    usedVouchers: 89,
    voucherValue: '15% - 25%',
    conditions: ['Khách hàng VIP', 'Mua từ 2 sản phẩm', 'Có thể tích lũy']
  },
  'PHVC000410': {
    name: 'Voucher sinh nhật khách hàng tháng 12',
    description: 'Quà tặng sinh nhật đặc biệt cho khách hàng có sinh nhật tháng 12',
    status: 'scheduled',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    totalVouchers: 2000,
    usedVouchers: 0,
    voucherValue: '200k',
    conditions: ['Sinh nhật T12', 'Xác thực CCCD', '1 lần/năm']
  },
  'PHVC000411': {
    name: 'Chương trình tri ân khách hàng thân thiết',
    description: 'Tri ân khách hàng có lịch sử mua hàng lâu năm',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    totalVouchers: 1500,
    usedVouchers: 567,
    voucherValue: '300k - 500k',
    conditions: ['Thành viên 2+ năm', 'Tổng mua 10tr+', 'Mỗi quý 1 lần']
  },
  'PHVC000412': {
    name: 'Ưu đãi cuối năm 2024',
    description: 'Chương trình khuyến mãi đặc biệt cuối năm',
    status: 'scheduled',
    startDate: '2024-12-20',
    endDate: '2024-12-31',
    totalVouchers: 3000,
    usedVouchers: 0,
    voucherValue: '100k - 1tr',
    conditions: ['Hóa đơn 500k+', 'Online + Offline', 'Thanh toán online +5%']
  },
  'PHVC000413': {
    name: 'Khuyến mãi mua 1 tặng 1',
    description: 'Chương trình mua 1 tặng 1 cho sản phẩm được chỉ định',
    status: 'active',
    startDate: '2024-11-01',
    endDate: '2024-11-30',
    totalVouchers: 800,
    usedVouchers: 634,
    voucherValue: '50% SP thứ 2',
    conditions: ['Sản phẩm chỉ định', 'Cùng loại', 'Giá trị thấp hơn']
  },
  'PHVC000414': {
    name: 'Voucher welcome cho khách hàng mới',
    description: 'Chào mừng khách hàng mới với ưu đãi đặc biệt',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    totalVouchers: 10000,
    usedVouchers: 3456,
    voucherValue: '50k - 100k',
    conditions: ['Khách hàng mới', 'Đơn hàng đầu tiên', 'Đăng ký thành viên']
  }
};

interface VoucherBatchSelectorProps {
  selectedBatch?: string;
  onBatchChange: (batch: string) => void;
  disabled?: boolean;
  className?: string;
  showDetails?: boolean;
}

export function VoucherBatchSelector({
  selectedBatch,
  onBatchChange,
  disabled = false,
  className,
  showDetails = true
}: VoucherBatchSelectorProps) {
  const [selectedValue, setSelectedValue] = useState(selectedBatch || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleBatchSelect = (value: string) => {
    setSelectedValue(value);
    onBatchChange(value);
  };

  const handleClearSelection = () => {
    setSelectedValue('');
    onBatchChange('');
  };

  const handleRefreshKiotVietData = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      console.log('Refreshed KiotViet data');
    }, 1500);
  };

  const selectedBatchDetail = selectedValue ? batchDetails[selectedValue] : null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="berry-success text-white">Đang hoạt động</Badge>;
      case 'scheduled':
        return <Badge className="berry-warning text-white">Đã lên lịch</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="theme-badge-secondary">Không hoạt động</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const filteredBatches = mockVoucherBatches.filter(batch =>
    batch.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor="voucher-batch-selector" className="theme-text">
            Chọn Đợt Phát Hành từ KiotViet *
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 theme-text-muted cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Chọn đợt phát hành voucher từ hệ thống KiotViet để đồng bộ thông tin và cấu hình quy trình phát hành.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshKiotVietData}
          disabled={disabled || isRefreshing}
          className="flex items-center space-x-1"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Làm mới</span>
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 theme-text-muted" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo mã hoặc tên đợt phát hành..."
            className="pl-9 voucher-input"
            disabled={disabled}
          />
        </div>

        <Combobox
          options={filteredBatches}
          value={selectedValue}
          onValueChange={handleBatchSelect}
          placeholder="Chọn đợt phát hành từ KiotViet..."
          searchPlaceholder="Tìm kiếm đợt phát hành..."
          emptyMessage="Không tìm thấy đợt phát hành nào."
          disabled={disabled}
          className="w-full"
        />
      </div>

      {/* Selected Batch Details */}
      {selectedValue && selectedBatchDetail && showDetails && (
        <Card className="voucher-card border-l-4 theme-border-primary">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="theme-badge-primary font-mono">
                    {selectedValue}
                  </Badge>
                  {getStatusBadge(selectedBatchDetail.status)}
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  <span>Xem trong KiotViet</span>
                </Button>
              </div>
              
              <div>
                <h4 className="font-medium theme-text">{selectedBatchDetail.name}</h4>
                <p className="text-sm theme-text-muted mt-1">{selectedBatchDetail.description}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="theme-text-muted">Thời gian:</span>
                  <div className="font-medium theme-text">
                    {new Date(selectedBatchDetail.startDate).toLocaleDateString('vi-VN')} - {' '}
                    {new Date(selectedBatchDetail.endDate).toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div>
                  <span className="theme-text-muted">Voucher:</span>
                  <div className="font-medium theme-text">
                    {selectedBatchDetail.usedVouchers} / {selectedBatchDetail.totalVouchers}
                  </div>
                </div>
                <div>
                  <span className="theme-text-muted">Giá trị:</span>
                  <div className="font-medium theme-text">{selectedBatchDetail.voucherValue}</div>
                </div>
                <div>
                  <span className="theme-text-muted">Tiến độ:</span>
                  <div className="font-medium theme-text">
                    {Math.round((selectedBatchDetail.usedVouchers / selectedBatchDetail.totalVouchers) * 100)}%
                  </div>
                </div>
              </div>
              
              <div>
                <span className="text-sm theme-text-muted">Điều kiện áp dụng:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedBatchDetail.conditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Selection State */}
      {!selectedValue && (
        <Alert className="voucher-alert-info">
          <Info className="h-4 w-4" />
          <AlertDescription className="theme-text-muted">
            <div className="text-sm">
              <div className="font-medium mb-1">Liên Kết Với KiotViet</div>
              <p>
                Chọn đợt phát hành voucher từ hệ thống KiotViet để đồng bộ thông tin và thiết lập quy trình tạo mã voucher tự động.
                Điều này giúp đảm bảo tính nhất quán giữa hai hệ thống.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Search Results Info */}
      {searchTerm && (
        <div className="text-xs theme-text-muted">
          Tìm thấy {filteredBatches.length} đợt phát hành phù hợp với "{searchTerm}"
        </div>
      )}
    </div>
  );
}
