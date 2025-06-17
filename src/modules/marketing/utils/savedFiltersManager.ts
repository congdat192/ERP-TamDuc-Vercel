
import { SavedFilterSegment, AdvancedFilter } from '../types/filter';

const STORAGE_KEY = 'marketing_saved_filters';

export class SavedFiltersManager {
  static getSavedFilters(): SavedFilterSegment[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading saved filters:', error);
      return [];
    }
  }

  static saveFilter(name: string, description: string, filter: AdvancedFilter, customerCount: number): SavedFilterSegment {
    const savedFilter: SavedFilterSegment = {
      id: Date.now().toString(),
      name,
      description,
      filter: {
        ...filter,
        name,
        id: Date.now().toString()
      },
      customerCount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const savedFilters = this.getSavedFilters();
    savedFilters.push(savedFilter);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedFilters));
    return savedFilter;
  }

  static updateFilter(id: string, updates: Partial<SavedFilterSegment>): boolean {
    const savedFilters = this.getSavedFilters();
    const index = savedFilters.findIndex(f => f.id === id);
    
    if (index === -1) return false;

    savedFilters[index] = {
      ...savedFilters[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedFilters));
    return true;
  }

  static deleteFilter(id: string): boolean {
    const savedFilters = this.getSavedFilters();
    const filtered = savedFilters.filter(f => f.id !== id);
    
    if (filtered.length === savedFilters.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  static renameFilter(id: string, newName: string): boolean {
    return this.updateFilter(id, { name: newName });
  }
}
