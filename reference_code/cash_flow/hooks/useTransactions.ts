import { useData } from '../contexts/DataContext';

export const useTransactions = () => {
    const { transactions, addTransactions, deleteTransaction } = useData();
    return { transactions, addTransactions, deleteTransaction };
};
