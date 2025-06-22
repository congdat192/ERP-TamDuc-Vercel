import { useState, useEffect } from 'react';
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
  FileText,
  Send,
  Package
} from 'lucide-react';
import { VoucherContentModal } from '../components/VoucherContentModal';
import { templateService } from '../services/templateService';
import { voucherBatchService } from '../services/voucherBatchService';
import type { VoucherTemplate, Staff } from '../types';
import type { VoucherBatch } from '../types/voucherBatch';

// Mock data - will be replaced with real API data later
const denominationOptions: ComboboxOption[] = [
  { value: '50000', label: '50.000đ', description: 'Mệnh giá voucher' },
];

const customerSourceOptions: ComboboxOption[] = [
  { value: 'facebook', label: 'Facebook', description: 'Khách hàng từ Facebook' },
  { value: 'zalo', label: 'Zalo', description: 'Khách hàng từ Zalo' },
  { value: 'website', label: 'Website', description: 'Khách hàng đăng ký từ website' },
  { value: 'hotline', label: 'Hotline', description: 'Khách hàng gọi hotline' },
  { value: 'old-customer-data', label: 'Gọi khách hàng cũ theo data', description: 'Gọi theo dữ liệu khách hàng cũ' },
  { value: 'old-customer-request', label: 'Khách hàng cũ x lại voucher', description: 'Khách hàng cũ yêu cầu voucher mới' },
  { value: 'apology-new', label: 'Xin lỗi khách hàng mới', description: 'Voucher xin lỗi cho khách hàng mới' },
  { value: 'no-voucher-3months', label: 'Data gọi không phát được voucher trong 3 tháng', description: 'Dữ liệu khách hàng không nhận voucher trong 3 tháng' },
];

const customerTypeOptions: ComboboxOption[] = [
  { value: 'new-first', label: 'Khách hàng mới', description: 'Lần đầu sử dụng dịch vụ' },
  { value: 'old-used', label: 'Khách hàng cũ', description: 'Đã sử dụng dịch vụ' },
  { value: 'loyal', label: 'Khách hàng thân thiết', description: 'Đã sử dụng dịch vụ > 5 lần' },
];

// Mock staff data
const mockStaff: Staff[] = [
  { id: '1', name: 'Bảo Trâm', type: 'cskh', isActive: true, isDefault: true, createdAt: new Date().toISOString() },
  { id: '2', name: 'Anh Thy', type: 'cskh', isActive: true, isDefault: false, createdAt: new Date().toISOString() },
  { id: '3', name: 'Nguyễn Liễu', type: 'telesale', isActive: true, isDefault: false, createdAt: new Date().toISOString() },
];

