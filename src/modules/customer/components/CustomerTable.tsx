
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Edit } from 'lucide-react';
import { Customer, CustomerSummary } from '../types';

interface CustomerTableProps {
  customers: Customer[];
  summary: CustomerSummary;
  onViewCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
}

export function CustomerTable({ customers, summary, onViewCustomer, onEditCustomer }: CustomerTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="bg-white rounded-lg border">
        {/* Summary Row */}
        <div className="border-b bg-gray-50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Mã khách hàng</TableHead>
                <TableHead className="w-48">Tên khách hàng</TableHead>
                <TableHead className="w-32">Điện thoại</TableHead>
                <TableHead className="w-32 text-center">Nợ hiện tại</TableHead>
                <TableHead className="w-24 text-center">Số ngày nợ</TableHead>
                <TableHead className="w-32 text-center">Tổng bán</TableHead>
                <TableHead className="w-32 text-center">Tổng bán trừ trả hàng</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-blue-50 font-semibold">
                <TableCell>Tổng cộng</TableCell>
                <TableCell>{summary.totalCustomers} khách hàng</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-center">{formatCurrency(summary.totalDebt)}</TableCell>
                <TableCell className="text-center">-</TableCell>
                <TableCell className="text-center">{formatCurrency(summary.totalSales)}</TableCell>
                <TableCell className="text-center">{formatCurrency(summary.totalSalesAfterReturns)}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Data Rows */}
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-gray-50">
                  <TableCell className="w-32 font-medium text-blue-600">
                    {customer.code}
                  </TableCell>
                  <TableCell className="w-48">{customer.name}</TableCell>
                  <TableCell className="w-32">{customer.phone}</TableCell>
                  <TableCell className="w-32 text-center">
                    {formatCurrency(customer.currentDebt)}
                  </TableCell>
                  <TableCell className="w-24 text-center">
                    {customer.daysOwed}
                  </TableCell>
                  <TableCell className="w-32 text-center">
                    {formatCurrency(customer.totalSales)}
                  </TableCell>
                  <TableCell className="w-32 text-center">
                    {formatCurrency(customer.totalSalesAfterReturns)}
                  </TableCell>
                  <TableCell className="w-24">
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewCustomer(customer)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditCustomer(customer)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
