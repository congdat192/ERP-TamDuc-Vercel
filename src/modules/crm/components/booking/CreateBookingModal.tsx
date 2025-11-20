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

interface CreateBookingModalProps {
    onSuccess: () => void;
}

export function CreateBookingModal({ onSuccess }: CreateBookingModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        booking_date: '',
        booking_time: '',
        type: 'eye_exam',
        branch_id: '1',
        notes: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Combine date and time
            const appointmentTime = new Date(`${formData.booking_date}T${formData.booking_time}`);

            await crmService.createBooking({
                customer_id: Math.floor(Math.random() * 1000), // Mock ID
                customer_name: formData.customer_name,
                customer_phone: formData.customer_phone,
                booking_date: appointmentTime.toISOString(),
                type: formData.type as any,
                branch_id: Number(formData.branch_id),
                branch_name: formData.branch_id === '1' ? 'Chi nhánh Quận 1' : formData.branch_id === '2' ? 'Chi nhánh Thủ Đức' : 'Chi nhánh Gò Vấp',
                status: 'pending',
                note: formData.notes,
            });

            toast({
                title: 'Thành công',
                description: 'Đã đặt lịch hẹn mới.',
            });
            setOpen(false);
            setFormData({
                customer_name: '',
                customer_phone: '',
                booking_date: '',
                booking_time: '',
                type: 'eye_exam',
                branch_id: '1',
                notes: '',
            });
            onSuccess();
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: 'Không thể đặt lịch hẹn.',
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
                    <Plus className="h-4 w-4 mr-2" /> Đặt Lịch Hẹn
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Đặt Lịch Hẹn Mới</DialogTitle>
                    <DialogDescription>
                        Tạo lịch hẹn khám mắt hoặc bảo hành cho khách hàng.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
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
                            <Label htmlFor="date" className="text-right">
                                Ngày
                            </Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.booking_date}
                                onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="time" className="text-right">
                                Giờ
                            </Label>
                            <Input
                                id="time"
                                type="time"
                                value={formData.booking_time}
                                onChange={(e) => setFormData({ ...formData, booking_time: e.target.value })}
                                className="col-span-3"
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
                                    <SelectValue placeholder="Chọn loại lịch hẹn" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="adjustment">Chỉnh kính</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="branch" className="text-right">
                                Chi nhánh
                            </Label>
                            <Select
                                value={formData.branch_id}
                                onValueChange={(value) => setFormData({ ...formData, branch_id: value })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Chọn chi nhánh" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Chi nhánh Quận 1</SelectItem>
                                    <SelectItem value="2">Chi nhánh Thủ Đức</SelectItem>
                                    <SelectItem value="3">Chi nhánh Gò Vấp</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="notes" className="text-right">
                                Ghi chú
                            </Label>
                            <Input
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Đang lưu...' : 'Lưu lịch hẹn'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
