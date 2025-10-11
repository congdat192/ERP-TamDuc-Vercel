import { supabase } from '@/integrations/supabase/client';

export interface CustomerData {
  id: number;
  code: string;
  name: string;
  gender: boolean;
  birthDate: string;
  contactNumber: string;
  address: string | null;
  locationName: string | null;
  wardName: string | null;
  email: string | null;
  organization: string | null;
  comments: string | null;
  taxCode: string | null;
  retailerId: number;
  debt: number;
  totalInvoiced: number;
  totalPoint: number;
  totalRevenue: number;
  modifiedDate: string;
  createdDate: string;
  groups: string | null;
  rewardPoint: number;
  psidFacebook: number;
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
    id: customer.code,
    customerCode: customer.code,
    customerName: customer.name,
    customerType: 'Cá nhân',
    phone: customer.contactNumber,
    customerGroup: customer.groups || 'Khách lẻ',
    gender: customer.gender ? 'Nam' : 'Nữ',
    birthDate: customer.birthDate ? new Date(customer.birthDate).toLocaleDateString('vi-VN') : '',
    email: customer.email || '',
    facebook: '',
    company: customer.organization || '',
    taxCode: customer.taxCode || '',
    idNumber: '',
    address: customer.address || '',
    deliveryArea: customer.locationName || '',
    ward: customer.wardName || '',
    creator: '',
    createDate: customer.createdDate ? new Date(customer.createdDate).toLocaleDateString('vi-VN') : '',
    notes: customer.comments || '',
    lastTransactionDate: customer.modifiedDate ? new Date(customer.modifiedDate).toLocaleDateString('vi-VN') : '',
    createBranch: '',
    currentDebt: customer.debt,
    debtDays: 0,
    totalSales: customer.totalRevenue,
    currentPoints: customer.rewardPoint,
    totalPoints: customer.totalPoint,
    totalSalesMinusReturns: customer.totalRevenue,
    status: 'Hoạt động'
  };
}
