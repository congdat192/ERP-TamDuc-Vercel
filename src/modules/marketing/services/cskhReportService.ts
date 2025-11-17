import { supabase } from '@/integrations/supabase/client';

// ✅ CHÍNH XÁC theo API .md file v1.2
export interface CSKHReportSummary {
  total_revenue: number;
  total_orders: number;
  total_vouchers: number;
  breakdown: {
    new_customers: {
      revenue: number;
      orders: number;
    };
    old_customers: {
      revenue: number;
      orders: number;
    };
  };
}

export interface CSKHReportResponse {
  success: boolean;
  creator_phone: string;
  period: {
    from: string;  // YYYY-MM-DD
    to: string;    // YYYY-MM-DD
  };
  summary: CSKHReportSummary;
  pagination: {
    page: number;
    pagesize: number;
    total: number;
  };
}

export const cskhReportService = {
  async getReport(filters: {
    creatorphone: string;
    fromdate?: string;
    todate?: string;
  }): Promise<CSKHReportResponse> {
    const params = new URLSearchParams();
    params.append('creatorphone', filters.creatorphone);
    if (filters.fromdate) params.append('fromdate', filters.fromdate);
    if (filters.todate) params.append('todate', filters.todate);
    
    // Use fetch with full URL since supabase.functions.invoke doesn't support query params well
    const { data: session } = await supabase.auth.getSession();
    const token = session.session?.access_token;
    
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hoahong-cskh?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  }
};
