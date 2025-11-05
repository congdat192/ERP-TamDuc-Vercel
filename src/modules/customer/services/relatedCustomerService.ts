/**
 * Related Customer Service
 * - Connects to External Supabase API for Related Customers Management
 * - Handles CRUD operations + Avatar Storage + Invoice Assignment
 */

import { 
  RelatedCustomer, 
  CreateRelatedCustomerData,
  UpdateRelatedCustomerData,
  RelatedAvatar,
  RelatedInvoice,
  UploadAvatarResponse,
  extractCustomerInfo
} from '../types/relatedCustomer.types';
import { MockRelatedCustomerAPI } from './relatedCustomerService.mockup';

// TODO: Replace with actual External Supabase API base URL
const EXTERNAL_API_BASE = import.meta.env.VITE_EXTERNAL_SUPABASE_API || 'https://your-external-supabase.com/api/v1';

// 🎭 MOCKUP MODE - Set to false when backend is ready
const USE_MOCKUP = true;

export class RelatedCustomerService {
  // ========== CRUD Operations ==========
  
  /**
   * Get all related customers by main customer phone
   */
  static async getRelatedByCustomerPhone(customerPhone: string): Promise<RelatedCustomer[]> {
    // 🎭 MOCKUP MODE
    if (USE_MOCKUP) {
      return MockRelatedCustomerAPI.getByCustomerPhone(customerPhone);
    }

    // 🔴 REAL API MODE
    try {
      const response = await fetch(
        `${EXTERNAL_API_BASE}/related-customers?customer_phone=${encodeURIComponent(customerPhone)}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch related customers');
      }
      
      return data.data || [];
    } catch (error) {
      console.error('[RelatedCustomerService] Error fetching related customers:', error);
      throw error;
    }
  }

  /**
   * Create a new related customer
   */
  static async createRelated(relatedData: CreateRelatedCustomerData): Promise<{ related_id: string; related_code: string }> {
    try {
      const response = await fetch(`${EXTERNAL_API_BASE}/related-customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(relatedData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to create related customer');
      }
      
      return data.data;
    } catch (error) {
      console.error('[RelatedCustomerService] Error creating related customer:', error);
      throw error;
    }
  }

  /**
   * Helper: Create related customer from existing customer object
   */
  static async createRelatedFromCustomer(
    customer: any,
    relatedData: Omit<CreateRelatedCustomerData, 'customer_phone' | 'customer_code' | 'customer_name' | 'customer_group'>
  ): Promise<{ related_id: string; related_code: string }> {
    const customerInfo = extractCustomerInfo(customer);
    
    const payload = {
      ...customerInfo,
      ...relatedData
    };

    // 🎭 MOCKUP MODE
    if (USE_MOCKUP) {
      const result = await MockRelatedCustomerAPI.create(payload);
      return { 
        related_id: result.id, 
        related_code: result.related_code 
      };
    }

    // 🔴 REAL API MODE
    return this.createRelated(payload);
  }

  /**
   * Upload avatar (supports MOCKUP mode)
   */
  static async uploadAvatar(
    relatedId: string, 
    file: File,
    uploadedBy: string
  ): Promise<UploadAvatarResponse> {
    // 🎭 MOCKUP MODE
    if (USE_MOCKUP) {
      return MockRelatedCustomerAPI.uploadAvatar(relatedId, file);
    }

    // 🔴 REAL API MODE
    try {
      // Validate file
      const validation = this.validateAvatarFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploaded_by', uploadedBy);

      // Upload via API
      const response = await fetch(
        `${EXTERNAL_API_BASE}/related-customers/${relatedId}/avatars/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to upload avatar');
      }

      return data.data;
    } catch (error) {
      console.error('[RelatedCustomerService] Error uploading avatar:', error);
      throw error;
    }
  }

  /**
   * Validate avatar file
   */
  private static validateAvatarFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Chỉ hỗ trợ file JPG, PNG hoặc WEBP'
      };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Kích thước file không được vượt quá 5MB'
      };
    }

    return { isValid: true };
  }

  /**
   * Update a related customer
   */
  static async updateRelated(relatedId: string, updates: UpdateRelatedCustomerData): Promise<void> {
    // 🎭 MOCKUP MODE
    if (USE_MOCKUP) {
      await MockRelatedCustomerAPI.update(relatedId, updates);
      return;
    }

    // 🔴 REAL API MODE
    try {
      const response = await fetch(`${EXTERNAL_API_BASE}/related-customers/${relatedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to update related customer');
      }
    } catch (error) {
      console.error('[RelatedCustomerService] Error updating related customer:', error);
      throw error;
    }
  }

  /**
   * Delete a related customer (soft delete)
   */
  static async deleteRelated(relatedId: string): Promise<void> {
    // 🎭 MOCKUP MODE
    if (USE_MOCKUP) {
      await MockRelatedCustomerAPI.delete(relatedId);
      return;
    }

    // 🔴 REAL API MODE
    try {
      const response = await fetch(`${EXTERNAL_API_BASE}/related-customers/${relatedId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete related customer');
      }
    } catch (error) {
      console.error('[RelatedCustomerService] Error deleting related customer:', error);
      throw error;
    }
  }

  // ========== Avatar Storage Operations ==========

  /**
   * Delete avatar from Storage (supports MOCKUP mode)
   */
  static async deleteAvatar(relatedId: string, avatarId: string): Promise<void> {
    // 🎭 MOCKUP MODE
    if (USE_MOCKUP) {
      await MockRelatedCustomerAPI.deleteAvatar(relatedId, avatarId);
      return;
    }

    // 🔴 REAL API MODE
    try {
      const response = await fetch(
        `${EXTERNAL_API_BASE}/related-customers/${relatedId}/avatars/${avatarId}`,
        { method: 'DELETE' }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete avatar');
      }
    } catch (error) {
      console.error('[RelatedCustomerService] Error deleting avatar:', error);
      throw error;
    }
  }

  /**
   * Set primary avatar (supports MOCKUP mode)
   */
  static async setPrimaryAvatar(relatedId: string, avatarId: string): Promise<void> {
    // 🎭 MOCKUP MODE
    if (USE_MOCKUP) {
      await MockRelatedCustomerAPI.setPrimaryAvatar(relatedId, avatarId);
      return;
    }

    // 🔴 REAL API MODE
    try {
      const response = await fetch(
        `${EXTERNAL_API_BASE}/related-customers/${relatedId}/avatars/${avatarId}/set-primary`,
        { method: 'PUT' }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to set primary avatar');
      }
    } catch (error) {
      console.error('[RelatedCustomerService] Error setting primary avatar:', error);
      throw error;
    }
  }

  /**
   * Get all avatars of a related customer (supports MOCKUP mode)
   */
  static async getAvatars(relatedId: string): Promise<RelatedAvatar[]> {
    // 🎭 MOCKUP MODE
    if (USE_MOCKUP) {
      return MockRelatedCustomerAPI.getAvatars(relatedId);
    }

    // 🔴 REAL API MODE
    try {
      const response = await fetch(
        `${EXTERNAL_API_BASE}/related-customers/${relatedId}/avatars`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch avatars');
      }
      
      return data.data || [];
    } catch (error) {
      console.error('[RelatedCustomerService] Error fetching avatars:', error);
      throw error;
    }
  }

  // ========== Invoice Assignment Operations ==========
  
  /**
   * Assign invoice to related customer (supports MOCKUP mode)
   */
  static async assignInvoice(
    relatedId: string,
    invoiceData: {
      invoice_code: string;
      invoice_date: string;
      total_amount: number;
      assigned_by: string;
      notes?: string;
    }
  ): Promise<void> {
    // 🎭 MOCKUP MODE
    if (USE_MOCKUP) {
      await MockRelatedCustomerAPI.assignInvoice(relatedId, invoiceData);
      return;
    }

    // 🔴 REAL API MODE
    try {
      const response = await fetch(
        `${EXTERNAL_API_BASE}/related-customers/${relatedId}/invoices`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invoiceData)
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to assign invoice');
      }
    } catch (error) {
      console.error('[RelatedCustomerService] Error assigning invoice:', error);
      throw error;
    }
  }

  /**
   * Unassign invoice from related customer (supports MOCKUP mode)
   */
  static async unassignInvoice(relatedId: string, invoiceCode: string): Promise<void> {
    // 🎭 MOCKUP MODE
    if (USE_MOCKUP) {
      await MockRelatedCustomerAPI.unassignInvoice(relatedId, invoiceCode);
      return;
    }

    // 🔴 REAL API MODE
    try {
      const response = await fetch(
        `${EXTERNAL_API_BASE}/related-customers/${relatedId}/invoices/${invoiceCode}`,
        { method: 'DELETE' }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to unassign invoice');
      }
    } catch (error) {
      console.error('[RelatedCustomerService] Error unassigning invoice:', error);
      throw error;
    }
  }

  /**
   * Get all invoices of a related customer (supports MOCKUP mode)
   */
  static async getInvoices(relatedId: string): Promise<RelatedInvoice[]> {
    // 🎭 MOCKUP MODE
    if (USE_MOCKUP) {
      return MockRelatedCustomerAPI.getInvoices(relatedId);
    }

    // 🔴 REAL API MODE
    try {
      const response = await fetch(
        `${EXTERNAL_API_BASE}/related-customers/${relatedId}/invoices`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch invoices');
      }
      
      return data.data || [];
    } catch (error) {
      console.error('[RelatedCustomerService] Error fetching invoices:', error);
      throw error;
    }
  }
}
