
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Shield, 
  Users, 
  Clock, 
  History, 
  Target, 
  Filter,
  Plus,
  Trash2,
  Info,
  ArrowUp,
  ArrowDown,
  Save,
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VoucherIssueRulesConditionsProps {
  onSettingsChange?: (settings: any) => void;
}

export function VoucherIssueRulesConditions({ onSettingsChange }: VoucherIssueRulesConditionsProps) {
  // Voucher History Logic
  const [historyRules, setHistoryRules] = useState({
    neverReceived: false,
    allowReissueUsedExpired: true,
    allowMultiple: false
  });

  // Frequency/Quota Rules
  const [frequencyRules, setFrequencyRules] = useState({
    enabled: false,
    limitType: 'day',
    maxPerPeriod: 1,
    maxPerCampaign: 5
  });

  // Customer Group/Segment Rules
  const [segmentRules, setSegmentRules] = useState({
    enabled: false,
    allowedSegments: ['vip', 'loyalty'],
    requireMinPoints: false,
    minPoints: 1000,
    requireActiveStatus: true
  });

  // Advanced Logic Rules
  const [advancedRules, setAdvancedRules] = useState([
    {
      id: 1,
      condition: 'Khách hàng VIP',
      operator: 'AND',
      value: 'active',
      enabled: true
    }
  ]);

  // Blacklist/Whitelist
  const [listRules, setListRules] = useState({
    blacklistEnabled: false,
    whitelistEnabled: false,
    blacklistIds: '',
    whitelistIds: '',
    excludeSegments: []
  });

  // Transaction-Linked Rules
  const [transactionRules, setTransactionRules] = useState({
    requireCompleted: true,
    requirePaid: true,
    blockPendingReturns: false,
    blockCancellations: false
  });

  // Rule Priority
  const [rulePriority, setRulePriority] = useState([
    'Danh sách trắng/đen',
    'Lịch sử voucher',
    'Phân khúc khách hàng',
    'Tần suất phát hành',
    'Giao dịch liên quan'
  ]);

  const handleSaveRules = () => {
    const allRules = {
      historyRules,
      frequencyRules,
      segmentRules,
      advancedRules,
      listRules,
      transactionRules,
      rulePriority
    };
    
    onSettingsChange?.(allRules);
    toast({
      title: "Đã lưu quy tắc",
      description: "Quy tắc phát voucher đã được cập nhật thành công.",
    });
  };

  const addAdvancedRule = () => {
    setAdvancedRules([...advancedRules, {
      id: Date.now(),
      condition: '',
      operator: 'AND',
      value: '',
      enabled: true
    }]);
    toast({
      description: "Đã thêm điều kiện mới"
    });
  };

  const removeAdvancedRule = (id: number) => {
    setAdvancedRules(advancedRules.filter(rule => rule.id !== id));
    toast({
      description: "Đã xóa điều kiện"
    });
  };

  const moveRulePriority = (index: number, direction: 'up' | 'down') => {
    const newPriority = [...rulePriority];
    if (direction === 'up' && index > 0) {
      [newPriority[index], newPriority[index - 1]] = [newPriority[index - 1], newPriority[index]];
    } else if (direction === 'down' && index < newPriority.length - 1) {
      [newPriority[index], newPriority[index + 1]] = [newPriority[index + 1], newPriority[index]];
    }
    setRulePriority(newPriority);
    toast({
      description: "Đã cập nhật thứ tự ưu tiên"
    });
  };

  const generateRuleSummary = () => {
    const activeRules = [];
    
    if (historyRules.neverReceived) activeRules.push("Chỉ phát cho KH chưa nhận voucher");
    if (frequencyRules.enabled) activeRules.push(`Tối đa ${frequencyRules.maxPerPeriod}/${frequencyRules.limitType}`);
    if (segmentRules.enabled) activeRules.push(`Chỉ ${segmentRules.allowedSegments.join(', ')}`);
    if (transactionRules.requireCompleted) activeRules.push("Yêu cầu đơn hàng hoàn thành");
    if (listRules.whitelistEnabled) activeRules.push("Áp dụng danh sách trắng");
    
    return activeRules.length > 0 ? activeRules.join(' • ') : 'Chưa có quy tắc nào được kích hoạt';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span>Quy Tắc & Điều Kiện Phát Voucher</span>
          </h3>
          <p className="text-gray-600 text-sm">Cấu hình điều kiện và quy tắc phát hành voucher cho khách hàng</p>
        </div>
        <Button onClick={handleSaveRules} className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          Lưu Quy Tắc
        </Button>
      </div>

      {/* Rule Summary */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900">Tóm Tắt Quy Tắc Hiện Tại</h4>
              <p className="text-sm text-blue-800 mt-1">{generateRuleSummary()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* A. Voucher History Logic */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <History className="w-5 h-5 text-purple-600" />
            <span>A. Quy Tắc Lịch Sử Voucher</span>
            <Button variant="ghost" size="sm">
              <Info className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Chỉ phát cho khách hàng chưa từng nhận voucher</Label>
                <p className="text-sm text-gray-600">Khách hàng mới hoàn toàn</p>
              </div>
              <Switch 
                checked={historyRules.neverReceived}
                onCheckedChange={(checked) => setHistoryRules({...historyRules, neverReceived: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Cho phép phát lại nếu voucher cũ đã sử dụng/hết hạn</Label>
                <p className="text-sm text-gray-600">Khách hàng có thể nhận voucher mới</p>
              </div>
              <Switch 
                checked={historyRules.allowReissueUsedExpired}
                onCheckedChange={(checked) => setHistoryRules({...historyRules, allowReissueUsedExpired: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Cho phép nhiều voucher cùng lúc (không giới hạn)</Label>
                <p className="text-sm text-gray-600">Dành cho trường hợp đặc biệt</p>
              </div>
              <Switch 
                checked={historyRules.allowMultiple}
                onCheckedChange={(checked) => setHistoryRules({...historyRules, allowMultiple: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* B. Frequency/Quota Rules */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Clock className="w-5 h-5 text-orange-600" />
            <span>B. Quy Tắc Tần Suất & Hạn Ngạch</span>
            <Switch 
              checked={frequencyRules.enabled}
              onCheckedChange={(checked) => setFrequencyRules({...frequencyRules, enabled: checked})}
            />
          </CardTitle>
        </CardHeader>
        {frequencyRules.enabled && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Giới hạn số lượng voucher mỗi</Label>
                <Select 
                  value={frequencyRules.limitType} 
                  onValueChange={(value) => setFrequencyRules({...frequencyRules, limitType: value})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Ngày</SelectItem>
                    <SelectItem value="week">Tuần</SelectItem>
                    <SelectItem value="month">Tháng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Số lượng tối đa mỗi kỳ: {frequencyRules.maxPerPeriod}</Label>
                <Slider
                  value={[frequencyRules.maxPerPeriod]}
                  onValueChange={(value) => setFrequencyRules({...frequencyRules, maxPerPeriod: value[0]})}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
            
            <div>
              <Label>Tối đa voucher mỗi chiến dịch: {frequencyRules.maxPerCampaign}</Label>
              <Slider
                value={[frequencyRules.maxPerCampaign]}
                onValueChange={(value) => setFrequencyRules({...frequencyRules, maxPerCampaign: value[0]})}
                max={20}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* C. Customer Group/Segment Rules */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Users className="w-5 h-5 text-green-600" />
            <span>C. Quy Tắc Phân Khúc Khách Hàng</span>
            <Switch 
              checked={segmentRules.enabled}
              onCheckedChange={(checked) => setSegmentRules({...segmentRules, enabled: checked})}
            />
          </CardTitle>
        </CardHeader>
        {segmentRules.enabled && (
          <CardContent className="space-y-4">
            <div>
              <Label>Phân khúc được phép</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['vip', 'loyalty', 'new', 'premium', 'standard'].map((segment) => (
                  <div key={segment} className="flex items-center space-x-2">
                    <Checkbox 
                      id={segment}
                      checked={segmentRules.allowedSegments.includes(segment)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSegmentRules({
                            ...segmentRules, 
                            allowedSegments: [...segmentRules.allowedSegments, segment]
                          });
                        } else {
                          setSegmentRules({
                            ...segmentRules, 
                            allowedSegments: segmentRules.allowedSegments.filter(s => s !== segment)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={segment} className="text-sm capitalize">{segment}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Yêu cầu điểm tích lũy tối thiểu</Label>
                <p className="text-sm text-gray-600">Kiểm tra số điểm của khách hàng</p>
              </div>
              <Switch 
                checked={segmentRules.requireMinPoints}
                onCheckedChange={(checked) => setSegmentRules({...segmentRules, requireMinPoints: checked})}
              />
            </div>
            
            {segmentRules.requireMinPoints && (
              <div>
                <Label>Số điểm tối thiểu</Label>
                <Input
                  type="number"
                  value={segmentRules.minPoints}
                  onChange={(e) => setSegmentRules({...segmentRules, minPoints: Number(e.target.value)})}
                  className="mt-1"
                />
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* D. Advanced Logic Rules */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Filter className="w-5 h-5 text-indigo-600" />
            <span>D. Điều Kiện Logic Nâng Cao</span>
            <Button variant="outline" size="sm" onClick={addAdvancedRule}>
              <Plus className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {advancedRules.map((rule, index) => (
            <div key={rule.id} className="flex items-center space-x-2 p-3 border rounded-lg">
              <Checkbox 
                checked={rule.enabled}
                onCheckedChange={(checked) => {
                  setAdvancedRules(advancedRules.map(r => 
                    r.id === rule.id ? {...r, enabled: !!checked} : r
                  ));
                }}
              />
              
              <Select value={rule.condition} onValueChange={(value) => {
                setAdvancedRules(advancedRules.map(r => 
                  r.id === rule.id ? {...r, condition: value} : r
                ));
              }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Chọn điều kiện" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Khách hàng VIP">Khách hàng VIP</SelectItem>
                  <SelectItem value="Chi tiêu > 5M">Chi tiêu {'>'}5M tháng</SelectItem>
                  <SelectItem value="Sinh nhật">Sinh nhật tháng này</SelectItem>
                  <SelectItem value="Đơn hàng đầu">Đơn hàng đầu tiên</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={rule.operator} onValueChange={(value) => {
                setAdvancedRules(advancedRules.map(r => 
                  r.id === rule.id ? {...r, operator: value} : r
                ));
              }}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">VÀ</SelectItem>
                  <SelectItem value="OR">HOẶC</SelectItem>
                  <SelectItem value="NOT">KHÔNG</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => removeAdvancedRule(rule.id)}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* E. Blacklist/Whitelist Management */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Target className="w-5 h-5 text-red-600" />
            <span>E. Quản Lý Danh Sách Trắng/Đen</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="font-medium">Danh sách đen (loại trừ)</Label>
                <Switch 
                  checked={listRules.blacklistEnabled}
                  onCheckedChange={(checked) => setListRules({...listRules, blacklistEnabled: checked})}
                />
              </div>
              {listRules.blacklistEnabled && (
                <Textarea
                  placeholder="Nhập ID khách hàng, cách nhau bằng dấu phẩy"
                  value={listRules.blacklistIds}
                  onChange={(e) => setListRules({...listRules, blacklistIds: e.target.value})}
                  rows={3}
                />
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="font-medium">Danh sách trắng (luôn bao gồm)</Label>
                <Switch 
                  checked={listRules.whitelistEnabled}
                  onCheckedChange={(checked) => setListRules({...listRules, whitelistEnabled: checked})}
                />
              </div>
              {listRules.whitelistEnabled && (
                <Textarea
                  placeholder="Nhập ID khách hàng ưu tiên"
                  value={listRules.whitelistIds}
                  onChange={(e) => setListRules({...listRules, whitelistIds: e.target.value})}
                  rows={3}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* F. Transaction-Linked Rules */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span>F. Quy Tắc Liên Quan Đến Giao Dịch</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Chỉ phát khi đơn hàng hoàn thành</Label>
                <p className="text-sm text-gray-600">Đảm bảo đơn hàng đã được xử lý</p>
              </div>
              <Switch 
                checked={transactionRules.requireCompleted}
                onCheckedChange={(checked) => setTransactionRules({...transactionRules, requireCompleted: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Yêu cầu thanh toán hoàn tất</Label>
                <p className="text-sm text-gray-600">Chỉ phát cho đơn đã thanh toán</p>
              </div>
              <Switch 
                checked={transactionRules.requirePaid}
                onCheckedChange={(checked) => setTransactionRules({...transactionRules, requirePaid: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Chặn nếu có đơn trả hàng đang xử lý</Label>
                <p className="text-sm text-gray-600">Tạm dừng phát voucher khi có tranh chấp</p>
              </div>
              <Switch 
                checked={transactionRules.blockPendingReturns}
                onCheckedChange={(checked) => setTransactionRules({...transactionRules, blockPendingReturns: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Chặn nếu có đơn hủy gần đây</Label>
                <p className="text-sm text-gray-600">Ngăn phát voucher cho KH hay hủy đơn</p>
              </div>
              <Switch 
                checked={transactionRules.blockCancellations}
                onCheckedChange={(checked) => setTransactionRules({...transactionRules, blockCancellations: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* G. Priority & Rule Ordering */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span>G. Thứ Tự Ưu Tiên Quy Tắc</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">Kéo thả để sắp xếp thứ tự kiểm tra quy tắc (ưu tiên từ trên xuống)</p>
          <div className="space-y-2">
            {rulePriority.map((rule, index) => (
              <div key={rule} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">{index + 1}</Badge>
                  <span className="font-medium">{rule}</span>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => moveRulePriority(index, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => moveRulePriority(index, 'down')}
                    disabled={index === rulePriority.length - 1}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
