export type PipelineStageId = 1 | 2 | 3 | 4 | 5 | 6;

export interface PipelineStage {
    id: PipelineStageId;
    name: string;
    color: string;
}

export interface CRMLead {
    id: string;
    customer_id: number;
    customer_name: string;
    customer_phone: string;
    customer_avatar?: string;
    pipeline_id: number;
    stage_id: PipelineStageId;
    title: string;
    value: number;
    source: 'Facebook' | 'Web' | 'Zalo' | 'Walk-in';
    assigned_to?: string; // User ID
    assigned_to_name?: string;
    tags?: string[];
    created_at: string;
    updated_at: string;
}

export interface CRMActivity {
    id: string;
    customer_id: number;
    lead_id?: string;
    type: 'call' | 'chat' | 'meeting' | 'note' | 'order' | 'booking' | 'zalo_zns' | 'sms';
    title: string;
    content: string;
    metadata?: Record<string, any>;
    created_by: string;
    created_by_name: string;
    created_at: string;
}

export interface CRMBooking {
    id: string;
    customer_id: number;
    customer_name: string;
    customer_phone: string;
    branch_id: number;
    branch_name: string;
    booking_date: string;
    type: 'eye_exam' | 'consultation' | 'warranty' | 'adjustment';
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    note?: string;
    created_at: string;
}

export interface CRMCampaign {
    id: string;
    name: string;
    type: 'voucher' | 'automation';
    status: 'active' | 'paused' | 'draft';
    trigger_event?: string;
    sent_count: number;
    conversion_rate: number;
    created_at: string;
}

export const SALES_PIPELINE_STAGES: PipelineStage[] = [
    { id: 1, name: 'Mới (New)', color: 'bg-blue-100 text-blue-800' },
    { id: 2, name: 'Đang tư vấn', color: 'bg-yellow-100 text-yellow-800' },
    { id: 3, name: 'Tiềm năng', color: 'bg-purple-100 text-purple-800' },
    { id: 4, name: 'Chờ thanh toán', color: 'bg-orange-100 text-orange-800' },
    { id: 5, name: 'Thắng (Won)', color: 'bg-green-100 text-green-800' },
    { id: 6, name: 'Thua (Lost)', color: 'bg-gray-100 text-gray-800' },
];

export interface CRMPrescription {
    id: string;
    customer_id: number;
    exam_date: string;
    sph_od: number;
    sph_os: number;
    cyl_od: number;
    cyl_os: number;
    ax_od: number;
    ax_os: number;
    add_od: number;
    add_os: number;
    pd: number;
    va_od: string;
    va_os: string;
    note?: string;
    prescribed_by: string;
}

export interface CRMFamilyMember {
    id: string;
    customer_id: number;
    related_customer_id?: number;
    name: string;
    relationship: 'spouse' | 'child' | 'parent' | 'sibling' | 'other';
    phone?: string;
    dob?: string;
}

export interface CRMTag {
    id: string;
    name: string;
    color: string;
}

export interface CRMCustomerDetail extends CRMLead {
    email?: string;
    address?: string;
    rank?: string;
    total_spent?: number;
    prescriptions?: CRMPrescription[];
    family_members?: CRMFamilyMember[];
    customer_tags?: CRMTag[];
}
