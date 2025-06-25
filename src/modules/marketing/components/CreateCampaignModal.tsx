
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface MarketingCampaign {
  id: string;
  name: string;
  type: 'zalo' | 'sms' | 'email' | 'vihat';
  status: 'draft' | 'active' | 'paused' | 'completed';
  targetCustomers: number;
  sentCount: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  createdBy: string;
  createdDate: string;
  scheduledDate?: string;
  filterName: string;
}

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignCreated: (campaign: MarketingCampaign) => void;
}

const messageTemplates = {
  zalo: {
    welcome: 'Chào mừng {{name}} đến với cửa hàng! 🎉 Hãy sử dụng mã giảm giá WELCOME10 để được giảm 10% cho đơn hàng đầu tiên.',
    promotion: 'Ưu đãi đặc biệt cho {{name}}! 💥 Giảm giá lên đến 50% cho tất cả sản phẩm. Mã: SALE50. Có hiệu lực đến {{date}}.',
    winback: 'Chúng tôi nhớ bạn, {{name}}! 💝 Quay lại và nhận ngay voucher 200k. Mã: COMEBACK200'
  },
  email: {
    welcome: 'Chào {{name}},\n\nCảm ơn bạn đã tham gia cộng đồng của chúng tôi. Để chào mừng, hãy sử dụng mã WELCOME10 để được giảm 10%.\n\nTrân trọng,\nĐội ngũ Marketing',
    promotion: 'Chào {{name}},\n\nĐừng bỏ lỡ cơ hội vàng! Ưu đãi lên đến 50% đang chờ bạn. Sử dụng mã SALE50 ngay hôm nay.\n\nMua sắm ngay!',
    winback: 'Chào {{name}},\n\nChúng tôi nhớ bạn! Hãy quay lại và nhận ngay voucher 200k với mã COMEBACK200.\n\nHẹn gặp lại!'
  },
  sms: {
    welcome: '{{name}} chào mừng bạn! Dùng mã WELCOME10 giảm 10% đơn đầu. Cảm ơn!',
    promotion: '{{name}} ơi! Sale 50% đang diễn ra. Mã: SALE50. Đặt hàng ngay!',
    winback: '{{name}} à! Voucher 200k đang chờ bạn. Mã: COMEBACK200. Quay lại nào!'
  }
};

const availableFilters = [
  'Khách hàng VIP có voucher chưa sử dụng',
  'Khách hàng mới trong 30 ngày', 
  'Khách hàng không hoạt động > 90 ngày'
];

export function CreateCampaignModal({ isOpen, onClose, onCampaignCreated }: CreateCampaignModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: '' as 'zalo' | 'sms' | 'email' | 'vihat',
    filterName: '',
    templateType: '',
    customMessage: '',
    scheduledDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.filterName) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    const newCampaign: MarketingCampaign = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      status: 'draft',
      targetCustomers: Math.floor(Math.random() * 200) + 50,
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      conversionRate: 0,
      createdBy: 'Current User',
      createdDate: new Date().toISOString().split('T')[0],
      scheduledDate: formData.scheduledDate || undefined,
      filterName: formData.filterName
    };

    onCampaignCreated(newCampaign);
    
    toast({
      title: "Tạo chiến dịch thành công",
      description: `Chiến dịch "${formData.name}" đã được tạo`,
    });

    // Reset form
    setFormData({
      name: '',
      type: '' as any,
      filterName: '',
      templateType: '',
      customMessage: '',
      scheduledDate: ''
    });
  };

  const getTemplate = () => {
    if (!formData.type || !formData.templateType) return '';
    return messageTemplates[formData.type]?.[formData.templateType as keyof typeof messageTemplates[typeof formData.type]] || '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tạo chiến dịch Marketing mới</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Tên chiến dịch *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập tên chiến dịch"
              />
            </div>
            
            <div>
              <Label htmlFor="type">Loại chiến dịch *</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value, templateType: '', customMessage: '' }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zalo">Zalo</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="vihat">Vihat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="filter">Bộ lọc khách hàng *</Label>
            <Select value={formData.filterName} onValueChange={(value) => setFormData(prev => ({ ...prev, filterName: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn bộ lọc đã lưu" />
              </SelectTrigger>
              <SelectContent>
                {availableFilters.map((filter) => (
                  <SelectItem key={filter} value={filter}>{filter}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.type && (
            <div>
              <Label htmlFor="template">Template nội dung</Label>
              <Select value={formData.templateType} onValueChange={(value) => setFormData(prev => ({ ...prev, templateType: value, customMessage: getTemplate() }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn template có sẵn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Chào mừng khách hàng mới</SelectItem>
                  <SelectItem value="promotion">Thông báo khuyến mãi</SelectItem>
                  <SelectItem value="winback">Win-back khách hàng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="message">Nội dung tin nhắn</Label>
            <Textarea
              id="message"
              value={formData.customMessage}
              onChange={(e) => setFormData(prev => ({ ...prev, customMessage: e.target.value }))}
              placeholder="Nhập nội dung tin nhắn hoặc chọn template..."
              rows={4}
            />
            <div className="text-xs text-gray-500 mt-1">
              Biến có thể sử dụng: {'{'}{'{'}{'}name{'}'}, {'{'}{'{'}{'}date{'}'}
            </div>
          </div>

          <div>
            <Label htmlFor="scheduledDate">Ngày gửi (tùy chọn)</Label>
            <Input
              id="scheduledDate"
              type="datetime-local"
              value={formData.scheduledDate}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" className="voucher-button-primary">
              Tạo chiến dịch
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
