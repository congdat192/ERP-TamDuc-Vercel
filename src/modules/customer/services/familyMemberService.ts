/**
 * Family Member Service
 * - Connects to External API for Family Members Management via customer-family-members endpoint
 * - 8 Actions: ADD, UPDATE, RENAME, DELETE, ADD_IMAGE, DELETE_IMAGE, ASSIGN_BILLS, UNASSIGN_BILL
 */

import { supabase } from '@/integrations/supabase/client';
import { FamilyMember } from './customerService';

export class FamilyMemberService {
  // Base endpoint
  private static readonly ENDPOINT = 'customer-family-members';

  /**
   * Helper: Get OAuth token (reuse existing pattern from other edge functions)
   */
  private static async getAuthHeaders(): Promise<HeadersInit> {
    // Token is handled automatically by supabase.functions.invoke
    return {
      'Content-Type': 'application/json'
    };
  }

  /**
   * Helper: Parse error from Supabase Functions response
   * Extracts detailed error information for better user feedback
   */
  private static parseError(error: any, result: any, action: string): string {
    console.error(`[FamilyMemberService] ${action} error:`, { error, result });

    // 1. Check if result has error details (from API response)
    if (result) {
      if (!result.success && result.error_description) {
        return result.error_description;
      }
      if (!result.success && result.error) {
        return typeof result.error === 'string' ? result.error : JSON.stringify(result.error);
      }
      if (result.details) {
        console.error(`[FamilyMemberService] ${action} details:`, result.details);
      }
    }

    // 2. Parse FunctionInvokeError (from Supabase SDK)
    if (error) {
      // Check if error.context contains response body
      if (error.context) {
        try {
          const contextData = typeof error.context === 'string'
            ? JSON.parse(error.context)
            : error.context;

          if (contextData.error_description) {
            return contextData.error_description;
          }
          if (contextData.error) {
            return typeof contextData.error === 'string'
              ? contextData.error
              : JSON.stringify(contextData.error);
          }
        } catch (e) {
          console.error('[FamilyMemberService] Failed to parse error.context:', e);
        }
      }

      // Return error message directly
      if (error.message) {
        return error.message;
      }
    }

    // 3. Fallback to generic message
    return `Không thể thực hiện ${action}. Vui lòng thử lại hoặc liên hệ quản trị viên.`;
  }

  // ========== 1. ADD - Thêm người thân mới ==========
  static async addFamilyMember(
    customerPhone: string,
    memberData: {
      ten: string;
      moi_quan_he: string;
      gioi_tinh?: 'nam' | 'nu' | 'khac';
      ngay_sinh?: string; // YYYY-MM-DD
      sdt?: string; // Phone number
      ghi_chu?: string;
      hinh_anh?: string[]; // Array of image URLs
    }
  ): Promise<FamilyMember> {
    const { data: result, error } = await supabase.functions.invoke(this.ENDPOINT, {
      body: {
        action: 'add',
        customer_sdt: customerPhone,
        nguoi_than: {
          ten: memberData.ten,
          moi_quan_he: memberData.moi_quan_he,
          gioi_tinh: memberData.gioi_tinh,
          ngay_sinh: memberData.ngay_sinh,
          sdt: memberData.sdt,
          ghi_chu: memberData.ghi_chu,
          hinh_anh: memberData.hinh_anh
        }
      }
    });

    if (error || !result?.success) {
      throw new Error(this.parseError(error, result, 'ADD'));
    }

    return result.data.family_member;
  }

  // ========== 2. UPDATE - Cập nhật thông tin người thân ==========
  static async updateFamilyMember(
    customerPhone: string,
    ten: string, // Identify by name
    updates: {
      moi_quan_he?: string;
      gioi_tinh?: 'nam' | 'nu' | 'khac';
      ngay_sinh?: string;
      sdt?: string;
      ghi_chu?: string;
    }
  ): Promise<FamilyMember> {
    const { data: result, error } = await supabase.functions.invoke(this.ENDPOINT, {
      body: {
        action: 'update',
        customer_sdt: customerPhone,
        nguoi_than: {
          ten,
          ...updates
        }
      }
    });

    if (error || !result?.success) {
      throw new Error(this.parseError(error, result, 'UPDATE'));
    }

    return result.data.family_member;
  }

