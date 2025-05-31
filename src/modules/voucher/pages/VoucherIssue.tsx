
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { toast } from '@/hooks/use-toast';
import { 
  Search, 
  Phone, 
  Gift,
  User,
  Building,
  CreditCard,
  FileText,
  Send
} from 'lucide-react';

// Mock data - will be replaced with real API data later
const denominationOptions: ComboboxOption[] = [
  { value: '100000', label: '100.000đ', description: 'Mệnh giá phổ biến' },
  { value: '250000', label: '250.000đ', description: 'Cho khách hàng thân thiết' },
  { value: '500000', label: '500.000đ', description: 'Mệnh giá cao' },
  { value: '1000000', label: '1.000.000đ', description: 'Mệnh giá VIP' },
];

const customerSourceOptions: ComboboxOption[] = [
  { value: 'website', label: 'Website', description: 'Đăng ký từ website' },
  { value: 'facebook', label: 'Facebook', description: 'Từ Facebook' },
  { value: 'referral', label: 'Giới thiệu', description: 'Được giới thiệu' },
  { value: 'hotline', label: 'Hotline', description: 'Gọi hotline' },
];

const customerTypeOptions: ComboboxOption[] = [
  { value: 'new', label: 'Khách hàng mới', description: 'Lần đầu sử dụng' },
  { value: 'loyal', label: 'Khách hàng thân thiết', description: 'Đã sử dụng > 5 lần' },
  { value: 'vip', label: 'Khách hàng VIP', description: 'Khách hàng cao cấp' },
];

export function VoucherIssue() {
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerSource, setCustomerSource] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [voucherValue, setVoucherValue] = useState('');
  const [notes, setNotes] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [allowCustomValue] = useState(true); // This would come from settings
  const [isLoading, setIsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<any>(null);

  const handleSearchCustomer = async () => {
    if (!customerPhone.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số điện thoại.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock customer data
      const mockCustomer = {
        name: 'Nguyễn Văn An',
        phone: customerPhone,
        email: 'nguyenvanan@email.com',
        lastVoucher: 'VCH-2024-001200',
        totalVouchers: 3,
        type: 'Regular'
      };
      
      setCustomerInfo(mockCustomer);
      setIsLoading(false);
      
      toast({
        title: "Thành công",
        description: "Đã tìm thấy thông tin khách hàng."
      });
    }, 1000);
  };

  const handleIssueVoucher = async () => {
    if (!customerPhone.trim() || !customerSource || !customerType || (!voucherValue && !customValue)) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin bắt buộc.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate voucher issuance
    setTimeout(() => {
      const voucherCode = `VCH-${new Date().getFullYear()}-${Math.random().toString().substr(2, 6)}`;
      
      setIsLoading(false);
      
      toast({
        title: "Thành công",
        description: `Voucher ${voucherCode} đã được cấp thành công!`
      });
      
      // Reset form
      setCustomerPhone('');
      setCustomerSource('');
      setCustomerType('');
      setVoucherValue('');
      setCustomValue('');
      setNotes('');
      setCustomerInfo(null);
    }, 1500);
  };

  const isFormValid = customerPhone.trim() && customerSource && customerType && (voucherValue || customValue);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Cấp Voucher</h2>
        <p className="text-gray-600">Cấp voucher cho khách hàng</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Thông Tin Khách Hàng</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customer-phone">Số Điện Thoại *</Label>
              <div className="flex mt-1 space-x-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="customer-phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Nhập số điện thoại..."
                    className="pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchCustomer()}
                  />
                </div>
                <Button 
                  onClick={handleSearchCustomer}
                  disabled={!customerPhone.trim() || isLoading}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Tìm
                </Button>
              </div>
            </div>

            {customerInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Thông Tin Khách Hàng</h4>
                <div className="space-y-1 text-sm">
                  <div><span className="font-medium">Tên:</span> {customerInfo.name}</div>
                  <div><span className="font-medium">SĐT:</span> {customerInfo.phone}</div>
                  <div><span className="font-medium">Email:</span> {customerInfo.email}</div>
                  <div><span className="font-medium">Voucher gần nhất:</span> {customerInfo.lastVoucher}</div>
                  <div><span className="font-medium">Tổng voucher:</span> {customerInfo.totalVouchers}</div>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="customer-source">Nguồn Khách Hàng *</Label>
              <div className="mt-1">
                <Combobox
                  options={customerSourceOptions}
                  value={customerSource}
                  onValueChange={setCustomerSource}
                  placeholder="Chọn nguồn khách hàng..."
                  searchPlaceholder="Tìm nguồn..."
                  emptyMessage="Không tìm thấy nguồn nào."
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="customer-type">Loại Khách Hàng *</Label>
              <div className="mt-1">
                <Combobox
                  options={customerTypeOptions}
                  value={customerType}
                  onValueChange={setCustomerType}
                  placeholder="Chọn loại khách hàng..."
                  searchPlaceholder="Tìm loại..."
                  emptyMessage="Không tìm thấy loại nào."
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voucher Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gift className="w-5 h-5" />
              <span>Thông Tin Voucher</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="voucher-value">Mệnh Giá Voucher *</Label>
              <div className="mt-1">
                <Combobox
                  options={denominationOptions}
                  value={voucherValue}
                  onValueChange={setVoucherValue}
                  placeholder="Chọn mệnh giá..."
                  searchPlaceholder="Tìm mệnh giá..."
                  emptyMessage="Không tìm thấy mệnh giá nào."
                  className="w-full"
                />
              </div>
            </div>

            {allowCustomValue && (
              <div>
                <Label htmlFor="custom-value">Hoặc Nhập Giá Trị Tùy Chỉnh</Label>
                <div className="relative mt-1">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="custom-value"
                    type="number"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    placeholder="Nhập giá trị..."
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="notes">Ghi Chú</Label>
              <div className="relative mt-1">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nhập ghi chú (tùy chọn)..."
                  className="pl-10 min-h-20"
                  rows={3}
                />
              </div>
            </div>

            <Button 
              onClick={handleIssueVoucher}
              disabled={!isFormValid || isLoading}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? 'Đang Xử Lý...' : 'Cấp Voucher'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Building className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">Hướng Dẫn Cấp Voucher</h3>
              <div className="text-sm text-gray-600 mt-1 space-y-1">
                <p>1. Nhập số điện thoại khách hàng và nhấn "Tìm" để lấy thông tin</p>
                <p>2. Chọn nguồn khách hàng và loại khách hàng từ dropdown</p>
                <p>3. Chọn mệnh giá voucher hoặc nhập giá trị tùy chỉnh</p>
                <p>4. Thêm ghi chú nếu cần thiết</p>
                <p>5. Nhấn "Cấp Voucher" để hoàn tất</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
