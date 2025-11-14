/**
 * Family Member Service
 * - Connects to External API for Family Members Management via customer-family-members endpoint
 * - 8 Actions: ADD, UPDATE, RENAME, DELETE, ADD_IMAGE, DELETE_IMAGE, ASSIGN_BILLS, UNASSIGN_BILL
 */

import { supabase } from '@/integrations/supabase/client';
import { FamilyMember } from './customerService';

// ============================================================
// TypeScript Types - MUST MATCH API SPEC EXACTLY
// ============================================================

export type MoiQuanHe = "con_cai" | "vo_chong" | "anh_chi_em" | "ong_ba" | "khac";
export type GioiTinh = "nam" | "nu";

export interface APIFamilyMember {
  id: string; // 10-char identifier [0-9a-z]
  ten: string;
  moi_quan_he: MoiQuanHe;
  gioi_tinh: GioiTinh;
  ngay_sinh: string | null;
  sdt: string | null;
  ghi_chu: string | null;
  hinh_anh: string[];
  bills: Array<{ hoadon_id: number; code: string }>;
  created_at: string;
  updated_at: string;
}

export interface APISuccessResponse {
  success: true;
  message: string;
  data: {
    customer_sdt: string;
    customer_code: string;
    family_member: APIFamilyMember;
  };
  meta: {
    request_id: string;
    duration_ms: number;
    permission_type: "rbac" | "legacy";
  };
  // Optional for convenience in UI code that reads error_description on unions
  error_description?: string;
}

export interface APIErrorResponse {
  success: false;
  error: string;
  error_description: string;
  meta: {
    request_id: string;
    duration_ms: number;
  };
}

export type APIResponse = APISuccessResponse | APIErrorResponse;

export class FamilyMemberService {
  // Base endpoint
  private static readonly ENDPOINT = 'customer-family-members';

  /**
   * Helper: Parse response from Supabase SDK
   * When edge function returns non-2xx status, SDK throws FunctionsHttpError with response in error.context
   * We need to extract the full response body from error.context
   */
  private static async parseResponse(data: any, error: any): Promise<APIResponse> {
    // Case 1: No error from SDK - response is in data (status 200)
    if (!error && data) {
      console.log('[FamilyMemberService] Success response:', data);
      return data as APIResponse;
    }

    // Case 2: SDK threw error (non-2xx status)
    // Response body is in error.context
    if (error?.context) {
      console.log('[FamilyMemberService] Error response from context:', error.context);
      try {
        let errorResponse;

        // Check if context is a Response object (needs to be parsed)
        if (error.context instanceof Response) {
          console.log('[FamilyMemberService] Context is Response object, parsing...');
          const text = await error.context.text();
          errorResponse = JSON.parse(text);
        } else if (typeof error.context === 'string') {
          errorResponse = JSON.parse(error.context);
        } else {
          errorResponse = error.context;
        }

        console.log('[FamilyMemberService] Parsed error response:', errorResponse);
        return errorResponse as APIErrorResponse;
      } catch (e) {
        console.error('[FamilyMemberService] Failed to parse error.context:', e, error.context);
      }
    }

    // Case 3: Network error or unexpected error
    console.error('[FamilyMemberService] Unexpected error:', error);
    return {
      success: false,
      error: 'Network error',
      error_description: error?.message || 'Không thể kết nối đến server',
      meta: {
        request_id: 'unknown',
        duration_ms: 0
      }
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
      sdt?: string; // Phone number
      ghi_chu?: string;
      hinh_anh?: string[]; // Array of image URLs
    }
  ): Promise<APIResponse> {
    const { data, error } = await supabase.functions.invoke(this.ENDPOINT, {
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

    return this.parseResponse(data, error);
  }

  // ========== 2. UPDATE - Cập nhật thông tin người thân (bao gồm rename) ==========
  static async updateFamilyMember(
    customerPhone: string,
    id: string,
    updates: {
      ten?: string; // Optional - for rename
      moi_quan_he?: string;
      gioi_tinh?: 'nam' | 'nu' | 'khac';
      ngay_sinh?: string;
      sdt?: string;
      ghi_chu?: string;
    }
  ): Promise<APIResponse> {
    const { data, error } = await supabase.functions.invoke(this.ENDPOINT, {
      body: {
        action: 'update',
        customer_sdt: customerPhone,
        nguoi_than: {
          id,
          ...updates
        }
      }
    });

    return this.parseResponse(data, error);
  }

  // ========== 3. DELETE - Xóa người thân ==========
  static async deleteFamilyMember(
    customerPhone: string,
    id: string
  ): Promise<APIResponse> {
    const { data, error } = await supabase.functions.invoke(this.ENDPOINT, {
      body: {
        action: 'delete',
        customer_sdt: customerPhone,
        nguoi_than: { id }
      }
    });

    return this.parseResponse(data, error);
  }

  // ========== 4. ADD_IMAGE - Thêm hình ảnh ==========
  static async addImages(
    customerPhone: string,
    id: string,
    hinh_anh_moi: string[] // Array of URLs
  ): Promise<APIResponse> {
    const { data, error } = await supabase.functions.invoke(this.ENDPOINT, {
      body: {
        action: 'add_image',
        customer_sdt: customerPhone,
        nguoi_than: {
          id,
          hinh_anh_moi
        }
      }
    });

    return this.parseResponse(data, error);
  }

  // ========== 5. DELETE_IMAGE - Xóa hình ảnh ==========
  static async deleteImage(
    customerPhone: string,
    id: string,
    image_url: string // Single URL
  ): Promise<APIResponse> {
    const { data, error } = await supabase.functions.invoke(this.ENDPOINT, {
      body: {
        action: 'delete_image',
        customer_sdt: customerPhone,
        nguoi_than: {
          id,
          image_url
        }
      }
    });

    return this.parseResponse(data, error);
  }

  // ========== 6. ASSIGN_BILLS - Gán hóa đơn (nhiều hóa đơn) ==========
  static async assignBills(
    customerPhone: string,
    id: string,
    hoadon_ids: (string | number)[] // ✅ Array of invoice IDs
  ): Promise<APIResponse> {
    const { data, error } = await supabase.functions.invoke(this.ENDPOINT, {
      body: {
        action: 'assign_bills',
        customer_sdt: customerPhone,
        nguoi_than: {
          id,
          hoadon_ids // ✅ API expects array of numbers/strings
        }
      }
    });

    return this.parseResponse(data, error);
  }

  // ========== 7. UNASSIGN_BILL - Bỏ gán 1 hóa đơn ==========
  static async unassignBill(
    customerPhone: string,
    id: string,
    hoadon_id: string | number // ✅ Single invoice ID
  ): Promise<APIResponse> {
    const { data, error } = await supabase.functions.invoke(this.ENDPOINT, {
      body: {
        action: 'unassign_bill',
        customer_sdt: customerPhone,
        nguoi_than: {
          id,
          hoadon_id // ✅ API expects number/string
        }
      }
    });

    return this.parseResponse(data, error);
  }
}
