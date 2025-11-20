import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { crmService } from '../../services/crmService';
import { useToast } from '@/hooks/use-toast';
import { CRMCampaign } from '../../types/crm';

interface EditCampaignModalProps {
    campaign: CRMCampaign | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EditCampaignModal({ campaign, open, onOpenChange, onSuccess }: EditCampaignModalProps) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        type: 'voucher',
        status: 'draft',
        trigger_event: '',
    });

    useEffect(() => {
        if (campaign) {
            setFormData({
                name: campaign.name,
                type: campaign.type,
                status: campaign.status,
                trigger_event: campaign.trigger_event || '',
            });
        }
    }, [campaign]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!campaign) return;

        setLoading(true);

        try {
            await crmService.updateCampaign(campaign.id, {
                name: formData.name,
                type: formData.type as any,
                status: formData.status as any,
                trigger_event: formData.trigger_event,
            });

            toast({
                title: 'Thành công',
                description: 'Đã cập nhật chiến dịch.',
            });
            onOpenChange(false);
            onSuccess();
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: 'Không thể cập nhật chiến dịch.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa Chiến dịch</DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin chiến dịch hoặc voucher.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-camp-name" className="text-right">
                                Tên
                            </Label>
                            <Input
                                id="edit-camp-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-camp-type" className="text-right">
                                Loại
                            </Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Chọn loại" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="voucher">Voucher</SelectItem>
                                    <SelectItem value="automation">Automation</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-camp-status" className="text-right">
                                Trạng thái
                            </Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Nháp</SelectItem>
                                    <SelectItem value="active">Đang chạy</SelectItem>
                                    <SelectItem value="paused">Tạm dừng</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-camp-trigger" className="text-right">
                                Trigger
                            </Label>
                            <Input
                                id="edit-camp-trigger"
                                value={formData.trigger_event}
                                onChange={(e) => setFormData({ ...formData, trigger_event: e.target.value })}
                                className="col-span-3"
                                placeholder="VD: order.success"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
