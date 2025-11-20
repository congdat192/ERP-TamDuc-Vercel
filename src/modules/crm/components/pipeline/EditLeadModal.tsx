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
import { CRMLead } from '../../types/crm';

interface EditLeadModalProps {
    lead: CRMLead | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EditLeadModal({ lead, open, onOpenChange, onSuccess }: EditLeadModalProps) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        title: '',
        customer_name: '',
        customer_phone: '',
        value: '',
        source: 'Walk-in',
    });

    useEffect(() => {
        if (lead) {
            setFormData({
                title: lead.title,
                customer_name: lead.customer_name,
                customer_phone: lead.customer_phone,
                value: lead.value.toString(),
                source: lead.source,
            });
        }
    }, [lead]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lead) return;

        setLoading(true);

        try {
            await crmService.updateLead(lead.id, {
                ...formData,
                value: Number(formData.value),
                source: formData.source as any,
            });

            toast({
                title: 'Thành công',
                description: 'Đã cập nhật thông tin cơ hội.',
            });
            onOpenChange(false);
            onSuccess();
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: 'Không thể cập nhật cơ hội.',
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
                    <DialogTitle>Chỉnh sửa Cơ hội</DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin cho deal này.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-title" className="text-right">
                                Tiêu đề
                            </Label>
                            <Input
                                id="edit-title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                                Khách hàng
                            </Label>
                            <Input
                                id="edit-name"
                                value={formData.customer_name}
                                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                className="col-span-3"
                                required
                                disabled // Assuming we don't change customer link easily here
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-phone" className="text-right">
                                SĐT
                            </Label>
                            <Input
                                id="edit-phone"
                                value={formData.customer_phone}
                                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                                className="col-span-3"
                                required
                                disabled
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-value" className="text-right">
                                Giá trị
                            </Label>
                            <Input
                                id="edit-value"
                                type="number"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                className="col-span-3"
                                placeholder="VNĐ"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-source" className="text-right">
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
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
