
import { BaseLocalStorageService } from './baseService';
import { MockSale } from '@/data/mockData';
import { customerService } from './customerService';
import { inventoryService } from './inventoryService';

class SalesLocalStorageService extends BaseLocalStorageService<MockSale> {
  constructor() {
    super('erp_sales');
  }

  // Override create to handle cross-module updates
  public create(sale: Omit<MockSale, 'id'> & { id?: string }): MockSale {
    const newSale = super.create(sale);
    
    // Update customer total spent and points
    if (newSale.customerId && newSale.paidAmount > 0) {
      customerService.updateTotalSpent(newSale.customerId, newSale.paidAmount);
      // Award points (1 point per 1000 VND spent)
      const pointsEarned = Math.floor(newSale.paidAmount / 1000);
      customerService.updatePoints(newSale.customerId, pointsEarned);
    }

    // Update product stock if items are specified
    newSale.items.forEach(productId => {
      inventoryService.updateStock(productId, -1); // Decrease stock by 1
    });

    return newSale;
  }

  // Override delete to handle reverse updates
  public delete(id: string): boolean {
    const sale = this.getById(id);
    if (!sale) return false;

    const deleted = super.delete(id);
    if (deleted) {
      // Reverse customer updates
      if (sale.customerId && sale.paidAmount > 0) {
        customerService.updateTotalSpent(sale.customerId, -sale.paidAmount);
        const pointsToDeduct = Math.floor(sale.paidAmount / 1000);
        customerService.updatePoints(sale.customerId, -pointsToDeduct);
      }

      // Restore product stock
      sale.items.forEach(productId => {
        inventoryService.updateStock(productId, 1); // Increase stock back
      });
    }

    return deleted;
  }

  // Custom methods for sales-specific operations
  public getByCustomerId(customerId: string): MockSale[] {
    const sales = this.getFromStorage();
    return sales.filter(sale => sale.customerId === customerId);
  }

  public getByDateRange(startDate: string, endDate: string): MockSale[] {
    const sales = this.getFromStorage();
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return saleDate >= start && saleDate <= end;
    });
  }

  public getByStatus(status: string): MockSale[] {
    const sales = this.getFromStorage();
    return sales.filter(sale => sale.status === status);
  }

  public getBySeller(seller: string): MockSale[] {
    const sales = this.getFromStorage();
    return sales.filter(sale => sale.seller === seller);
  }

  public getByChannel(channel: string): MockSale[] {
    const sales = this.getFromStorage();
    return sales.filter(sale => sale.channel === channel);
  }

  public getTotalRevenue(): number {
    const sales = this.getFromStorage();
    return sales.reduce((total, sale) => total + sale.paidAmount, 0);
  }

  public getTotalRevenueByDateRange(startDate: string, endDate: string): number {
    const salesInRange = this.getByDateRange(startDate, endDate);
    return salesInRange.reduce((total, sale) => total + sale.paidAmount, 0);
  }

  public searchByCustomerInfo(query: string): MockSale[] {
    const sales = this.getFromStorage();
    const lowerQuery = query.toLowerCase();
    return sales.filter(sale => 
      sale.customer.toLowerCase().includes(lowerQuery) ||
      sale.phone.includes(query) ||
      sale.orderCode.toLowerCase().includes(lowerQuery)
    );
  }
}

export const salesService = new SalesLocalStorageService();
