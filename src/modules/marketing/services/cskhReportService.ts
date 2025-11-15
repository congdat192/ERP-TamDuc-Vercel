import { supabase } from '@/integrations/supabase/client';

export interface CSKHReportSummary {
  total_revenue: number;
  total_profit: number;
  total_commission: number;
  orders_count: number;
}

export interface CSKHCustomerBreakdown {
  new_customer: {
    count: number;
    revenue: number;
    commission: number;
  };
  returning_customer: {
    count: number;
    revenue: number;
    commission: number;
  };
}

export interface CSKHReportRecord {
  creatorphone: string;
  creatorname: string;
  invoicecode: string;
  invoiceid: string;
  invoicestatus: string;
  customername: string;
  customerphone: string;
  customerstatus: string; // "new" | "returning"
  revenue: number;
  profit: number;
  commission: number;
  created_at: string;
}

export interface CSKHReportResponse {
  success: boolean;
  summary: CSKHReportSummary;
  breakdown: CSKHCustomerBreakdown;
  list: CSKHReportRecord[];
  pagination: {
    page: number;
    pagesize: number;
    total: number;
  };
  meta: {
    request_id: string;
    creatorphone: string;
    fromdate?: string;
    todate?: string;
    generated_at: string;
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
