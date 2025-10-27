import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit } from 'lucide-react';
import { voucherService, type VoucherCampaign } from '../../../services/voucherService';
import { toast } from 'sonner';
import { CampaignDialog } from './CampaignDialog';

interface CampaignItemProps {
  campaign: VoucherCampaign;
  onEdit: (campaign: VoucherCampaign) => void;
  onToggle: (campaign: VoucherCampaign) => void;
}

function CampaignItem({ campaign, onEdit, onToggle }: CampaignItemProps) {
  return (
    <div 
      className={`flex items-center justify-between p-3 border rounded-lg transition-opacity ${
        !campaign.is_active ? 'opacity-50 bg-muted/30' : ''
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Campaign Info */}
        <div className="flex-1">
          <div className="font-medium flex items-center gap-2">
            {campaign.name}
            {!campaign.is_active && (
              <span className="text-xs bg-muted px-2 py-0.5 rounded">
                Đã tắt
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            ID: {campaign.campaign_id}
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {campaign.is_active ? 'Bật' : 'Tắt'}
          </span>
          <Switch
            checked={campaign.is_active}
            onCheckedChange={() => onToggle(campaign)}
          />
        </div>
      </div>

      {/* Edit Button */}
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onEdit(campaign)}
        className="ml-4"
      >
        <Edit className="w-4 h-4 mr-1" />
        Sửa
      </Button>
    </div>
  );
}

export function CampaignSettings() {
  const [campaigns, setCampaigns] = useState<VoucherCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<VoucherCampaign | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await voucherService.getCampaigns();
      setCampaigns(data);
    } catch (error) {
      toast.error('Không thể tải danh sách chiến dịch');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    loadCampaigns();
    setDialogOpen(false);
    setEditingCampaign(null);
  };

  const handleToggleActive = async (campaign: VoucherCampaign) => {
    try {
      const newStatus = !campaign.is_active;
      await voucherService.updateCampaign(campaign.id, { 
        is_active: newStatus 
      });
      
      toast.success(
        campaign.is_active 
          ? 'Đã tắt chiến dịch' 
          : 'Đã bật chiến dịch'
      );
      
      // Auto-switch tab
      if (newStatus) {
        setActiveTab('active');
      } else {
        setActiveTab('inactive');
      }
      
      loadCampaigns();
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  // Filter campaigns
  const activeCampaigns = campaigns.filter(c => c.is_active);
  const inactiveCampaigns = campaigns.filter(c => !c.is_active);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Quản lý Chiến dịch Voucher</CardTitle>
        <Button onClick={() => setDialogOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Tạo chiến dịch
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'inactive')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="active">
              Đang hoạt động
              <span className="ml-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full text-xs font-medium">
                {activeCampaigns.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Đã tắt
              <span className="ml-2 bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                {inactiveCampaigns.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {isLoading ? (
              <div className="text-center py-8">Đang tải...</div>
            ) : activeCampaigns.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có chiến dịch nào đang hoạt động
              </div>
            ) : (
              <div className="space-y-2">
                {activeCampaigns.map((campaign) => (
                  <CampaignItem 
                    key={campaign.id} 
                    campaign={campaign}
                    onEdit={(c) => { setEditingCampaign(c); setDialogOpen(true); }}
                    onToggle={handleToggleActive}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="inactive">
            {isLoading ? (
              <div className="text-center py-8">Đang tải...</div>
            ) : inactiveCampaigns.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có chiến dịch nào bị tắt
              </div>
            ) : (
              <div className="space-y-2">
                {inactiveCampaigns.map((campaign) => (
                  <CampaignItem 
                    key={campaign.id} 
                    campaign={campaign}
                    onEdit={(c) => { setEditingCampaign(c); setDialogOpen(true); }}
                    onToggle={handleToggleActive}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <CampaignDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        campaign={editingCampaign}
        onSave={handleSave}
      />
    </Card>
  );
}
