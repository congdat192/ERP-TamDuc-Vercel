
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

// Column width configurations based on content type
const getColumnWidth = (columnKey: string): string => {
  const widthConfig: Record<string, string> = {
    // Short columns
    'customerCode': 'min-w-[100px]',
    'gender': 'min-w-[80px]',
    'status': 'min-w-[100px]',
    'debtDays': 'min-w-[90px]',
    'ward': 'min-w-[100px]',
    
    // Medium columns
    'customerName': 'min-w-[150px]',
    'phone': 'min-w-[130px]',
    'customerType': 'min-w-[120px]',
    'customerGroup': 'min-w-[140px]',
    'birthDate': 'min-w-[110px]',
    'email': 'min-w-[180px]',
    'creator': 'min-w-[120px]',
    'createDate': 'min-w-[110px]',
    'lastTransactionDate': 'min-w-[140px]',
    'createBranch': 'min-w-[130px]',
    
    // Currency/Number columns
    'currentDebt': 'min-w-[120px]',
    'totalSales': 'min-w-[120px]',
    'currentPoints': 'min-w-[100px]',
    'totalPoints': 'min-w-[100px]',
    'totalSalesMinusReturns': 'min-w-[160px]',
    
    // Long content columns
    'facebook': 'min-w-[200px]',
    'company': 'min-w-[180px]',
    'taxCode': 'min-w-[120px]',
    'idNumber': 'min-w-[140px]',
    'address': 'min-w-[250px]',
    'deliveryArea': 'min-w-[140px]',
    'notes': 'min-w-[200px]'
  };
  
  return widthConfig[columnKey] || 'min-w-[120px]';
};

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
      return <Badge className="theme-badge-success whitespace-nowrap">Hoạt động</Badge>;
    }
    return <Badge className="berry-error-light whitespace-nowrap">Ngưng hoạt động</Badge>;
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
        return <span className="whitespace-nowrap">{customer.id}</span>;
      case 'customerName':
        return customer.name;
      case 'customerType':
        return <span className="whitespace-nowrap">Cá nhân</span>;
      case 'phone':
        return <span className="whitespace-nowrap">{customer.phone}</span>;
      case 'customerGroup':
        return customer.group;
      case 'gender':
        return <span className="whitespace-nowrap">Nam</span>;
      case 'birthDate':
        return <span className="whitespace-nowrap">{customer.birthday}</span>;
      case 'email':
        return customer.email;
      case 'facebook':
        return customer.facebook;
      case 'company':
        return customer.company;
      case 'taxCode':
        return <span className="whitespace-nowrap">{customer.taxCode}</span>;
      case 'idNumber':
        return <span className="whitespace-nowrap">123456789</span>;
      case 'address':
        return customer.address;
      case 'deliveryArea':
        return customer.deliveryArea;
      case 'ward':
        return <span className="whitespace-nowrap">Phường 1</span>;
      case 'creator':
        return <span className="whitespace-nowrap">{customer.creator}</span>;
      case 'createDate':
        return <span className="whitespace-nowrap">{customer.createdDate}</span>;
      case 'notes':
        return customer.note;
      case 'lastTransactionDate':
        return <span className="whitespace-nowrap">20/01/2024</span>;
      case 'createBranch':
        return <span className="whitespace-nowrap">Chi nhánh HCM</span>;
      case 'currentDebt':
        return <span className="whitespace-nowrap text-right block">{formatCurrency(customer.totalDebt)}</span>;
      case 'debtDays':
        return <span className="whitespace-nowrap text-center block">0</span>;
      case 'totalSales':
        return <span className="whitespace-nowrap text-right block">{formatCurrency(customer.totalSpent)}</span>;
      case 'currentPoints':
        return <span className="whitespace-nowrap text-center block">{customer.points.toString()}</span>;
      case 'totalPoints':
        return <span className="whitespace-nowrap text-center block">{(customer.points + 200).toString()}</span>;
      case 'totalSalesMinusReturns':
        return <span className="whitespace-nowrap text-right block">{formatCurrency(customer.totalSpent - 50000)}</span>;
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
        {/* Table with horizontal scroll - CONTAINED within this div */}
        <div className="relative">
          <div className="overflow-x-auto max-w-full">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="hover:theme-bg-primary/5">
                  <TableHead className="w-12 sticky left-0 theme-card z-10 border-r theme-border-primary">
                    <Checkbox
                      checked={selectedCustomers.length === customers.length}
                      onCheckedChange={handleSelectAll}
                      className="voucher-checkbox"
                    />
                  </TableHead>
                  {visibleColumns.map((column) => (
                    <TableHead 
                      key={column.key} 
                      className={`theme-text font-medium whitespace-nowrap ${getColumnWidth(column.key)}`}
                    >
                      {column.label}
                    </TableHead>
                  ))}
                  <TableHead className="theme-text font-medium w-24 whitespace-nowrap sticky right-0 theme-card z-10 border-l theme-border-primary">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.slice(startIndex, startIndex + itemsPerPage).map((customer) => (
                  <TableRow key={customer.id} className="hover:theme-bg-primary/5">
                    <TableCell className="sticky left-0 theme-card z-10 border-r theme-border-primary">
                      <Checkbox
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked as boolean)}
                        className="voucher-checkbox"
                      />
                    </TableCell>
                    {visibleColumns.map((column) => (
                      <TableCell 
                        key={column.key} 
                        className={`theme-text ${getColumnWidth(column.key)}`}
                      >
                        {renderCellContent(customer, column.key)}
                      </TableCell>
                    ))}
                    <TableCell className="w-24 sticky right-0 theme-card z-10 border-l theme-border-primary">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:voucher-bg-primary/10 hover:voucher-text-primary"
                        >
                          <Eye className="w-4 h-4 voucher-text-primary" />
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
                          className="h-8 w-8 p-0 hover:voucher-bg-primary/10 hover:voucher-text-primary"
                        >
                          <MoreHorizontal className="w-4 h-4 voucher-text-primary" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

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
                className="h-8 w-8 p-0 voucher-border-primary hover:voucher-bg-primary/10 hover:voucher-text-primary disabled:opacity-50"
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
                className="h-8 w-8 p-0 voucher-border-primary hover:voucher-bg-primary/10 hover:voucher-text-primary disabled:opacity-50"
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
