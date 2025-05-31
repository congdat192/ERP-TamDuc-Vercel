
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { 
  Search, 
  User, 
  Phone, 
  Receipt, 
  Copy, 
  Printer, 
  CheckCircle,
  AlertTriangle,
  Gift
} from 'lucide-react';

// Mock dynamic data that would come from settings
const mockDenominations = [
  { id: '1', value: 100000, label: '100.000đ', isActive: true },
  { id: '2', value: 250000, label: '250.000đ', isActive: true },
  { id: '3', value: 500000, label: '500.000đ', isActive: true },
  { id: '4', value: 1000000, label: '1.000.000đ', isActive: true },
];

const mockCustomerSources = [
  { id: '1', name: 'Website', isActive: true },
  { id: '2', name: 'Facebook', isActive: true },
  { id: '3', name: 'Giới thiệu', isActive: true },
  { id: '4', name: 'Hotline', isActive: true },
];

const mockCustomerTypes = [
  { id: '1', name: 'Khách hàng mới', isActive: true },
  { id: '2', name: 'Khách hàng thân thiết', isActive: true },
  { id: '3', name: 'Khách hàng VIP', isActive: true },
];

export function VoucherIssue() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerFound, setCustomerFound] = useState<any>(null);
  const [existingVoucher, setExistingVoucher] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newVoucher, setNewVoucher] = useState<any>(null);
  const [allowCustomValue, setAllowCustomValue] = useState(false);
  const [showCustomValueInput, setShowCustomValueInput] = useState(false);
  const [formData, setFormData] = useState({
    customerSource: '',
    customerType: '',
    voucherValue: '',
    customValue: '',
    notes: ''
  });

  // Filter active options
  const activeDenominations = mockDenominations.filter(d => d.isActive);
  const activeCustomerSources = mockCustomerSources.filter(s => s.isActive);
  const activeCustomerTypes = mockCustomerTypes.filter(t => t.isActive);

  const handlePhoneSearch = async () => {
    if (!phoneNumber) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Simulate found customer
      const foundCustomer = {
        name: 'Nguyễn Văn Tuấn',
        phone: phoneNumber,
        email: 'nguyen.van.tuan@email.com',
        lastVoucher: '15/01/2024',
        totalVouchers: 3,
        type: 'VIP'
      };
      
      // Simulate existing active voucher
      const activeVoucher = {
        code: 'VCH-2024-001234',
        value: '500.000đ',
        status: 'active',
        issueDate: '20/01/2024',
        expiryDate: '20/02/2024',
        issuedBy: 'Trần Thị Lan'
      };
      
      setCustomerFound(foundCustomer);
      setExistingVoucher(Math.random() > 0.7 ? activeVoucher : null);
      setIsLoading(false);
    }, 1000);
  };

  const handleVoucherValueChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomValueInput(true);
      setFormData({...formData, voucherValue: 'custom'});
    } else {
      setShowCustomValueInput(false);
      setFormData({...formData, voucherValue: value, customValue: ''});
    }
  };

  const handleIssueVoucher = () => {
    if (!formData.customerSource || !formData.customerType || !formData.voucherValue) {
      toast({
        title: "Thiếu Thông Tin",
        description: "Vui lòng điền đầy đủ các trường bắt buộc.",
        variant: "destructive",
      });
      return;
    }

    if (formData.voucherValue === 'custom' && !formData.customValue) {
      toast({
        title: "Thiếu Giá Trị Voucher",
        description: "Vui lòng nhập giá trị voucher tùy chỉnh.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate voucher generation with backend logic
    setTimeout(() => {
      const finalValue = formData.voucherValue === 'custom' 
        ? `${parseInt(formData.customValue).toLocaleString('vi-VN')}đ`
        : formData.voucherValue;

      const voucher = {
        code: `VCH-${Date.now()}`, // Backend would generate based on source/type/employee
        value: finalValue,
        customer: customerFound?.name || 'Khách Hàng Mới',
        phone: phoneNumber,
        issueDate: new Date().toLocaleDateString('vi-VN'),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
        issuedBy: 'Nguyễn Văn An',
        content: generateVoucherContent({
          customerName: customerFound?.name || 'Khách Hàng Mới',
          voucherCode: `VCH-${Date.now()}`,
          phoneNumber: phoneNumber,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
          employeeName: 'Nguyễn Văn An'
        })
      };
      
      setNewVoucher(voucher);
      setShowSuccess(true);
      setIsLoading(false);
      
      toast({
        title: "Phát Hành Voucher Thành Công!",
        description: `Voucher ${voucher.code} đã được tạo.`,
      });
    }, 1500);
  };

  const generateVoucherContent = (data: any) => {
    // Default template with variable replacement
    const template = `Xin chào $tenKH,

Bạn đã nhận được voucher $mavoucher trị giá $giatri.
Số điện thoại: $sdt
Hạn sử dụng: $hansudung
Nhân viên phát hành: $nhanvien

Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!`;

    return template
      .replace(/\$tenKH/g, data.customerName)
      .replace(/\$mavoucher/g, data.voucherCode)
      .replace(/\$sdt/g, data.phoneNumber)
      .replace(/\$hansudung/g, data.expiryDate)
      .replace(/\$nhanvien/g, data.employeeName);
  };

  const copyVoucherCode = () => {
    navigator.clipboard.writeText(newVoucher.code);
    toast({
      title: "Đã Sao Chép!",
      description: "Mã voucher đã được sao chép vào clipboard.",
    });
  };

  const printVoucher = () => {
    toast({
      title: "Đang In...",
      description: "Voucher đang được gửi tới máy in.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="w-5 h-5 text-blue-600" />
            <span>Phát Hành Voucher Mới</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Search */}
          <div className="space-y-4">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <Label htmlFor="phone">Số Điện Thoại Khách Hàng *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0901234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={handlePhoneSearch}
                disabled={!phoneNumber || isLoading}
                className="mb-0"
              >
                <Search className="w-4 h-4 mr-2" />
                {isLoading ? 'Đang Tìm...' : 'Tìm Kiếm'}
              </Button>
            </div>

            {/* Customer Info Display */}
            {customerFound && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{customerFound.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{customerFound.phone}</span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge variant="secondary">Khách Hàng {customerFound.type}</Badge>
                          <span className="text-xs text-gray-500">
                            {customerFound.totalVouchers} voucher đã phát hành
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Existing Voucher Warning */}
            {existingVoucher && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Tìm thấy voucher đang hoạt động:</strong> {existingVoucher.code} ({existingVoucher.value}) 
                  hết hạn vào {existingVoucher.expiryDate}. 
                  <Button variant="link" className="p-0 h-auto text-orange-800 underline ml-1">
                    Xem chi tiết
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Voucher Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="source">Nguồn Khách Hàng *</Label>
                <Select value={formData.customerSource} onValueChange={(value) => 
                  setFormData({...formData, customerSource: value})
                }>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn nguồn" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeCustomerSources.map((source) => (
                      <SelectItem key={source.id} value={source.name}>
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Loại Khách Hàng *</Label>
                <Select value={formData.customerType} onValueChange={(value) => 
                  setFormData({...formData, customerType: value})
                }>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeCustomerTypes.map((type) => (
                      <SelectItem key={type.id} value={type.name}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="value">Giá Trị Voucher *</Label>
                <Select value={formData.voucherValue} onValueChange={handleVoucherValueChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn giá trị" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeDenominations.map((denomination) => (
                      <SelectItem key={denomination.id} value={denomination.label}>
                        {denomination.label}
                      </SelectItem>
                    ))}
                    {allowCustomValue && (
                      <SelectItem value="custom">Giá trị tùy chỉnh</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {showCustomValueInput && (
                <div>
                  <Label htmlFor="custom-value">Giá Trị Tùy Chỉnh (VNĐ) *</Label>
                  <Input
                    id="custom-value"
                    type="number"
                    placeholder="50000"
                    value={formData.customValue}
                    onChange={(e) => setFormData({...formData, customValue: e.target.value})}
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="notes">Ghi Chú (Không Bắt Buộc)</Label>
                <Textarea
                  id="notes"
                  placeholder="Thêm ghi chú bổ sung..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Issue Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button 
              size="lg"
              onClick={handleIssueVoucher}
              disabled={isLoading || !phoneNumber}
              className="bg-green-600 hover:bg-green-700 text-white px-8"
            >
              <Receipt className="w-5 h-5 mr-2" />
              {isLoading ? 'Đang Phát Hành...' : 'Phát Hành Voucher'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-6 h-6" />
              <span>Phát Hành Voucher Thành Công!</span>
            </DialogTitle>
          </DialogHeader>
          
          {newVoucher && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-mono font-bold text-green-800">
                    {newVoucher.code}
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    Giá trị: {newVoucher.value}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Khách hàng:</span>
                  <span className="font-medium">{newVoucher.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Điện thoại:</span>
                  <span className="font-medium">{newVoucher.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày phát hành:</span>
                  <span className="font-medium">{newVoucher.issueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày hết hạn:</span>
                  <span className="font-medium">{newVoucher.expiryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Người phát hành:</span>
                  <span className="font-medium">{newVoucher.issuedBy}</span>
                </div>
              </div>

              {/* Voucher Content Preview */}
              {newVoucher.content && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Nội Dung Voucher:</h4>
                  <div className="text-sm bg-white p-3 rounded border">
                    <pre className="whitespace-pre-wrap font-mono text-xs">
                      {newVoucher.content}
                    </pre>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={copyVoucherCode}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Sao Chép Mã
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={printVoucher}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  In
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
