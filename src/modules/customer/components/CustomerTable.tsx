
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
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
      case 'id':
        return <span className="font-medium text-blue-600">{customer.id}</span>;
      case 'name':
        return <span className="font-medium">{customer.name}</span>;
      case 'phone':
        return customer.phone;
      case 'group':
        return (
          <Badge className={getGroupBadgeColor(customer.group)} variant="secondary">
            {customer.group}
          </Badge>
        );
      case 'birthday':
        return customer.birthday;
      case 'creator':
        return customer.creator;
      case 'createdDate':
        return customer.createdDate;
      case 'note':
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
      case 'points':
        return customer.points?.toLocaleString();
      case 'totalSpent':
        return customer.totalSpent?.toLocaleString();
      case 'totalDebt':
        return customer.totalDebt?.toLocaleString();
      case 'status':
        return customer.status;
      default:
        return '';
    }
  };

  // Calculate pagination info
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6">
      {/* Table container with proper horizontal scroll */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full table-fixed" style={{ minWidth: `${visibleColumns.length * 150}px` }}>
          <thead className="sticky top-0 bg-white z-10 border-b">
            <tr className="bg-gray-50">
              <th className="w-12 px-4 py-3 text-left">
                <Checkbox 
                  checked={selectedCustomers.length === customers.length && customers.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              {visibleColumns.map((column) => (
                <th key={column.key} className="min-w-[150px] px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">
                  {column.label}
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
                  <td key={column.key} className="min-w-[150px] px-4 py-3 whitespace-nowrap">
                    {renderCellContent(customer, column.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
