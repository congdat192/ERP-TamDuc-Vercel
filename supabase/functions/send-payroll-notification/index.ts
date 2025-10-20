import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'https://esm.sh/resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PayrollNotificationRequest {
  month: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { month }: PayrollNotificationRequest = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch payrolls with status = 'issued'
    const { data: payrolls, error } = await supabase
      .from('employee_payrolls')
      .select(`
        id,
        employee_id,
        employee_name,
        employee_code,
        month,
        net_payment,
        employees!inner(email, user_id)
      `)
      .eq('month', month)
      .eq('status', 'issued');

    if (error) throw error;

    if (!payrolls || payrolls.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Không có phiếu lương nào để gửi' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📧 Sending payroll notifications for ${payrolls.length} employees...`);

    // Send emails using Resend
    const emailPromises = payrolls.map(async (payroll: any) => {
      const employeeEmail = payroll.employees?.email;
      
      if (!employeeEmail) {
        console.log(`⚠️ Nhân viên ${payroll.employee_code} không có email`);
        return null;
      }

      const monthFormatted = new Date(payroll.month).toLocaleDateString('vi-VN', { 
        month: 'long', 
        year: 'numeric' 
      });

      const netPaymentFormatted = new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
      }).format(payroll.net_payment);

      try {
        await resend.emails.send({
          from: 'HR Department <hr@dangphuocquan.cloud>',
          to: [employeeEmail],
          subject: `📊 Phiếu Lương Tháng ${monthFormatted}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">💼 Phiếu Lương</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">${monthFormatted}</p>
              </div>
              
              <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                <h2 style="color: #1f2937; margin-top: 0;">Xin chào ${payroll.employee_name},</h2>
                
                <p style="color: #4b5563; font-size: 15px;">
                  Phiếu lương tháng <strong>${monthFormatted}</strong> của bạn đã được phát hành.
                </p>
                
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px;"><strong>Mã nhân viên:</strong></p>
                  <p style="margin: 5px 0 15px 0; color: #1f2937; font-size: 16px; font-weight: 600;">${payroll.employee_code}</p>
                  
                  <p style="margin: 0; color: #6b7280; font-size: 14px;"><strong>Thực nhận:</strong></p>
                  <p style="margin: 5px 0 0 0; color: #16a34a; font-size: 28px; font-weight: bold;">
                    ${netPaymentFormatted}
                  </p>
                </div>
                
                <p style="color: #4b5563; font-size: 15px;">
                  Vui lòng đăng nhập vào hệ thống ESS để xem chi tiết phiếu lương của bạn.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${Deno.env.get('SITE_URL')}/ERP/ESS" 
                     style="display: inline-block; background: #667eea; color: white; padding: 14px 32px; 
                            text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;
                            box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                    🔍 Xem Phiếu Lương
                  </a>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                    <strong>Lưu ý:</strong> Nếu có bất kỳ thắc mắc nào về phiếu lương, vui lòng liên hệ phòng Nhân sự.
                  </p>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 20px; padding: 20px;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  © ${new Date().getFullYear()} HR Department. All rights reserved.
                </p>
              </div>
            </body>
            </html>
          `,
        });

        console.log(`✅ Email sent to ${employeeEmail}: ${monthFormatted} - ${netPaymentFormatted}`);
        
        return {
          to: employeeEmail,
          employee_code: payroll.employee_code,
          employee_name: payroll.employee_name,
          month: monthFormatted,
          net_payment: netPaymentFormatted,
          status: 'sent',
        };
      } catch (error: any) {
        console.error(`❌ Failed to send email to ${employeeEmail}:`, error.message);
        return {
          to: employeeEmail,
          employee_code: payroll.employee_code,
          employee_name: payroll.employee_name,
          month: monthFormatted,
          net_payment: netPaymentFormatted,
          status: 'failed',
          error: error.message,
        };
      }
    });

    const results = await Promise.allSettled(emailPromises);
    const notifications = results
      .map(r => r.status === 'fulfilled' ? r.value : null)
      .filter(Boolean);
    
    const successCount = notifications.filter(n => n?.status === 'sent').length;
    const failedCount = notifications.filter(n => n?.status === 'failed').length;

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Đã gửi ${successCount}/${payrolls.length} email thành công`,
        totalPayrolls: payrolls.length,
        successCount,
        failedCount,
        notifications,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error sending payroll notifications:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
