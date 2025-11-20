import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet } from 'lucide-react';

interface DebtStatsProps {
    totalPayable: number;
    newDebt: number;
    repaid: number;
}

export const DebtStats: React.FC<DebtStatsProps> = ({ totalPayable, newDebt, repaid }) => {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                        Tổng nợ phải trả
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-rose-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-rose-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPayable)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Tất cả nhà cung cấp
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                        Nợ mới trong tháng
                    </CardTitle>
                    <ArrowUpRight className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(newDebt)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Phát sinh tăng
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                        Đã trả trong tháng
                    </CardTitle>
                    <Wallet className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(repaid)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Thanh toán cho NCC
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
