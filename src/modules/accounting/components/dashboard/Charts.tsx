import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { Transaction, TransactionType, FinancialSummary } from '../../types';
import { BRANCHES } from '../../constants';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Color constants for charts
const COLORS = {
    INCOME: '#10b981', // emerald-500
    EXPENSE: '#ef4444', // rose-500
    PIE: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444']
};

interface ChartsProps {
    transactions: Transaction[]; // All transactions or Branch filtered
    selectedBranchId: string;
    stats: { global: FinancialSummary };
}

export const Charts: React.FC<ChartsProps> = ({ transactions, selectedBranchId, stats }) => {
    const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val);

    // Chart Data Calculation
    const chartData = useMemo(() => {
        if (selectedBranchId !== 'all') {
            const categoryMap: Record<string, { name: string, income: number, expense: number }> = {};
            transactions.forEach(t => {
                if (t.isDebt) return; // Exclude unpaid debts from cash flow charts
                if (!categoryMap[t.category]) categoryMap[t.category] = { name: t.category, income: 0, expense: 0 };
                if (t.type === TransactionType.INCOME) categoryMap[t.category].income += t.amount;
                else categoryMap[t.category].expense += t.amount;
            });
            return Object.values(categoryMap);
        } else {
            return BRANCHES.map(branch => {
                const branchTrans = transactions.filter(t => t.branchId === branch.id && !t.isDebt);
                const income = branchTrans.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
                const expense = branchTrans.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
                return { name: branch.code, fullName: branch.name, income, expense };
            });
        }
    }, [selectedBranchId, transactions]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>{selectedBranchId === 'all' ? 'Thu/Chi theo Chi nhánh (Thực tế)' : 'Phân bổ theo Danh mục'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(value) => `${value / 1000000}M`} />
                                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: number) => formatCurrency(value)} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="income" name="Thu" fill={COLORS.INCOME} radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="expense" name="Chi" fill={COLORS.EXPENSE} radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Cơ cấu dòng tiền</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={[{ name: 'Thu', value: stats.global.totalIncome }, { name: 'Chi', value: stats.global.totalExpense }]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    <Cell fill={COLORS.INCOME} /> <Cell fill={COLORS.EXPENSE} />
                                </Pie>
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="text-center mt-4 text-sm text-gray-500">Tỷ lệ thu/chi hiện tại</div>
                </CardContent>
            </Card>
        </div>
    );
};
