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
import { Textarea } from '@/components/ui/textarea';
import { crmService } from '../../services/crmService';
import { useToast } from '@/hooks/use-toast';
import { CRMBooking } from '../../types/crm';

interface EditBookingModalProps {
    booking: CRMBooking | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EditBookingModal({ booking, open, onOpenChange, onSuccess }: EditBookingModalProps) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        booking_date: '',
        status: 'pending',
        note: '',
    });

    useEffect(() => {
        if (booking) {
            // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
            const date = new Date(booking.booking_date);
            const formattedDate = date.toISOString().slice(0, 16);

            setFormData({
                booking_date: formattedDate,
                status: booking.status,
                note: booking.note || '',
            });
        }
    }, [booking]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!booking) return;

        setLoading(true);

        try {
            await crmService.updateBooking(booking.id, {
                booking_date: new Date(formData.booking_date).toISOString(),
                status: formData.status as any,
                note: formData.note,
            });

            toast({
                title: 'Thành công',
                description: 'Đã cập nhật lịch hẹn.',
            });
            onOpenChange(false);
            onSuccess();
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: 'Không thể cập nhật lịch hẹn.',
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
                    <DialogTitle>Cập nhật Lịch hẹn</DialogTitle>
                    <DialogDescription>
                        Thay đổi trạng thái hoặc dời lịch hẹn.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Khách hàng</Label>
                            <div className="col-span-3 font-medium">
                                {booking?.customer_name}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-date" className="text-right">
                                Thời gian
                            </Label>
                            <Input
                                id="edit-date"
                                type="datetime-local"
                                value={formData.booking_date}
                                onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-status" className="text-right">
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
                                    <SelectItem value="pending">Chờ xác nhận</SelectItem>
                                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                                    <SelectItem value="completed">Hoàn thành</SelectItem>
                                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-note" className="text-right">
                                Ghi chú
                            </Label>
                            <Textarea
                                id="edit-note"
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                className="col-span-3"
                                placeholder="Ghi chú thêm..."
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
