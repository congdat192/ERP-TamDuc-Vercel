
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, Play, Pause, BarChart3, Calendar, Beaker, Calculator, Archive, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CreateCampaignModal } from '../CreateCampaignModal';
import { BulkOperationsBar, BulkSelectCheckbox, BulkSelectHeader } from '@/components/ui/bulk-operations';

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
    name: 'Chiến dịch chào mừng khách hàng mới',
    type: 'zalo',
    status: 'active',
    targetCustomers: 150,
    sentCount: 145,
    openRate: 85.2,
    clickRate: 12.4,
    conversionRate: 3.8,
    createdBy: 'Nguyễn Văn A',
    createdDate: '2024-06-20',
    filterName: 'Khách hàng mới trong 30 ngày'
  },
  {
    id: '2',
    name: 'Khuyến mãi cuối tháng',
    type: 'email',
    status: 'completed',
    targetCustomers: 300,
    sentCount: 300,
    openRate: 68.5,
    clickRate: 8.9,
    conversionRate: 2.1,
    createdBy: 'Trần Thị B',
    createdDate: '2024-06-15',
    filterName: 'Khách hàng VIP có voucher chưa sử dụng'
  }
];

export function MarketingCampaignsTab() {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>([]);

  const handleCreateCampaign = (newCampaign: MarketingCampaign) => {
    setCampaigns(prev => [...prev, newCampaign]);
    setIsCreateModalOpen(false);
  };

  const handleViewAnalytics = (campaign: MarketingCampaign) => {
    toast({
      title: "Xem báo cáo",
      description: `Mở báo cáo chi tiết cho "${campaign.name}"`,
    });
  };

  const handleScheduleCampaign = (campaign: MarketingCampaign) => {
    toast({
      title: "Lên lịch chiến dịch",
      description: `Mở trình lên lịch cho "${campaign.name}"`,
    });
  };

  const handleABTest = (campaign: MarketingCampaign) => {
    toast({
      title: "A/B Test",
      description: `Tạo A/B test cho "${campaign.name}"`,
    });
  };

  const handleROICalculator = (campaign: MarketingCampaign) => {
    toast({
      title: "Tính toán ROI",
      description: `Mở máy tính ROI cho "${campaign.name}"`,
    });
  };

  const handleTemplateLibrary = () => {
    toast({
      title: "Thư viện template",
      description: "Mở thư viện template tin nhắn",
    });
  };

  const handleAnalyticsDashboard = () => {
    toast({
      title: "Bảng điều khiển Analytics",
      description: "Mở dashboard tổng quan về các chiến dịch",
    });
  };

  const handleSelectCampaign = (campaignId: string, selected: boolean) => {
    if (selected) {
      setSelectedCampaignIds(prev => [...prev, campaignId]);
    } else {
      setSelectedCampaignIds(prev => prev.filter(id => id !== campaignId));
    }
  };

  const handleSelectAll = () => {
    setSelectedCampaignIds(campaigns.map(campaign => campaign.id));
  };

  const handleDeselectAll = () => {
    setSelectedCampaignIds([]);
  };

  const handleBulkDelete = () => {
    setCampaigns(prev => prev.filter(campaign => !selectedCampaignIds.includes(campaign.id)));
    setSelectedCampaignIds([]);
    toast({
      title: "Xóa thành công",
      description: `Đã xóa ${selectedCampaignIds.length} chiến dịch`,
    });
  };

  const handleBulkArchive = () => {
    // In real implementation, would update status to archived
    toast({
      title: "Lưu trữ thành công",
      description: `Đã lưu trữ ${selectedCampaignIds.length} chiến dịch`,
    });
    setSelectedCampaignIds([]);
  };

  const handleBulkExport = () => {
    const selectedCampaigns = campaigns.filter(campaign => 
      selectedCampaignIds.includes(campaign.id)
    );
    
    const csvContent = selectedCampaigns.map(campaign => 
      `${campaign.name},${campaign.type},${campaign.status},${campaign.targetCustomers},${campaign.sentCount}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected-campaigns.csv';
    a.click();
    
    toast({
      title: "Xuất dữ liệu đã chọn",
      description: `Đã xuất ${selectedCampaigns.length} chiến dịch`,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'draft': { className: "bg-gray-100 text-gray-800", label: "Nháp" },
      'active': { className: "bg-green-100 text-green-800", label: "Đang chạy" },
      'paused': { className: "bg-yellow-100 text-yellow-800", label: "Tạm dừng" },
      'completed': { className: "bg-blue-100 text-blue-800", label: "Hoàn thành" }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'zalo': { className: "bg-blue-100 text-blue-800", label: "Zalo" },
      'email': { className: "bg-purple-100 text-purple-800", label: "Email" },
      'sms': { className: "bg-orange-100 text-orange-800", label: "SMS" },
      'vihat': { className: "bg-green-100 text-green-800", label: "Vihat" }
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold theme-text">Chiến dịch Marketing</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAnalyticsDashboard} variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics Dashboard
          </Button>
          <Button onClick={handleTemplateLibrary} variant="outline" size="sm">
            <Archive className="w-4 h-4 mr-2" />
            Thư viện Template
          </Button>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="voucher-button-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo chiến dịch
          </Button>
        </div>
      </div>

      <BulkOperationsBar
        selectedCount={selectedCampaignIds.length}
        totalCount={campaigns.length}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleBulkExport}
        onBulkArchive={handleBulkArchive}
        entityName="chiến dịch"
      />

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <BulkSelectHeader
                  selectedCount={selectedCampaignIds.length}
                  totalCount={campaigns.length}
                  onSelectAll={handleSelectAll}
                  onDeselectAll={handleDeselectAll}
                />
              </TableHead>
              <TableHead className="font-medium">Tên chiến dịch</TableHead>
              <TableHead className="font-medium">Loại</TableHead>
              <TableHead className="font-medium">Trạng thái</TableHead>
              <TableHead className="font-medium">KH mục tiêu</TableHead>
              <TableHead className="font-medium">Đã gửi</TableHead>
              <TableHead className="font-medium">Tỷ lệ mở</TableHead>
              <TableHead className="font-medium">Tỷ lệ click</TableHead>
              <TableHead className="font-medium">Chuyển đổi</TableHead>
              <TableHead className="font-medium">Người tạo</TableHead>
              <TableHead className="font-medium">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id} className="hover:bg-gray-50">
                <TableCell>
                  <BulkSelectCheckbox
                    checked={selectedCampaignIds.includes(campaign.id)}
                    onChange={(checked) => handleSelectCampaign(campaign.id, checked)}
                  />
                </TableCell>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>{getTypeBadge(campaign.type)}</TableCell>
                <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                <TableCell>{campaign.targetCustomers.toLocaleString()}</TableCell>
                <TableCell>{campaign.sentCount.toLocaleString()}</TableCell>
                <TableCell>{campaign.openRate.toFixed(1)}%</TableCell>
                <TableCell>{campaign.clickRate.toFixed(1)}%</TableCell>
                <TableCell>{campaign.conversionRate.toFixed(1)}%</TableCell>
                <TableCell>{campaign.createdBy}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewAnalytics(campaign)}
                      className="h-8 px-2"
                    >
                      <BarChart3 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleScheduleCampaign(campaign)}
                      className="h-8 px-2"
                    >
                      <Calendar className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleABTest(campaign)}
                      className="h-8 px-2"
                    >
                      <Beaker className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleROICalculator(campaign)}
                      className="h-8 px-2"
                    >
                      <Calculator className="w-3 h-3" />
                    </Button>
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
        onCampaignCreated={handleCreateCampaign}
      />
    </div>
  );
}
