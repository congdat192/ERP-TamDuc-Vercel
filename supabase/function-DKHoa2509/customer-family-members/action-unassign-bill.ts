// ================================================================
// ACTION: UNASSIGN BILL
// Operation: update (requires can_update permission)
// Removes invoice reference from family member's bills array
// ================================================================
import { getVietnamISOString } from './vietnam-time.ts';
export async function handleUnassignBill(supabase, payload, customer) {
  console.log('📋 [UNASSIGN_BILL] Starting unassign bill action');
  const nguoiThan = payload.nguoi_than;
  const tenToFind = nguoiThan.ten;
  const hoadonIdToRemove = nguoiThan.hoadon_id;
  if (!hoadonIdToRemove) {
    return {
      success: false,
      error: 'Missing required field: nguoi_than.hoadon_id'
    };
  }
  console.log(`   Finding member: ${tenToFind}`);
  console.log(`   Bill to unassign: ${hoadonIdToRemove}`);
  // Find member by exact name
  const existingMembers = customer.family_members || [];
  const memberIndex = existingMembers.findIndex((m)=>m.ten === tenToFind);
  if (memberIndex === -1) {
    console.log(`❌ [UNASSIGN_BILL] Member not found: ${tenToFind}`);
    return {
      success: false,
      error: `Không tìm thấy người thân với tên "${tenToFind}"`
    };
  }
  console.log(`✓  [UNASSIGN_BILL] Found member at index ${memberIndex}`);
  const existingMember = existingMembers[memberIndex];
  const existingBills = existingMember.bills || [];
  // Check if bill exists
  const billExists = existingBills.some((b)=>b.hoadon_id === hoadonIdToRemove);
  if (!billExists) {
    console.log(`❌ [UNASSIGN_BILL] Bill not found in member's bills`);
    return {
      success: false,
      error: `Invoice ID ${hoadonIdToRemove} not found in member's bills`
    };
  }
  // Remove bill from array
  const updatedBills = existingBills.filter((b)=>b.hoadon_id !== hoadonIdToRemove);
  console.log(`   Previous bills: ${existingBills.length}`);
  console.log(`   Bills after unassign: ${updatedBills.length}`);
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
    console.error('❌ [UNASSIGN_BILL] Database update failed:', updateError);
    return {
      success: false,
      error: `Database update failed: ${updateError.message}`
    };
  }
  console.log('✅ [UNASSIGN_BILL] Bill unassigned successfully');
  return {
    success: true,
    data: updatedMember
  };
}
