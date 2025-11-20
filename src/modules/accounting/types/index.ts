export enum TransactionType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
}

export enum FundType {
    CASH = 'CASH',
    BANK = 'BANK',
}

export enum RecurrenceFrequency {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
}

export interface Branch {
    id: string;
    name: string;
    code: string;
    isHeadOffice: boolean;
}

export interface Supplier {
    id: string;
    name: string;
    code: string;
    phone: string;
    address?: string;
    initialDebt: number;
    taxCode?: string;
    contactPerson?: string;
    email?: string;
    notes?: string;
}

export interface Transaction {
    id: string;
    date: string; // ISO string YYYY-MM-DD
    amount: number;
    type: TransactionType;
    fundType: FundType;
    category: string;
    branchId: string;
    description: string;
    // New fields for Accounts Payable
    supplierId?: string;
    isDebt?: boolean; // True if this is a purchase on credit (increases debt, no cash impact yet)
    isDebtRepayment?: boolean; // True if this is paying off a debt (decreases debt, decreases cash)
}

export interface FinancialSummary {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    cashBalance: number;
    bankBalance: number;
    totalPayable: number; // New field for total debt
}

export interface AIAnalysisResult {
    summary: string;
    insights: string[];
    recommendations: string[];
}

export type CategoryMap = Record<TransactionType, string[]>;
