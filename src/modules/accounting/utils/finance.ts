import { Transaction, TransactionType, FundType, Supplier } from '../types';
import { BRANCHES } from '../constants';

export const calculateStats = (transactions: Transaction[], suppliers: Supplier[], selectedBranchId: string) => {
    // 1. Calculate Debt (Payable)
    let totalPayable = suppliers.reduce((sum, s) => sum + s.initialDebt, 0);

    const global = { totalIncome: 0, totalExpense: 0, balance: 0, cashBalance: 0, bankBalance: 0, totalPayable: 0 };
    const headOffice = { cashBalance: 0, bankBalance: 0 };
    const branches = { cashBalance: 0, bankBalance: 0 };
    const hoId = BRANCHES.find(b => b.isHeadOffice)?.id;

    transactions.forEach(t => {
        // Debt Logic (Global)
        if (selectedBranchId === 'all' || t.branchId === selectedBranchId) {
            if (t.isDebt) {
                totalPayable += t.amount; // Bought on credit
            } else if (t.isDebtRepayment) {
                totalPayable -= t.amount; // Paid off debt
            }
        }
    });

    global.totalPayable = totalPayable;

    // Cash/Bank Logic (Branch Filtered)
    const branchTransactions = transactions.filter(t => selectedBranchId === 'all' || t.branchId === selectedBranchId);

    branchTransactions.forEach(t => {
        const amount = t.amount;
        const isIncome = t.type === TransactionType.INCOME;
        const isCash = t.fundType === FundType.CASH;

        if (t.isDebt) return;

        if (isIncome) {
            global.totalIncome += amount;
            if (isCash) global.cashBalance += amount; else global.bankBalance += amount;

            if (t.branchId === hoId) {
                if (isCash) headOffice.cashBalance += amount; else headOffice.bankBalance += amount;
            } else {
                if (isCash) branches.cashBalance += amount; else branches.bankBalance += amount;
            }
        } else {
            // Expense or DebtRepayment
            global.totalExpense += amount;
            if (isCash) global.cashBalance -= amount; else global.bankBalance -= amount;

            if (t.branchId === hoId) {
                if (isCash) headOffice.cashBalance -= amount; else headOffice.bankBalance -= amount;
            } else {
                if (isCash) branches.cashBalance -= amount; else branches.bankBalance -= amount;
            }
        }
    });

    global.balance = global.totalIncome - global.totalExpense;
    return { global, headOffice, branches, totalPayable, branchTransactions };
};

export const calculateSupplierDebts = (transactions: Transaction[], suppliers: Supplier[]) => {
    const debtMap: Record<string, number> = {};

    // Initialize with initial debt
    suppliers.forEach(s => {
        debtMap[s.id] = s.initialDebt;
    });

    // Process transactions
    transactions.forEach(t => {
        if (t.supplierId) {
            if (!debtMap[t.supplierId]) debtMap[t.supplierId] = 0; // Should be initialized, but safety check

            if (t.isDebt) {
                debtMap[t.supplierId] += t.amount;
            } else if (t.isDebtRepayment) {
                debtMap[t.supplierId] -= t.amount;
            }
        }
    });

    return debtMap;
};
