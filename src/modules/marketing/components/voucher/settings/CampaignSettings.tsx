import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { voucherService, type VoucherCampaign } from '../../../services/voucherService';
import { toast } from 'sonner';
import { CampaignDialog } from './CampaignDialog';

export function CampaignSettings() {
  const [campaigns, setCampaigns] = useState<VoucherCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<VoucherCampaign | null>(null);

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
        {isLoading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : (
          <div className="space-y-2">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{campaign.name}</div>
                  <div className="text-sm text-muted-foreground">ID: {campaign.campaign_id}</div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setEditingCampaign(campaign);
                    setDialogOpen(true);
                  }}
                >
                  Sửa
                </Button>
              </div>
            ))}
          </div>
        )}
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
