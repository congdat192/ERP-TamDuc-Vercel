import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('[cleanup] Starting daily voucher image cleanup at', new Date().toISOString());

    const { data: files, error: listError } = await supabase
      .storage
      .from('voucher-generated')
      .list();

    if (listError) {
      console.error('[cleanup] List error:', listError);
      throw listError;
    }

    if (!files || files.length === 0) {
      console.log('[cleanup] No files to delete');
      return new Response(
        JSON.stringify({ success: true, deleted: 0, message: 'No files to delete' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const filePaths = files.map(f => f.name);
    console.log('[cleanup] Deleting', filePaths.length, 'files:', filePaths);

    const { error: deleteError } = await supabase
      .storage
      .from('voucher-generated')
      .remove(filePaths);

    if (deleteError) {
      console.error('[cleanup] Delete error:', deleteError);
      throw deleteError;
    }

    console.log('[cleanup] Successfully deleted', filePaths.length, 'files');

    return new Response(
      JSON.stringify({ 
        success: true,
        deleted: filePaths.length,
        files: filePaths,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[cleanup] Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error?.message || 'Unknown error occurred' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
