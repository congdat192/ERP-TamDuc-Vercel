import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Building2, Wallet, Landmark, LayoutDashboard } from 'lucide-react';
import { StatCard } from './StatCard';
import { FinancialSummary } from '../../types';

interface StatCardsProps {
    stats: {
        global: FinancialSummary;
        headOffice: { cashBalance: number; bankBalance: number };
        branches: { cashBalance: number; bankBalance: number };
        totalPayable: number;
    };
    selectedBranchId: string;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats, selectedBranchId }) => {
    const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val);

    if (selectedBranchId === 'all') {
        return (
            <div className="space-y-6 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <StatCard title="Tổng Thu Hệ Thống" amount={stats.global.totalIncome} icon={TrendingUp} type="success" />
                    <StatCard title="Tổng Chi Hệ Thống" amount={stats.global.totalExpense} icon={TrendingDown} type="danger" />
                    <StatCard title="Nợ Phải Trả NCC" amount={stats.totalPayable} icon={AlertCircle} type="neutral" trend="Công nợ hiện tại" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* HO Funds */}
                    <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm">
                        <h3 className="text-sm font-semibold text-indigo-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                            <Building2 size={16} className="text-indigo-600" /> Sổ Quỹ Văn Phòng Tổng
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                                <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><Wallet size={16} /> Quỹ Tiền Mặt</div>
                                <div className="text-lg font-bold text-gray-800">{formatCurrency(stats.headOffice.cashBalance)}</div>
                            </div>
                            <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                                <div className="flex items-center gap-2 mb-2 text-purple-700 font-medium text-sm"><Landmark size={16} /> Quỹ Ngân Hàng</div>
                                <div className="text-lg font-bold text-gray-800">{formatCurrency(stats.headOffice.bankBalance)}</div>
                            </div>
                        </div>
                    </div>
                    {/* Branch Funds */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
                            <LayoutDashboard size={16} className="text-gray-500" /> Sổ Quỹ Khối Chi Nhánh
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                                <div className="flex items-center gap-2 mb-2 text-gray-600 font-medium text-sm"><Wallet size={16} /> Quỹ Tiền Mặt</div>
                                <div className="text-lg font-bold text-gray-800">{formatCurrency(stats.branches.cashBalance)}</div>
                            </div>
                            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                                <div className="flex items-center gap-2 mb-2 text-gray-600 font-medium text-sm"><Landmark size={16} /> Quỹ Ngân Hàng</div>
                                <div className="text-lg font-bold text-gray-800">{formatCurrency(stats.branches.bankBalance)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            <StatCard title="Tổng Thu" amount={stats.global.totalIncome} icon={TrendingUp} type="success" />
            <StatCard title="Tổng Chi" amount={stats.global.totalExpense} icon={TrendingDown} type="danger" />
            <StatCard title="Nợ Phải Trả" amount={stats.totalPayable} icon={AlertCircle} type="neutral" />
            <StatCard title="Quỹ Tiền Mặt" amount={stats.global.cashBalance} icon={Wallet} type="neutral" />
            <StatCard title="Quỹ Ngân Hàng" amount={stats.global.bankBalance} icon={Landmark} type="neutral" />
        </div>
    );
};
