import { supabaseClient } from './supabase-client';
import type { Customer, VoucherEligibility } from '@/types/customer.types';

export const customerApi = {
  async getByPhone(phone: string): Promise<Customer> {
    const response = await supabaseClient.request<{ data: Customer }>(
      `get-customer-by-phone?phone=${encodeURIComponent(phone)}`
    );
    return response.data;
  },

  async checkVoucherEligibility(phone: string): Promise<VoucherEligibility> {
    return supabaseClient.request<VoucherEligibility>(
      `check-voucher-eligibility?phone=${encodeURIComponent(phone)}`
    );
  },

  async claimVoucher(phone: string, campaignId: string) {
    return supabaseClient.request('claim-voucher', {
      method: 'POST',
      body: JSON.stringify({ phone, campaign_id: campaignId })
    });
  },

  async getVoucherHistory(
    phone: string, 
    page = 1, 
    limit = 20,
    status?: string,
    campaignId?: string
  ) {
    let query = `get-voucher-history?phone=${encodeURIComponent(phone)}&page=${page}&limit=${limit}`;
    if (status) query += `&status=${encodeURIComponent(status)}`;
    if (campaignId) query += `&campaign_id=${encodeURIComponent(campaignId)}`;
    
    return supabaseClient.request(query);
  },

  async getInvoiceHistory(phone: string) {
    const response = await supabaseClient.request<{ data: any }>(
      `get-invoice-history?phone=${encodeURIComponent(phone)}`
    );
    return response.data;
  },

  async getVoucherTerms(id: string) {
    return supabaseClient.request(`get-voucher-terms?id=${encodeURIComponent(id)}`);
  }
};
