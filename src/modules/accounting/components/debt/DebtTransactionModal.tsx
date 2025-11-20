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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Supplier, TransactionType, FundType } from '../../types';

interface DebtTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    mode: 'IMPORT' | 'REPAYMENT';
    suppliers: Supplier[];
    initialSupplierId?: string;
}

export const DebtTransactionModal: React.FC<DebtTransactionModalProps> = ({
    isOpen,
    onClose,
    onSave,
    mode,
    suppliers,
    initialSupplierId
}) => {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const selectedSupplierId = watch('supplierId');

    useEffect(() => {
        if (isOpen) {
            reset({
                date: new Date().toISOString().split('T')[0],
                amount: 0,
                description: '',
                supplierId: initialSupplierId || '',
                fundType: FundType.CASH // Default to CASH for repayment
            });
        }
    }, [isOpen, initialSupplierId, reset]);

    const onSubmit = (data: any) => {
        // Construct the transaction object based on mode
        const transactionData = {
            date: data.date,
            amount: Number(data.amount),
            description: data.description,
            supplierId: data.supplierId,
            branchId: 'all', // Or current branch if available via props
            // Mode specific fields
            type: mode === 'IMPORT' ? TransactionType.EXPENSE : TransactionType.EXPENSE, // Both are technically expenses logic-wise or handled specially
            isDebt: mode === 'IMPORT',
            isDebtRepayment: mode === 'REPAYMENT',
            fundType: mode === 'REPAYMENT' ? data.fundType : undefined, // Import doesn't use fund
        };

        onSave(transactionData);
        onClose();
    };

    const title = mode === 'IMPORT' ? 'Ghi nhận nợ (Nhập hàng)' : 'Thanh toán nợ NCC';
    const buttonText = mode === 'IMPORT' ? 'Lưu công nợ' : 'Xác nhận thanh toán';
    const buttonColor = mode === 'IMPORT' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-emerald-600 hover:bg-emerald-700';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Ngày giao dịch</Label>
                            <Input type="date" {...register('date', { required: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Số tiền</Label>
                            <Input type="number" {...register('amount', { required: true, min: 1 })} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Nhà cung cấp</Label>
                        <Select
                            value={selectedSupplierId}
                            onValueChange={(val) => setValue('supplierId', val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn nhà cung cấp" />
                            </SelectTrigger>
                            <SelectContent>
                                {suppliers.map(s => (
                                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {mode === 'REPAYMENT' && (
                        <div className="space-y-2">
                            <Label>Nguồn tiền</Label>
                            <Select
                                defaultValue={FundType.CASH}
                                onValueChange={(val) => setValue('fundType', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn nguồn tiền" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={FundType.CASH}>Tiền mặt</SelectItem>
                                    <SelectItem value={FundType.BANK}>Ngân hàng</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Diễn giải / Ghi chú</Label>
                        <Textarea
                            {...register('description')}
                            placeholder={mode === 'IMPORT' ? "Nhập hàng theo hóa đơn..." : "Thanh toán tiền hàng..."}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
                        <Button type="submit" className={buttonColor}>{buttonText}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
