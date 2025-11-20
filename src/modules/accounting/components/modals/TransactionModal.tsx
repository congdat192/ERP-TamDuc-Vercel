import React, { useState, useEffect } from 'react';
import { X, Check, Wallet, CreditCard, Repeat } from 'lucide-react';
import { Transaction, TransactionType, FundType, RecurrenceFrequency, CategoryMap } from '../../types';
import { BRANCHES } from '../../constants';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (transactions: Omit<Transaction, 'id'>[]) => void;
    initialBranchId?: string;
    initialType?: TransactionType;
    categories: CategoryMap;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialBranchId,
    initialType,
    categories,
}) => {
    // Basic Transaction State
    const [type, setType] = useState<TransactionType>(TransactionType.INCOME);
    const [fundType, setFundType] = useState<FundType>(FundType.BANK);
    const [amount, setAmount] = useState<string>('');
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState<string>('');
    const [branchId, setBranchId] = useState<string>(initialBranchId || BRANCHES[0].id);
    const [description, setDescription] = useState<string>('');

    // Recurring State
    const [isRecurring, setIsRecurring] = useState(false);
    const [frequency, setFrequency] = useState<RecurrenceFrequency>(RecurrenceFrequency.MONTHLY);
    const [endDate, setEndDate] = useState<string>('');

    // Initialize form when modal opens
    useEffect(() => {
        if (isOpen) {
            setType(initialType || TransactionType.INCOME);
            setBranchId(initialBranchId && initialBranchId !== 'all' ? initialBranchId : BRANCHES[0].id);

            // Reset fields
            setAmount('');
            setDescription('');
            setDate(new Date().toISOString().split('T')[0]);
            setIsRecurring(false);
            setEndDate('');

            // Default to first category
            const targetCategories = categories[initialType || TransactionType.INCOME];
            if (targetCategories && targetCategories.length > 0) {
                setCategory(targetCategories[0]);
            }
        }
    }, [isOpen, initialBranchId, initialType, categories]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) return;

        const baseTransaction = {
            date,
            amount: numAmount,
            type,
            fundType,
            category,
            branchId,
            description,
            isDebt: false,
            isDebtRepayment: false
        };

        if (isRecurring && endDate) {
            const transactions: Omit<Transaction, 'id'>[] = [];
            let currentDate = new Date(date);
            const end = new Date(endDate);

            while (currentDate <= end) {
                transactions.push({
                    ...baseTransaction,
                    date: currentDate.toISOString().split('T')[0]
                });

                // Increment date
                if (frequency === RecurrenceFrequency.DAILY) currentDate.setDate(currentDate.getDate() + 1);
                if (frequency === RecurrenceFrequency.WEEKLY) currentDate.setDate(currentDate.getDate() + 7);
                if (frequency === RecurrenceFrequency.MONTHLY) currentDate.setMonth(currentDate.getMonth() + 1);
            }
            onSave(transactions);
        } else {
            onSave([baseTransaction]);
        }
        onClose();
    };

    const isExpense = type === TransactionType.EXPENSE;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className={isExpense ? 'text-rose-600' : 'text-emerald-600'}>
                        {isExpense ? 'Phiếu Chi (Expense)' : 'Phiếu Thu (Income)'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSave} className="space-y-5 py-4">

                    {/* Amount & Date Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs uppercase text-gray-500 mb-1">Số tiền</Label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    required
                                    min="0"
                                    step="1000"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="pl-3 pr-12 font-bold"
                                    placeholder="0"
                                />
                                <span className="absolute right-3 top-2.5 text-gray-400 text-sm font-medium">VND</span>
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs uppercase text-gray-500 mb-1">Ngày giao dịch</Label>
                            <Input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Branch & Fund Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs uppercase text-gray-500 mb-1">Chi nhánh</Label>
                            <select
                                value={branchId}
                                onChange={(e) => setBranchId(e.target.value)}
                                disabled={!!initialBranchId && initialBranchId !== 'all'}
                                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                            >
                                {BRANCHES.map(b => (
                                    <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label className="text-xs uppercase text-gray-500 mb-1">Nguồn tiền</Label>
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setFundType(FundType.CASH)}
                                    title="Tiền mặt"
                                    className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-xs font-medium transition-all ${fundType === FundType.CASH ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
                                >
                                    <Wallet size={14} className="mr-1" /> TM
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFundType(FundType.BANK)}
                                    title="Ngân hàng"
                                    className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-xs font-medium transition-all ${fundType === FundType.BANK ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
                                >
                                    <CreditCard size={14} className="mr-1" /> NH
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div>
                        <Label className="text-xs uppercase text-gray-500 mb-1">Danh mục</Label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        >
                            {categories[type].map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <Label className="text-xs uppercase text-gray-500 mb-1">Mô tả / Ghi chú</Label>
                        <Textarea
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="resize-none"
                            placeholder="Chi tiết giao dịch..."
                        />
                    </div>

                    {/* Recurring Options */}
                    <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2 mb-3">
                            <input
                                type="checkbox"
                                id="recurring"
                                checked={isRecurring}
                                onChange={(e) => setIsRecurring(e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="recurring" className="text-sm font-medium text-gray-700 flex items-center gap-1 cursor-pointer" title="Tạo giao dịch lặp lại tự động">
                                <Repeat size={14} /> Lặp lại giao dịch này
                            </label>
                        </div>

                        {isRecurring && (
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg animate-in slide-in-from-top-2">
                                <div>
                                    <Label className="text-xs text-gray-500 mb-1">Tần suất</Label>
                                    <select
                                        value={frequency}
                                        onChange={(e) => setFrequency(e.target.value as RecurrenceFrequency)}
                                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none"
                                    >
                                        <option value={RecurrenceFrequency.DAILY}>Hàng ngày</option>
                                        <option value={RecurrenceFrequency.WEEKLY}>Hàng tuần</option>
                                        <option value={RecurrenceFrequency.MONTHLY}>Hàng tháng</option>
                                    </select>
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-500 mb-1">Kết thúc</Label>
                                    <Input
                                        type="date"
                                        required
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="h-8"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className={`w-full font-bold ${isExpense ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                    >
                        <Check size={20} className="mr-2" />
                        {isRecurring ? 'Lưu Giao Dịch Lặp Lại' : 'Lưu Giao Dịch'}
                    </Button>

                </form>
            </DialogContent>
        </Dialog>
    );
};
