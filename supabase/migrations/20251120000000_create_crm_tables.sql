-- Create CRM Tables

-- 1. CRM Pipelines
CREATE TABLE IF NOT EXISTS public.crm_pipelines (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CRM Stages
CREATE TABLE IF NOT EXISTS public.crm_stages (
    id SERIAL PRIMARY KEY,
    pipeline_id INTEGER REFERENCES public.crm_pipelines(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    color TEXT, -- Tailwind class or hex code
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CRM Leads
CREATE TABLE IF NOT EXISTS public.crm_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id INTEGER, -- Link to Kiotviet Customer ID (assuming integer)
    pipeline_id INTEGER REFERENCES public.crm_pipelines(id),
    stage_id INTEGER REFERENCES public.crm_stages(id),
    title TEXT NOT NULL,
    value NUMERIC(15, 2) DEFAULT 0,
    source TEXT, -- Facebook, Web, Zalo, etc.
    assigned_to UUID REFERENCES auth.users(id),
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CRM Bookings
CREATE TABLE IF NOT EXISTS public.crm_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id INTEGER, -- Link to Kiotviet Customer ID
    branch_id INTEGER, -- Link to Kiotviet Branch ID
    booking_date TIMESTAMPTZ NOT NULL,
    type TEXT, -- eye_exam, consultation, warranty, adjustment
    status TEXT DEFAULT 'pending', -- pending, confirmed, completed, cancelled
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CRM Campaigns
CREATE TABLE IF NOT EXISTS public.crm_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- voucher, automation
    status TEXT DEFAULT 'draft', -- active, paused, draft
    trigger_event TEXT,
    sent_count INTEGER DEFAULT 0,
    conversion_rate NUMERIC(5, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CRM Activities
CREATE TABLE IF NOT EXISTS public.crm_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id INTEGER,
    lead_id UUID REFERENCES public.crm_leads(id) ON DELETE SET NULL,
    type TEXT NOT NULL, -- call, chat, meeting, note, order, booking, zalo_zns, sms
    title TEXT,
    content TEXT,
    metadata JSONB,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.crm_pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Permissive for now, can be tightened later)

-- Pipelines & Stages: Readable by everyone, manageable by admins (simplified to authenticated for now)
CREATE POLICY "Authenticated users can view pipelines" ON public.crm_pipelines FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view stages" ON public.crm_stages FOR SELECT USING (auth.role() = 'authenticated');

-- Leads: View/Edit assigned or if admin (simplified to authenticated for now)
CREATE POLICY "Authenticated users can view leads" ON public.crm_leads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert leads" ON public.crm_leads FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update leads" ON public.crm_leads FOR UPDATE USING (auth.role() = 'authenticated');

-- Bookings
CREATE POLICY "Authenticated users can view bookings" ON public.crm_bookings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert bookings" ON public.crm_bookings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update bookings" ON public.crm_bookings FOR UPDATE USING (auth.role() = 'authenticated');

-- Campaigns
CREATE POLICY "Authenticated users can view campaigns" ON public.crm_campaigns FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert campaigns" ON public.crm_campaigns FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update campaigns" ON public.crm_campaigns FOR UPDATE USING (auth.role() = 'authenticated');

-- Activities
CREATE POLICY "Authenticated users can view activities" ON public.crm_activities FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert activities" ON public.crm_activities FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Seed Data for Pipelines
INSERT INTO public.crm_pipelines (name, is_default) VALUES ('Quy trình bán hàng chuẩn', true);

-- Seed Data for Stages
INSERT INTO public.crm_stages (pipeline_id, name, order_index, color) 
VALUES 
    ((SELECT id FROM public.crm_pipelines WHERE name = 'Quy trình bán hàng chuẩn'), 'Mới (New)', 1, 'bg-blue-100 text-blue-800'),
    ((SELECT id FROM public.crm_pipelines WHERE name = 'Quy trình bán hàng chuẩn'), 'Đang tư vấn', 2, 'bg-yellow-100 text-yellow-800'),
    ((SELECT id FROM public.crm_pipelines WHERE name = 'Quy trình bán hàng chuẩn'), 'Tiềm năng', 3, 'bg-purple-100 text-purple-800'),
    ((SELECT id FROM public.crm_pipelines WHERE name = 'Quy trình bán hàng chuẩn'), 'Chờ thanh toán', 4, 'bg-orange-100 text-orange-800'),
    ((SELECT id FROM public.crm_pipelines WHERE name = 'Quy trình bán hàng chuẩn'), 'Thắng (Won)', 5, 'bg-green-100 text-green-800'),
    ((SELECT id FROM public.crm_pipelines WHERE name = 'Quy trình bán hàng chuẩn'), 'Thua (Lost)', 6, 'bg-gray-100 text-gray-800');
