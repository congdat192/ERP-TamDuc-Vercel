import { supabase } from '@/integrations/supabase/client';

export interface FamilyMember {
  id: string; // 10-char identifier from API v2
  sdt: string;
  ten: string;
  bills: any[];
  ghi_chu: string | null;
  hinh_anh: string[];
  gioi_tinh: 'nam' | 'nu' | 'khac';
  ngay_sinh: string; // YYYY-MM-DD
  created_at: string; // ISO 8601 with timezone (UTC+7)
  updated_at: string; // ISO 8601 with timezone (UTC+7)
  moi_quan_he: string; // "con_cai", "vo_chong", etc.
}

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
  family_members?: FamilyMember[];
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
    interactionHistory: customer.customer_interaction_history || [],
    familyMembers: customer.family_members || []
  };
}

/**
 * Map family_members từ API response sang RelatedCustomer format
 * Chỉ để hiển thị (READ-ONLY) - không dùng cho CRUD
 */
export function mapFamilyMembersToRelated(
  familyMembers: FamilyMember[],
  customerData: { contactnumber: string; code: string; name: string; groups: string | null }
): any[] {
  if (!familyMembers || familyMembers.length === 0) {
    return [];
  }

  return familyMembers.map((member, index) => {
    // Map giới tính
    let gender: "Nam" | "Nữ" | null = null;
    if (member.gioi_tinh === 'nam') gender = "Nam";
    else if (member.gioi_tinh === 'nu') gender = "Nữ";

    return {
      // IDs - use API id as primary identifier
      id: member.id, // ✅ Use API's 10-char id
      related_code: `FM-${member.id.toUpperCase()}`,
      
      // Main customer info
      customer_phone: customerData.contactnumber,
      customer_code: customerData.code,
      customer_name: customerData.name,
      customer_group: customerData.groups || 'Khách lẻ',
      
      // Related customer info
      related_name: member.ten,
      relationship_type: member.moi_quan_he,
      gender: gender,
      birth_date: member.ngay_sinh, // Already YYYY-MM-DD format
      phone: member.sdt || null,
      notes: member.ghi_chu || null,
      
      // Avatars (map từ hinh_anh array)
      avatars: member.hinh_anh.map((url, idx) => ({
        id: `avatar-${idx}`,
        related_id: `family-${member.sdt}-${index}`,
        avatar_url: url,
        public_url: url,
        is_primary: idx === 0,
        uploaded_at: member.created_at,
        uploaded_by: 'external_api'
      })),
      
      // Invoices (map từ bills array - format from API response)
      invoices: (member.bills || []).map((bill: any) => ({
        id: `bill-${bill.invoice_code || bill.code}`,
        related_id: `family-${member.sdt}-${index}`,
        invoice_code: bill.invoice_code || bill.code,
        invoice_date: bill.invoice_date || bill.createddate,
        total_amount: bill.total || 0,
        assigned_at: member.created_at,
        assigned_by: 'external_api',
        notes: bill.description || null,
        // Extra fields for display
        branchname: bill.branchname || '',
        soldbyname: bill.soldbyname || '',
        details: bill.details || []
      })),
      
      // Metadata (giữ timezone UTC+7 như API response)
      created_at: member.created_at,
      updated_at: member.updated_at,
      created_by: 'external_api',
      deleted_at: null,
      
      // Flag để biết data từ API
      _source: 'external_api'
    };
  });
}
