import { CRMActivity, CRMBooking, CRMCampaign, CRMLead, SALES_PIPELINE_STAGES } from '../types/crm';

// --- Mock Data ---

const mockLeads: CRMLead[] = [
    {
        id: 'lead-1',
        customer_id: 101,
        customer_name: 'Nguyễn Văn A',
        customer_phone: '0909123456',
        pipeline_id: 1,
        stage_id: 1, // New
        title: 'Quan tâm kính Rayban',
        value: 2500000,
        source: 'Facebook',
        assigned_to: 'user-1',
        assigned_to_name: 'Nhân viên Sale 1',
        tags: ['VIP', 'Hỏi giá'],
        created_at: '2025-11-18T10:00:00Z',
        updated_at: '2025-11-18T10:00:00Z',
    },
    {
        id: 'lead-2',
        customer_id: 102,
        customer_name: 'Trần Thị B',
        customer_phone: '0918888999',
        pipeline_id: 1,
        stage_id: 2, // Contacting
        title: 'Tư vấn tròng kính chống ánh sáng xanh',
        value: 1200000,
        source: 'Web',
        assigned_to: 'user-1',
        assigned_to_name: 'Nhân viên Sale 1',
        created_at: '2025-11-17T14:30:00Z',
        updated_at: '2025-11-18T09:15:00Z',
    },
    {
        id: 'lead-3',
        customer_id: 103,
        customer_name: 'Lê Văn C',
        customer_phone: '0987654321',
        pipeline_id: 1,
        stage_id: 3, // Qualified
        title: 'Đặt lịch đo mắt & cắt kính',
        value: 3500000,
        source: 'Zalo',
        assigned_to: 'user-2',
        assigned_to_name: 'Nhân viên Sale 2',
        created_at: '2025-11-16T08:00:00Z',
        updated_at: '2025-11-17T16:00:00Z',
    },
    {
        id: 'lead-4',
        customer_id: 104,
        customer_name: 'Phạm Thị D',
        customer_phone: '0933444555',
        pipeline_id: 1,
        stage_id: 5, // Won
        title: 'Đã chốt đơn gọng kính kim loại',
        value: 1800000,
        source: 'Walk-in',
        assigned_to: 'user-1',
        assigned_to_name: 'Nhân viên Sale 1',
        created_at: '2025-11-15T11:20:00Z',
        updated_at: '2025-11-15T12:00:00Z',
    },
];

const mockActivities: CRMActivity[] = [
    {
        id: 'act-1',
        customer_id: 101,
        lead_id: 'lead-1',
        type: 'chat',
        title: 'Chat từ Facebook',
        content: 'Khách hỏi giá mẫu Rayban Aviator, đã gửi báo giá.',
        metadata: { platform: 'Facebook', link: 'https://pancake.vn/chat/123' },
        created_by: 'user-1',
        created_by_name: 'Nhân viên Sale 1',
        created_at: '2025-11-18T10:05:00Z',
    },
    {
        id: 'act-2',
        customer_id: 101,
        lead_id: 'lead-1',
        type: 'call',
        title: 'Gọi điện tư vấn',
        content: 'Gọi xác nhận độ cận, khách hẹn cuối tuần ghé.',
        created_by: 'user-1',
        created_by_name: 'Nhân viên Sale 1',
        created_at: '2025-11-18T10:30:00Z',
    },
    {
        id: 'act-3',
        customer_id: 102,
        type: 'order',
        title: 'Đơn hàng mới',
        content: 'Khách đặt mua online tròng kính Essilor.',
        metadata: { order_id: 'DH001', amount: 1200000 },
        created_by: 'system',
        created_by_name: 'System',
        created_at: '2025-11-17T15:00:00Z',
    },
];

const mockBookings: CRMBooking[] = [
    {
        id: 'book-1',
        customer_id: 103,
        customer_name: 'Lê Văn C',
        customer_phone: '0987654321',
        branch_id: 1,
        branch_name: 'Chi nhánh Quận 1',
        booking_date: '2025-11-20T09:00:00Z',
        type: 'eye_exam',
        status: 'confirmed',
        note: 'Đo mắt kỹ thuật cao',
        created_at: '2025-11-16T08:30:00Z',
    },
    {
        id: 'book-2',
        customer_id: 105,
        customer_name: 'Hoàng Văn E',
        customer_phone: '0999888777',
        branch_id: 2,
        branch_name: 'Chi nhánh Thủ Đức',
        booking_date: '2025-11-21T14:00:00Z',
        type: 'warranty',
        status: 'pending',
        note: 'Bảo hành gọng kính',
        created_at: '2025-11-19T10:00:00Z',
    },
];

const mockCampaigns: CRMCampaign[] = [
    {
        id: 'camp-1',
        name: 'Chúc mừng sinh nhật tháng 11',
        type: 'voucher',
        status: 'active',
        trigger_event: 'birthday_month',
        sent_count: 150,
        conversion_rate: 12.5,
        created_at: '2025-11-01T00:00:00Z',
    },
    {
        id: 'camp-2',
        name: 'Khách hàng cũ quay lại',
        type: 'automation',
        status: 'active',
        trigger_event: 'last_purchase_90_days',
        sent_count: 300,
        conversion_rate: 5.2,
        created_at: '2025-10-15T00:00:00Z',
    },
];

