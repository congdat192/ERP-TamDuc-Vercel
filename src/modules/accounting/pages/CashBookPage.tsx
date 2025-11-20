import React, { useState, useMemo } from 'react';
import { CashBookProvider, useCashBook } from '../contexts/CashBookContext';
import { StatCards } from '../components/dashboard/StatCards';
import { Charts } from '../components/dashboard/Charts';
import { TransactionTable } from '../components/dashboard/TransactionTable';
import { TransactionModal } from '../components/modals/TransactionModal';
import { CashBookSidebar } from '../components/layout/CashBookSidebar';
import { calculateStats } from '../utils/finance';
import { TransactionType } from '../types';
import { BRANCHES } from '../constants';
import { Plus, Download, Settings, Sparkles, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";

const CashBookContent: React.FC = () => {
    const { transactions, suppliers, categories, addTransactions, deleteTransaction } = useCashBook();

    // UI State
    const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialTransactionType, setInitialTransactionType] = useState<TransactionType>(TransactionType.INCOME);

    // Calculate Stats
    const stats = useMemo(() => {
        return calculateStats(transactions, suppliers, selectedBranchId);
    }, [transactions, suppliers, selectedBranchId]);

    const handleOpenTransactionModal = (type: TransactionType) => {
        setInitialTransactionType(type);
        setIsModalOpen(true);
    };

    const currentBranch = useMemo(() => BRANCHES.find(b => b.id === selectedBranchId), [selectedBranchId]);
    const pageTitle = selectedBranchId === 'all' ? 'Tổng quan tài chính' : currentBranch?.name || 'Chi nhánh';
    const pageSubtitle = selectedBranchId === 'all' ? 'Quản lý thu chi, công nợ và dòng tiền' : `Mã chi nhánh: ${currentBranch?.code}`;

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-gray-50">
            {/* Left Sidebar */}
            <CashBookSidebar
                selectedBranchId={selectedBranchId}
                onSelectBranch={setSelectedBranchId}
                suppliers={suppliers}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
                            <p className="text-gray-500">{pageSubtitle}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Button variant="outline" size="icon" className="bg-white">
                                <Settings size={18} className="text-gray-600" />
                            </Button>

                            <Button variant="outline" className="bg-white gap-2 text-gray-700">
                                <FileText size={16} /> Báo cáo
                            </Button>

                            <Button variant="outline" className="bg-white gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                                <Sparkles size={16} /> AI Phân Tích
                            </Button>

                            <Button
                                onClick={() => handleOpenTransactionModal(TransactionType.INCOME)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm shadow-emerald-200"
                            >
                                <Plus size={16} /> Phiếu Thu
                            </Button>

                            <Button
                                onClick={() => handleOpenTransactionModal(TransactionType.EXPENSE)}
                                className="bg-rose-600 hover:bg-rose-700 text-white gap-2 shadow-sm shadow-rose-200"
                            >
                                <Plus size={16} /> Phiếu Chi
                            </Button>
                        </div>
                    </div>

                    {/* Dashboard Content */}
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <StatCards stats={stats} selectedBranchId={selectedBranchId} />

                        <Charts
                            transactions={stats.branchTransactions}
                            selectedBranchId={selectedBranchId}
                            stats={stats}
                        />

                        <TransactionTable
                            transactions={stats.branchTransactions}
                            categories={categories}
                            suppliers={suppliers}
                            onDelete={deleteTransaction}
                        />
                    </div>
                </div>
            </div>

            {/* Modals */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={addTransactions}
                initialType={initialTransactionType}
                initialBranchId={selectedBranchId}
                categories={categories}
            />
        </div>
    );
};

const CashBookPage: React.FC = () => {
    return (
        <CashBookProvider>
            <div className="min-h-screen bg-gray-50">
                <CashBookContent />
            </div>
        </CashBookProvider>
    );
};

export default CashBookPage;
