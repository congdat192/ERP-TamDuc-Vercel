import React, { useState, useMemo } from 'react';
import { History, Filter, Calendar, X, Wallet, Landmark, AlertCircle, Check, Trash2 } from 'lucide-react';
import { Transaction, TransactionType, FundType, Supplier, CategoryMap } from '../../types';
import { BRANCHES } from '../../constants';

interface TransactionTableProps {
    transactions: Transaction[];
    categories: CategoryMap;
    suppliers: Supplier[];
    onDelete: (id: string) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, categories, suppliers, onDelete }) => {
    // Filter State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterType, setFilterType] = useState<TransactionType | 'ALL'>('ALL');
    const [filterFundType, setFilterFundType] = useState<FundType | 'ALL'>('ALL');
    const [filterCategory, setFilterCategory] = useState<string>('ALL');
    const [filterStartDate, setFilterStartDate] = useState<string>('');
    const [filterEndDate, setFilterEndDate] = useState<string>('');

    const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val);

    // Derived Data
    const tableTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesType = filterType === 'ALL' || t.type === filterType;
            const matchesFundType = filterFundType === 'ALL' || t.fundType === filterFundType;
            const matchesCategory = filterCategory === 'ALL' || t.category === filterCategory;
            let matchesDate = true;
            if (filterStartDate) matchesDate = matchesDate && t.date >= filterStartDate;
            if (filterEndDate) matchesDate = matchesDate && t.date <= filterEndDate;
            return matchesType && matchesCategory && matchesDate && matchesFundType;
        });
    }, [transactions, filterType, filterCategory, filterStartDate, filterEndDate, filterFundType]);

    const availableCategories = useMemo(() => {
        if (filterType === 'ALL') return [...categories[TransactionType.INCOME], ...categories[TransactionType.EXPENSE]];
        return categories[filterType as TransactionType];
    }, [filterType, categories]);

    const isFilterActive = filterType !== 'ALL' || filterCategory !== 'ALL' || filterStartDate !== '' || filterEndDate !== '' || filterFundType !== 'ALL';

    const resetFilters = () => {
        setFilterType('ALL'); setFilterFundType('ALL'); setFilterCategory('ALL'); setFilterStartDate(''); setFilterEndDate('');
    };

    const applyDatePreset = (preset: 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH') => {
        const now = new Date();
        const formatDate = (d: Date) => d.toISOString().split('T')[0];
        let start = new Date(now), end = new Date(now);
        if (preset === 'THIS_WEEK') {
            const day = now.getDay(), diff = now.getDate() - day + (day === 0 ? -6 : 1);
            start.setDate(diff); end.setDate(start.getDate() + 6);
        } else if (preset === 'THIS_MONTH') {
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        }
        setFilterStartDate(formatDate(start)); setFilterEndDate(formatDate(end));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><History size={20} className="text-gray-400" /> Giao dịch</h3>
                    <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${isFilterOpen || isFilterActive ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200' : 'text-gray-600 hover:bg-gray-50 ring-1 ring-gray-200'}`}>
                        <Filter size={16} /> Bộ lọc {isFilterActive && <span className="w-2 h-2 rounded-full bg-indigo-500"></span>}
                    </button>
                </div>
            </div>
            {isFilterOpen && (
                <div className="bg-gray-50/80 p-5 border-b border-gray-100 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="text-xs font-semibold text-gray-500 uppercase mr-2 flex items-center gap-1"><Calendar size={12} /> Nhanh:</span>
                        <button onClick={() => applyDatePreset('TODAY')} className="px-3 py-1 text-xs bg-white border border-gray-200 rounded-full hover:bg-indigo-50 transition-colors">Hôm nay</button>
                        <button onClick={() => applyDatePreset('THIS_WEEK')} className="px-3 py-1 text-xs bg-white border border-gray-200 rounded-full hover:bg-indigo-50 transition-colors">Tuần này</button>
                        <button onClick={() => applyDatePreset('THIS_MONTH')} className="px-3 py-1 text-xs bg-white border border-gray-200 rounded-full hover:bg-indigo-50 transition-colors">Tháng này</button>
                        <div className="flex-1"></div>
                        {isFilterActive && <button onClick={resetFilters} className="text-sm text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"><X size={16} /> Xóa bộ lọc</button>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div><label className="block text-xs font-semibold text-gray-500 mb-1">Từ ngày</label><input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                        <div><label className="block text-xs font-semibold text-gray-500 mb-1">Đến ngày</label><input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                        <div><label className="block text-xs font-semibold text-gray-500 mb-1">Loại giao dịch</label><select value={filterType} onChange={(e) => { setFilterType(e.target.value as TransactionType | 'ALL'); setFilterCategory('ALL'); }} className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"><option value="ALL">Tất cả</option><option value={TransactionType.INCOME}>Thu</option><option value={TransactionType.EXPENSE}>Chi</option></select></div>
                        <div><label className="block text-xs font-semibold text-gray-500 mb-1">Loại quỹ</label><select value={filterFundType} onChange={(e) => setFilterFundType(e.target.value as FundType | 'ALL')} className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"><option value="ALL">Tất cả</option><option value={FundType.CASH}>Tiền mặt</option><option value={FundType.BANK}>Ngân hàng</option></select></div>
                        <div><label className="block text-xs font-semibold text-gray-500 mb-1">Danh mục</label><select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"><option value="ALL">Tất cả danh mục</option>{filterType === 'ALL' ? <><optgroup label="Thu">{categories[TransactionType.INCOME].map(cat => <option key={cat} value={cat}>{cat}</option>)}</optgroup><optgroup label="Chi">{categories[TransactionType.EXPENSE].map(cat => <option key={cat} value={cat}>{cat}</option>)}</optgroup></> : availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <th className="px-6 py-3 font-medium">Ngày</th>
                            <th className="px-6 py-3 font-medium">Chi nhánh</th>
                            <th className="px-6 py-3 font-medium">Quỹ/Trạng thái</th>
                            <th className="px-6 py-3 font-medium">Danh mục</th>
                            <th className="px-6 py-3 font-medium">Mô tả</th>
                            <th className="px-6 py-3 font-medium text-right">Số tiền</th>
                            <th className="px-6 py-3 font-medium text-center w-20">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {tableTransactions.length > 0 ? tableTransactions.slice(0, isFilterActive ? 50 : 10).map((tx) => (
                            <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{tx.date}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">{BRANCHES.find(b => b.id === tx.branchId)?.code || tx.branchId}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {tx.isDebt ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                                            <AlertCircle size={12} /> Ghi nợ
                                        </span>
                                    ) : tx.isDebtRepayment ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                            <Check size={12} /> Trả nợ
                                        </span>
                                    ) : tx.fundType === FundType.CASH ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"><Wallet size={12} /> Tiền mặt</span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100"><Landmark size={12} /> Ngân hàng</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tx.type === TransactionType.INCOME ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{tx.category}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                    {tx.supplierId && <span className="font-semibold text-gray-700 mr-1">[{suppliers.find(s => s.id === tx.supplierId)?.name || 'NCC'}]</span>}
                                    {tx.description}
                                </td>
                                <td className={`px-6 py-4 text-sm font-bold text-right whitespace-nowrap ${tx.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {tx.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(tx.amount)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => onDelete(tx.id)} title="Xóa" className="text-gray-400 hover:text-rose-500 transition-colors p-1 rounded-full hover:bg-rose-50"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        )) : <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">Không tìm thấy giao dịch nào phù hợp.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
