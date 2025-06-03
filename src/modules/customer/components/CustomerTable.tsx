
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Customer, CustomerSummary } from '../types';

interface CustomerTableProps {
  customers: Customer[];
  summary: CustomerSummary;
  onCustomerClick: (customer: Customer) => void;
  isLoading?: boolean;
}

export function CustomerTable({ customers, summary, onCustomerClick, isLoading }: CustomerTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background">
            <TableRow className="bg-muted/50">
              <TableHead className="w-32">Mã khách hàng</TableHead>
              <TableHead className="min-w-48">Tên khách hàng</TableHead>
              <TableHead className="w-32">Điện thoại</TableHead>
              <TableHead className="w-32 text-right">Nợ hiện tại</TableHead>
              <TableHead className="w-24 text-center">Số ngày nợ</TableHead>
              <TableHead className="w-40 text-right">Tổng bán</TableHead>
              <TableHead className="w-48 text-right">Tổng bán trừ trả hàng</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
            {/* Summary Row */}
            <TableRow className="bg-blue-50 font-semibold">
              <TableCell colSpan={3} className="text-right">
                Tổng ({summary.totalCustomers.toLocaleString('vi-VN')} khách hàng):
              </TableCell>
              <TableCell className="text-right text-red-600">
                {formatCurrency(summary.totalCurrentDebt)}
              </TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right text-green-600">
                {formatCurrency(summary.totalSales)}
              </TableCell>
              <TableCell className="text-right text-green-600">
                {formatCurrency(summary.totalSalesAfterReturns)}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow 
                key={customer.id} 
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => onCustomerClick(customer)}
              >
                <TableCell className="font-medium text-blue-600">
                  {customer.code}
                </TableCell>
                <TableCell className="font-medium">
                  {customer.name}
                </TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell className="text-right">
                  {customer.currentDebt > 0 ? (
                    <span className="text-red-600">
                      {formatCurrency(customer.currentDebt)}
                    </span>
                  ) : (
                    <span>0</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {customer.daysOwed > 0 ? customer.daysOwed : 0}
                </TableCell>
                <TableCell className="text-right">
                  {customer.totalSales > 0 ? (
                    <span className="text-green-600">
                      {formatCurrency(customer.totalSales)}
                    </span>
                  ) : (
                    <span>0</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {customer.totalSalesAfterReturns > 0 ? (
                    <span className="text-green-600">
                      {formatCurrency(customer.totalSalesAfterReturns)}
                    </span>
                  ) : (
                    <span>0</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCustomerClick(customer);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Không tìm thấy khách hàng nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
