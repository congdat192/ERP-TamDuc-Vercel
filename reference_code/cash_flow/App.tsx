import React, { useState, useMemo } from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { BRANCHES } from './constants';
import { TransactionType, AIAnalysisResult, Supplier } from './types';
import { DataProvider } from './contexts/DataContext';
import { useTransactions } from './hooks/useTransactions';
import { useSuppliers } from './hooks/useSuppliers';
import { useCategories } from './hooks/useCategories';
import { calculateStats } from './utils/finance';
import { analyzeFinances } from './services/geminiService';

// Components
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { StatCards } from './components/dashboard/StatCards';
import { Charts } from './components/dashboard/Charts';
import { TransactionTable } from './components/dashboard/TransactionTable';
import { SupplierDetailView } from './components/SupplierDetailView';

// Modals
import { TransactionModal } from './components/TransactionModal';
import { AIInsightModal } from './components/AIInsightModal';
import { ReportModal } from './components/ReportModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { SupplierManagerModal } from './components/SupplierManagerModal';

type ViewMode = 'BRANCH' | 'SUPPLIER';

const AppContent: React.FC = () => {
  // --- Data Hooks ---
  const { transactions, addTransactions, deleteTransaction } = useTransactions();
  const { suppliers, updateSuppliers } = useSuppliers();
  const { categories, updateCategories } = useCategories();

  // --- UI State ---
  const [viewMode, setViewMode] = useState<ViewMode>('BRANCH');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);

  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialTransactionType, setInitialTransactionType] = useState<TransactionType>(TransactionType.INCOME);

  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  const [isSupplierManagerOpen, setIsSupplierManagerOpen] = useState(false);
  const [supplierEditId, setSupplierEditId] = useState<string | null>(null);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    targetBranchId: string | null;
    message: string;
  }>({
    isOpen: false,
    targetBranchId: null,
    message: ''
  });

  // --- Derived Data ---
  const stats = useMemo(() => {
    return calculateStats(transactions, suppliers, selectedBranchId);
  }, [transactions, suppliers, selectedBranchId]);

  // --- Handlers ---
  const handleSwitchBranch = (newBranchId: string) => {
    if (newBranchId === selectedBranchId && viewMode === 'BRANCH') return;
    const branchName = newBranchId === 'all' ? 'Toàn hệ thống' : BRANCHES.find(b => b.id === newBranchId)?.name || 'Chi nhánh';
    setConfirmModal({ isOpen: true, targetBranchId: newBranchId, message: `Bạn có chắc chắn muốn chuyển sang xem dữ liệu: ${branchName}?` });
  };

  const performBranchSwitch = () => {
    if (confirmModal.targetBranchId) {
      setSelectedBranchId(confirmModal.targetBranchId);
      setViewMode('BRANCH');
      setSelectedSupplierId(null);
    }
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleAnalyze = async () => {
    setIsAIModalOpen(true); setIsAILoading(true);
    const branchName = selectedBranchId === 'all' ? "Toàn bộ hệ thống" : BRANCHES.find(b => b.id === selectedBranchId)?.name || "Chi nhánh";
    const result = await analyzeFinances(stats.branchTransactions, branchName);
    setAiResult(result); setIsAILoading(false);
  };

  const handleSwitchToSupplier = (id: string) => {
    setSelectedSupplierId(id);
    setViewMode('SUPPLIER');
  };

  const handleOpenSupplierManager = () => {
    setSupplierEditId(null);
    setIsSupplierManagerOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSupplierEditId(supplier.id);
    setIsSupplierManagerOpen(true);
  };

  const handleDeleteSupplier = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa nhà cung cấp này?')) {
      updateSuppliers(suppliers.filter(s => s.id !== id));
      if (selectedSupplierId === id) {
        setViewMode('BRANCH');
        setSelectedSupplierId(null);
      }
    }
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giao dịch này không? Hành động này không thể hoàn tác.')) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar
        viewMode={viewMode}
        selectedBranchId={selectedBranchId}
        selectedSupplierId={selectedSupplierId}
        onSwitchBranch={handleSwitchBranch}
        onSwitchToSupplier={handleSwitchToSupplier}
        onOpenSupplierManager={handleOpenSupplierManager}
      />

      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-x-hidden">
        <Header
          viewMode={viewMode}
          selectedBranchId={selectedBranchId}
          onSwitchBranch={handleSwitchBranch}
          onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onAnalyze={handleAnalyze}
          onOpenTransactionModal={(type) => { setInitialTransactionType(type); setIsModalOpen(true); }}
        />

        {viewMode === 'SUPPLIER' && selectedSupplierId ? (
          <SupplierDetailView
            supplierId={selectedSupplierId}
            suppliers={suppliers}
            transactions={transactions}
            onEdit={handleEditSupplier}
            onDelete={handleDeleteSupplier}
            onBack={() => { setViewMode('BRANCH'); setSelectedSupplierId(null); }}
          />
        ) : (
          <div className="animate-in fade-in duration-300">
            <StatCards stats={stats} selectedBranchId={selectedBranchId} />
            <Charts transactions={stats.branchTransactions} selectedBranchId={selectedBranchId} stats={stats} />
            <TransactionTable
              transactions={stats.branchTransactions}
              categories={categories}
              suppliers={suppliers}
              onDelete={handleDeleteTransaction}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addTransactions}
        initialBranchId={viewMode === 'BRANCH' ? selectedBranchId : 'all'}
        initialType={initialTransactionType}
        categories={categories}
        suppliers={suppliers}
      />

      <AIInsightModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} analysis={aiResult} isLoading={isAILoading} />
      <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} transactions={transactions} />
      <CategoryManagerModal isOpen={isCategoryManagerOpen} onClose={() => setIsCategoryManagerOpen(false)} categories={categories} onUpdateCategories={updateCategories} />
      <SupplierManagerModal
        isOpen={isSupplierManagerOpen}
        onClose={() => setIsSupplierManagerOpen(false)}
        suppliers={suppliers}
        transactions={transactions}
        onUpdateSuppliers={updateSuppliers}
        initialEditId={supplierEditId}
      />

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden transform scale-100 transition-transform">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle size={32} /></div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Xác nhận chuyển đổi</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{confirmModal.message}</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">Hủy bỏ</button>
                <button onClick={performBranchSwitch} className="flex-1 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"><Check size={18} /> Đồng ý</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  console.log('App component is rendering');
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
};

console.log('App.tsx loaded, about to export');
export default App;