export function VoucherIssue() {
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [customerSource, setCustomerSource] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [voucherValue, setVoucherValue] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<any>(null);
  const [templates, setTemplates] = useState<VoucherTemplate[]>([]);
  const [voucherBatches, setVoucherBatches] = useState<VoucherBatch[]>([]);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [generatedVoucherCode, setGeneratedVoucherCode] = useState('');
  const [mergedVoucherContent, setMergedVoucherContent] = useState('');

  // Load templates and voucher batches on component mount
  useEffect(() => {
    const loadedTemplates = templateService.getTemplates();
    setTemplates(loadedTemplates);
    
    const loadedBatches = voucherBatchService.getBatches();
    setVoucherBatches(loadedBatches);
    
    // Set default values
    const defaultTemplate = loadedTemplates.find(t => t.isDefault);
    if (defaultTemplate) {
      setSelectedTemplateId(defaultTemplate.id);
    } else if (loadedTemplates.length > 0) {
      setSelectedTemplateId(loadedTemplates[0].id);
    }
    
    const defaultBatch = loadedBatches.find(b => b.isDefault);
    if (defaultBatch) {
      setSelectedBatchId(defaultBatch.id);
    }
    
    const defaultStaff = mockStaff.find(s => s.isDefault);
    if (defaultStaff) {
      setSelectedStaffId(defaultStaff.id);
    }
  }, []);

  // Convert templates to combobox options
  const templateOptions: ComboboxOption[] = templates.map(template => ({
    value: template.id,
    label: template.name,
    description: template.isDefault ? 'Mẫu mặc định' : 'Mẫu tùy chỉnh'
  }));

  // Convert voucher batches to combobox options
  const batchOptions: ComboboxOption[] = voucherBatches
    .filter(batch => batch.isActive)
    .map(batch => ({
      value: batch.id,
      label: batch.name,
      description: batch.isDefault ? 'Đợt mặc định' : batch.description || 'Đợt phát hành'
    }));

  // Convert staff to combobox options
  const staffOptions: ComboboxOption[] = mockStaff
    .filter(staff => staff.isActive)
    .map(staff => ({
      value: staff.id,
      label: staff.name,
      description: staff.isDefault ? `${staff.type.toUpperCase()} - Mặc định` : staff.type.toUpperCase()
    }));

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

  const mergeTemplateVariables = (templateContent: string, voucherCode: string) => {
    const currentDate = new Date();
    const expiryDate = new Date(currentDate);
    expiryDate.setMonth(expiryDate.getMonth() + 3); // Voucher expires in 3 months
    
    const selectedStaff = mockStaff.find(s => s.id === selectedStaffId);
    
    return templateContent
      .replace(/\$tenKH/g, customerInfo?.name || 'Khách hàng')
      .replace(/\$mavoucher/g, voucherCode)
      .replace(/\$sdt/g, customerPhone)
      .replace(/\$hansudung/g, expiryDate.toLocaleDateString('vi-VN'))
      .replace(/\$nhanvien/g, selectedStaff?.name || 'Nhân viên tư vấn')
      .replace(/\$giatri/g, '50.000đ');
  };

  const handleIssueVoucher = async () => {
    if (!customerPhone.trim() || !selectedBatchId || !customerSource || !customerType || !selectedStaffId || !voucherValue || !selectedTemplateId) {
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
      const selectedBatch = voucherBatches.find(b => b.id === selectedBatchId);
      const voucherCode = `${selectedBatch?.codePrefix || 'VCH'}-${new Date().getFullYear()}-${Math.random().toString().substr(2, 6)}${selectedBatch?.codeSuffix || ''}`;
      const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
      
      if (selectedTemplate) {
        const mergedContent = mergeTemplateVariables(selectedTemplate.content, voucherCode);
        setGeneratedVoucherCode(voucherCode);
        setMergedVoucherContent(mergedContent);
        setIsVoucherModalOpen(true);
      }
      
      setIsLoading(false);
      
      toast({
        title: "Thành công",
        description: `Voucher ${voucherCode} đã được cấp thành công!`
      });
    }, 1500);
  };

  const handleCloseVoucherModal = () => {
    setIsVoucherModalOpen(false);
    
    // Reset form after successful voucher creation
    setCustomerPhone('');
    setCustomerSource('');
    setCustomerType('');
    setVoucherValue('');
    setNotes('');
    setCustomerInfo(null);
    setGeneratedVoucherCode('');
    setMergedVoucherContent('');
    
    // Keep default values for batch, staff, and template
    const defaultBatch = voucherBatches.find(b => b.isDefault);
    if (defaultBatch) {
      setSelectedBatchId(defaultBatch.id);
    }
    
    const defaultStaff = mockStaff.find(s => s.isDefault);
    if (defaultStaff) {
      setSelectedStaffId(defaultStaff.id);
    }
    
    const defaultTemplate = templates.find(t => t.isDefault);
    if (defaultTemplate) {
      setSelectedTemplateId(defaultTemplate.id);
    }
  };

  const isFormValid = customerPhone.trim() && selectedBatchId && customerSource && customerType && selectedStaffId && voucherValue && selectedTemplateId;

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold theme-text">Cấp Voucher</h2>
          <p className="theme-text-muted">Cấp voucher cho khách hàng</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Information */}
          <Card className="voucher-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 theme-text">
                <User className="w-5 h-5 theme-text-primary" />
                <span>Thông Tin Khách Hàng</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customer-phone" className="theme-text">Số Điện Thoại *</Label>
                <div className="flex mt-1 space-x-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-3 h-4 w-4 theme-text-muted" />
                    <Input
                      id="customer-phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Nhập số điện thoại..."
                      className="pl-10 voucher-input"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearchCustomer()}
                    />
                  </div>
                  <Button 
                    onClick={handleSearchCustomer}
                    disabled={!customerPhone.trim() || isLoading}
                    className="voucher-button-primary"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Tìm
                  </Button>
                </div>
              </div>

              {customerInfo && (
                <div className="voucher-alert-info rounded-lg p-4">
                  <h4 className="font-medium theme-text-primary mb-2">Thông Tin Khách Hàng</h4>
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
                <Label htmlFor="voucher-batch" className="theme-text">Đợt Phát Hành Voucher *</Label>
                <div className="mt-1">
                  <Combobox
                    options={batchOptions}
                    value={selectedBatchId}
                    onValueChange={setSelectedBatchId}
                    placeholder="Chọn đợt phát hành..."
                    searchPlaceholder="Tìm đợt..."
                    emptyMessage="Không tìm thấy đợt nào."
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="customer-source" className="theme-text">Nguồn Khách Hàng *</Label>
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
                <Label htmlFor="customer-type" className="theme-text">Loại Khách Hàng *</Label>
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

              <div>
                <Label htmlFor="staff-selector" className="theme-text">Nhân Viên *</Label>
                <div className="mt-1">
                  <Combobox
                    options={staffOptions}
                    value={selectedStaffId}
                    onValueChange={setSelectedStaffId}
                    placeholder="Chọn nhân viên..."
                    searchPlaceholder="Tìm nhân viên..."
                    emptyMessage="Không tìm thấy nhân viên nào."
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voucher Details */}
          <Card className="voucher-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 theme-text">
                <Gift className="w-5 h-5 theme-text-primary" />
                <span>Thông Tin Voucher</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="voucher-value" className="theme-text">Mệnh Giá Voucher *</Label>
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

              <div>
                <Label htmlFor="template-selector" className="theme-text">Mẫu Nội Dung Voucher *</Label>
                <div className="mt-1">
                  <Combobox
                    options={templateOptions}
                    value={selectedTemplateId}
                    onValueChange={setSelectedTemplateId}
                    placeholder="Chọn mẫu nội dung..."
                    searchPlaceholder="Tìm mẫu..."
                    emptyMessage="Không tìm thấy mẫu nào."
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="theme-text">Ghi Chú</Label>
                <div className="relative mt-1">
                  <FileText className="absolute left-3 top-3 h-4 w-4 theme-text-muted" />
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Nhập ghi chú (tùy chọn)..."
                    className="pl-10 min-h-20 voucher-input"
                    rows={3}
                  />
                </div>
              </div>

              <Button 
                onClick={handleIssueVoucher}
                disabled={!isFormValid || isLoading}
                className="w-full voucher-button-primary"
              >
                <Send className="w-4 h-4 mr-2" />
                {isLoading ? 'Đang Xử Lý...' : 'Cấp Voucher'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="voucher-card">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Building className="w-5 h-5 theme-text-primary mt-0.5" />
              <div>
                <h3 className="font-medium theme-text">Hướng Dẫn Cấp Voucher</h3>
                <div className="text-sm theme-text-muted mt-1 space-y-1">
                  <p>1. Nhập số điện thoại khách hàng và nhấn "Tìm" để lấy thông tin</p>
                  <p>2. Chọn đợt phát hành voucher (đã được đặt mặc định)</p>
                  <p>3. Chọn nguồn khách hàng và loại khách hàng từ dropdown</p>
                  <p>4. Chọn nhân viên phụ trách (đã được đặt mặc định)</p>
                  <p>5. Chọn mệnh giá voucher và mẫu nội dung voucher</p>
                  <p>6. Thêm ghi chú nếu cần thiết</p>
                  <p>7. Nhấn "Cấp Voucher" để hoàn tất và xem nội dung voucher</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voucher Content Modal */}
      <VoucherContentModal
        isOpen={isVoucherModalOpen}
        onClose={handleCloseVoucherModal}
        content={mergedVoucherContent}
        voucherCode={generatedVoucherCode}
      />
    </>
  );
}
