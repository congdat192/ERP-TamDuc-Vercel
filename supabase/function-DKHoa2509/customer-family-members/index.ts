// ================================================================
// EDGE FUNCTION: Customer Family Members API
// Resource: kiotviet.customers_backup (column: family_members)
// ================================================================
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getVietnamISOString } from './vietnam-time.ts';
import { checkRBACPermissions, checkLegacyPermissions } from './rbac.ts';
import { validateRequestPayload, cleanPhoneNumber } from './validators.ts';
import { corsResponse, successResponse, unauthorizedResponse, forbiddenResponse, badRequestResponse, notFoundResponse, internalErrorResponse } from './response.ts';
import { handleAdd } from './action-add.ts';
import { handleUpdate } from './action-update.ts';
import { handleRename } from './action-rename.ts';
import { handleDelete } from './action-delete.ts';
import { handleAddImage } from './action-add-image.ts';
import { handleDeleteImage } from './action-delete-image.ts';
import { handleAssignBills } from './action-assign-bills.ts';
import { handleUnassignBill } from './action-unassign-bill.ts';
console.info('🚀 Customer Family Members API started');
Deno.serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return corsResponse();
  }
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📨 [${requestId}] New request`);
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorizedResponse('Authorization header required', requestId);
    }
    const oauthToken = authHeader.replace('Bearer ', '');
    let payload;
    try {
      payload = await req.json();
      console.log(`   Action: ${payload.action}`);
    } catch (error) {
      return badRequestResponse('Invalid JSON', requestId);
    }
    const validation = validateRequestPayload(payload);
    if (!validation.valid) {
      return badRequestResponse(validation.error, requestId);
    }
    const validatedPayload = validation.data;
    const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'), {
      db: {
        schema: 'api'
      }
    });
    const { data: tokenRecord, error: tokenError } = await supabase.from('oauth_tokens').select('*').eq('access_token', oauthToken).eq('revoked', false).gt('expires_at_vn', getVietnamISOString()).single();
    if (tokenError || !tokenRecord) {
      return unauthorizedResponse('Invalid token', requestId);
    }
    const { data: clientRecord } = await supabase.from('oauth_clients').select('*').eq('client_id', tokenRecord.client_id).single();
    if (!clientRecord || !clientRecord.active) {
      return forbiddenResponse('Client suspended', requestId);
    }
    const resource = 'kiotviet.customers_backup';
    let operation;
    if (validatedPayload.action === 'add') {
      operation = 'create';
    } else if (validatedPayload.action === 'delete') {
      operation = 'delete';
    } else {
      operation = 'update';
    }
    console.log(`🔒 Checking ${operation} on ${resource}`);
    let hasAccess = false;
    let permissionType = 'rbac';
    const rbacResult = await checkRBACPermissions(supabase, tokenRecord.client_id, resource, operation);
    if (rbacResult !== null) {
      hasAccess = rbacResult;
    } else {
      const allowedResources = tokenRecord.scopes || clientRecord.allowed_resources;
      hasAccess = checkLegacyPermissions(allowedResources, resource);
      permissionType = 'legacy';
    }
    if (!hasAccess) {
      console.error(`❌ PERMISSION DENIED`);
      return forbiddenResponse(`No ${operation} access to ${resource}`, requestId);
    }
    console.log(`✅ PERMISSION GRANTED (${permissionType})`);
    const nowVN = getVietnamISOString();
    await supabase.from('oauth_tokens').update({
      last_used_at: nowVN,
      last_used_at_vn: nowVN
    }).eq('id', tokenRecord.id);
    console.log(`🔍 Finding customer: ${validatedPayload.customer_sdt}`);
    const cleanPhone = cleanPhoneNumber(validatedPayload.customer_sdt);
    const { data: customerData, error: customerError } = await supabase.from('customers_backup').select('*').eq('contactnumber', cleanPhone).single();
    if (customerError || !customerData) {
      await logUsage(supabase, tokenRecord, req, validatedPayload.action, 404, nowVN);
      return notFoundResponse(`Customer not found`, requestId);
    }
    console.log(`✓  Customer: ${customerData.code}`);
    const customer = customerData;
    console.log(`⚡ Executing: ${validatedPayload.action}`);
    let actionResult;
    switch(validatedPayload.action){
      case 'add':
        actionResult = await handleAdd(supabase, validatedPayload, customer);
        break;
      case 'update':
        actionResult = await handleUpdate(supabase, validatedPayload, customer);
        break;
      case 'rename':
        actionResult = await handleRename(supabase, validatedPayload, customer);
        break;
      case 'delete':
        actionResult = await handleDelete(supabase, validatedPayload, customer);
        break;
      case 'add_image':
        actionResult = await handleAddImage(supabase, validatedPayload, customer);
        break;
      case 'delete_image':
        actionResult = await handleDeleteImage(supabase, validatedPayload, customer);
        break;
      case 'assign_bills':
        actionResult = await handleAssignBills(supabase, validatedPayload, customer);
        break;
      case 'unassign_bill':
        actionResult = await handleUnassignBill(supabase, validatedPayload, customer);
        break;
      default:
        actionResult = {
          success: false,
          error: 'Unknown action'
        };
    }
    const statusCode = actionResult.success ? 200 : 400;
    await logUsage(supabase, tokenRecord, req, validatedPayload.action, statusCode, nowVN);
    if (!actionResult.success) {
      return badRequestResponse(actionResult.error, requestId);
    }
    const duration = Date.now() - startTime;
    console.log(`✅ Completed in ${duration}ms\n`);
    return successResponse({
      customer_sdt: validatedPayload.customer_sdt,
      customer_code: customer.code,
      family_member: actionResult.data
    }, getActionSuccessMessage(validatedPayload.action), requestId, duration, permissionType);
  } catch (error) {
    console.error('❌ Error:', error);
    return internalErrorResponse(error.message, requestId);
  }
});
async function logUsage(supabase, tokenRecord, req, action, statusCode, timestamp) {
  const rawIP = req.headers.get('x-forwarded-for') || 'unknown';
  const clientIP = rawIP.split(',')[0].trim().substring(0, 45);
  await supabase.from('oauth_token_usage').insert({
    token_id: tokenRecord.id,
    client_id: tokenRecord.client_id,
    ip_address: clientIP,
    endpoint: `kiotviet.customers_backup.family_members:${action}`,
    status_code: statusCode,
    created_at: timestamp,
    created_at_vn: timestamp
  });
}
function getActionSuccessMessage(action) {
  const messages = {
    add: 'Đã thêm người thân thành công',
    update: 'Đã cập nhật thông tin người thân',
    rename: 'Đã đổi tên người thân',
    delete: 'Đã xóa người thân',
    add_image: 'Đã thêm ảnh',
    delete_image: 'Đã xóa ảnh',
    assign_bills: 'Đã gán hóa đơn',
    unassign_bill: 'Đã bỏ gán hóa đơn'
  };
  return messages[action] || 'Success';
}
