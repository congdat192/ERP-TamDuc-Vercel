
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Mail, Calendar, MapPin, User, Building, Receipt } from 'lucide-react';
import { Customer } from '../types';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onEditCustomer: (customer: Customer) => void;
}

export function CustomerDetailModal({ isOpen, onClose, customer, onEditCustomer }: CustomerDetailModalProps) {
  if (!customer) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN').format(date);
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'VIP':
        return 'bg-purple-100 text-purple-800';
      case 'Premium':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi Tiết Khách Hàng</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Customer Header */}
          <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                {customer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{customer.name}</h3>
              <p className="text-sm text-gray-500 mb-2">Mã: {customer.code}</p>
              <div className="flex items-center space-x-2">
                <Badge className={getTypeColor(customer.customerGroup)}>
                  {customer.customerGroup}
                </Badge>
                <Badge className={getStatusColor(customer.status)}>
                  {customer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Customer Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center">
                <User className="w-5 h-5 mr-2" />
                Thông Tin Liên Hệ
              </h4>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
                {customer.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{customer.address}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Chi nhánh: {customer.branch}</span>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center">
                <Receipt className="w-5 h-5 mr-2" />
                Thông Tin Kinh Doanh
              </h4>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Loại khách hàng:</span>
                  <span className="text-sm font-medium">
                    {customer.customerType === 'individual' ? 'Cá nhân' : 'Công ty'}
                  </span>
                </div>
                {customer.gender && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Giới tính:</span>
                    <span className="text-sm font-medium">
                      {customer.gender === 'male' ? 'Nam' : 'Nữ'}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Người tạo:</span>
                  <span className="text-sm font-medium">{customer.creator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ngày tạo:</span>
                  <span className="text-sm font-medium">{formatDate(customer.createdDate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Thống Kê Tài Chính</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-sm text-red-600 font-medium">Nợ Hiện Tại</p>
                <p className="text-xl font-bold text-red-700">{formatCurrency(customer.currentDebt)}</p>
                <p className="text-xs text-red-500">{customer.daysOwed} ngày</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-green-600 font-medium">Tổng Bán</p>
                <p className="text-xl font-bold text-green-700">{formatCurrency(customer.totalSales)}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-600 font-medium">Bán Trừ Trả Hàng</p>
                <p className="text-xl font-bold text-blue-700">{formatCurrency(customer.totalSalesAfterReturns)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 font-medium">Giao Dịch Cuối</p>
                <p className="text-sm font-bold text-gray-700">
                  {customer.lastTransactionDate ? formatDate(customer.lastTransactionDate) : 'Chưa có'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button onClick={() => onEditCustomer(customer)}>
              Chỉnh Sửa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
