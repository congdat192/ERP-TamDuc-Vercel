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

  // ========== 1. ADD - Thêm người thân mới ==========
  static async addFamilyMember(
    customerPhone: string,
    memberData: {
      ten: string;
      moi_quan_he: string;
      gioi_tinh?: 'nam' | 'nu' | 'khac';
      ngay_sinh?: string; // YYYY-MM-DD
      ghi_chu?: string;
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
          ghi_chu: memberData.ghi_chu
        }
      }
    });

    if (error) throw new Error(error.message);
    if (!result.success) throw new Error(result.error_description || 'Failed to add family member');
    
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

    if (error) throw new Error(error.message);
    if (!result.success) throw new Error(result.error_description || 'Failed to update family member');
    
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
        nguoi_than: {
          ten_cu,
          ten_moi
        }
      }
    });

    if (error) throw new Error(error.message);
    if (!result.success) throw new Error(result.error_description || 'Failed to rename family member');
    
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

    if (error) throw new Error(error.message);
    if (!result.success) throw new Error(result.error_description || 'Failed to delete family member');
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

    if (error) throw new Error(error.message);
    if (!result.success) throw new Error(result.error_description || 'Failed to add images');
    
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

    if (error) throw new Error(error.message);
    if (!result.success) throw new Error(result.error_description || 'Failed to delete image');
    
    return result.data.family_member;
  }

  // ========== 7. ASSIGN_BILLS - Gán hóa đơn (nhiều hóa đơn) ==========
  static async assignBills(
    customerPhone: string,
    ten: string,
    billCodes: string[] // Array of invoice codes ["HD265426", "HD265411"]
  ): Promise<FamilyMember> {
    const { data: result, error } = await supabase.functions.invoke(this.ENDPOINT, {
      body: {
        action: 'assign_bills',
        customer_sdt: customerPhone,
        nguoi_than: {
          ten,
          hoadon_ids: billCodes // API expects "hoadon_ids" as string array
        }
      }
    });

    if (error) throw new Error(error.message);
    if (!result.success) throw new Error(result.error_description || 'Failed to assign bills');
    
    return result.data.family_member;
  }

  // ========== 8. UNASSIGN_BILL - Bỏ gán 1 hóa đơn ==========
  static async unassignBill(
    customerPhone: string,
    ten: string,
    billCode: string // Single invoice code "HD265426"
  ): Promise<FamilyMember> {
    const { data: result, error } = await supabase.functions.invoke(this.ENDPOINT, {
      body: {
        action: 'unassign_bill',
        customer_sdt: customerPhone,
        nguoi_than: {
          ten,
          hoadon_id: billCode // API expects "hoadon_id" as string (not array)
        }
      }
    });

    if (error) throw new Error(error.message);
    if (!result.success) throw new Error(result.error_description || 'Failed to unassign bill');
    
    return result.data.family_member;
  }
}
