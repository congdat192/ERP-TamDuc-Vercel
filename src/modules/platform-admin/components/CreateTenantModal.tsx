
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Mail, Phone, CreditCard } from 'lucide-react';
import { TenantInfo } from '../utils/mockData';

interface CreateTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTenantCreated: (tenant: TenantInfo) => void;
}

export function CreateTenantModal({ isOpen, onClose, onTenantCreated }: CreateTenantModalProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactEmail: '',
    contactPhone: '',
    plan: 'basic' as TenantInfo['plan'],
    status: 'trial' as TenantInfo['status'],
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newTenant: TenantInfo = {
        id: `tenant-${Date.now()}`,
        companyName: formData.companyName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        status: formData.status,
        plan: formData.plan,
        userCount: 1,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        subscription: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          status: 'active',
          amount: formData.plan === 'basic' ? 0 : formData.plan === 'professional' ? 8000000 : 15000000
        }
      };

      onTenantCreated(newTenant);
      setIsSubmitting(false);
      
      // Reset form
      setFormData({
        companyName: '',
        contactEmail: '',
        contactPhone: '',
        plan: 'basic',
        status: 'trial',
        notes: ''
      });
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Thêm Khách Hàng Mới</span>
          </DialogTitle>
          <DialogDescription>
            Tạo tài khoản mới cho khách hàng sử dụng hệ thống ERP
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Thông Tin Công Ty</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Tên Công Ty *</Label>
                <Input
                  id="companyName"
                  placeholder="VD: ABC Technology Co., Ltd"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email Liên Hệ *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="admin@company.com"
                      className="pl-10"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Số Điện Thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="contactPhone"
                      placeholder="+84 24 3888 9999"
                      className="pl-10"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Cấu Hình Dịch Vụ</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plan">Gói Dịch Vụ</Label>
                  <Select value={formData.plan} onValueChange={(value: TenantInfo['plan']) => setFormData({ ...formData, plan: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn gói dịch vụ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Cơ Bản (Miễn phí 30 ngày)</SelectItem>
                      <SelectItem value="professional">Chuyên Nghiệp (8,000,000 VNĐ/năm)</SelectItem>
                      <SelectItem value="enterprise">Doanh Nghiệp (15,000,000 VNĐ/năm)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Trạng Thái Ban Đầu</Label>
                  <Select value={formData.status} onValueChange={(value: TenantInfo['status']) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trial">Dùng Thử</SelectItem>
                      <SelectItem value="active">Hoạt Động</SelectItem>
                      <SelectItem value="inactive">Không Hoạt Động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Ghi Chú</Label>
                <Textarea
                  id="notes"
                  placeholder="Thông tin bổ sung về khách hàng..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Plan Details */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Chi tiết gói {formData.plan === 'basic' ? 'Cơ Bản' : formData.plan === 'professional' ? 'Chuyên Nghiệp' : 'Doanh Nghiệp'}:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  {formData.plan === 'basic' && (
                    <>
                      <li>• Tối đa 5 người dùng</li>
                      <li>• 1GB lưu trữ</li>
                      <li>• Hỗ trợ email</li>
                      <li>• 30 ngày dùng thử miễn phí</li>
                    </>
                  )}
                  {formData.plan === 'professional' && (
                    <>
                      <li>• Tối đa 25 người dùng</li>
                      <li>• 10GB lưu trữ</li>
                      <li>• Hỗ trợ điện thoại</li>
                      <li>• Báo cáo nâng cao</li>
                    </>
                  )}
                  {formData.plan === 'enterprise' && (
                    <>
                      <li>• Không giới hạn người dùng</li>
                      <li>• 100GB lưu trữ</li>
                      <li>• Hỗ trợ 24/7</li>
                      <li>• Tùy chỉnh theo yêu cầu</li>
                    </>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang tạo...' : 'Tạo Khách Hàng'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