  // ========== 3. RENAME - Đổi tên người thân ==========
  static async renameFamilyMember(
    customerPhone: string,
    ten_cu: string,
    ten_moi: string
  ): Promise<FamilyMember> {
    const { data: result, error } = await supabase.functions.invoke(this.ENDPOINT, {
      body: {
        action: 'rename',
        customer_sdt: customerPhone,
        ten_cu,      // ✅ Root level (not inside nguoi_than)
        ten_moi      // ✅ Root level (not inside nguoi_than)
      }
    });

    if (error || !result?.success) {
      throw new Error(this.parseError(error, result, 'RENAME'));
    }

    return result.data.family_member;
  }

  // ========== 4. DELETE - Xóa người thân ==========
  static async deleteFamilyMember(
    customerPhone: string,
    ten: string
  ): Promise<void> {
    const { data: result, error } = await supabase.functions.invoke(this.ENDPOINT, {
      body: {
        action: 'delete',
        customer_sdt: customerPhone,
        nguoi_than: {
          ten
        }
      }
    });

    if (error || !result?.success) {
      throw new Error(this.parseError(error, result, 'DELETE'));
    }
  }

  // ========== 5. ADD_IMAGE - Thêm hình ảnh ==========
  static async addImages(
    customerPhone: string,
    ten: string,
    hinh_anh_moi: string[] // Array of URLs
  ): Promise<FamilyMember> {
    const { data: result, error } = await supabase.functions.invoke(this.ENDPOINT, {
      body: {
        action: 'add_image',
        customer_sdt: customerPhone,
        nguoi_than: {
          ten,
          hinh_anh_moi
        }
      }
    });

    if (error || !result?.success) {
      throw new Error(this.parseError(error, result, 'ADD_IMAGE'));
    }

    return result.data.family_member;
  }

  // ========== 6. DELETE_IMAGE - Xóa hình ảnh ==========
  static async deleteImage(
    customerPhone: string,
    ten: string,
    image_url: string // Single URL
  ): Promise<FamilyMember> {
    const { data: result, error } = await supabase.functions.invoke(this.ENDPOINT, {
      body: {
        action: 'delete_image',
        customer_sdt: customerPhone,
        nguoi_than: {
          ten,
          image_url
        }
      }
    });

    if (error || !result?.success) {
      throw new Error(this.parseError(error, result, 'DELETE_IMAGE'));
    }

    return result.data.family_member;
  }

  // ========== 7. ASSIGN_BILLS - Gán hóa đơn (nhiều hóa đơn) ==========
  static async assignBills(
    customerPhone: string,
    ten: string,
    billIds: number[] // ✅ Array of invoice IDs (numbers) [12345, 67890]
  ): Promise<FamilyMember> {
    const { data: result, error } = await supabase.functions.invoke(this.ENDPOINT, {
      body: {
        action: 'assign_bills',
        customer_sdt: customerPhone,
        nguoi_than: {
          ten,
          hoadon_ids: billIds // ✅ API expects array of numbers
        }
      }
    });

    if (error || !result?.success) {
      throw new Error(this.parseError(error, result, 'ASSIGN_BILLS'));
    }

    return result.data.family_member;
  }

  // ========== 8. UNASSIGN_BILL - Bỏ gán 1 hóa đơn ==========
  static async unassignBill(
    customerPhone: string,
    ten: string,
    billId: number // ✅ Single invoice ID (number) 12345
  ): Promise<FamilyMember> {
    const { data: result, error } = await supabase.functions.invoke(this.ENDPOINT, {
      body: {
        action: 'unassign_bill',
        customer_sdt: customerPhone,
        nguoi_than: {
          ten,
          hoadon_id: billId // ✅ API expects number
        }
      }
    });

    if (error || !result?.success) {
      throw new Error(this.parseError(error, result, 'UNASSIGN_BILL'));
    }

    return result.data.family_member;
  }
}
