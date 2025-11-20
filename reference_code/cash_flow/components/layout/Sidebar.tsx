import React, { useMemo } from 'react';
import { LayoutDashboard, Building2, Settings, Plus, Check } from 'lucide-react';
import { BRANCHES } from '../../constants';
import { useSuppliers } from '../../hooks/useSuppliers';
import { useTransactions } from '../../hooks/useTransactions';
import { calculateSupplierDebts } from '../../utils/finance';

interface SidebarProps {
    viewMode: 'BRANCH' | 'SUPPLIER';
    selectedBranchId: string;
    selectedSupplierId: string | null;
    onSwitchBranch: (id: string) => void;
    onSwitchToSupplier: (id: string) => void;
    onOpenSupplierManager: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    viewMode,
    selectedBranchId,
    selectedSupplierId,
    onSwitchBranch,
    onSwitchToSupplier,
    onOpenSupplierManager,
}) => {
    const { suppliers } = useSuppliers();
    const { transactions } = useTransactions();

    const supplierDebts = useMemo(() => {
        return calculateSupplierDebts(transactions, suppliers);
    }, [transactions, suppliers]);

    const formatCompactCurrency = (val: number) => new Intl.NumberFormat('vi-VN', { notation: "compact", maximumFractionDigits: 1 }).format(val);

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-10 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3 shrink-0">
                <div className="bg-indigo-600 p-2 rounded-lg text-white">
                    <Building2 size={24} />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-gray-800">FinTrack</h1>
                    <p className="text-xs text-gray-500">Sổ quỹ hệ thống</p>
                </div>
            </div>

            <nav className="flex-1 flex flex-col p-4 overflow-hidden">
                <div className="flex-shrink-0 mb-2">
                    <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Phạm vi</p>
                    <button
                        onClick={() => onSwitchBranch('all')}
                        title="Xem số liệu toàn bộ công ty"
                        className={`w - full flex items - center gap - 3 px - 3 py - 2 rounded - lg text - sm font - medium transition - colors ${viewMode === 'BRANCH' && selectedBranchId === 'all' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'} `}
                    >
                        <LayoutDashboard size={18} /> Toàn hệ thống
                    </button>
                </div>

                <div className="flex-shrink-0 max-h-[35vh] overflow-y-auto mb-2">
                    <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 sticky top-0 bg-white z-10">Chi Nhánh</p>
                    {BRANCHES.map(branch => (
                        <button
                            key={branch.id}
                            onClick={() => onSwitchBranch(branch.id)}
                            className={`w - full flex items - center gap - 3 px - 3 py - 2 rounded - lg text - sm font - medium transition - colors ${viewMode === 'BRANCH' && selectedBranchId === branch.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'} `}
                        >
                            <span className={`w - 2 h - 2 rounded - full flex - shrink - 0 ${branch.isHeadOffice ? 'bg-amber-500' : 'bg-gray-300'} `} />
                            <span className="truncate text-left">{branch.name}</span>
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto min-h-0 border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between px-2 mb-2 sticky top-0 bg-white z-10">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nhà Cung Cấp</p>
                        <button onClick={onOpenSupplierManager} className="p-1 hover:bg-indigo-50 text-indigo-600 rounded transition-colors" title="Quản lý NCC">
                            <Settings size={14} />
                        </button>
                    </div>
                    <div className="space-y-1 pb-4">
                        {suppliers.map(s => {
                            const debt = supplierDebts[s.id] || 0;
                            const isActive = viewMode === 'SUPPLIER' && selectedSupplierId === s.id;
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => onSwitchToSupplier(s.id)}
                                    className={`w - full flex items - center justify - between px - 3 py - 2 rounded - lg text - sm transition - colors group ${isActive ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' : 'text-gray-600 hover:bg-gray-100'} `}
                                >
                                    <span className="truncate text-left flex-1 mr-2">{s.name}</span>
                                    <span className={`text - xs font - medium whitespace - nowrap ${debt > 0 ? 'text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded' : 'text-emerald-600'} `}>
                                        {debt > 0 ? formatCompactCurrency(debt) : <Check size={14} />}
                                    </span>
                                </button>
                            );
                        })}
                        {suppliers.length === 0 && (
                            <p className="px-3 text-xs text-gray-400 italic text-center py-2">Chưa có NCC</p>
                        )}
                        <button
                            onClick={onOpenSupplierManager}
                            className="w-full flex items-center gap-2 px-3 py-2 mt-2 rounded-lg text-xs font-medium text-indigo-600 hover:bg-indigo-50 border border-dashed border-indigo-200 justify-center"
                        >
                            <Plus size={14} /> Thêm mới
                        </button>
                    </div>
                </div>
            </nav>
        </aside>
    );
};
