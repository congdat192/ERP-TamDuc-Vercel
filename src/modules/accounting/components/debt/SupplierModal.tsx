import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Supplier } from '../../types';

interface SupplierModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (supplier: Omit<Supplier, 'id'> & { id?: string }) => void;
    supplier?: Supplier | null;
}

export const SupplierModal: React.FC<SupplierModalProps> = ({
    isOpen,
    onClose,
    onSave,
    supplier,
}) => {
    const { register, handleSubmit, reset, setValue } = useForm<Supplier>();

    useEffect(() => {
        if (isOpen) {
            if (supplier) {
                setValue('name', supplier.name);
                setValue('code', supplier.code);
                setValue('phone', supplier.phone);
                setValue('email', supplier.email);
                setValue('taxCode', supplier.taxCode);
                setValue('address', supplier.address);
                setValue('contactPerson', supplier.contactPerson);
                setValue('initialDebt', supplier.initialDebt);
                setValue('notes', supplier.notes);
            } else {
                reset({
                    name: '',
                    code: '',
                    phone: '',
                    email: '',
                    taxCode: '',
                    address: '',
                    contactPerson: '',
                    initialDebt: 0,
                    notes: '',
                });
            }
        }
    }, [isOpen, supplier, setValue, reset]);

    const onSubmit = (data: Supplier) => {
        onSave({ ...data, id: supplier?.id });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{supplier ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Mã NCC</Label>
                            <Input id="code" {...register('code', { required: true })} placeholder="NCC001" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Tên Nhà Cung Cấp</Label>
                            <Input id="name" {...register('name', { required: true })} placeholder="Công ty ABC" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="taxCode">Mã số thuế</Label>
                            <Input id="taxCode" {...register('taxCode')} placeholder="030..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Số điện thoại</Label>
                            <Input id="phone" {...register('phone')} placeholder="090..." />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contactPerson">Người liên hệ</Label>
                            <Input id="contactPerson" {...register('contactPerson')} placeholder="Nguyễn Văn A" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register('email')} placeholder="contact@example.com" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Input id="address" {...register('address')} placeholder="123 Đường ABC..." />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="initialDebt">Nợ đầu kỳ</Label>
                        <Input
                            id="initialDebt"
                            type="number"
                            {...register('initialDebt', { valueAsNumber: true })}
                            disabled={!!supplier} // Disable editing initial debt for existing suppliers to avoid confusion
                        />
                        {supplier && <p className="text-xs text-gray-500">Không thể sửa nợ đầu kỳ sau khi tạo.</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Ghi chú</Label>
                        <Textarea id="notes" {...register('notes')} />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Lưu thông tin</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
