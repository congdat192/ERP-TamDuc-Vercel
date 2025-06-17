
export class DataSyncManager {
  private static listeners: Map<string, Set<() => void>> = new Map();

  // Subscribe to data changes for a specific storage key
  public static subscribe(storageKey: string, callback: () => void): () => void {
    if (!this.listeners.has(storageKey)) {
      this.listeners.set(storageKey, new Set());
    }
    
    this.listeners.get(storageKey)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      const keyListeners = this.listeners.get(storageKey);
      if (keyListeners) {
        keyListeners.delete(callback);
        if (keyListeners.size === 0) {
          this.listeners.delete(storageKey);
        }
      }
    };
  }

  // Notify all subscribers when data changes
  public static notify(storageKey: string): void {
    const keyListeners = this.listeners.get(storageKey);
    if (keyListeners) {
      keyListeners.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Error in data sync callback:', error);
        }
      });
    }
  }

  // Setup global event listeners for cross-module synchronization
  public static initialize(): void {
    // Listen for custom events from localStorage services
    window.addEventListener('erp-data-changed', (event: CustomEvent) => {
      this.notify(event.detail.storageKey);
    });

    // Listen for storage events from other tabs/windows
    window.addEventListener('storage', (event) => {
      if (event.key && event.key.startsWith('erp_')) {
        this.notify(event.key);
      }
    });

    console.log('DataSyncManager initialized');
  }

  // Force refresh all modules (useful for debugging)
  public static forceRefreshAll(): void {
    const storageKeys = ['erp_customers', 'erp_inventory', 'erp_sales', 'erp_vouchers'];
    storageKeys.forEach(key => this.notify(key));
  }

  // Get current listener count for debugging
  public static getStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    this.listeners.forEach((listeners, key) => {
      stats[key] = listeners.size;
    });
    return stats;
  }
}

// Auto-initialize when the module is imported
DataSyncManager.initialize();
