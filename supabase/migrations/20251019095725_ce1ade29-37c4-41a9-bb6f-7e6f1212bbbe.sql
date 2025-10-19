-- Create RPC function to batch OTP verification and employee data retrieval
CREATE OR REPLACE FUNCTION public.verify_employee_otp_batch(
  p_email text,
  p_otp_code text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_otp_record record;
  v_employee record;
  v_result jsonb;
BEGIN
  -- Step 1: Verify OTP and get employee data in one query (OPTIMIZED)
  SELECT 
    o.id as otp_id,
    o.email,
    o.expires_at,
    o.verified,
    e.id as employee_id,
    e.full_name,
    e.employee_code,
    e.user_id,
    e.department,
    e.position,
    e.avatar_path,
    e.phone,
    e.email as employee_email
  INTO v_otp_record
  FROM email_otp_codes o
  JOIN employees e ON LOWER(e.email) = LOWER(o.email)
  WHERE LOWER(o.email) = LOWER(p_email)
    AND o.otp_code = p_otp_code
    AND e.deleted_at IS NULL
  ORDER BY o.created_at DESC
  LIMIT 1;
  
  -- Check if OTP found
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'OTP_NOT_FOUND',
      'message', 'Mã OTP không chính xác. Vui lòng kiểm tra lại.'
    );
  END IF;
  
  -- Check if expired
  IF v_otp_record.expires_at < now() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'OTP_EXPIRED',
      'message', 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.'
    );
  END IF;
  
  -- Step 2: Mark OTP as verified (async, non-blocking for response)
  IF NOT v_otp_record.verified THEN
    UPDATE email_otp_codes
    SET verified = true, verified_at = now()
    WHERE id = v_otp_record.otp_id;
  END IF;
  
  -- Step 3: Update profile password_change_required if user exists
  IF v_otp_record.user_id IS NOT NULL THEN
    UPDATE profiles
    SET password_change_required = false
    WHERE id = v_otp_record.user_id;
  END IF;
  
  -- Step 4: Return success with employee data
  RETURN jsonb_build_object(
    'success', true,
    'employee', jsonb_build_object(
      'id', v_otp_record.employee_id,
      'full_name', v_otp_record.full_name,
      'employee_code', v_otp_record.employee_code,
      'user_id', v_otp_record.user_id,
      'department', v_otp_record.department,
      'position', v_otp_record.position,
      'avatar_path', v_otp_record.avatar_path,
      'phone', v_otp_record.phone,
      'email', v_otp_record.employee_email
    )
  );
END;
$$;