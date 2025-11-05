/**
 * Related Customer Types
 * - Supports multiple relationship types (not just parent-child)
 * - Uses customer_* naming (customer as main reference, related as associated person)
 */

export type RelationshipType = 
  | "con_cai"       // Con cái
  | "vo_chong"      // Vợ/Chồng
  | "anh_chi_em"    // Anh/Chị/Em
  | "ong_ba"        // Ông/Bà
  | "khac";         // Khác

export const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  con_cai: "Con cái",
  vo_chong: "Vợ/Chồng",
  anh_chi_em: "Anh/Chị/Em",
  ong_ba: "Ông/Bà",
  khac: "Khác"
};

export const RELATIONSHIP_ICONS: Record<RelationshipType, string> = {
  con_cai: "👶",
  vo_chong: "💑",
  anh_chi_em: "👫",
  ong_ba: "👴",
  khac: "👥"
};

export interface RelatedCustomer {
  id: string;
  
  // Main customer info (from KiotViet API)
  customer_phone: string;
  customer_code: string;
  customer_name: string;
  customer_group: string;
  
  // Related customer info
  related_code: string;
  related_name: string;
  relationship_type: RelationshipType;
  gender: "Nam" | "Nữ" | null;
  birth_date: string | null;  // YYYY-MM-DD
  phone: string | null;
  notes: string | null;
  
  // Metadata
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  
  // Relations
  avatars?: RelatedAvatar[];
  invoices?: RelatedInvoice[];
}

export interface RelatedAvatar {
  id: string;
  related_id: string;
  storage_bucket: string;
  storage_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  public_url: string;
  uploaded_at: string;
  uploaded_by: string;
  is_primary: boolean;
}

export interface RelatedInvoice {
  id: string;
  related_id: string;
  invoice_code: string;
  invoice_date: string;
  total_amount: number;
  assigned_by: string;
  assigned_at: string;
  notes: string | null;
}

export interface CreateRelatedCustomerData {
  customer_phone: string;
  customer_code: string;
  customer_name: string;
  customer_group: string;
  related_name: string;
  relationship_type: RelationshipType;
  gender: "Nam" | "Nữ";
  birth_date: string;  // YYYY-MM-DD
  phone?: string;
  notes?: string;
  created_by: string;
}

export interface UpdateRelatedCustomerData {
  related_name?: string;
  relationship_type?: RelationshipType;
  gender?: "Nam" | "Nữ";
  birth_date?: string;
  phone?: string;
  notes?: string;
}

export interface UploadAvatarResponse {
  avatar_id: string;
  storage_path: string;
  public_url: string;
}

/**
 * Extract customer info from KiotViet Customer object
 * Maps to customer_* fields
 */
export function extractCustomerInfo(customer: any): {
  customer_phone: string;
  customer_code: string;
  customer_name: string;
  customer_group: string;
} {
  return {
    customer_phone: customer.phone || customer.contactnumber || '',
    customer_code: customer.id || customer.code || customer.customerCode || '',
    customer_name: customer.name || customer.customerName || '',
    customer_group: customer.group || customer.groups || 'Khách lẻ'
  };
}
