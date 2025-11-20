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

        const payload = await req.json()
        console.log('Received Kiotviet Webhook:', payload)

        // Example: Handle Order Update
        // Kiotviet payload structure varies, assuming generic 'orders' or 'customers' key
        // This is a placeholder logic

        const { eventType, data } = payload

        if (eventType === 'order.success') {
            // Create a lead or update existing one
            // For now, just log it as an activity if we can find the customer
            // const { error } = await supabase.from('crm_activities').insert({...})
        }

        return new Response(
            JSON.stringify({ message: 'Webhook received', data: payload }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
