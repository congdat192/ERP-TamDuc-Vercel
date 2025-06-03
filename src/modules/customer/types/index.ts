
export interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  customerGroup: string;
  customerType: 'individual' | 'company';
  gender?: 'male' | 'female';
  birthday?: Date;
  creator: string;
  branch: string;
  createdDate: Date;
  lastTransactionDate?: Date;
  currentDebt: number;
  daysOwed: number;
  totalSales: number;
  totalSalesAfterReturns: number;
  status: 'active' | 'inactive';
}

export interface CustomerFilters {
  customerGroup: string;
  branch: string;
  createdDateFrom?: Date;
  createdDateTo?: Date;
  creator: string;
  customerType: string;
  gender: string;
  birthdayFrom?: Date;
  birthdayTo?: Date;
  lastTransactionDateFrom?: Date;
  lastTransactionDateTo?: Date;
}

export interface CustomerSummary {
  totalCustomers: number;
  totalDebt: number;
  totalSales: number;
  totalSalesAfterReturns: number;
}
