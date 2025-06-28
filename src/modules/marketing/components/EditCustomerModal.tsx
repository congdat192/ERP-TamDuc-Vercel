
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Save, X } from 'lucide-react';

interface MarketingCustomer {
  id: string;
  name: string;
  phone: string;
  group: string;
  source: string;
  email: string;
  createdDate: string;
  status: 'active' | 'inactive';
  totalSpent: number;
  voucherCount: number;
}

interface EditCustomerModalProps {
  customer: MarketingCustomer | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: MarketingCustomer) => void;
}

export function EditCustomerModal({ customer, isOpen, onClose, onSave }: EditCustomerModalProps) {
  const [formData, setFormData] = useState<Partial<MarketingCustomer>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        group: customer.group,
        status: customer.status
      });
    }
  }, [customer]);

  const handleInputChange = (field: keyof MarketingCustomer, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!customer || !formData.name || !formData.phone) {
      toast({
        title: "Lỗi validation",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedCustomer: MarketingCustomer = {
        ...customer,
        ...formData,
        name: formData.name!,
        phone: formData.phone!,
        email: formData.email!,
        group: formData.group!,
        status: formData.status as 'active' | 'inactive'
      };

      onSave(updatedCustomer);
      
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin khách hàng đã được cập nhật",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Cập nhật thất bại",
        description: "Có lỗi xảy ra khi cập nhật thông tin khách hàng",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Chỉnh sửa thông tin khách hàng</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tên khách hàng */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên khách hàng <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nhập tên khách hàng"
              />
            </div>

            {/* Số điện thoại */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                Số điện thoại <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Nhập số điện thoại"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Nhập email"
              />
            </div>

            {/* Nhóm khách hàng */}
            <div className="space-y-2">
              <Label>Nhóm khách hàng</Label>
              <Select 
                value={formData.group || ''} 
                onValueChange={(value) => handleInputChange('group', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhóm khách hàng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="Thường">Thường</SelectItem>
                  <SelectItem value="Tiềm năng">Tiềm năng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Trạng thái */}
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select 
                value={formData.status || ''} 
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Thông tin chỉ đọc */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3 theme-text">Thông tin thống kê</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="theme-text-muted">Tổng chi tiêu:</span>
                <span className="ml-2 font-medium theme-text">
                  {customer.totalSpent.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <div>
                <span className="theme-text-muted">Số voucher:</span>
                <span className="ml-2 font-medium theme-text">{customer.voucherCount}</span>
              </div>
              <div>
                <span className="theme-text-muted">Ngày tạo:</span>
                <span className="ml-2 font-medium theme-text">
                  {new Date(customer.createdDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div>
                <span className="theme-text-muted">Nguồn:</span>
                <span className="ml-2 font-medium theme-text">{customer.source}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            <X className="w-4 h-4 mr-2" />
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
