
import React, { useState, useEffect } from 'react';
import { X, Check, Wallet, CreditCard, Repeat, User, ShoppingCart, Banknote, FileText } from 'lucide-react';
import { Transaction, TransactionType, FundType, RecurrenceFrequency, CategoryMap, Supplier } from '../types';
import { BRANCHES } from '../constants';

export type ExpenseMode = 'NORMAL' | 'DEBT_IMPORT' | 'DEBT_REPAYMENT';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transactions: Omit<Transaction, 'id'>[]) => void;
  initialBranchId?: string;
  initialType?: TransactionType;
  initialSupplierId?: string | null;
  initialExpenseMode?: ExpenseMode;
  categories: CategoryMap;
  suppliers: Supplier[];
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialBranchId, 
  initialType,
  initialSupplierId,
  initialExpenseMode,
  categories,
  suppliers
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

  // Accounts Payable State
  const [supplierId, setSupplierId] = useState<string>('');
  const [expenseMode, setExpenseMode] = useState<ExpenseMode>('NORMAL');

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
      
      // Handle Supplier Context
      setSupplierId(initialSupplierId || '');
      setExpenseMode(initialExpenseMode || 'NORMAL');

      // Default Category logic
      if (initialType === TransactionType.EXPENSE && initialExpenseMode === 'DEBT_REPAYMENT') {
         setCategory('Trả nợ nhà cung cấp');
      } else if (initialType === TransactionType.EXPENSE && initialExpenseMode === 'DEBT_IMPORT') {
         setCategory('Nhập hàng hóa');
      } else {
         // Default to first category
         const targetCategories = categories[initialType || TransactionType.INCOME];
         if (targetCategories && targetCategories.length > 0) {
            setCategory(targetCategories[0]);
         }
      }
    }
  }, [isOpen, initialBranchId, initialType, initialSupplierId, initialExpenseMode, categories]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    // Logic to determine debt flags based on Expense Mode
    let isDebt = false;
    let isDebtRepayment = false;
    let finalDescription = description;

    if (type === TransactionType.EXPENSE) {
      if (expenseMode === 'DEBT_IMPORT') {
        isDebt = true;
        if (!finalDescription) finalDescription = 'Nhập hàng (Ghi nợ)';
      } else if (expenseMode === 'DEBT_REPAYMENT') {
        isDebtRepayment = true;
        if (!finalDescription) finalDescription = 'Thanh toán công nợ';
      }
    }

    const baseTransaction = {
      date,
      amount: numAmount,
      type,
      fundType,
      category,
      branchId,
      description: finalDescription,
      supplierId: (type === TransactionType.EXPENSE && supplierId) ? supplierId : undefined,
      isDebt,
      isDebtRepayment
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

  if (!isOpen) return null;

  const isExpense = type === TransactionType.EXPENSE;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className={`px-6 py-4 border-b border-gray-100 flex justify-between items-center ${isExpense ? 'bg-rose-50' : 'bg-emerald-50'}`}>
          <h2 className={`text-lg font-bold ${isExpense ? 'text-rose-700' : 'text-emerald-700'}`}>
            {isExpense ? 'Phiếu Chi (Expense)' : 'Phiếu Thu (Income)'}
          </h2>
          <button onClick={onClose} title="Đóng" className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          
          {/* EXPENSE MODE TABS */}
          {isExpense && (
            <div className="bg-gray-100 p-1 rounded-lg flex mb-2">
              <button 
                type="button"
                onClick={() => setExpenseMode('NORMAL')}
                className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${expenseMode === 'NORMAL' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Chi phí / Mua ngay
              </button>
              <button 
                 type="button"
                 onClick={() => setExpenseMode('DEBT_IMPORT')}
                 className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${expenseMode === 'DEBT_IMPORT' ? 'bg-white text-orange-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Nhập hàng (Ghi nợ)
              </button>
              <button 
                 type="button"
                 onClick={() => {
                    setExpenseMode('DEBT_REPAYMENT');
                    setCategory('Trả nợ nhà cung cấp'); // Auto-set category
                 }}
                 className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${expenseMode === 'DEBT_REPAYMENT' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Trả nợ NCC
              </button>
            </div>
          )}

          {/* Amount & Date Row */}
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Số tiền</label>
                <div className="relative">
                   <input 
                      type="number" 
                      required
                      min="0"
                      step="1000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-3 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-bold text-gray-700"
                      placeholder="0"
                   />
                   <span className="absolute right-3 top-2.5 text-gray-400 text-sm font-medium">VND</span>
                </div>
             </div>
             <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Ngày giao dịch</label>
                <input 
                   type="date" 
                   required
                   value={date}
                   onChange={(e) => setDate(e.target.value)}
                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
                />
             </div>
          </div>

          {/* Branch & Fund Type */}
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Chi nhánh</label>
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
             
             {/* Hide FundType selection if in Debt Import mode (since no money moves) */}
             {expenseMode !== 'DEBT_IMPORT' && (
               <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nguồn tiền</label>
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
             )}
          </div>

          {/* Category & Supplier */}
          <div className="grid grid-cols-1 gap-4">
             {/* Category Selection */}
             {expenseMode === 'NORMAL' && (
                <div>
                   <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Danh mục</label>
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
             )}

             {/* Supplier Selection - Show if Expense */}
             {isExpense && (
               <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                     {expenseMode === 'DEBT_REPAYMENT' ? 'Trả cho NCC' : 'Nhà Cung Cấp'}
                     {(expenseMode === 'DEBT_IMPORT' || expenseMode === 'DEBT_REPAYMENT') && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <select 
                       value={supplierId}
                       onChange={(e) => setSupplierId(e.target.value)}
                       required={expenseMode !== 'NORMAL'}
                       className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm ${supplierId ? 'border-indigo-300 bg-indigo-50 text-indigo-900 font-medium' : 'border-gray-300'}`}
                    >
                       <option value="">-- Chọn đối tác --</option>
                       {suppliers.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                       ))}
                    </select>
                    <User size={16} className="absolute left-3 top-3 text-gray-400" />
                  </div>
               </div>
             )}
          </div>

          {/* Description */}
          <div>
             <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Mô tả / Ghi chú</label>
             <textarea 
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                placeholder={expenseMode === 'DEBT_IMPORT' ? "VD: Nhập 50 thùng giấy A4..." : "Chi tiết giao dịch..."}
             />
          </div>

          {/* Recurring Options (Only for Normal Income/Expense) */}
          {expenseMode === 'NORMAL' && (
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
                    <label className="block text-xs text-gray-500 mb-1">Tần suất</label>
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
                    <label className="block text-xs text-gray-500 mb-1">Kết thúc</label>
                    <input 
                      type="date" 
                      required
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <button 
             type="submit" 
             className={`w-full py-3 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2 ${isExpense ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'}`}
          >
             <Check size={20} /> 
             {isRecurring ? 'Lưu Giao Dịch Lặp Lại' : 'Lưu Giao Dịch'}
          </button>

        </form>
      </div>
    </div>
  );
};
