
export interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  currentDebt: number;
  daysOwed: number;
  totalSales: number;
  totalSalesAfterReturns: number;
  customerGroup?: string;
  branchCreator?: string;
  creator?: string;
  customerType: 'individual' | 'company';
  gender?: 'male' | 'female';
  birthday?: Date;
  lastTransactionDate?: Date;
  createdDate: Date;
  email?: string;
  address?: string;
}

export interface CustomerFilters {
  customerGroup?: string;
  branchCreator?: string;
  creator?: string;
  customerType?: 'individual' | 'company' | 'all';
  gender?: 'male' | 'female' | 'all';
  birthdayFrom?: Date;
  birthdayTo?: Date;
  lastTransactionFrom?: Date;
  lastTransactionTo?: Date;
  createdDateFrom?: Date;
  createdDateTo?: Date;
  search?: string;
}

export interface CustomerSummary {
  totalCustomers: number;
  totalCurrentDebt: number;
  totalSales: number;
  totalSalesAfterReturns: number;
}
