import { supabase } from '@/integrations/supabase/client';

export interface CustomerData {
  id: number;
  code: string;
  name: string;
  gender: boolean;
  birthdate: string;
  contactnumber: string;
  identificationnumber: string;
  address: string | null;
  retailerid: number;
  branchid: number;
  locationname: string | null;
  wardname: string | null;
  email: string | null;
  avatar: string;
  organization: string | null;
  comments: string | null;
  taxcode: string | null;
  debt: number;
  modifieddate: string;
  createddate: string;
  rewardpoint: number;
  type: number;
  totalinvoiced: number;
  totalpoint: number;
  totalrevenue: number;
  groups: string | null;
  psidfacebook: string | null;
  totalinvoice: number;
  avatar_history: Array<{
    avatar: string;
    createddate: string;
  }>;
  customer_interaction_history?: Array<{
    cost: number;
    date: string;
    type: string;
    title: string;
    status: string;
    channel: string;
    message: string;
    batch_id: string;
    metadata: {
      error: string | null;
      sms_id: string;
      provider: string;
      sender_name: string;
    };
    delivery_status: string;
  }>;
}

export interface CustomerResponse {
  success: boolean;
  data: CustomerData;
  meta: {
    total: number;
    request_id: string;
    duration_ms: number;
    permission_type: string;
  };
}

/**
 * Fetch customer information by phone number
 */
export async function fetchCustomerByPhone(phone: string): Promise<CustomerResponse | null> {
  try {
    if (!phone || phone.trim() === '') {
      console.warn('[customerService] Phone number is empty');
      return null;
    }

    console.log('[customerService] Calling edge function to fetch customer...');

    // Call edge function
    const { data, error } = await supabase.functions.invoke('get-customer-by-phone', {
      body: { phone: phone.trim() }
    });

    if (error) {
      console.error('[customerService] Edge function error:', error);
      return null;
    }

    if (!data || !data.success) {
      console.error('[customerService] Invalid response from edge function:', data);
      return null;
    }

    console.log('[customerService] Successfully fetched customer:', data.data.data?.code || 'N/A');
    return data.data as CustomerResponse;
  } catch (error) {
    console.error('[customerService] Exception while fetching customer:', error);
    return null;
  }
}

/**
 * Map API customer data to internal format
 */
export function mapCustomerData(customer: CustomerData): any {
  return {
    id: customer.code || '',
    customerCode: customer.code || '',
    customerName: customer.name || '',
    customerType: 'Cá nhân',
    phone: customer.contactnumber || '',
    idNumber: customer.identificationnumber || '',
    customerGroup: customer.groups || 'Khách lẻ',
    gender: customer.gender ? 'Nam' : 'Nữ',
    birthDate: customer.birthdate ? new Date(customer.birthdate).toLocaleDateString('vi-VN') : '',
    email: customer.email || '',
    facebook: '',
    company: customer.organization || '',
    taxCode: customer.taxcode || '',
    address: customer.address || '',
    deliveryArea: customer.locationname || '',
    ward: customer.wardname || '',
    creator: '',
    createDate: customer.createddate ? new Date(customer.createddate).toLocaleDateString('vi-VN') : '',
    notes: customer.comments || '',
    lastTransactionDate: customer.modifieddate ? new Date(customer.modifieddate).toLocaleDateString('vi-VN') : '',
    createBranch: '',
    currentDebt: customer.debt || 0,
    debtDays: 0,
    totalSales: customer.totalrevenue || 0,
    currentPoints: customer.rewardpoint || 0,
    totalPoints: customer.totalpoint || 0,
    totalSalesMinusReturns: customer.totalrevenue || 0,
    totalInvoices: customer.totalinvoice || 0,
    status: 'Hoạt động',
    // For CustomerInfoTab and CustomerDetailRow
    name: customer.name || '',
    group: customer.groups || 'Khách lẻ',
    birthday: customer.birthdate ? new Date(customer.birthdate).toLocaleDateString('vi-VN') : '',
    createdDate: customer.createddate ? new Date(customer.createddate).toLocaleDateString('vi-VN') : '',
    note: customer.comments || '',
    points: customer.rewardpoint || 0,
    totalSpent: customer.totalrevenue || 0,
    totalDebt: customer.debt || 0,
    avatarUrl: customer.avatar || null,
    avatarHistory: customer.avatar_history || [],
    interactionHistory: customer.customer_interaction_history || []
  };
}
