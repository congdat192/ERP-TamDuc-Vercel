import { useState, useMemo } from 'react';
import { Customer, CustomerFilters, CustomerSummary } from '../types';

// Mock data for demonstration
const mockCustomers: Customer[] = [
  {
    id: '1',
    code: 'KH869953',
    name: 'Anh Thành',
    phone: '0795442122',
    email: 'thanh@email.com',
    customerGroup: 'VIP',
    customerType: 'individual',
    gender: 'male',
    creator: 'Admin',
    branch: 'Chi nhánh 1',
    createdDate: new Date('2024-01-15'),
    lastTransactionDate: new Date('2024-01-20'),
    currentDebt: 0,
    daysOwed: 0,
    totalSales: 1631000,
    totalSalesAfterReturns: 1631000,
    status: 'active'
  },
  {
    id: '2',
    code: 'KH869952',
    name: 'Anh Hoà',
    phone: '0328750955',
    email: 'hoa@email.com',
    customerGroup: 'Thường',
    customerType: 'individual',
    gender: 'male',
    creator: 'Admin',
    branch: 'Chi nhánh 1',
    createdDate: new Date('2024-01-10'),
    lastTransactionDate: new Date('2024-01-18'),
    currentDebt: 0,
    daysOwed: 0,
    totalSales: 560000,
    totalSalesAfterReturns: 560000,
    status: 'active'
  },
  {
    id: '3',
    code: 'KH869951',
    name: 'Anh Trí',
    phone: '0090147044',
    customerGroup: 'Thường',
    customerType: 'individual',
    gender: 'male',
    creator: 'Staff1',
    branch: 'Chi nhánh 2',
    createdDate: new Date('2024-01-05'),
    currentDebt: 0,
    daysOwed: 0,
    totalSales: 0,
    totalSalesAfterReturns: 0,
    status: 'active'
  },
  {
    id: '4',
    code: 'KH869950',
    name: 'Anh Đỗ Hào',
    phone: '0337092306',
    customerGroup: 'VIP',
    customerType: 'individual',
    gender: 'male',
    creator: 'Admin',
    branch: 'Chi nhánh 1',
    createdDate: new Date('2024-01-08'),
    lastTransactionDate: new Date('2024-01-16'),
    currentDebt: 0,
    daysOwed: 0,
    totalSales: 1144000,
    totalSalesAfterReturns: 1144000,
    status: 'active'
  },
  {
    id: '5',
    code: 'KH869949',
    name: 'Chị Thảo',
    phone: '0979423393',
    customerGroup: 'Premium',
    customerType: 'individual',
    gender: 'female',
    creator: 'Staff2',
    branch: 'Chi nhánh 1',
    createdDate: new Date('2024-01-12'),
    lastTransactionDate: new Date('2024-01-19'),
    currentDebt: 0,
    daysOwed: 0,
    totalSales: 1247000,
    totalSalesAfterReturns: 1247000,
    status: 'active'
  }
];

export function useCustomers() {
  const [customers] = useState<Customer[]>(mockCustomers);
  const [filters, setFilters] = useState<CustomerFilters>({
    customerGroup: 'all',
    branch: 'all',
    creator: 'all',
    customerType: 'all',
    gender: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      // Search filter
      const matchesSearch = 
        customer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm);

      // Other filters
      const matchesGroup = filters.customerGroup === 'all' || customer.customerGroup === filters.customerGroup;
      const matchesBranch = filters.branch === 'all' || customer.branch === filters.branch;
      const matchesCreator = filters.creator === 'all' || customer.creator === filters.creator;
      const matchesType = filters.customerType === 'all' || customer.customerType === filters.customerType;
      const matchesGender = filters.gender === 'all' || customer.gender === filters.gender;

      return matchesSearch && matchesGroup && matchesBranch && matchesCreator && matchesType && matchesGender;
    });
  }, [customers, filters, searchTerm]);

  const summary = useMemo((): CustomerSummary => {
    return filteredCustomers.reduce(
      (acc, customer) => ({
        totalCustomers: acc.totalCustomers + 1,
        totalDebt: acc.totalDebt + customer.currentDebt,
        totalSales: acc.totalSales + customer.totalSales,
        totalSalesAfterReturns: acc.totalSalesAfterReturns + customer.totalSalesAfterReturns
      }),
      { totalCustomers: 0, totalDebt: 0, totalSales: 0, totalSalesAfterReturns: 0 }
    );
  }, [filteredCustomers]);

  return {
    customers: filteredCustomers,
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    summary
  };
}
