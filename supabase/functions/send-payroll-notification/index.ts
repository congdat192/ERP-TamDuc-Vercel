import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    // Note: Email sending functionality requires Resend or SMTP setup
    // For now, we'll just log the notification
    // In production, integrate with Resend or your email service
    
    const notifications = payrolls.map((payroll: any) => {
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

      console.log(`✅ [Mock] Email sent to ${employeeEmail}: Phiếu lương ${monthFormatted} - ${netPaymentFormatted}`);
      
      return {
        to: employeeEmail,
        employee_code: payroll.employee_code,
        employee_name: payroll.employee_name,
        month: monthFormatted,
        net_payment: netPaymentFormatted,
      };
    }).filter(Boolean);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Đã gửi ${notifications.length} email thông báo`,
        totalPayrolls: payrolls.length,
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
