
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageType } from '../types/filter';
import { MessageTemplateManager } from '../utils/messageTemplates';
import { mockCustomers } from '@/data/mockData';

interface MessagePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  messageType: MessageType;
  content: string;
  customerIds: string[];
  customerCount: number;
}

export function MessagePreview({
  isOpen,
  onClose,
  messageType,
  content,
  customerIds,
  customerCount
}: MessagePreviewProps) {
  
  const getPreviewCustomers = () => {
    return customerIds
      .slice(0, 5) // Show first 5 customers as preview
      .map(id => mockCustomers.find(c => c.id === id))
      .filter(Boolean);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const generatePreviewContent = (customer: any) => {
    const customerData = {
      '[Tên khách hàng]': customer.name,
      '[Số điện thoại]': customer.phone,
      '[Tổng chi tiêu]': formatCurrency(customer.totalSpent),
      '[Điểm tích lũy]': customer.points.toLocaleString(),
      '[Nhóm khách hàng]': customer.group,
      '[Khu vực]': customer.deliveryArea
    };

    return MessageTemplateManager.replaceVariables(content, customerData);
  };

  const previewCustomers = getPreviewCustomers();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="theme-text">Xem Trước Tin Nhắn</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <Card className="theme-card">
            <CardHeader>
              <CardTitle className="text-lg theme-text">Thông Tin Gửi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm theme-text-muted">Loại tin nhắn:</span>
                  <Badge variant="outline" className="ml-2">
                    {messageType.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm theme-text-muted">Số lượng khách hàng:</span>
                  <span className="ml-2 font-medium theme-text">
                    {customerCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Examples */}
          <div className="space-y-4">
            <h3 className="font-medium theme-text">
              Xem trước với một số khách hàng mẫu:
            </h3>
            
            {previewCustomers.map((customer, index) => (
              <Card key={customer!.id} className="theme-card border theme-border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium theme-text">
                      {customer!.name} - {customer!.phone}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      Khách hàng #{index + 1}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <pre className="text-sm whitespace-pre-wrap theme-text">
                      {generatePreviewContent(customer)}
                    </pre>
                  </div>
                  
                  <div className="mt-3 text-xs theme-text-muted">
                    Tổng chi tiêu: {formatCurrency(customer!.totalSpent)} | 
                    Điểm tích lũy: {customer!.points.toLocaleString()} | 
                    Nhóm: {customer!.group}
                  </div>
                </CardContent>
              </Card>
            ))}

            {customerCount > 5 && (
              <div className="text-center text-sm theme-text-muted">
                ... và {(customerCount - 5).toLocaleString()} khách hàng khác
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
