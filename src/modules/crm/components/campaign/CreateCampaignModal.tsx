import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Plus } from 'lucide-react';

interface CreateCampaignModalProps {
    onSuccess: () => void;
}

export function CreateCampaignModal({ onSuccess }: CreateCampaignModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        type: 'voucher',
        trigger_event: 'manual',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await crmService.createCampaign({
                name: formData.name,
                type: formData.type as any,
                status: 'active',
                trigger_event: formData.trigger_event,
                sent_count: 0,
                conversion_rate: 0,
            });

            toast({
                title: 'Thành công',
                description: 'Đã tạo chiến dịch mới.',
            });
            setOpen(false);
            setFormData({
                name: '',
                type: 'voucher',
                trigger_event: 'manual',
            });
            onSuccess();
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: 'Không thể tạo chiến dịch.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" /> Tạo Chiến Dịch
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tạo Chiến Dịch Mới</DialogTitle>
                    <DialogDescription>
                        Tạo chiến dịch voucher hoặc automation gửi tin nhắn.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Tên chiến dịch
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="col-span-3"
                                placeholder="VD: Khuyến mãi tháng 11"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                Loại
                            </Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Chọn loại chiến dịch" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="voucher">Voucher</SelectItem>
                                    <SelectItem value="automation">Automation (SMS/ZNS)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="trigger" className="text-right">
                                Sự kiện kích hoạt
                            </Label>
                            <Select
                                value={formData.trigger_event}
                                onValueChange={(value) => setFormData({ ...formData, trigger_event: value })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Chọn sự kiện" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="manual">Thủ công (Gửi ngay)</SelectItem>
                                    <SelectItem value="birthday_month">Sinh nhật trong tháng</SelectItem>
                                    <SelectItem value="last_purchase_90_days">Mua hàng &gt; 90 ngày</SelectItem>
                                    <SelectItem value="new_customer">Khách hàng mới</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Đang tạo...' : 'Tạo chiến dịch'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
