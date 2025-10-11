import { supabase } from '@/integrations/supabase/client';

export interface InvoiceDetail {
  productcode: string;
  productname: string;
  quantity: number;
  price: number;
  discount: number;
  discountratio: number;
  subtotal: number;
}

export interface Invoice {
  code: string;
  created_at_vn: string;
  soldbyname: string;
  branchname: string;
  total: number;
  totalpayment: number;
  status: number;
  statusvalue: string;
  details: InvoiceDetail[];
}

export interface Customer {
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface InvoiceHistoryResponse {
  success: boolean;
  data: {
    customer: Customer;
    invoices: Invoice[];
    summary: {
      total_invoices: number;
      displayed_invoices: number;
      total_amount: number;
      has_more: boolean;
      next_offset: number | null;
    };
  };
  meta: {
    request_id: string;
    duration_ms: number;
    permission_type: string;
    pagination: {
      limit: number;
      offset: number;
      total: number;
      has_more: boolean;
    };
  };
}

/**
 * Fetch invoice history for a customer by phone number
 */
export async function fetchInvoicesByPhone(phone: string): Promise<InvoiceHistoryResponse | null> {
  try {
    if (!phone || phone.trim() === '') {
      console.warn('[invoiceService] Phone number is empty');
      return null;
    }

    // Get current session token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('[invoiceService] No active session found');
      return null;
    }

    // Call the API directly
    const apiUrl = `https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/invoices-history-customer?phone=${encodeURIComponent(phone.trim())}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[invoiceService] HTTP error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data as InvoiceHistoryResponse;
  } catch (error) {
    console.error('[invoiceService] Exception while fetching invoices:', error);
    return null;
  }
}

/**
 * Map API response to internal sales data format
 */
export function mapInvoiceToSalesData(invoice: Invoice, customer: Customer): any {
  return {
    id: invoice.code,
    customerId: customer.code,
    date: new Date(invoice.created_at_vn).toLocaleString('vi-VN'),
    createdTime: new Date(invoice.created_at_vn).toLocaleString('vi-VN'),
    lastUpdated: new Date(invoice.created_at_vn).toLocaleString('vi-VN'),
    orderCode: invoice.code,
    returnCode: '',
    customer: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    area: '',
    ward: '',
    birthdate: '',
    branch: invoice.branchname,
    seller: invoice.soldbyname,
    creator: invoice.soldbyname,
    channel: '',
    note: '',
    totalAmount: invoice.total,
    discount: invoice.total - invoice.totalpayment,
    tax: 0,
    needToPay: invoice.totalpayment,
    paidAmount: invoice.totalpayment,
    paymentDiscount: 0,
    deliveryTime: '',
    status: invoice.statusvalue,
    items: invoice.details.map(d => d.productcode)
  };
}
