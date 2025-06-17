
export abstract class BaseLocalStorageService<T> {
  protected storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  protected getFromStorage(): T[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading from localStorage (${this.storageKey}):`, error);
      return [];
    }
  }

  protected saveToStorage(data: T[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      this.notifyDataChange();
    } catch (error) {
      console.error(`Error saving to localStorage (${this.storageKey}):`, error);
      throw new Error('Không thể lưu dữ liệu');
    }
  }

  protected notifyDataChange(): void {
    // Dispatch custom event for cross-module synchronization
    window.dispatchEvent(new CustomEvent('erp-data-changed', {
      detail: { storageKey: this.storageKey }
    }));
  }

  public getAll(): T[] {
    return this.getFromStorage();
  }

  public getById(id: string): T | undefined {
    const data = this.getFromStorage();
    return data.find((item: any) => item.id === id);
  }

  public create(item: Omit<T, 'id'> & { id?: string }): T {
    const data = this.getFromStorage();
    const newItem = {
      ...item,
      id: item.id || this.generateId(),
    } as T;
    
    data.push(newItem);
    this.saveToStorage(data);
    return newItem;
  }

  public update(id: string, updates: Partial<T>): T | null {
    const data = this.getFromStorage();
    const index = data.findIndex((item: any) => item.id === id);
    
    if (index === -1) return null;
    
    data[index] = { ...data[index], ...updates };
    this.saveToStorage(data);
    return data[index];
  }

  public delete(id: string): boolean {
    const data = this.getFromStorage();
    const filteredData = data.filter((item: any) => item.id !== id);
    
    if (filteredData.length === data.length) return false;
    
    this.saveToStorage(filteredData);
    return true;
  }

  public search(criteria: Partial<T>): T[] {
    const data = this.getFromStorage();
    return data.filter(item => {
      return Object.entries(criteria).every(([key, value]) => {
        const itemValue = (item as any)[key];
        if (typeof value === 'string' && typeof itemValue === 'string') {
          return itemValue.toLowerCase().includes(value.toLowerCase());
        }
        return itemValue === value;
      });
    });
  }

  public count(): number {
    return this.getFromStorage().length;
  }

  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize with mock data if empty
  public initializeWithMockData(mockData: T[]): void {
    const existingData = this.getFromStorage();
    if (existingData.length === 0) {
      this.saveToStorage(mockData);
      console.log(`Initialized ${this.storageKey} with ${mockData.length} mock records`);
    }
  }
}
