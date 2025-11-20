import React from 'react';
import { Settings, FileText, Sparkles, PlusCircle, MinusCircle } from 'lucide-react';
import { BRANCHES } from '../../constants';
import { TransactionType } from '../../types';

interface HeaderProps {
    viewMode: 'BRANCH' | 'SUPPLIER';
    selectedBranchId: string;
    onSwitchBranch: (id: string) => void;
    onOpenCategoryManager: () => void;
    onOpenReportModal: () => void;
    onAnalyze: () => void;
    onOpenTransactionModal: (type: TransactionType) => void;
}

export const Header: React.FC<HeaderProps> = ({
    viewMode,
    selectedBranchId,
    onSwitchBranch,
    onOpenCategoryManager,
    onOpenReportModal,
    onAnalyze,
    onOpenTransactionModal,
}) => {
    return (
        <>
            {/* Header Mobile */}
            <div className="md:hidden flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-gray-800">FinTrack</h1>
                <select
                    className="bg-white border border-gray-300 rounded-md text-sm py-1 px-2"
                    value={selectedBranchId}
                    onChange={(e) => onSwitchBranch(e.target.value)}
                >
                    <option value="all">Toàn bộ</option>
                    {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </div>

            {/* Top Bar Actions (Always Visible) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                {/* Title Dynamic based on View Mode */}
                <div>
                    {viewMode === 'BRANCH' ? (
                        <>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {selectedBranchId === 'all' ? 'Tổng quan tài chính' : BRANCHES.find(b => b.id === selectedBranchId)?.name}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">Quản lý thu chi, công nợ và dòng tiền</p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-indigo-900">
                                Quản lý công nợ
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">Chi tiết giao dịch nhà cung cấp</p>
                        </>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button onClick={onOpenCategoryManager} className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all shadow-sm" title="Quản lý danh mục">
                        <Settings size={18} />
                    </button>
                    <button onClick={onOpenReportModal} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm font-medium">
                        <FileText size={18} /> <span className="hidden sm:inline">Báo cáo</span>
                    </button>
                    {viewMode === 'BRANCH' && (
                        <button onClick={onAnalyze} className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all shadow-sm font-medium">
                            <Sparkles size={18} /> <span className="hidden sm:inline">AI Phân Tích</span>
                        </button>
                    )}

                    <button onClick={() => onOpenTransactionModal(TransactionType.INCOME)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200 font-medium">
                        <PlusCircle size={18} /> <span className="hidden sm:inline">Phiếu Thu</span> <span className="sm:hidden">Thu</span>
                    </button>
                    <button onClick={() => onOpenTransactionModal(TransactionType.EXPENSE)} className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all shadow-md shadow-rose-200 font-medium">
                        <MinusCircle size={18} /> <span className="hidden sm:inline">Phiếu Chi</span> <span className="sm:hidden">Chi</span>
                    </button>
                </div>
            </div>
        </>
    );
};
