
import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { 
  Edit, 
  Trash2, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  Calendar,
  Users,
  Target
} from 'lucide-react';
import { Campaign, CAMPAIGN_TYPE_LABELS, CAMPAIGN_STATUS_LABELS } from '../types/campaign';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { format } from 'date-fns';

interface CampaignTableProps {
  campaigns: Campaign[];
  loading: boolean;
  selectedCampaigns: string[];
  onSelectionChange: (selected: string[]) => void;
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: string) => void;
}

export function CampaignTable({
  campaigns,
  loading,
  selectedCampaigns,
  onSelectionChange,
  onEdit,
  onDelete
}: CampaignTableProps) {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(campaigns.map(c => c.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectCampaign = (campaignId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedCampaigns, campaignId]);
    } else {
      onSelectionChange(selectedCampaigns.filter(id => id !== campaignId));
    }
  };

  const toggleRowExpansion = (campaignId: string) => {
    setExpandedRows(prev => 
      prev.includes(campaignId) 
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'draft': return 'outline';
      case 'completed': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="border-b-2">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedCampaigns.length === campaigns.length && campaigns.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-8"></TableHead>
                <TableHead className="font-semibold">Tên Chiến Dịch</TableHead>
                <TableHead className="font-semibold">Loại</TableHead>
                <TableHead className="font-semibold">Lịch Trình</TableHead>
                <TableHead className="font-semibold">Trạng Thái</TableHead>
                <TableHead className="font-semibold text-center">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <>
                  <TableRow key={campaign.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedCampaigns.includes(campaign.id)}
                        onCheckedChange={(checked) => handleSelectCampaign(campaign.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(campaign.id)}
                        className="p-1"
                      >
                        {expandedRows.includes(campaign.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{campaign.name}</div>
                        {campaign.description && (
                          <div className="text-sm text-gray-500 mt-1">{campaign.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {campaign.types.map((type) => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {CAMPAIGN_TYPE_LABELS[type]}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {format(campaign.schedule.startDate, 'dd/MM/yyyy')}
                        </div>
                        {campaign.schedule.endDate && (
                          <div className="text-gray-500 text-xs mt-1">
                            đến {format(campaign.schedule.endDate, 'dd/MM/yyyy')}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(campaign.status)}>
                        {CAMPAIGN_STATUS_LABELS[campaign.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(campaign)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled
                          title="Cấu hình voucher (sắp có)"
                        >
                          <Settings className="w-4 h-4 text-gray-400" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa chiến dịch</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa chiến dịch "{campaign.name}"? 
                                Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => onDelete(campaign.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row Content */}
                  {expandedRows.includes(campaign.id) && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-gray-50 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Chi Tiết Lịch Trình
                            </h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>Bắt đầu: {format(campaign.schedule.startDate, 'dd/MM/yyyy HH:mm')}</p>
                              {campaign.schedule.endDate && (
                                <p>Kết thúc: {format(campaign.schedule.endDate, 'dd/MM/yyyy HH:mm')}</p>
                              )}
                              {campaign.schedule.isCustom && campaign.schedule.customDescription && (
                                <p>Ghi chú: {campaign.schedule.customDescription}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              Thông Tin Tạo
                            </h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>Tạo bởi: {campaign.createdBy}</p>
                              <p>Ngày tạo: {format(campaign.createdAt, 'dd/MM/yyyy HH:mm')}</p>
                              <p>Cập nhật: {format(campaign.updatedAt, 'dd/MM/yyyy HH:mm')}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Cấu Hình Voucher
                            </h4>
                            <div className="text-sm text-gray-600">
                              <Button variant="outline" size="sm" disabled>
                                <Settings className="w-4 h-4 mr-2" />
                                Thiết lập quy tắc voucher
                              </Button>
                              <p className="text-xs text-gray-400 mt-2">
                                Tính năng này sẽ được triển khai trong phiên bản tiếp theo
                              </p>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>

        {campaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Target className="w-12 h-12 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có chiến dịch nào</h3>
            <p className="text-gray-500">Tạo chiến dịch đầu tiên để bắt đầu quản lý voucher</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
