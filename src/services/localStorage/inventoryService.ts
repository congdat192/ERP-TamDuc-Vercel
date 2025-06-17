
import { BaseLocalStorageService } from './baseService';
import { MockInventory } from '@/data/mockData';

class InventoryLocalStorageService extends BaseLocalStorageService<MockInventory> {
  constructor() {
    super('erp_inventory');
  }

  // Custom methods for inventory-specific operations
  public getByProductCode(productCode: string): MockInventory | undefined {
    const products = this.getFromStorage();
    return products.find(product => product.productCode === productCode);
  }

  public getByBarcode(barcode: string): MockInventory | undefined {
    const products = this.getFromStorage();
    return products.find(product => product.barcode === barcode);
  }

  public getByCategory(category: string): MockInventory[] {
    const products = this.getFromStorage();
    return products.filter(product => product.category === category);
  }

  public getByBrand(brand: string): MockInventory[] {
    const products = this.getFromStorage();
    return products.filter(product => product.brand === brand);
  }

  public getLowStockProducts(): MockInventory[] {
    const products = this.getFromStorage();
    return products.filter(product => product.stock <= product.minStock);
  }

  public getActiveProducts(): MockInventory[] {
    const products = this.getFromStorage();
    return products.filter(product => product.status === 'Đang bán');
  }

  public updateStock(productId: string, quantityChange: number): boolean {
    const product = this.getById(productId);
    if (!product) return false;

    const newStock = product.stock + quantityChange;
    if (newStock < 0) return false; // Prevent negative stock

    const updatedProduct = this.update(productId, {
      stock: newStock,
      lastUpdated: new Date().toLocaleString('vi-VN')
    });
    return !!updatedProduct;
  }

  public reserveStock(productId: string, quantity: number): boolean {
    const product = this.getById(productId);
    if (!product || product.stock < quantity) return false;

    const updatedProduct = this.update(productId, {
      reservedCustomers: product.reservedCustomers + 1,
      stock: product.stock - quantity
    });
    return !!updatedProduct;
  }

  public searchByName(name: string): MockInventory[] {
    const products = this.getFromStorage();
    return products.filter(product => 
      product.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  public searchByCodeOrName(query: string): MockInventory[] {
    const products = this.getFromStorage();
    const lowerQuery = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.productCode.toLowerCase().includes(lowerQuery) ||
      product.barcode.includes(query)
    );
  }
}

export const inventoryService = new InventoryLocalStorageService();
