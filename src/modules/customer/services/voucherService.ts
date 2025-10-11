import { supabase } from '@/integrations/supabase/client';

// Types
export interface CustomerInfo {
  name: string;
  phone: string;
  birth_month: number;
  customer_age_days: number;
}

export interface ReceivedVoucher {
  id: number;
  campaign_id: string;
  campaign_name: string;
  campaign_group: string;
  voucher_code: string;
  customer_phone: string;
  customer_id: number;
  customer_code: string;
  customer_name: string;
  received_at: string;
  expires_at: string;
  status: string;
  discount_type: 'voucher' | 'coupon';
  discount_display: string;
  info_1?: string;
  info_2?: string;
  info_3?: string;
  popup_helper_id?: string;
  invoice_used_voucher?: string;
  used_at?: string;
  activated_at?: string;
}

export interface AvailableCampaign {
  campaign_id: string;
  campaign_name: string;
  campaign_group: string;
  discount_type: 'voucher' | 'coupon';
  discount_display: string;
  min_purchase: number;
  expires_at: string;
  validity_type: string;
  auto_activate: boolean;
  info_1?: string;
  info_2?: string;
  info_3?: string;
  popup_helper_id?: string;
  status: string;
}

export interface VoucherEligibilityResponse {
  customer: CustomerInfo;
  received_vouchers: ReceivedVoucher[];
  available_campaigns: AvailableCampaign[];
  meta: {
    request_id: string;
    duration_ms: number;
    total_received: number;
    active_vouchers: number;
    eligible_campaigns: number;
  };
}

export interface ClaimVoucherResponse {
  success: boolean;
  voucher: {
    code: string;
    status: string;
    expires_at: string;
    campaign_name: string;
    discount_display: string;
  };
  meta: {
    request_id: string;
    duration_ms: number;
  };
}

export interface VoucherHistoryItem {
  id: number;
  campaign_id: string;
  campaign_name: string;
  campaign_group: string;
  voucher_code: string;
  customer_phone: string;
  customer_name: string;
  status: string;
  received_at: string;
  expires_at: string;
  activated_at?: string;
  used_at?: string;
  invoice_used_voucher?: string;
}

export interface VoucherHistoryResponse {
  success: boolean;
  data: {
    phone: string;
    vouchers: VoucherHistoryItem[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
  meta: {
    request_id: string;
    duration_ms: number;
  };
}

// Service functions
export const voucherService = {
  // Check voucher eligibility
  checkVoucherEligibility: async (phone: string): Promise<VoucherEligibilityResponse> => {
    const params = new URLSearchParams({ phone });
    const { data, error } = await supabase.functions.invoke(
      `check-voucher-eligibility?${params.toString()}`
    );

    if (error) throw error;
    return data;
  },

  // Claim voucher
  claimVoucher: async (phone: string, campaign_id: string): Promise<ClaimVoucherResponse> => {
    const { data, error } = await supabase.functions.invoke('claim-voucher', {
      method: 'POST',
      body: { phone, campaign_id }
    });

    if (error) throw error;
    return data;
  },

  // Get voucher history with pagination
  getVoucherHistory: async (
    phone: string,
    page = 1,
    limit = 20,
    status?: string,
    campaign_id?: string
  ): Promise<VoucherHistoryResponse> => {
    const params = new URLSearchParams({
      phone,
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(campaign_id && { campaign_id })
    });

    const { data, error } = await supabase.functions.invoke(
      `voucher-history-customer?${params.toString()}`
    );

    if (error) throw error;
    return data;
  }
};
