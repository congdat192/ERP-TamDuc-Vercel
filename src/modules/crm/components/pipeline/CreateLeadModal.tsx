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

interface CreateLeadModalProps {
    onSuccess: () => void;
}

export function CreateLeadModal({ onSuccess }: CreateLeadModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        title: '',
        customer_name: '',
        customer_phone: '',
        value: '',
        source: 'Walk-in',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await crmService.createLead({
                ...formData,
                customer_id: Math.floor(Math.random() * 1000), // Mock ID
                pipeline_id: 1,
                stage_id: 1, // Default to 'New'
                value: Number(formData.value),
                source: formData.source as any,
            });

            toast({
                title: 'Thành công',
                description: 'Đã tạo cơ hội mới.',
            });
            setOpen(false);
            setFormData({
                title: '',
                customer_name: '',
                customer_phone: '',
                value: '',
                source: 'Walk-in',
            });
            onSuccess();
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: 'Không thể tạo cơ hội.',
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
                    <Plus className="h-4 w-4 mr-2" /> Thêm Cơ hội
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Thêm Cơ hội Mới</DialogTitle>
                    <DialogDescription>
                        Tạo một deal mới trong pipeline bán hàng.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Tiêu đề
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="col-span-3"
                                placeholder="VD: Mua kính Rayban"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Khách hàng
                            </Label>
                            <Input
                                id="name"
                                value={formData.customer_name}
                                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                                SĐT
                            </Label>
                            <Input
                                id="phone"
                                value={formData.customer_phone}
                                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="value" className="text-right">
                                Giá trị
                            </Label>
                            <Input
                                id="value"
                                type="number"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                className="col-span-3"
                                placeholder="VNĐ"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="source" className="text-right">
                                Nguồn
                            </Label>
                            <Select
                                value={formData.source}
                                onValueChange={(value) => setFormData({ ...formData, source: value })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Chọn nguồn" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Walk-in">Walk-in (Tại quầy)</SelectItem>
                                    <SelectItem value="Facebook">Facebook</SelectItem>
                                    <SelectItem value="Zalo">Zalo</SelectItem>
                                    <SelectItem value="Web">Website</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Đang tạo...' : 'Tạo mới'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
