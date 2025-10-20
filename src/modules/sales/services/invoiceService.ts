import { supabase } from '@/integrations/supabase/client';
import { formatToVietnamDateTime } from '@/lib/dateUtils';

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

    console.log('[invoiceService] Calling edge function to fetch invoices...');

    // Call edge function
    const { data, error } = await supabase.functions.invoke('get-invoices-by-phone', {
      body: { phone: phone.trim() }
    });

    if (error) {
      console.error('[invoiceService] Edge function error:', error);
      return null;
    }

    if (!data || !data.success) {
      console.error('[invoiceService] Invalid response from edge function:', data);
      return null;
    }

      // Backend wraps External API response thêm 1 layer
      const actualData = data.data?.data || data.data;
      console.log('[invoiceService] Successfully fetched invoices:', actualData?.summary?.total_invoices || 0);
      return actualData as InvoiceHistoryResponse;
  } catch (error) {
    console.error('[invoiceService] Exception while fetching invoices:', error);
    return null;
  }
}

/**
 * Map API response to internal sales data format
 */
export function mapInvoiceToSalesData(invoice: Invoice, customer: Customer): any {
  // Convert UTC time from External API to Vietnam time (GMT+7)
  const vietnamTime = formatToVietnamDateTime(invoice.created_at_vn);
  
  return {
    id: invoice.code,
    customerId: customer.code,
    date: vietnamTime,
    createdTime: vietnamTime,
    lastUpdated: vietnamTime,
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
