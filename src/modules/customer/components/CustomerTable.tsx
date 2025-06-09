
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnConfig } from './ColumnVisibilityFilter';

interface CustomerTableProps {
  customers: any[];
  visibleColumns: ColumnConfig[];
  selectedCustomers: string[];
  handleSelectCustomer: (customerId: string, checked: boolean) => void;
  handleSelectAll: (checked: boolean) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
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
  
  // Định nghĩa width cho từng loại cột
  const getColumnWidth = (columnKey: string): string => {
    // Cột ngắn (100px)
    const shortColumns = ['gender', 'currentDebt', 'debtDays', 'currentPoints', 'totalPoints', 'status'];
    
    // Cột trung bình (150px)
    const mediumColumns = ['customerCode', 'customerName', 'customerType', 'phone', 'email', 'creator', 'createDate', 'lastTransactionDate', 'totalSales'];
    
    // Cột dài (200-250px)
    const longColumns = ['customerGroup', 'birthDate', 'facebook', 'company', 'taxCode', 'idNumber', 'address', 'deliveryArea', 'ward', 'notes', 'createBranch', 'totalSalesMinusReturns'];
    
    if (shortColumns.includes(columnKey)) return '100px';
    if (mediumColumns.includes(columnKey)) return '150px';
    if (longColumns.includes(columnKey)) return '220px';
    
    return '150px'; // default
  };

  const getGroupBadgeColor = (group: string) => {
    switch (group) {
      case '1.Giới thiệu':
        return 'bg-blue-100 text-blue-800';
      case '2. Facebook':
        return 'bg-purple-100 text-purple-800';
      case '3. Google':
        return 'bg-green-100 text-green-800';
      case '4. Di dưỡng':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCellContent = (customer: any, columnKey: string) => {
    switch (columnKey) {
      case 'customerCode':
        return <span className="font-medium text-blue-600">{customer.id}</span>;
      case 'customerName':
        return <span className="font-medium">{customer.name}</span>;
      case 'phone':
        return customer.phone;
      case 'customerGroup':
        return (
          <Badge className={getGroupBadgeColor(customer.group)} variant="secondary">
            {customer.group}
          </Badge>
        );
      case 'birthDate':
        return customer.birthday;
      case 'creator':
        return customer.creator;
      case 'createDate':
        return customer.createdDate;
      case 'notes':
        return customer.note;
      case 'email':
        return customer.email;
      case 'facebook':
        return customer.facebook;
      case 'company':
        return customer.company;
      case 'taxCode':
        return customer.taxCode;
      case 'address':
        return customer.address;
      case 'deliveryArea':
        return customer.deliveryArea;
      case 'currentPoints':
        return customer.points?.toLocaleString();
      case 'totalSales':
        return customer.totalSpent?.toLocaleString();
      case 'currentDebt':
        return customer.totalDebt?.toLocaleString();
      case 'status':
        return customer.status;
      case 'customerType':
        return 'Cá nhân'; // mock data
      case 'gender':
        return 'Nam'; // mock data
      case 'idNumber':
        return '123456789012'; // mock data
      case 'ward':
        return 'Phường 1'; // mock data
      case 'lastTransactionDate':
        return '20/01/2024'; // mock data
      case 'createBranch':
        return 'Chi nhánh chính'; // mock data
      case 'debtDays':
        return '0'; // mock data
      case 'totalPoints':
        return '2000'; // mock data
      case 'totalSalesMinusReturns':
        return customer.totalSpent?.toLocaleString(); // mock data
      default:
        return '';
    }
  };

  // Calculate pagination info
  const startIndex = (currentPage - 1) * itemsPerPage;
  
  // Tính tổng width của table
  const totalTableWidth = visibleColumns.reduce((total, col) => {
    const width = parseInt(getColumnWidth(col.key));
    return total + width;
  }, 50); // 50px cho checkbox column

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6">
      {/* Table container với horizontal scroll được tối ưu */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: `${totalTableWidth}px` }}>
          <table className="w-full">
            <thead className="sticky top-0 bg-white z-10 border-b">
              <tr className="bg-gray-50">
                <th className="w-[50px] px-4 py-3 text-left">
                  <Checkbox 
                    checked={selectedCustomers.length === customers.length && customers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                {visibleColumns.map((column) => (
                  <th 
                    key={column.key} 
                    style={{ width: getColumnWidth(column.key) }}
                    className="px-4 py-3 text-left font-medium text-gray-500"
                  >
                    <div className="whitespace-normal break-words">
                      {column.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 border-b">
                  <td className="px-4 py-3">
                    <Checkbox 
                      checked={selectedCustomers.includes(customer.id)}
                      onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked as boolean)}
                    />
                  </td>
                  {visibleColumns.map((column) => (
                    <td 
                      key={column.key} 
                      style={{ width: getColumnWidth(column.key) }}
                      className="px-4 py-3"
                    >
                      <div className="whitespace-normal break-words text-sm">
                        {renderCellContent(customer, column.key)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination - outside table container but inside card */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Hiển thị</span>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">dòng</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <span className="text-sm text-gray-600">
            {startIndex + 1} - {Math.min(startIndex + itemsPerPage, customers.length)} trong {totalCustomers.toLocaleString()} khách hàng
          </span>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center space-x-1">
              <Input
                type="number"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="w-16 h-8 text-center"
              />
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
