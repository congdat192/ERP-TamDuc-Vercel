import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SyncSchedule {
  id: string;
  credential_id: string;
  sync_type: string;
  next_run_at: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🕐 Starting scheduled sync check...');

    // Query schedules that are due to run
    const { data: schedules, error: fetchError } = await supabase
      .from('kiotviet_sync_schedules')
      .select('id, credential_id, sync_type, next_run_at')
      .eq('enabled', true)
      .lte('next_run_at', new Date().toISOString())
      .order('next_run_at', { ascending: true });

    if (fetchError) {
      console.error('❌ Error fetching schedules:', fetchError);
      throw fetchError;
    }

    if (!schedules || schedules.length === 0) {
      console.log('✅ No schedules due to run');
      return new Response(
        JSON.stringify({ success: true, message: 'No schedules due', ran: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📋 Found ${schedules.length} schedule(s) to run`);

    let successCount = 0;
    let errorCount = 0;

    // Process each schedule
    for (const schedule of schedules) {
      console.log(`🔄 Running sync: ${schedule.sync_type} for credential ${schedule.credential_id}`);

      try {
        // Invoke the main kiotviet-sync function
        const { data: syncResult, error: syncError } = await supabase.functions.invoke('kiotviet-sync', {
          body: {
            syncType: schedule.sync_type,
            credentialId: schedule.credential_id,
          },
        });

        if (syncError) {
          console.error(`❌ Sync failed for ${schedule.sync_type}:`, syncError);
          errorCount++;
          continue;
        }

        console.log(`✅ Sync completed for ${schedule.sync_type}:`, syncResult);

        // Update last_run_at (trigger will auto-calculate next_run_at)
        const { error: updateError } = await supabase
          .from('kiotviet_sync_schedules')
          .update({ last_run_at: new Date().toISOString() })
          .eq('id', schedule.id);

        if (updateError) {
          console.error(`❌ Failed to update schedule ${schedule.id}:`, updateError);
        } else {
          successCount++;
        }
      } catch (error) {
        console.error(`❌ Exception during sync ${schedule.sync_type}:`, error);
        errorCount++;
      }
    }

    console.log(`✅ Scheduler completed: ${successCount} success, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        ran: successCount,
        errors: errorCount,
        total: schedules.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Scheduler error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
