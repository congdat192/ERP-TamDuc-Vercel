import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  emailType: 'otp' | 'password_reset' | 'user_credentials' | 'payroll';
  metadata?: Record<string, any>;
  sentBy?: string; // user_id của người gửi (nếu có)
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  logId?: string;
}

/**
 * Centralized email service using Larksuite SMTP
 * Automatically logs all emails to database
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const startTime = Date.now();
  
  // Init Supabase Admin Client for logging
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Create log entry (pending)
  const { data: logEntry, error: logError } = await supabaseAdmin
    .from('email_logs')
    .insert({
      from_email: Deno.env.get('SMTP_FROM_EMAIL'),
      to_email: options.to,
      subject: options.subject,
      email_type: options.emailType,
      status: 'pending',
      sent_by: options.sentBy || null,
      metadata: options.metadata || {}
    })
    .select('id')
    .single();

  const logId = logEntry?.id;

  try {
    // Init SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: Deno.env.get('SMTP_HOST')!,
        port: parseInt(Deno.env.get('SMTP_PORT')!),
        tls: Deno.env.get('SMTP_ENCRYPTION') === 'SSL', // true for SSL
        auth: {
          username: Deno.env.get('SMTP_USERNAME')!,
          password: Deno.env.get('SMTP_PASSWORD')!,
        },
      },
    });

    // Send email
    await client.send({
      from: Deno.env.get('SMTP_FROM_EMAIL')!,
      to: options.to,
      subject: options.subject,
      content: 'auto',
      html: options.html,
    });

    await client.close();

    const responseTime = Date.now() - startTime;

    // Update log (success)
    if (logId) {
      await supabaseAdmin
        .from('email_logs')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          response_time_ms: responseTime
        })
        .eq('id', logId);
    }

    console.log(`✅ Email sent successfully to ${options.to} (${responseTime}ms)`);

    return {
      success: true,
      messageId: logId,
      logId
    };

  } catch (error: any) {
    console.error(`❌ Failed to send email to ${options.to}:`, error);

    // Update log (failed)
    if (logId) {
      await supabaseAdmin
        .from('email_logs')
        .update({
          status: 'failed',
          error_message: error.message || 'Unknown error',
          response_time_ms: Date.now() - startTime
        })
        .eq('id', logId);
    }

    return {
      success: false,
      error: error.message || 'Failed to send email',
      logId
    };
  }
}
