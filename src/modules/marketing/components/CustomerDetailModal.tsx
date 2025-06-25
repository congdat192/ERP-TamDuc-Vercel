
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Phone, Mail, Calendar, MapPin, Tag } from 'lucide-react';

interface Customer {
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

interface CustomerDetailModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerDetailModal({ customer, isOpen, onClose }: CustomerDetailModalProps) {
  const [activeSection, setActiveSection] = useState('overview');

  if (!customer) return null;

  const menuItems = [
    { id: 'overview', label: 'Thông tin tổng quan', icon: User },
    { id: 'vouchers', label: 'Lịch sử voucher', icon: Tag },
    { id: 'interactions', label: 'Lịch sử tương tác', icon: Phone },
    { id: 'orders', label: 'Lịch sử đơn hàng', icon: Calendar },
    { id: 'notes', label: 'Ghi chú nội bộ', icon: Mail }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Tên khách hàng:</label>
                <p className="font-semibold">{customer.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Số điện thoại:</label>
                <p className="font-semibold">{customer.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email:</label>
                <p className="font-semibold">{customer.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Nhóm khách hàng:</label>
                <Badge variant="outline">{customer.group}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Nguồn khách hàng:</label>
                <Badge className="bg-blue-100 text-blue-800">{customer.source}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Trạng thái:</label>
                <Badge className={customer.status === 'active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {customer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Tổng chi tiêu:</label>
                <p className="font-semibold text-green-600">{customer.totalSpent.toLocaleString('vi-VN')}đ</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Số voucher:</label>
                <p className="font-semibold">{customer.voucherCount}</p>
              </div>
            </div>
          </div>
        );
      case 'vouchers':
        return (
          <div className="space-y-4">
            <h4 className="font-medium">Lịch sử voucher</h4>
            <div className="text-sm text-gray-600">
              Tính năng đang được phát triển...
            </div>
          </div>
        );
      case 'interactions':
        return (
          <div className="space-y-4">
            <h4 className="font-medium">Lịch sử tương tác</h4>
            <div className="text-sm text-gray-600">
              Tính năng đang được phát triển...
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-4">
            <h4 className="font-medium">Lịch sử đơn hàng</h4>
            <div className="text-sm text-gray-600">
              Tính năng đang được phát triển...
            </div>
          </div>
        );
      case 'notes':
        return (
          <div className="space-y-4">
            <h4 className="font-medium">Ghi chú nội bộ</h4>
            <div className="text-sm text-gray-600">
              Tính năng đang được phát triển...
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Chi tiết khách hàng: {customer.name}</DialogTitle>
        </DialogHeader>
        
        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 border-r bg-gray-50 p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
