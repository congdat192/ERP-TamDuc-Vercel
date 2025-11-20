import { supabase } from '@/integrations/supabase/client';
import { CRMActivity, CRMBooking, CRMCampaign, CRMLead, PipelineStage } from '../types/crm';

// Toggle this to false to use real Supabase data
const USE_MOCK_DATA = true;

export const crmService = {
    getLeads: async (pipelineId?: number): Promise<CRMLead[]> => {
        if (USE_MOCK_DATA) {
            const { mockDataService } = await import('./mockData');
            return mockDataService.getLeads(pipelineId);
        }

        let query = supabase.from('crm_leads').select('*');
        if (pipelineId) {
            query = query.eq('pipeline_id', pipelineId);
        }

        const { data: leads, error } = await query;
        if (error) throw error;

        // Fetch customer details for each lead (manual join since FK might not exist yet)
        const customerIds = leads.map(l => l.customer_id).filter(Boolean);
        let customersMap: Record<number, any> = {};

        if (customerIds.length > 0) {
            const { data: customers } = await supabase
                .from('customers')
                .select('id, full_name, phone') // Assuming these fields exist
                .in('id', customerIds);

            if (customers) {
                customers.forEach(c => {
                    customersMap[c.id] = c;
                });
            }
        }

        return leads.map(lead => ({
            ...lead,
            customer_name: customersMap[lead.customer_id]?.full_name || `Khách hàng #${lead.customer_id}`,
            customer_phone: customersMap[lead.customer_id]?.phone || '',
            // Ensure other fields match CRMLead interface
            pipeline_id: lead.pipeline_id,
            stage_id: lead.stage_id,
            source: lead.source as any,
            value: Number(lead.value)
        }));
    },

    getStages: async (pipelineId: number = 1): Promise<PipelineStage[]> => {
        if (USE_MOCK_DATA) {
            const { SALES_PIPELINE_STAGES } = await import('../types/crm');
            return SALES_PIPELINE_STAGES;
        }

        const { data, error } = await supabase
            .from('crm_stages')
            .select('*')
            .eq('pipeline_id', pipelineId)
            .order('position', { ascending: true });

        if (error) throw error;

        return data.map(stage => ({
            id: stage.id as any,
            name: stage.name,
            color: stage.color
        }));
    },

    updateLeadStage: async (leadId: string, newStageId: number): Promise<void> => {
        if (USE_MOCK_DATA) {
            const { mockDataService } = await import('./mockData');
            return mockDataService.updateLeadStage(leadId, newStageId);
        }

        const { error } = await supabase
            .from('crm_leads')
            .update({ stage_id: newStageId, updated_at: new Date().toISOString() })
            .eq('id', leadId);

        if (error) throw error;
    },

    getActivities: async (customerId?: number): Promise<CRMActivity[]> => {
        if (USE_MOCK_DATA) {
            const { mockDataService } = await import('./mockData');
            return mockDataService.getActivities(customerId);
        }

        let query = supabase.from('crm_activities').select('*').order('created_at', { ascending: false });
        if (customerId) {
            query = query.eq('customer_id', customerId);
        }

        const { data, error } = await query;
        if (error) throw error;

        return data.map(activity => ({
            ...activity,
            type: activity.type as any,
            metadata: activity.metadata as any
        }));
    },

    getBookings: async (): Promise<CRMBooking[]> => {
        if (USE_MOCK_DATA) {
            const { mockDataService } = await import('./mockData');
            return mockDataService.getBookings();
        }

        const { data: bookings, error } = await supabase
            .from('crm_bookings')
            .select('*')
            .order('booking_date', { ascending: true });

        if (error) throw error;

        // Fetch customer details
        const customerIds = bookings.map(b => b.customer_id).filter(Boolean);
        let customersMap: Record<number, any> = {};

        if (customerIds.length > 0) {
            const { data: customers } = await supabase
                .from('customers')
                .select('id, full_name, phone')
                .in('id', customerIds);

            if (customers) {
                customers.forEach(c => {
                    customersMap[c.id] = c;
                });
            }
        }

        return bookings.map(booking => ({
            ...booking,
            customer_name: customersMap[booking.customer_id]?.full_name || `Khách hàng #${booking.customer_id}`,
            customer_phone: customersMap[booking.customer_id]?.phone || '',
            branch_name: 'Chi nhánh mặc định', // TODO: Fetch branch name
            type: booking.type as any,
            status: booking.status as any
        }));
    },

    getCampaigns: async (): Promise<CRMCampaign[]> => {
        if (USE_MOCK_DATA) {
            const { mockDataService } = await import('./mockData');
            return mockDataService.getCampaigns();
        }

        const { data, error } = await supabase
            .from('crm_campaigns')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map(campaign => ({
            ...campaign,
            type: campaign.type as any,
            status: campaign.status as any,
            conversion_rate: Number(campaign.conversion_rate)
        }));
    },

    createLead: async (lead: Omit<CRMLead, 'id' | 'created_at' | 'updated_at'>): Promise<CRMLead> => {
        if (USE_MOCK_DATA) {
            const { mockDataService } = await import('./mockData');
            return mockDataService.createLead(lead);
        }

        const { data, error } = await supabase
            .from('crm_leads')
            .insert({
                customer_id: lead.customer_id,
                pipeline_id: lead.pipeline_id,
                stage_id: lead.stage_id,
                title: lead.title,
                value: lead.value,
                source: lead.source,
                tags: lead.tags
            })
            .select()
            .single();

        if (error) throw error;

        return {
            ...data,
            customer_name: lead.customer_name, // Optimistic update
            customer_phone: lead.customer_phone,
            source: data.source as any,
            value: Number(data.value)
        };
    },

    createBooking: async (booking: Omit<CRMBooking, 'id' | 'created_at'>): Promise<CRMBooking> => {
        if (USE_MOCK_DATA) {
            const { mockDataService } = await import('./mockData');
            return mockDataService.createBooking(booking);
        }

        const { data, error } = await supabase
            .from('crm_bookings')
            .insert({
                customer_id: booking.customer_id,
                branch_id: booking.branch_id,
                booking_date: booking.booking_date,
                type: booking.type,
                status: booking.status,
                note: booking.note
            })
            .select()
            .single();

        if (error) throw error;

        return {
            ...data,
            customer_name: booking.customer_name,
            customer_phone: booking.customer_phone,
            branch_name: booking.branch_name,
            type: data.type as any,
            status: data.status as any
        };
    },

    createCampaign: async (campaign: Omit<CRMCampaign, 'id' | 'created_at'>): Promise<CRMCampaign> => {
        if (USE_MOCK_DATA) {
            const { mockDataService } = await import('./mockData');
            return mockDataService.createCampaign(campaign);
        }

        const { data, error } = await supabase
            .from('crm_campaigns')
            .insert({
                name: campaign.name,
                type: campaign.type,
                status: campaign.status,
                trigger_event: campaign.trigger_event
            })
            .select()
            .single();

        if (error) throw error;

        return {
            ...data,
            type: data.type as any,
            status: data.status as any,
            conversion_rate: Number(data.conversion_rate)
        };
    },

    updateLead: async (id: string, updates: Partial<CRMLead>): Promise<void> => {
        if (USE_MOCK_DATA) {
            // Mock update
            return;
        }

        const { error } = await supabase
            .from('crm_leads')
            .update({
                title: updates.title,
                value: updates.value,
                source: updates.source,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) throw error;
    },

    deleteLead: async (id: string): Promise<void> => {
        if (USE_MOCK_DATA) {
            // Mock delete
            return;
        }

        const { error } = await supabase
            .from('crm_leads')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    updateBooking: async (id: string, updates: Partial<CRMBooking>): Promise<void> => {
        if (USE_MOCK_DATA) {
            // Mock update
            return;
        }

        const { error } = await supabase
            .from('crm_bookings')
            .update({
                booking_date: updates.booking_date,
                status: updates.status,
                note: updates.note,
                // updated_at: new Date().toISOString() // Assuming table has updated_at trigger or column
            })
            .eq('id', id);

        if (error) throw error;
    },

    updateCampaign: async (id: string, updates: Partial<CRMCampaign>): Promise<void> => {
        if (USE_MOCK_DATA) {
            // Mock update
            return;
        }

        const { error } = await supabase
            .from('crm_campaigns')
            .update({
                name: updates.name,
                type: updates.type,
                status: updates.status,
                trigger_event: updates.trigger_event,
                // updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) throw error;
    },

    updateStage: async (id: number, updates: Partial<PipelineStage>): Promise<void> => {
        if (USE_MOCK_DATA) {
            return;
        }

        const { error } = await supabase
            .from('crm_stages')
            .update({
                name: updates.name,
                color: updates.color
            })
            .eq('id', id);

        if (error) throw error;
    },

    getWorkflows: async () => {
        if (USE_MOCK_DATA) {
            const { mockDataService } = await import('./mockData');
            return mockDataService.getWorkflows();
        }
        return []; // TODO: Implement real Supabase fetch
    },

    getCustomerDetails: async (customerId: number) => {
        if (USE_MOCK_DATA) {
            const { mockDataService } = await import('./mockData');
            return mockDataService.getCustomerDetails(customerId);
        }
        return null; // TODO: Implement real API
    }
};
