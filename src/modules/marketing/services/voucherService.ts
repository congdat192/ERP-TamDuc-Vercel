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

export interface ExternalCampaign {
  campaign_id: string;
  campaign_name: string;
  discount_type?: string;
  discount_value?: number;
  description?: string;
  is_active?: boolean;
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

  async getExternalCampaigns(): Promise<ExternalCampaign[]> {
    const { data, error } = await supabase.functions.invoke('get-voucher-campaigns-external');
    
    if (error) {
      console.error('Error loading external campaigns:', error);
      throw new Error(error.message || 'Không thể tải campaigns từ hệ thống external');
    }
    
    if (!data.success) {
      throw new Error(data.error || 'API trả về lỗi');
    }
    
    return data.data || [];
  },

  // ========== CUSTOMER TYPES & SOURCES (CRUD) ==========
  async createCustomerType(data: { type_code: string; type_name: string; description?: string }) {
    const { data: result, error } = await supabase
      .from('voucher_customer_types')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  async updateCustomerType(id: string, updates: Partial<{ type_name: string; description: string; is_active: boolean }>) {
    const { error } = await supabase
      .from('voucher_customer_types')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
  },

  async createSource(data: { source_code: string; source_name: string; description?: string }) {
    const { data: result, error } = await supabase
      .from('voucher_sources')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  async updateSource(id: string, updates: Partial<{ source_name: string; description: string; is_active: boolean }>) {
    const { error } = await supabase
      .from('voucher_sources')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
  },

  async createTemplate(data: { name: string; template_text: string; template_html?: string; is_default: boolean }) {
    const { data: result, error } = await supabase
      .from('voucher_templates')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  async updateTemplate(id: string, updates: Partial<VoucherTemplate>) {
    const { error } = await supabase
      .from('voucher_templates')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
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
  },

  async getHistoryWithFilters(filters: {
    startDate?: Date;
    endDate?: Date;
    phone?: string;
    status?: 'success' | 'failed';
    limit?: number;
  }) {
    let query = supabase
      .from('voucher_issuance_history')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (filters.startDate) query = query.gte('created_at', filters.startDate.toISOString());
    if (filters.endDate) query = query.lte('created_at', filters.endDate.toISOString());
    if (filters.phone) query = query.ilike('phone', `%${filters.phone}%`);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.limit) query = query.limit(filters.limit);
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Helper to get employee name from user_id
  async getEmployeeName(userId: string): Promise<string> {
    const { data } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();
    
    return data?.full_name || 'Unknown';
  }
};
