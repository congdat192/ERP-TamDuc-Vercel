// ================================================================
// ACTION: RENAME FAMILY MEMBER
// Operation: update (requires can_update permission)
// ================================================================
import { getVietnamISOString } from './vietnam-time.ts';
export async function handleRename(supabase, payload, customer) {
  console.log('✏️  [RENAME] Starting rename family member action');
  const tenCu = payload.ten_cu;
  const tenMoi = payload.ten_moi;
  console.log(`   Old name: ${tenCu}`);
  console.log(`   New name: ${tenMoi}`);
  // Find member by old name (exact match)
  const existingMembers = customer.family_members || [];
  const memberIndex = existingMembers.findIndex((m)=>m.ten === tenCu);
  if (memberIndex === -1) {
    console.log(`❌ [RENAME] Member not found: ${tenCu}`);
    return {
      success: false,
      error: `Không tìm thấy người thân với tên "${tenCu}"`
    };
  }
  // Check if new name already exists
  const newNameExists = existingMembers.some((m)=>m.ten === tenMoi);
  if (newNameExists) {
    console.log(`❌ [RENAME] New name already exists: ${tenMoi}`);
    return {
      success: false,
      error: `Tên "${tenMoi}" đã tồn tại`
    };
  }
  console.log(`✓  [RENAME] Found member at index ${memberIndex}`);
  // Update name
  const updatedMember = {
    ...existingMembers[memberIndex],
    ten: tenMoi,
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
    console.error('❌ [RENAME] Database update failed:', updateError);
    return {
      success: false,
      error: `Database update failed: ${updateError.message}`
    };
  }
  console.log('✅ [RENAME] Family member renamed successfully');
  return {
    success: true,
    data: updatedMember
  };
}
