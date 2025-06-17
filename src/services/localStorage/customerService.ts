
import { BaseLocalStorageService } from './baseService';
import { MockCustomer } from '@/data/mockData';

class CustomerLocalStorageService extends BaseLocalStorageService<MockCustomer> {
  constructor() {
    super('erp_customers');
  }

  // Custom methods for customer-specific operations
  public getByPhone(phone: string): MockCustomer | undefined {
    const customers = this.getFromStorage();
    return customers.find(customer => customer.phone === phone);
  }

  public getByGroup(group: string): MockCustomer[] {
    const customers = this.getFromStorage();
    return customers.filter(customer => customer.group === group);
  }

  public updateTotalSpent(customerId: string, amount: number): boolean {
    const customer = this.getById(customerId);
    if (!customer) return false;

    const updatedCustomer = this.update(customerId, {
      totalSpent: customer.totalSpent + amount
    });
    return !!updatedCustomer;
  }

  public updatePoints(customerId: string, points: number): boolean {
    const customer = this.getById(customerId);
    if (!customer) return false;

    const updatedCustomer = this.update(customerId, {
      points: customer.points + points
    });
    return !!updatedCustomer;
  }

  public updateDebt(customerId: string, debtAmount: number): boolean {
    const customer = this.getById(customerId);
    if (!customer) return false;

    const updatedCustomer = this.update(customerId, {
      totalDebt: customer.totalDebt + debtAmount
    });
    return !!updatedCustomer;
  }

  public getActiveCustomers(): MockCustomer[] {
    const customers = this.getFromStorage();
    return customers.filter(customer => customer.status === 'Hoạt động');
  }

  public searchByName(name: string): MockCustomer[] {
    const customers = this.getFromStorage();
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  public searchByPhoneOrName(query: string): MockCustomer[] {
    const customers = this.getFromStorage();
    const lowerQuery = query.toLowerCase();
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(lowerQuery) ||
      customer.phone.includes(query)
    );
  }
}

export const customerService = new CustomerLocalStorageService();
