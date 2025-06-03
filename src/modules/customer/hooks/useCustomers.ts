
import { useState, useMemo, useCallback } from 'react';
import { Customer, CustomerFilters, CustomerSummary } from '../types';

// Mock data generator
const generateMockCustomers = (): Customer[] => {
  const customers: Customer[] = [];
  const names = [
    'Anh Thành', 'Anh Hoà', 'Anh Trí', 'Anh Đỗ Hào', 'Chị Thảo', 'Cô Hoa', 'Chị Huyền', 
    'Cô Thuý', 'Chị Đỗ Thị Thảo Vân', 'Chị Khánh Dư', 'Chị Nguyễn Khánh Linh', 'Chị Hân',
    'Chị Bảo Bình', 'Cô Đặng Thị Ngọc Thủy', 'Anh Minh Thuận', 'Anh Lê Phát Đại'
  ];
  
  for (let i = 0; i < 100; i++) {
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomDebt = Math.random() > 0.7 ? Math.floor(Math.random() * 10000000) : 0;
    const randomSales = Math.floor(Math.random() * 50000000);
    
    customers.push({
      id: `customer-${i + 1}`,
      code: `KH${(869939 + i).toString()}`,
      name: `${randomName} ${i + 1}`,
      phone: `0${Math.floor(Math.random() * 900000000) + 100000000}`,
      currentDebt: randomDebt,
      daysOwed: randomDebt > 0 ? Math.floor(Math.random() * 30) : 0,
      totalSales: randomSales,
      totalSalesAfterReturns: randomSales,
      customerGroup: ['vip', 'regular', 'wholesale'][Math.floor(Math.random() * 3)],
      branchCreator: 'Chi nhánh chính',
      creator: 'Admin',
      customerType: Math.random() > 0.8 ? 'company' : 'individual',
      gender: Math.random() > 0.5 ? 'male' : 'female',
      birthday: new Date(1970 + Math.floor(Math.random() * 50), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      lastTransactionDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
      createdDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000),
      email: `customer${i + 1}@email.com`,
      address: `Địa chỉ ${i + 1}, Quận 1, TP.HCM`
    });
  }
  
  return customers;
};

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(generateMockCustomers());
  const [filters, setFilters] = useState<CustomerFilters>({});
  const [isLoading, setIsLoading] = useState(false);

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          customer.code.toLowerCase().includes(searchLower) ||
          customer.name.toLowerCase().includes(searchLower) ||
          customer.phone.includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Customer group filter
      if (filters.customerGroup && customer.customerGroup !== filters.customerGroup) {
        return false;
      }

      // Customer type filter
      if (filters.customerType && filters.customerType !== 'all' && customer.customerType !== filters.customerType) {
        return false;
      }

      // Gender filter
      if (filters.gender && filters.gender !== 'all' && customer.gender !== filters.gender) {
        return false;
      }

      // Branch creator filter
      if (filters.branchCreator && !customer.branchCreator?.toLowerCase().includes(filters.branchCreator.toLowerCase())) {
        return false;
      }

      // Creator filter
      if (filters.creator && !customer.creator?.toLowerCase().includes(filters.creator.toLowerCase())) {
        return false;
      }

      // Date filters
      if (filters.createdDateFrom && customer.createdDate < filters.createdDateFrom) {
        return false;
      }
      if (filters.createdDateTo && customer.createdDate > filters.createdDateTo) {
        return false;
      }

      if (filters.birthdayFrom && customer.birthday && customer.birthday < filters.birthdayFrom) {
        return false;
      }
      if (filters.birthdayTo && customer.birthday && customer.birthday > filters.birthdayTo) {
        return false;
      }

      if (filters.lastTransactionFrom && customer.lastTransactionDate && customer.lastTransactionDate < filters.lastTransactionFrom) {
        return false;
      }
      if (filters.lastTransactionTo && customer.lastTransactionDate && customer.lastTransactionDate > filters.lastTransactionTo) {
        return false;
      }

      return true;
    });
  }, [customers, filters]);

  const summary = useMemo((): CustomerSummary => {
    return {
      totalCustomers: filteredCustomers.length,
      totalCurrentDebt: filteredCustomers.reduce((sum, customer) => sum + customer.currentDebt, 0),
      totalSales: filteredCustomers.reduce((sum, customer) => sum + customer.totalSales, 0),
      totalSalesAfterReturns: filteredCustomers.reduce((sum, customer) => sum + customer.totalSalesAfterReturns, 0),
    };
  }, [filteredCustomers]);

  const addCustomer = useCallback((newCustomer: Omit<Customer, 'id' | 'createdDate'>) => {
    const customer: Customer = {
      ...newCustomer,
      id: `customer-${Date.now()}`,
      code: newCustomer.code || `KH${Date.now().toString().slice(-6)}`,
      createdDate: new Date(),
    };
    
    setCustomers(prev => [customer, ...prev]);
  }, []);

  const updateCustomer = useCallback((customerId: string, updates: Partial<Customer>) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === customerId 
          ? { ...customer, ...updates }
          : customer
      )
    );
  }, []);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCustomers(generateMockCustomers());
    setIsLoading(false);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    customers: filteredCustomers,
    summary,
    filters,
    isLoading,
    setFilters,
    addCustomer,
    updateCustomer,
    refreshData,
    resetFilters,
  };
}
