import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Transaction, Supplier, CategoryMap } from '../types';
import { MOCK_TRANSACTIONS, MOCK_SUPPLIERS, CATEGORIES } from '../constants';

interface CashBookContextType {
    transactions: Transaction[];
    suppliers: Supplier[];
    categories: CategoryMap;
    addTransactions: (newTxs: Omit<Transaction, 'id'>[]) => void;
    deleteTransaction: (id: string) => void;
    updateSuppliers: (suppliers: Supplier[]) => void;
    updateCategories: (categories: CategoryMap) => void;
}

const CashBookContext = createContext<CashBookContextType | undefined>(undefined);

export const CashBookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // --- State ---
    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        const saved = localStorage.getItem('fintrack_transactions');
        return saved ? JSON.parse(saved) : MOCK_TRANSACTIONS;
    });

    const [categories, setCategories] = useState<CategoryMap>(() => {
        const saved = localStorage.getItem('fintrack_categories');
        return saved ? JSON.parse(saved) : CATEGORIES;
    });

    const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
        const saved = localStorage.getItem('fintrack_suppliers');
        return saved ? JSON.parse(saved) : MOCK_SUPPLIERS;
    });

    // --- Effects for Persistence ---
    useEffect(() => { localStorage.setItem('fintrack_transactions', JSON.stringify(transactions)); }, [transactions]);
    useEffect(() => { localStorage.setItem('fintrack_categories', JSON.stringify(categories)); }, [categories]);
    useEffect(() => { localStorage.setItem('fintrack_suppliers', JSON.stringify(suppliers)); }, [suppliers]);

    // --- Actions ---
    const addTransactions = (newTxs: Omit<Transaction, 'id'>[]) => {
        const transactionsWithIds = newTxs.map(tx => ({ ...tx, id: Math.random().toString(36).substr(2, 9) }));
        setTransactions(prev => [...transactionsWithIds, ...prev]);
    };

    const deleteTransaction = (id: string) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    const updateSuppliers = (newSuppliers: Supplier[]) => {
        setSuppliers(newSuppliers);
    };

    const updateCategories = (newCategories: CategoryMap) => {
        setCategories(newCategories);
    };

    return (
        <CashBookContext.Provider value={{
            transactions,
            suppliers,
            categories,
            addTransactions,
            deleteTransaction,
            updateSuppliers,
            updateCategories
        }}>
            {children}
        </CashBookContext.Provider>
    );
};

export const useCashBook = () => {
    const context = useContext(CashBookContext);
    if (context === undefined) {
        throw new Error('useCashBook must be used within a CashBookProvider');
    }
    return context;
};
