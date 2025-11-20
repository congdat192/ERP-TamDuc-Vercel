import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { phone, message, template_id, customer_id, lead_id } = await req.json()

        // 1. Call ZNS Provider API (Mocked)
        console.log(`Sending ZNS to ${phone}: ${message} (Template: ${template_id})`)

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // 2. Log to CRM Activities
        const { error } = await supabase
            .from('crm_activities')
            .insert({
                customer_id: customer_id,
                lead_id: lead_id,
                type: 'zalo_zns',
                content: message,
                metadata: { template_id, phone, status: 'sent' },
                created_by: (await supabase.auth.getUser()).data.user?.id // This might be null if called by service role
            })

        if (error) throw error

        return new Response(
            JSON.stringify({ success: true, message: 'Message sent successfully' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
