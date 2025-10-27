import { supabase } from '@/integrations/supabase/client';

export interface VoucherCampaign {
  id: string;
  name: string;
  campaign_id: string;
  description: string | null;
  is_active: boolean;
}

export interface VoucherTemplate {
  id: string;
  name: string;
  template_text: string;
  template_html: string | null;
  is_default: boolean;
}

export interface CustomerValidationResponse {
  success: boolean;
  data: {
    customer_type: 'new' | 'existing' | 'vip';
    phone: string;
  };
}

export interface VoucherIssueResponse {
  success: boolean;
  data: {
    voucher_code: string;
    campaign_name: string;
    discount_display: string;
    expires_at: string;
    status: string;
  };
}

export const voucherService = {
  // ========== CAMPAIGNS ==========
  async getCampaigns(): Promise<VoucherCampaign[]> {
    const { data, error } = await supabase
      .from('voucher_campaigns')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async createCampaign(campaign: Omit<VoucherCampaign, 'id'>): Promise<VoucherCampaign> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('voucher_campaigns')
      .insert({ ...campaign, created_by: user?.id })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCampaign(id: string, updates: Partial<VoucherCampaign>): Promise<void> {
    const { error } = await supabase
      .from('voucher_campaigns')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
  },

  // ========== TEMPLATES ==========
  async getTemplates(): Promise<VoucherTemplate[]> {
    const { data, error } = await supabase
      .from('voucher_templates')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getDefaultTemplate(): Promise<VoucherTemplate | null> {
    const { data, error } = await supabase
      .from('voucher_templates')
      .select('*')
      .eq('is_default', true)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  // ========== CUSTOMER TYPES & SOURCES ==========
  async getCustomerTypes() {
    const { data, error } = await supabase
      .from('voucher_customer_types')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    return data || [];
  },

  async getSources() {
    const { data, error } = await supabase
      .from('voucher_sources')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    return data || [];
  },

  // ========== API CALLS ==========
  async validateCustomer(phone: string): Promise<CustomerValidationResponse> {
    const { data, error } = await supabase.functions.invoke('validate-customer-external', {
      body: { phone }
    });

    if (error) throw error;
    return data;
  },

  async issueVoucher(payload: {
    phone: string;
    campaign_id: string;
    source: string;
    customer_info: any;
  }): Promise<VoucherIssueResponse> {
    const { data, error } = await supabase.functions.invoke('issue-voucher-external', {
      body: payload
    });

    if (error) throw error;
    return data;
  },

  // ========== HISTORY ==========
  async getHistory(limit = 50) {
    const { data, error } = await supabase
      .from('voucher_issuance_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  }
};
