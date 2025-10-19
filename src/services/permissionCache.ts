/**
 * Ultra-Simple Permission Cache Service
 * - Caches user profile + role (level) only
 * - TTL: 2 hours
 * - No complex permissions, just role level for Owner/Admin check
 */

export interface CachedAuth {
  profile: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    avatar_path?: string;
    status: string;
  };
  role: {
    id: number;
    name: string;
    level: number;
    description?: string;
  };
  modules: string[];
  features: string[];
}

export class PermissionCache {
  private static KEY = 'tam_duc_erp_auth';
  private static TTL = 2 * 60 * 60 * 1000; // 2 hours
  private static VERSION = '2.2'; // Bump to invalidate cache with features field

  static save(data: CachedAuth): void {
    try {
      const cache = {
        data,
        ts: Date.now(),
        version: this.VERSION
      };
      localStorage.setItem(this.KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('❌ [PermissionCache] Save error:', error);
    }
  }

  static load(): CachedAuth | null {
    try {
      const item = localStorage.getItem(this.KEY);
      if (!item) return null;

      const parsed = JSON.parse(item);

      // Check version mismatch
      if (parsed.version !== this.VERSION) {
        console.log('⚠️ [PermissionCache] Version mismatch, clearing cache');
        this.clear();
        return null;
      }

      // Check TTL
      if (Date.now() - parsed.ts > this.TTL) {
        console.log('⏰ [PermissionCache] Cache expired, clearing');
        this.clear();
        return null;
      }

      console.log('✅ [PermissionCache] Cache hit');
      return parsed.data;
    } catch (error) {
      console.error('❌ [PermissionCache] Load error:', error);
      this.clear();
      return null;
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(this.KEY);
      console.log('🗑️ [PermissionCache] Cache cleared');
    } catch (error) {
      console.error('❌ [PermissionCache] Clear error:', error);
    }
  }

  static isExpiringSoon(): boolean {
    try {
      const item = localStorage.getItem(this.KEY);
      if (!item) return true;

      const { ts } = JSON.parse(item);
      const timeRemaining = this.TTL - (Date.now() - ts);
      return timeRemaining < 5 * 60 * 1000; // < 5 minutes
    } catch {
      return true;
    }
  }
}
