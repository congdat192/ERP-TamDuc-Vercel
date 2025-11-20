import { useCallback, useEffect, useState } from 'react';
import { crmService } from '../services/crmService';
import { CRMCampaign } from '../types/crm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Gift, Zap, RefreshCw } from 'lucide-react';
import { CreateCampaignModal } from '../components/campaign/CreateCampaignModal';
import { EditCampaignModal } from '../components/campaign/EditCampaignModal';

export function CampaignPage() {
    const [campaigns, setCampaigns] = useState<CRMCampaign[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<CRMCampaign | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEditClick = (campaign: CRMCampaign) => {
        setSelectedCampaign(campaign);
        setShowEditModal(true);
    };

    const loadCampaigns = useCallback(async () => {
        setLoading(true);
        try {
            const data = await crmService.getCampaigns();
            setCampaigns(data);
        } catch (error) {
            console.error("Failed to load campaigns:", error);
            // Optionally, handle error display
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCampaigns();
    }, [loadCampaigns]);

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Chiến dịch & Voucher</h1>
                    <p className="text-sm text-gray-500">Quản lý các chương trình khuyến mãi và automation.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={loadCampaigns} disabled={loading}>
                        <RefreshCw className={`h - 4 w - 4 ${loading ? 'animate-spin' : ''} `} />
                    </Button>
                    <CreateCampaignModal onSuccess={loadCampaigns} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaigns.map((camp) => (
                    <Card
                        key={camp.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleEditClick(camp)}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {camp.type === 'voucher' ? 'Voucher Campaign' : 'Automation'}
                            </CardTitle>
                            {camp.type === 'voucher' ? <Gift className="h-4 w-4 text-pink-500" /> : <Zap className="h-4 w-4 text-blue-500" />}
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold mb-2">{camp.name}</div>
                            <div className="flex items-center gap-2 mb-4">
                                <Badge variant={camp.status === 'active' ? 'default' : 'secondary'}>
                                    {camp.status}
                                </Badge>
                                <span className="text-xs text-gray-500">Trigger: {camp.trigger_event}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-500">Đã gửi</div>
                                    <div className="font-semibold">{camp.sent_count}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Tỷ lệ chuyển đổi</div>
                                    <div className="font-semibold text-green-600">{camp.conversion_rate}%</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <EditCampaignModal
                campaign={selectedCampaign}
                open={showEditModal}
                onOpenChange={setShowEditModal}
                onSuccess={loadCampaigns}
            />
        </div>
    );
}