const mockPrescriptions: any[] = [
    {
        id: 'rx-1',
        customer_id: 101,
        exam_date: '2023-11-15',
        sph_od: -2.5, sph_os: -2.75,
        cyl_od: -0.5, cyl_os: -0.5,
        ax_od: 180, ax_os: 175,
        add_od: 0, add_os: 0,
        pd: 62,
        va_od: '10/10', va_os: '10/10',
        note: 'Đeo kính thường xuyên',
        prescribed_by: 'Bác sĩ A'
    },
    {
        id: 'rx-2',
        customer_id: 101,
        exam_date: '2024-11-15',
        sph_od: -3.0, sph_os: -3.25, // Tăng độ
        cyl_od: -0.75, cyl_os: -0.75,
        ax_od: 180, ax_os: 170,
        add_od: 0, add_os: 0,
        pd: 62,
        va_od: '10/10', va_os: '10/10',
        note: 'Tăng độ nhẹ, khuyên dùng tròng chống ánh sáng xanh',
        prescribed_by: 'KTV B'
    }
];

const mockFamilyMembers: any[] = [
    {
        id: 'fam-1',
        customer_id: 101,
        name: 'Nguyễn Thị Vợ',
        relationship: 'spouse',
        phone: '0909999888',
        dob: '1990-05-20'
    },
    {
        id: 'fam-2',
        customer_id: 101,
        name: 'Nguyễn Văn Con',
        relationship: 'child',
        dob: '2015-08-10'
    }
];

const mockTags: any[] = [
    { id: 'tag-1', name: 'VIP', color: '#FFD700' }, // Gold
    { id: 'tag-2', name: 'Thích gọng tròn', color: '#87CEEB' }, // SkyBlue
    { id: 'tag-3', name: 'Dị ứng kim loại', color: '#FF6347' } // Tomato
];

const mockWorkflows = [
    {
        id: 'wf-1',
        name: 'Quy trình chăm sóc khách hàng mới',
        nodes: [
            { id: '1', type: 'custom', position: { x: 250, y: 5 }, data: { label: 'Khách hàng mới', description: 'Khi có khách hàng mới đăng ký' } },
            { id: '2', type: 'custom', position: { x: 250, y: 100 }, data: { label: 'Gửi Email chào mừng', description: 'Gửi email giới thiệu dịch vụ' } },
        ],
        edges: [{ id: 'e1-2', source: '1', target: '2' }],
        status: 'active'
    }
];

// --- Service Methods ---

export const mockDataService = {
    getLeads: async (): Promise<CRMLead[]> => {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
        return [...mockLeads];
    },

    updateLeadStage: async (leadId: string, newStageId: number): Promise<void> => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const lead = mockLeads.find((l) => l.id === leadId);
        if (lead) {
            lead.stage_id = newStageId as any;
            lead.updated_at = new Date().toISOString();
        }
    },

    getActivities: async (customerId?: number): Promise<CRMActivity[]> => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        if (customerId) {
            return mockActivities.filter((a) => a.customer_id === customerId);
        }
        return [...mockActivities];
    },

    getBookings: async (): Promise<CRMBooking[]> => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        return [...mockBookings];
    },

    getCampaigns: async (): Promise<CRMCampaign[]> => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return [...mockCampaigns];
    },

    createLead: async (lead: Omit<CRMLead, 'id' | 'created_at' | 'updated_at'>): Promise<CRMLead> => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        const newLead: CRMLead = {
            ...lead,
            id: `lead-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        mockLeads.push(newLead);
        return newLead;
    },

    createBooking: async (booking: Omit<CRMBooking, 'id' | 'created_at'>): Promise<CRMBooking> => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        const newBooking: CRMBooking = {
            ...booking,
            id: `book-${Date.now()}`,
            branch_id: 1, // Mock branch
            branch_name: 'Chi nhánh Quận 1', // Mock branch
            created_at: new Date().toISOString(),
        };
        mockBookings.push(newBooking);
        return newBooking;
    },

    createCampaign: async (campaign: Omit<CRMCampaign, 'id' | 'created_at'>): Promise<CRMCampaign> => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        const newCampaign: CRMCampaign = {
            ...campaign,
            id: `camp-${Date.now()}`,
            created_at: new Date().toISOString(),
        };
        mockCampaigns.push(newCampaign);
        return newCampaign;
    },

    getWorkflows: async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return [...mockWorkflows];
    },

    getCustomerDetails: async (customerId: number) => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        // Find basic info from leads or create mock
        const baseInfo = mockLeads.find(l => l.customer_id === customerId) || {
            customer_id: customerId,
            customer_name: 'Khách hàng Mẫu',
            customer_phone: '0909000000'
        };

        return {
            ...baseInfo,
            email: 'nguyenvana@example.com',
            address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
            rank: 'VIP',
            total_spent: 15500000,
            prescriptions: mockPrescriptions.filter(p => p.customer_id === customerId),
            family_members: mockFamilyMembers.filter(f => f.customer_id === customerId),
            customer_tags: mockTags // Return all tags for demo, ideally filter by customer
        };
    }
};
