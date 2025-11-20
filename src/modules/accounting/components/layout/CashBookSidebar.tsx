import React, { useState } from 'react';
import { LayoutGrid, Building2, MapPin, Users, Plus } from 'lucide-react';
import { BRANCHES } from '../../constants';
import { Supplier } from '../../types';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CashBookSidebarProps {
    selectedBranchId: string;
    onSelectBranch: (id: string) => void;
    suppliers: Supplier[];
}

export const CashBookSidebar: React.FC<CashBookSidebarProps> = ({
    selectedBranchId,
    onSelectBranch,
    suppliers
}) => {
    const [pendingBranchId, setPendingBranchId] = useState<string | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const handleBranchClick = (id: string) => {
        if (id === selectedBranchId) return;
        setPendingBranchId(id);
        setIsAlertOpen(true);
    };

    const confirmBranchChange = () => {
        if (pendingBranchId) {
            onSelectBranch(pendingBranchId);
        }
        setPendingBranchId(null);
        setIsAlertOpen(false);
    };

    return (
        <>
            <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col shrink-0">
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 font-bold text-indigo-600">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <Building2 size={20} />
                        </div>
                        <span>FinTrack</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-11">Sổ quỹ hệ thống</p>
                </div>

                <ScrollArea className="flex-1 py-4">
                    <div className="px-3 mb-6">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Phạm vi</h3>
                        <button
                            onClick={() => handleBranchClick('all')}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                selectedBranchId === 'all'
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-gray-600 hover:bg-gray-50"
                            )}
                        >
                            <LayoutGrid size={18} />
                            Toàn hệ thống
                        </button>
                    </div>

                    <div className="px-3 mb-6">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Chi nhánh</h3>
                        <div className="space-y-1">
                            {BRANCHES.map((branch) => (
                                <button
                                    key={branch.id}
                                    onClick={() => handleBranchClick(branch.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        selectedBranchId === branch.id
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        selectedBranchId === branch.id ? "bg-indigo-500" : "bg-gray-300"
                                    )} />
                                    <span className="truncate text-left">{branch.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="px-3">
                        <div className="flex items-center justify-between px-3 mb-3">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nhà cung cấp</h3>
                            <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400 hover:text-indigo-600">
                                <Plus size={14} />
                            </Button>
                        </div>
                        <div className="space-y-1">
                            {suppliers.slice(0, 5).map((supplier) => (
                                <div
                                    key={supplier.id}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer group"
                                >
                                    <span className="truncate">{supplier.name}</span>
                                    {supplier.initialDebt > 0 && (
                                        <span className="text-xs font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                                            {new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(supplier.initialDebt)}
                                        </span>
                                    )}
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 justify-start px-3">
                                + Thêm mới
                            </Button>
                        </div>
                    </div>
                </ScrollArea>
            </div>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận chuyển chi nhánh</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn chuyển sang xem dữ liệu của chi nhánh khác không?
                            Các bộ lọc hiện tại có thể sẽ được đặt lại.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmBranchChange}>Xác nhận</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
