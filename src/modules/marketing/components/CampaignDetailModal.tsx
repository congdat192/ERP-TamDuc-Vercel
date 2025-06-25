
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, MousePointer, TrendingUp, Users, Calendar, User } from 'lucide-react';

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

interface CampaignDetailModalProps {
  campaign: MarketingCampaign | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CampaignDetailModal({ campaign, isOpen, onClose }: CampaignDetailModalProps) {
  if (!campaign) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { className: "bg-gray-100 text-gray-800", label: "Nháp" },
      active: { className: "bg-green-100 text-green-800", label: "Đang chạy" },
      paused: { className: "bg-yellow-100 text-yellow-800", label: "Tạm dừng" },
      completed: { className: "bg-blue-100 text-blue-800", label: "Hoàn thành" }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      zalo: { className: "bg-blue-100 text-blue-800", label: "Zalo" },
      sms: { className: "bg-orange-100 text-orange-800", label: "SMS" },
      email: { className: "bg-purple-100 text-purple-800", label: "Email" },
      vihat: { className: "bg-green-100 text-green-800", label: "Vihat" }
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Chi tiết chiến dịch: {campaign.name}</span>
            <div className="flex items-center space-x-2">
              {getTypeBadge(campaign.type)}
              {getStatusBadge(campaign.status)}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Campaign Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Người tạo:</label>
              <div className="flex items-center space-x-2 mt-1">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-semibold">{campaign.createdBy}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Ngày tạo:</label>
              <div className="flex items-center space-x-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-semibold">{new Date(campaign.createdDate).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Bộ lọc sử dụng:</label>
              <p className="font-semibold mt-1">{campaign.filterName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Ngày gửi:</label>
              <p className="font-semibold mt-1">
                {campaign.scheduledDate 
                  ? new Date(campaign.scheduledDate).toLocaleDateString('vi-VN')
                  : 'Gửi ngay'
                }
              </p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="w-4 h-4 mr-2 text-blue-500" />
                  Khách hàng mục tiêu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaign.targetCustomers.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Tổng số khách hàng</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-green-500" />
                  Tỷ lệ mở
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{campaign.openRate.toFixed(1)}%</div>
                <Progress value={campaign.openRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <MousePointer className="w-4 h-4 mr-2 text-orange-500" />
                  Tỷ lệ click
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{campaign.clickRate.toFixed(1)}%</div>
                <Progress value={campaign.clickRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-purple-500" />
                  Chuyển đổi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{campaign.conversionRate.toFixed(1)}%</div>
                <Progress value={campaign.conversionRate} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Detailed Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê chi tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{campaign.sentCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Tin nhắn đã gửi</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(campaign.sentCount * campaign.openRate / 100).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Số lượng mở</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(campaign.sentCount * campaign.clickRate / 100).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Số lượt click</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(campaign.sentCount * campaign.conversionRate / 100).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Chuyển đổi thành công</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Timeline (Placeholder) */}
          <Card>
            <CardHeader>
              <CardTitle>Dòng thời gian chiến dịch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                Tính năng theo dõi dòng thời gian đang được phát triển...
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
