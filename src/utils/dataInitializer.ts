
import { mockCustomers, mockInventory, mockSales } from '@/data/mockData';
import { customerService } from '@/services/localStorage/customerService';
import { inventoryService } from '@/services/localStorage/inventoryService';
import { salesService } from '@/services/localStorage/salesService';
import { voucherService } from '@/services/localStorage/voucherService';

// Sample voucher data for initialization
const mockVouchers = [
  {
    id: 'voucher-1',
    code: 'VCH-2024-001',
    value: '500,000đ',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0901234567',
    status: 'active' as const,
    issueDate: '01/06/2024',
    expiryDate: '31/12/2024',
    issuedBy: 'Admin',
    notes: 'Voucher khách VIP'
  },
  {
    id: 'voucher-2',
    code: 'VCH-2024-002',
    value: '200,000đ',
    customerName: 'Trần Thị Bình',
    customerPhone: '0907654321',
    status: 'used' as const,
    issueDate: '05/06/2024',
    expiryDate: '31/12/2024',
    usedDate: '10/06/2024',
    issuedBy: 'Manager',
    notes: 'Voucher khuyến mãi'
  }
];

export class DataInitializer {
  private static readonly DATA_VERSION_KEY = 'erp_data_version';
  private static readonly CURRENT_VERSION = '1.0.0';

  public static async initializeAllData(): Promise<void> {
    try {
      const currentVersion = localStorage.getItem(this.DATA_VERSION_KEY);
      
      if (currentVersion !== this.CURRENT_VERSION) {
        console.log('Initializing ERP data with mock data...');
        
        // Initialize all modules with mock data
        customerService.initializeWithMockData(mockCustomers);
        inventoryService.initializeWithMockData(mockInventory);
        salesService.initializeWithMockData(mockSales);
        voucherService.initializeWithMockData(mockVouchers);

        // Set version to prevent re-initialization
        localStorage.setItem(this.DATA_VERSION_KEY, this.CURRENT_VERSION);
        
        console.log('ERP data initialization completed');
        
        // Dispatch event to notify modules
        window.dispatchEvent(new CustomEvent('erp-data-initialized'));
      } else {
        console.log('ERP data already initialized');
      }
    } catch (error) {
      console.error('Error initializing ERP data:', error);
    }
  }

  public static resetAllData(): void {
    localStorage.removeItem('erp_customers');
    localStorage.removeItem('erp_inventory');
    localStorage.removeItem('erp_sales');
    localStorage.removeItem('erp_vouchers');
    localStorage.removeItem(this.DATA_VERSION_KEY);
    
    // Re-initialize with fresh mock data
    this.initializeAllData();
  }

  public static getDataStats(): Record<string, number> {
    return {
      customers: customerService.count(),
      inventory: inventoryService.count(),
      sales: salesService.count(),
      vouchers: voucherService.count()
    };
  }

  public static exportAllData(): Record<string, any> {
    return {
      customers: customerService.getAll(),
      inventory: inventoryService.getAll(),
      sales: salesService.getAll(),
      vouchers: voucherService.getAll(),
      version: this.CURRENT_VERSION,
      exportedAt: new Date().toISOString()
    };
  }

  public static importAllData(data: Record<string, any>): boolean {
    try {
      if (data.customers) {
        localStorage.setItem('erp_customers', JSON.stringify(data.customers));
      }
      if (data.inventory) {
        localStorage.setItem('erp_inventory', JSON.stringify(data.inventory));
      }
      if (data.sales) {
        localStorage.setItem('erp_sales', JSON.stringify(data.sales));
      }
      if (data.vouchers) {
        localStorage.setItem('erp_vouchers', JSON.stringify(data.vouchers));
      }
      
      localStorage.setItem(this.DATA_VERSION_KEY, data.version || this.CURRENT_VERSION);
      
      // Notify all modules about data change
      window.dispatchEvent(new CustomEvent('erp-data-imported'));
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

// Auto-initialize when the module is imported
DataInitializer.initializeAllData();
