// ================================================================
// ACTION: ASSIGN BILLS
// Operation: update (requires can_update permission)
// Assigns invoices from hoadon_kiotviet_mktd to family member
// ================================================================
import { getVietnamISOString } from './vietnam-time.ts';
export async function handleAssignBills(supabase, payload, customer) {
  console.log('📋 [ASSIGN_BILLS] Starting assign bills action');
  const nguoiThan = payload.nguoi_than;
  const tenToFind = nguoiThan.ten;
  const hoadonIds = nguoiThan.hoadon_ids;
  if (!hoadonIds || hoadonIds.length === 0) {
    return {
      success: false,
      error: 'Missing or empty field: nguoi_than.hoadon_ids'
    };
  }
  console.log(`   Finding member: ${tenToFind}`);
  console.log(`   Bills to assign: ${hoadonIds.length}`);
  // Validate that all hoadon_ids exist in hoadon_kiotviet_mktd
  console.log('🔍 [ASSIGN_BILLS] Validating invoice IDs...');
  const { data: invoices, error: invoiceError } = await supabase.from('hoadon_kiotviet_mktd').select('id, code').in('id', hoadonIds);
  if (invoiceError) {
    console.error('❌ [ASSIGN_BILLS] Failed to validate invoices:', invoiceError);
    return {
      success: false,
      error: `Failed to validate invoices: ${invoiceError.message}`
    };
  }
  if (!invoices || invoices.length !== hoadonIds.length) {
    const foundIds = invoices?.map((inv)=>inv.id) || [];
    const missingIds = hoadonIds.filter((id)=>!foundIds.includes(id));
    console.log(`❌ [ASSIGN_BILLS] Invalid invoice IDs: ${missingIds.join(', ')}`);
    return {
      success: false,
      error: `Invalid invoice IDs: ${missingIds.join(', ')}`
    };
  }
  console.log(`✓  [ASSIGN_BILLS] All invoice IDs validated`);
  // Find member by exact name
  const existingMembers = customer.family_members || [];
  const memberIndex = existingMembers.findIndex((m)=>m.ten === tenToFind);
  if (memberIndex === -1) {
    console.log(`❌ [ASSIGN_BILLS] Member not found: ${tenToFind}`);
    return {
      success: false,
      error: `Không tìm thấy người thân với tên "${tenToFind}"`
    };
  }
  console.log(`✓  [ASSIGN_BILLS] Found member at index ${memberIndex}`);
  const existingMember = existingMembers[memberIndex];
  const existingBills = existingMember.bills || [];
  // Create bill references from validated invoices
  const newBillReferences = invoices.map((inv)=>({
      hoadon_id: inv.id,
      code: inv.code
    }));
  // APPEND to existing bills, avoiding duplicates
  const existingBillIds = new Set(existingBills.map((b)=>b.hoadon_id));
  const billsToAdd = newBillReferences.filter((b)=>!existingBillIds.has(b.hoadon_id));
  if (billsToAdd.length === 0) {
    console.log(`⚠️  [ASSIGN_BILLS] All bills already assigned`);
    return {
      success: false,
      error: 'All bills are already assigned to this member'
    };
  }
  const updatedBills = [
    ...existingBills,
    ...billsToAdd
  ];
  console.log(`   Previous bills: ${existingBills.length}`);
  console.log(`   New bills to add: ${billsToAdd.length}`);
  console.log(`   Total bills after assign: ${updatedBills.length}`);
  const updatedMember = {
    ...existingMember,
    bills: updatedBills,
    updated_at: getVietnamISOString()
  };
  // Replace in array
  const updatedMembers = [
    ...existingMembers
  ];
  updatedMembers[memberIndex] = updatedMember;
  // Update database
  const { error: updateError } = await supabase.from('customers_backup').update({
    family_members: updatedMembers
  }).eq('id', customer.id);
  if (updateError) {
    console.error('❌ [ASSIGN_BILLS] Database update failed:', updateError);
    return {
      success: false,
      error: `Database update failed: ${updateError.message}`
    };
  }
  console.log('✅ [ASSIGN_BILLS] Bills assigned successfully');
  return {
    success: true,
    data: updatedMember
  };
}
