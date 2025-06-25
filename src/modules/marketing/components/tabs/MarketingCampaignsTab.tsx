
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Play, Pause } from 'lucide-react';
import { CreateCampaignModal } from '../CreateCampaignModal';
import { CampaignDetailModal } from '../CampaignDetailModal';

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

const mockCampaigns: MarketingCampaign[] = [
  {
    id: '1',
    name: 'Khuyến mãi mùa hè - VIP Customers',
    type: 'zalo',
    status: 'completed',
    targetCustomers: 127,
    sentCount: 125,
    openRate: 85.6,
    clickRate: 32.4,
    conversionRate: 12.8,
    createdBy: 'Nguyễn Văn Marketing',
    createdDate: '2024-06-15',
    filterName: 'Khách hàng VIP có voucher chưa sử dụng'
  },
  {
    id: '2',
    name: 'Chào mừng khách hàng mới',
    type: 'email',
    status: 'active',
    targetCustomers: 89,
    sentCount: 89,
    openRate: 72.1,
    clickRate: 18.9,
    conversionRate: 8.4,
    createdBy: 'Trần Thị Customer Success',
    createdDate: '2024-06-20',
    scheduledDate: '2024-06-25',
    filterName: 'Khách hàng mới trong 30 ngày'
  },
  {
    id: '3',
    name: 'Win-back inactive customers',
    type: 'sms',
    status: 'draft',
    targetCustomers: 45,
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    conversionRate: 0,
    createdBy: 'Lê Văn Retention',
    createdDate: '2024-06-22',
    filterName: 'Khách hàng không hoạt động > 90 ngày'
  }
];

export function MarketingCampaignsTab() {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<MarketingCampaign | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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

  const handleCampaignClick = (campaign: MarketingCampaign) => {
    setSelectedCampaign(campaign);
    setIsDetailModalOpen(true);
  };

  const handleStatusToggle = (campaignId: string, currentStatus: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { 
            ...campaign, 
            status: currentStatus === 'active' ? 'paused' : 'active' as any
          }
        : campaign
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold theme-text">Chiến dịch Marketing</h2>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="voucher-button-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo chiến dịch mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Tổng chiến dịch</div>
          <div className="text-2xl font-bold theme-text-primary">{campaigns.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Đang hoạt động</div>
          <div className="text-2xl font-bold text-green-600">
            {campaigns.filter(c => c.status === 'active').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Tổng KH tiếp cận</div>
          <div className="text-2xl font-bold text-blue-600">
            {campaigns.reduce((sum, c) => sum + c.targetCustomers, 0)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Tỷ lệ chuyển đổi TB</div>
          <div className="text-2xl font-bold text-orange-600">
            {(campaigns.reduce((sum, c) => sum + c.conversionRate, 0) / campaigns.length).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Tên chiến dịch</TableHead>
              <TableHead className="font-medium">Loại</TableHead>
              <TableHead className="font-medium">Trạng thái</TableHead>
              <TableHead className="font-medium">KH mục tiêu</TableHead>
              <TableHead className="font-medium">Đã gửi</TableHead>
              <TableHead className="font-medium">Tỷ lệ mở</TableHead>
              <TableHead className="font-medium">Tỷ lệ click</TableHead>
              <TableHead className="font-medium">Chuyển đổi</TableHead>
              <TableHead className="font-medium">Người tạo</TableHead>
              <TableHead className="font-medium">Ngày tạo</TableHead>
              <TableHead className="font-medium">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow 
                key={campaign.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleCampaignClick(campaign)}
              >
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>{getTypeBadge(campaign.type)}</TableCell>
                <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                <TableCell>{campaign.targetCustomers.toLocaleString()}</TableCell>
                <TableCell>{campaign.sentCount.toLocaleString()}</TableCell>
                <TableCell>{campaign.openRate.toFixed(1)}%</TableCell>
                <TableCell>{campaign.clickRate.toFixed(1)}%</TableCell>
                <TableCell className="font-semibold text-green-600">
                  {campaign.conversionRate.toFixed(1)}%
                </TableCell>
                <TableCell>{campaign.createdBy}</TableCell>
                <TableCell>{new Date(campaign.createdDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCampaignClick(campaign)}
                      className="h-8 px-2"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-2"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    {(campaign.status === 'active' || campaign.status === 'paused') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusToggle(campaign.id, campaign.status)}
                        className="h-8 px-2"
                      >
                        {campaign.status === 'active' ? (
                          <Pause className="w-3 h-3" />
                        ) : (
                          <Play className="w-3 h-3" />
                        )}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCampaignCreated={(newCampaign) => {
          setCampaigns(prev => [...prev, newCampaign]);
          setIsCreateModalOpen(false);
        }}
      />

      <CampaignDetailModal
        campaign={selectedCampaign}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}
