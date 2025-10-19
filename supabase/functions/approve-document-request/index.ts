import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ User authenticated:', user.id);

    // Check permission - use maybeSingle to avoid errors
    const { data: hasPermission, error: permError } = await supabaseAdmin
      .from('user_roles')
      .select(`
        *,
        roles!inner(name)
      `)
      .eq('user_id', user.id)
      .in('roles.name', ['Owner', 'Admin', 'owner', 'admin'])
      .maybeSingle();

    if (permError) {
      console.error('❌ Permission check error:', permError);
      return new Response(
        JSON.stringify({ error: 'Permission check failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!hasPermission) {
      console.error('❌ Permission denied for user:', user.id);
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Permission verified for user:', user.id);

    // Get request body
    const { requestId, approved, reviewNote } = await req.json();

    console.log('📝 Processing document request:', { requestId, approved, reviewNote });

    // Fetch request
    const { data: request, error: reqError } = await supabaseAdmin
      .from('document_change_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (reqError || !request) {
      throw new Error('Request not found');
    }

    console.log('✅ Request fetched:', requestId);

    if (approved) {
      // Move file from pending to approved folder
      const oldPath = request.file_path; // documents/pending/{employeeId}_...
      const fileName = oldPath.split('/').pop();
      const newPath = `documents/${fileName}`;

      console.log('📂 Moving file from:', oldPath);
      console.log('📂 Moving file to:', newPath);

      // Download file from temp location
      const { data: fileData, error: downloadError } = await supabaseAdmin.storage
        .from('employee-documents')
        .download(oldPath);

      if (downloadError) {
        console.error('❌ Error downloading file:', downloadError);
        throw new Error('Failed to download file from temp location');
      }

      // Upload to permanent location
      const { error: uploadError } = await supabaseAdmin.storage
        .from('employee-documents')
        .upload(newPath, fileData, { 
          upsert: false,
          contentType: request.mime_type 
        });

      if (uploadError) {
        console.error('❌ Error uploading file:', uploadError);
        throw new Error('Failed to move file to permanent location');
      }

      console.log('✅ File moved successfully');

      // Insert to employee_documents
      const { error: insertError } = await supabaseAdmin
        .from('employee_documents')
        .insert({
          employee_id: request.employee_id,
          document_type: request.document_type,
          file_name: request.file_name,
          file_path: newPath,
          file_size: request.file_size,
          mime_type: request.mime_type,
          notes: request.notes,
          uploaded_by: user.id
        });

      if (insertError) {
        console.error('❌ Error inserting document:', insertError);
        throw new Error('Failed to insert document record');
      }

      console.log('✅ Document record created');

      // Delete temp file
      const { error: deleteError } = await supabaseAdmin.storage
        .from('employee-documents')
        .remove([oldPath]);

      if (deleteError) {
        console.warn('⚠️ Warning: Failed to delete temp file:', deleteError);
      } else {
        console.log('✅ Temp file deleted');
      }
    } else {
      // Reject: Delete temp file
      console.log('🗑️ Deleting temp file:', request.file_path);

      const { error: deleteError } = await supabaseAdmin.storage
        .from('employee-documents')
        .remove([request.file_path]);

      if (deleteError) {
        console.warn('⚠️ Warning: Failed to delete temp file:', deleteError);
      } else {
        console.log('✅ Temp file deleted');
      }
    }

    // Update request status
    const { error: updateError } = await supabaseAdmin
      .from('document_change_requests')
      .update({
        status: approved ? 'approved' : 'rejected',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        review_note: reviewNote || null
      })
      .eq('id', requestId);

    if (updateError) {
      console.error('❌ Error updating request:', updateError);
      throw new Error('Failed to update request status');
    }

    console.log('✅ Request status updated');

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
