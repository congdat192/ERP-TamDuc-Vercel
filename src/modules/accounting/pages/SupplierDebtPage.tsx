import React, { useState, useMemo } from 'react';
import { CashBookProvider, useCashBook } from '../contexts/CashBookContext';
import { DebtStats } from '../components/debt/DebtStats';
import { SupplierTable } from '../components/debt/SupplierTable';
import { SupplierModal } from '../components/debt/SupplierModal';
import { DebtTransactionModal } from '../components/debt/DebtTransactionModal';
import { calculateStats, calculateSupplierDebts } from '../utils/finance';
import { Supplier, TransactionType } from '../types';
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload } from 'lucide-react';

const SupplierDebtContent: React.FC = () => {
    const { transactions, suppliers, addTransactions, updateSuppliers } = useCashBook();

    // UI State
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
    const [debtModalMode, setDebtModalMode] = useState<'IMPORT' | 'REPAYMENT'>('IMPORT');
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [selectedSupplierForDebt, setSelectedSupplierForDebt] = useState<Supplier | null>(null);

    // Derived Data
    const debtMap = useMemo(() => calculateSupplierDebts(transactions, suppliers), [transactions, suppliers]);

    const stats = useMemo(() => {
        const { totalPayable } = calculateStats(transactions, suppliers, 'all').global;

        // Calculate monthly stats
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        let newDebt = 0;
        let repaid = 0;

        transactions.forEach(t => {
            const tDate = new Date(t.date);
            if (tDate.getMonth() === thisMonth && tDate.getFullYear() === thisYear) {
                if (t.isDebt) newDebt += t.amount;
                if (t.isDebtRepayment) repaid += t.amount;
            }
        });

        return { totalPayable, newDebt, repaid };
    }, [transactions, suppliers]);

    // Handlers
    const handleAddSupplier = () => {
        setEditingSupplier(null);
        setIsSupplierModalOpen(true);
    };

    const handleEditSupplier = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setIsSupplierModalOpen(true);
    };

    const handleSaveSupplier = (data: any) => {
        if (data.id) {
            // Update existing
            const updatedSuppliers = suppliers.map(s => s.id === data.id ? { ...s, ...data } : s);
            updateSuppliers(updatedSuppliers);
        } else {
            // Create new
            const newSupplier = {
                ...data,
                id: `s${Date.now()}`, // Simple ID generation
            };
            updateSuppliers([...suppliers, newSupplier]);
        }
    };

    const handleImportDebt = () => {
        setDebtModalMode('IMPORT');
        setSelectedSupplierForDebt(null);
        setIsDebtModalOpen(true);
    };

    const handlePayDebt = (supplier?: Supplier) => {
        setDebtModalMode('REPAYMENT');
        setSelectedSupplierForDebt(supplier || null);
        setIsDebtModalOpen(true);
    };

    const handleSaveDebtTransaction = (transactionData: any) => {
        addTransactions(transactionData);
    };

    return (
        <div className="space-y-6 p-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Công Nợ Nhà Cung Cấp</h1>
                    <p className="text-gray-500">Theo dõi công nợ, nhập hàng và thanh toán</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <Download size={16} /> Xuất báo cáo
                    </Button>

                    <Button
                        onClick={handleImportDebt}
                        className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
                    >
                        <Upload size={16} /> Ghi nhận nợ (Nhập hàng)
                    </Button>

                    <Button
                        onClick={handleAddSupplier}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                    >
                        <Plus size={16} /> Thêm Nhà Cung Cấp
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <DebtStats
                totalPayable={stats.totalPayable}
                newDebt={stats.newDebt}
                repaid={stats.repaid}
            />

            {/* Main Table */}
            <SupplierTable
                suppliers={suppliers}
                debtMap={debtMap}
                onPay={handlePayDebt}
                onEdit={handleEditSupplier}
                onView={(s) => console.log('View details', s)} // Placeholder for detail view
            />

            {/* Modals */}
            <SupplierModal
                isOpen={isSupplierModalOpen}
                onClose={() => setIsSupplierModalOpen(false)}
                onSave={handleSaveSupplier}
                supplier={editingSupplier}
            />

            <DebtTransactionModal
                isOpen={isDebtModalOpen}
                onClose={() => setIsDebtModalOpen(false)}
                onSave={handleSaveDebtTransaction}
                mode={debtModalMode}
                suppliers={suppliers}
                initialSupplierId={selectedSupplierForDebt?.id}
            />
        </div>
    );
};

const SupplierDebtPage: React.FC = () => {
    return (
        <CashBookProvider>
            <div className="min-h-screen bg-gray-50">
                <SupplierDebtContent />
            </div>
        </CashBookProvider>
    );
};

export default SupplierDebtPage;
