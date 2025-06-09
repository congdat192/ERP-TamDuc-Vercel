
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, Eye, Edit, MoreHorizontal } from 'lucide-react';
import { ColumnConfig } from './ColumnVisibilityFilter';

interface Customer {
  id: string;
  name: string;
  phone: string;
  group: string;
  birthday: string;
  creator: string;
  createdDate: string;
  note: string;
  email: string;
  facebook: string;
  company: string;
  taxCode: string;
  address: string;
  deliveryArea: string;
  points: number;
  totalSpent: number;
  totalDebt: number;
  status: string;
}

interface CustomerTableProps {
  customers: Customer[];
  visibleColumns: ColumnConfig[];
  selectedCustomers: string[];
  handleSelectCustomer: (customerId: string, checked: boolean) => void;
  handleSelectAll: (checked: boolean) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  totalCustomers: number;
  totalPages: number;
}

export function CustomerTable({
  customers,
  visibleColumns,
  selectedCustomers,
  handleSelectCustomer,
  handleSelectAll,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalCustomers,
  totalPages
}: CustomerTableProps) {
  const getStatusBadge = (status: string) => {
    if (status === 'Hoạt động') {
      return <Badge className="theme-badge-success">Hoạt động</Badge>;
    }
    return <Badge className="berry-error-light">Ngưng hoạt động</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const renderCellContent = (customer: Customer, columnKey: string) => {
    switch (columnKey) {
      case 'customerCode':
        return customer.id;
      case 'customerName':
        return customer.name;
      case 'customerType':
        return 'Cá nhân';
      case 'phone':
        return customer.phone;
      case 'customerGroup':
        return customer.group;
      case 'gender':
        return 'Nam';
      case 'birthDate':
        return customer.birthday;
      case 'email':
        return customer.email;
      case 'facebook':
        return customer.facebook;
      case 'company':
        return customer.company;
      case 'taxCode':
        return customer.taxCode;
      case 'idNumber':
        return '123456789';
      case 'address':
        return customer.address;
      case 'deliveryArea':
        return customer.deliveryArea;
      case 'ward':
        return 'Phường 1';
      case 'creator':
        return customer.creator;
      case 'createDate':
        return customer.createdDate;
      case 'notes':
        return customer.note;
      case 'lastTransactionDate':
        return '20/01/2024';
      case 'createBranch':
        return 'Chi nhánh HCM';
      case 'currentDebt':
        return formatCurrency(customer.totalDebt);
      case 'debtDays':
        return '0';
      case 'totalSales':
        return formatCurrency(customer.totalSpent);
      case 'currentPoints':
        return customer.points.toString();
      case 'totalPoints':
        return (customer.points + 200).toString();
      case 'totalSalesMinusReturns':
        return formatCurrency(customer.totalSpent - 50000);
      case 'status':
        return getStatusBadge(customer.status);
      default:
        return '-';
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCustomers);

  return (
    <Card className="theme-card">
      <CardContent className="p-0">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow className="hover:theme-bg-primary/5">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedCustomers.length === customers.length}
                    onCheckedChange={handleSelectAll}
                    className="theme-border-primary data-[state=checked]:theme-bg-primary"
                  />
                </TableHead>
                {visibleColumns.map((column) => (
                  <TableHead key={column.key} className="theme-text font-medium">
                    {column.label}
                  </TableHead>
                ))}
                <TableHead className="theme-text font-medium w-24">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.slice(startIndex, startIndex + itemsPerPage).map((customer) => (
                <TableRow key={customer.id} className="hover:theme-bg-primary/5">
                  <TableCell>
                    <Checkbox
                      checked={selectedCustomers.includes(customer.id)}
                      onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked as boolean)}
                      className="theme-border-primary data-[state=checked]:theme-bg-primary"
                    />
                  </TableCell>
                  {visibleColumns.map((column) => (
                    <TableCell key={column.key} className="theme-text">
                      {renderCellContent(customer, column.key)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:theme-bg-primary/10 hover:theme-text-primary"
                      >
                        <Eye className="w-4 h-4 theme-text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:theme-bg-secondary/10 hover:theme-text-secondary"
                      >
                        <Edit className="w-4 h-4 theme-text-secondary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:theme-bg-primary/10 hover:theme-text-primary"
                      >
                        <MoreHorizontal className="w-4 h-4 theme-text-primary" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t theme-border-primary">
          <div className="flex items-center space-x-2">
            <span className="text-sm theme-text-muted">Hiển thị</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-2 py-1 text-sm border theme-border-primary rounded voucher-input theme-text"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm theme-text-muted">
              trên {totalCustomers} khách hàng
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm theme-text-muted">
              {startIndex + 1}-{endIndex} trên {totalCustomers}
            </span>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 theme-border-primary hover:theme-bg-primary/10 hover:theme-text-primary disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-3 py-1 text-sm theme-text">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0 theme-border-primary hover:theme-bg-primary/10 hover:theme-text-primary disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
