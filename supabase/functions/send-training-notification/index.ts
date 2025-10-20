import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  enrollment_id: string;
  notification_type: 'enrollment_created' | 'session_starting_soon' | 'course_completed';
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📧 [send-training-notification] Starting...');

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

    const { enrollment_id, notification_type }: NotificationPayload = await req.json();

    // Get enrollment details
    const { data: enrollment, error: enrollmentError } = await supabaseAdmin
      .from('training_enrollments')
      .select(`
        *,
        employees(id, full_name, email),
        training_sessions(id, session_name, start_date, end_date),
        training_programs(id, title, description)
      `)
      .eq('id', enrollment_id)
      .single();

    if (enrollmentError || !enrollment) {
      throw new Error(`Enrollment not found: ${enrollmentError?.message}`);
    }

    // Check if notification already sent
    const { data: existingLog } = await supabaseAdmin
      .from('training_notification_logs')
      .select('id')
      .eq('enrollment_id', enrollment_id)
      .eq('notification_type', notification_type)
      .maybeSingle();

    if (existingLog) {
      console.log('⚠️ Notification already sent, skipping');
      return new Response(
        JSON.stringify({ success: true, message: 'Already sent' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare email content
    const employee = enrollment.employees as any;
    const session = enrollment.training_sessions as any;
    const program = enrollment.training_programs as any;

    let emailSubject = '';
    let emailBody = '';

    switch (notification_type) {
      case 'enrollment_created':
        emailSubject = `[Đào Tạo] Bạn đã được gán vào khóa: ${program.title}`;
        emailBody = `
          <h2>Xin chào ${employee.full_name},</h2>
          <p>Bạn đã được gán vào khóa đào tạo: <strong>${program.title}</strong></p>
          <p><strong>Lớp học:</strong> ${session.session_name}</p>
          <p><strong>Thời gian:</strong> ${new Date(session.start_date).toLocaleDateString('vi-VN')} - ${new Date(session.end_date).toLocaleDateString('vi-VN')}</p>
          <p><strong>Mô tả:</strong> ${program.description || 'Không có'}</p>
          <p>Vui lòng truy cập hệ thống để xem chi tiết.</p>
        `;
        break;

      case 'session_starting_soon':
        emailSubject = `[Nhắc Nhở] Khóa đào tạo sắp bắt đầu: ${program.title}`;
        emailBody = `
          <h2>Xin chào ${employee.full_name},</h2>
          <p>Khóa đào tạo <strong>${program.title}</strong> sẽ bắt đầu vào ngày <strong>${new Date(session.start_date).toLocaleDateString('vi-VN')}</strong></p>
          <p><strong>Lớp học:</strong> ${session.session_name}</p>
          <p>Vui lòng chuẩn bị và tham gia đầy đủ.</p>
        `;
        break;

      case 'course_completed':
        emailSubject = `[Hoàn Thành] Chúc mừng bạn hoàn thành khóa: ${program.title}`;
        emailBody = `
          <h2>Xin chào ${employee.full_name},</h2>
          <p>Chúc mừng bạn đã hoàn thành khóa đào tạo: <strong>${program.title}</strong></p>
          <p><strong>Điểm số:</strong> ${enrollment.final_score || 'N/A'}%</p>
          <p>Cảm ơn bạn đã tham gia tích cực!</p>
        `;
        break;
    }

    // Send email via Resend (if RESEND_API_KEY available)
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    let sentAt = null;
    let status = 'pending';
    let errorMessage = null;

    if (resendApiKey) {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Training System <training@tamduceyewear.com>',
            to: [employee.email],
            subject: emailSubject,
            html: emailBody
          })
        });

        if (resendResponse.ok) {
          sentAt = new Date().toISOString();
          status = 'sent';
          console.log('✅ Email sent successfully');
        } else {
          const error = await resendResponse.text();
          errorMessage = `Resend error: ${error}`;
          status = 'failed';
          console.error('❌ Resend error:', error);
        }
      } catch (error: any) {
        errorMessage = error.message;
        status = 'failed';
        console.error('❌ Send email error:', error);
      }
    } else {
      console.log('⚠️ RESEND_API_KEY not set, skipping email send');
      status = 'pending';
      errorMessage = 'RESEND_API_KEY not configured';
    }

    // Log notification
    await supabaseAdmin
      .from('training_notification_logs')
      .insert({
        enrollment_id,
        employee_id: employee.id,
        notification_type,
        email_to: employee.email,
        email_subject: emailSubject,
        email_body: emailBody,
        status,
        sent_at: sentAt,
        error_message: errorMessage
      });

    console.log('✅ [send-training-notification] Complete');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification processed',
        status 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ [send-training-notification] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
