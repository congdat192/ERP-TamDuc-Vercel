
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Filter,
  Download,
  Trash2,
  Power,
  PowerOff
} from 'lucide-react';
import { CampaignTable } from '../components/CampaignTable';
import { CampaignForm } from '../components/CampaignForm';
import { Campaign, CampaignType, CampaignStatus } from '../types/campaign';
import { useCampaignManagement } from '../hooks/useCampaignManagement';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

export function CampaignManagement() {
  const {
    campaigns,
    loading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    bulkUpdateStatus
  } = useCampaignManagement();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<CampaignType | 'all'>('all');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           campaign.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
      const matchesType = typeFilter === 'all' || campaign.types.includes(typeFilter);
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [campaigns, searchTerm, statusFilter, typeFilter]);

  const handleCreateCampaign = async (data: any) => {
    try {
      await createCampaign(data);
      setIsFormOpen(false);
      toast({
        title: "Thành công",
        description: "Chiến dịch đã được tạo thành công."
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo chiến dịch. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  const handleEditCampaign = async (data: any) => {
    if (!editingCampaign) return;
    
    try {
      await updateCampaign(editingCampaign.id, data);
      setEditingCampaign(null);
      setIsFormOpen(false);
      toast({
        title: "Thành công",
        description: "Chiến dịch đã được cập nhật thành công."
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật chiến dịch. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      await deleteCampaign(id);
      toast({
        title: "Thành công",
        description: "Chiến dịch đã được xóa thành công."
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa chiến dịch. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  const handleBulkActivate = async () => {
    try {
      await bulkUpdateStatus(selectedCampaigns, 'active');
      setSelectedCampaigns([]);
      toast({
        title: "Thành công",
        description: `Đã kích hoạt ${selectedCampaigns.length} chiến dịch.`
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể kích hoạt chiến dịch. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  const handleBulkDeactivate = async () => {
    try {
      await bulkUpdateStatus(selectedCampaigns, 'inactive');
      setSelectedCampaigns([]);
      toast({
        title: "Thành công",
        description: `Đã tạm dừng ${selectedCampaigns.length} chiến dịch.`
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạm dừng chiến dịch. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  const openEditForm = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsFormOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản Lý Chiến Dịch</h2>
          <p className="text-gray-600">Cấu hình và quản lý các chiến dịch phát hành voucher</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo Chiến Dịch Mới
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm chiến dịch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Tạm dừng</SelectItem>
                  <SelectItem value="draft">Nháp</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Loại chiến dịch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="monthly">Hàng tháng</SelectItem>
                  <SelectItem value="promotion-batch">Đợt khuyến mãi</SelectItem>
                  <SelectItem value="ongoing">Liên tục</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Xuất Excel
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedCampaigns.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {selectedCampaigns.length} chiến dịch được chọn
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleBulkActivate}>
                    <Power className="w-4 h-4 mr-1" />
                    Kích hoạt
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleBulkDeactivate}>
                    <PowerOff className="w-4 h-4 mr-1" />
                    Tạm dừng
                  </Button>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Xóa
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Campaign Table */}
      <CampaignTable
        campaigns={filteredCampaigns}
        loading={loading}
        selectedCampaigns={selectedCampaigns}
        onSelectionChange={setSelectedCampaigns}
        onEdit={openEditForm}
        onDelete={handleDeleteCampaign}
      />

      {/* Campaign Form Modal */}
      <CampaignForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCampaign(null);
        }}
        onSubmit={editingCampaign ? handleEditCampaign : handleCreateCampaign}
        initialData={editingCampaign}
        mode={editingCampaign ? 'edit' : 'create'}
      />
    </div>
  );
}
