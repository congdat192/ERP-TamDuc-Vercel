export interface Customer {
  id: number;
  code: string;
  name: string;
  gender: boolean;
  birthDate: string;
  contactNumber: string;
  address: string | null;
  debt: number;
  totalRevenue: number;
  rewardPoint: number;
}

export interface VoucherReceived {
  id: number;
  campaign_id: string;
  campaign_name: string;
  voucher_code: string;
  status: string;
  discount_display: string;
  expires_at: string;
  popup_helper_id: string;
}

export interface VoucherCampaign {
  campaign_id: string;
  campaign_name: string;
  discount_display: string;
  expires_at: string;
  status: string;
}

export interface VoucherEligibility {
  customer: {
    name: string;
    phone: string;
    birth_month: number;
  };
  received_vouchers: VoucherReceived[];
  available_campaigns: VoucherCampaign[];
  meta: {
    total_received: number;
    active_vouchers: number;
    eligible_campaigns: number;
  };
}

export interface InvoiceDetail {
  productcode: string;
  productname: string;
  quantity: number;
  price: number;
  discount: number;
  subtotal: number;
}

export interface Invoice {
  code: string;
  created_at_vn: string;
  soldbyname: string;
  branchname: string;
  total: number;
  totalpayment: number;
  statusvalue: string;
  details: InvoiceDetail[];
}

export interface InvoiceHistory {
  customer: {
    code: string;
    name: string;
    phone: string;
  };
  invoices: Invoice[];
  summary: {
    total_invoices: number;
    total_amount: number;
  };
}
