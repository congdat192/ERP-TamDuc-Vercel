import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateUserRequest {
  email: string;
  fullName: string;
  phone?: string;
  roleId: number; // 1 = admin role, 2+ = other roles
}

// Generate strong random password
function generatePassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  const all = uppercase + lowercase + numbers + symbols;
  
  let password = '';
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName, phone, roleId }: CreateUserRequest = await req.json();

    console.log('📝 Creating user account for:', email);

    // Validate input
    if (!email || !fullName || !roleId) {
      throw new Error('Missing required fields: email, fullName, roleId');
    }

    // Create Supabase Admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Generate temporary password
    const tempPassword = generatePassword(12);
    console.log('🔐 Generated temporary password (length: 12)');

    // Create user in Supabase Auth (auto-confirmed)
    const { data: authUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // Auto-confirm email (no verification needed)
      user_metadata: {
        full_name: fullName,
        phone: phone || '',
        password_change_required: true
      }
    });

    if (createError) {
      console.error('❌ Error creating user:', createError);
      
      // Handle duplicate email with clear message
      if (createError.code === 'email_exists') {
        return new Response(
          JSON.stringify({
            error: 'Email đã tồn tại trong hệ thống. Vui lòng sử dụng email khác.',
            code: 'email_exists'
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      throw createError;
    }

    console.log('✅ User created in Auth:', authUser.user.id);

    // Update profile with password_change_required flag
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ password_change_required: true })
      .eq('id', authUser.user.id);

    if (profileError) {
      console.error('⚠️ Warning: Could not update profile:', profileError);
    }

    console.log(`📝 Assigning role_id: ${roleId} to user...`);

    // Validate role exists
    const { data: roleData, error: roleCheckError } = await supabaseAdmin
      .from('roles')
      .select('id, name')
      .eq('id', roleId)
      .single();

    if (roleCheckError || !roleData) {
      console.error('❌ Invalid role ID:', roleId, roleCheckError);
      throw new Error(`Invalid role ID: ${roleId}`);
    }

    // Wait a bit for trigger to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Delete default role created by trigger
    await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', authUser.user.id);

    // Insert the admin-selected role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: authUser.user.id,
        role_id: roleId
      });

    if (roleError) {
      console.error('❌ Could not assign role:', roleError);
      throw new Error('Failed to assign role to user');
    }

    console.log(`✅ Assigned role: ${roleData.name} (ID: ${roleId})`);

    // Send credentials email
    const loginUrl = `${Deno.env.get('SITE_URL')}/login`;
    console.log('📧 Sending credentials email...');

    const { error: emailError } = await supabaseAdmin.functions.invoke(
      'send-new-user-credentials',
      {
        body: {
          email,
          fullName,
          tempPassword,
          loginUrl
        }
      }
    );

    if (emailError) {
      console.error('⚠️ Warning: Could not send email:', emailError);
      
      // Check for specific Resend errors
      if (emailError.message?.includes('verify')) {
        console.error('❌ Domain not verified. Please verify domain at resend.com/domains');
      }
      
      if (emailError.statusCode === 403) {
        console.error('❌ 403 Forbidden: Email address not allowed (sandbox mode or unverified domain)');
      }
      
      // Don't fail the request if email fails - user is already created
      console.log('⚠️ User created but email not sent. Admin should manually provide credentials.');
    } else {
      console.log('✅ Credentials email sent successfully');
    }

    return new Response(
      JSON.stringify({
        success: true,
        userId: authUser.user.id,
        message: 'User account created successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('❌ Error in create-user-account:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to create user account'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
