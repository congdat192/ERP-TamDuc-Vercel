import { supabase } from '@/integrations/supabase/client';

export interface VoucherCampaign {
  id: string;
  name: string;
  campaign_id: number | string; // DB stores as number (BIGINT), form uses string
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
    phone: string;
    customer_type: 'new' | 'old';
  };
  meta?: {
    request_id: string;
    timestamp: string;
  };
}

export interface VoucherIssueResponse {
  success: boolean;
  code: string;
  campaign_id: number;
  campaign_code: string;
  created_at: string;
  activated_at: string;
  expired_at: string;
  activation_status: string;
  recipient_phone: string;
  creator_phone: string;
  customer_type: 'new' | 'old';
  customer_source: string;
  meta: {
    request_id: string;
    duration_ms: number;
  };
  description?: string; // Error message if success: false
}

export interface ExternalCampaign {
  campaign_id: number;        // Numeric ID from external API (c.id): 101111
  campaign_code: string;      // Campaign code (c.code): "PHVC000003"
  campaign_name: string;      // Display name (c.name): "VC 50K đợt 2"
  discount_type?: string;
  discount_value?: number;
  description?: string;
  is_active?: boolean;
  _meta?: {
    external_id: number;
    start_date?: string;
    end_date?: string;
    expire_time?: number;
  };
}

export const voucherService = {
  // ========== CAMPAIGNS ==========
  async getCampaigns(): Promise<VoucherCampaign[]> {
    const { data, error } = await supabase
      .from('voucher_campaigns')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async createCampaign(campaign: Omit<VoucherCampaign, 'id'>): Promise<VoucherCampaign> {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Convert campaign_id from string to number for DB
    const campaignData = {
      ...campaign,
      campaign_id: typeof campaign.campaign_id === 'string' 
        ? parseInt(campaign.campaign_id, 10)
        : campaign.campaign_id,
      created_by: user?.id
    };
    
    const { data, error } = await supabase
      .from('voucher_campaigns')
      .insert(campaignData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCampaign(id: string, updates: Partial<VoucherCampaign>): Promise<void> {
    // Convert campaign_id from string to number if present
    const updateData: any = { ...updates };
    if (updateData.campaign_id !== undefined) {
      updateData.campaign_id = typeof updateData.campaign_id === 'string'
        ? parseInt(updateData.campaign_id, 10)
        : updateData.campaign_id;
    }
    
    const { error } = await supabase
      .from('voucher_campaigns')
      .update(updateData)
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
    const params = new URLSearchParams({ phone });
    const { data, error } = await supabase.functions.invoke(
      `check-type-customer?${params.toString()}`
    );

    if (error) throw error;
    
    if (!data.success) {
      throw new Error(data.error || 'Không thể xác định loại khách hàng');
    }
    
    return data;
  },

  async issueVoucher(payload: {
    campaign_id: number;
    creator_phone: string;
    recipient_phone: string;
    customer_source: string;
    customer_type: 'new' | 'old';
  }): Promise<VoucherIssueResponse> {
    const { data, error } = await supabase.functions.invoke('create-and-release-voucher', {
      body: payload
    });

    if (error) {
      const errorMsg = error?.context?.body?.description || error.message || 'Không thể phát hành voucher';
      throw new Error(errorMsg);
    }

    if (!data.success) {
      throw new Error(data.description || 'Không thể phát hành voucher');
    }

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
