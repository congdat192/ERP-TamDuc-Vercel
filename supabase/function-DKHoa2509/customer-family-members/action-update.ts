// ================================================================
// ACTION: UPDATE FAMILY MEMBER
// Operation: update (requires can_update permission)
// Partial update - only merge changed fields
// ================================================================
import { getVietnamISOString } from './vietnam-time.ts';
import { validateMoiQuanHe, validateGioiTinh, validateDateFormat } from './validators.ts';
export async function handleUpdate(supabase, payload, customer) {
  console.log('✏️  [UPDATE] Starting update family member action');
  const nguoiThan = payload.nguoi_than;
  const tenToFind = nguoiThan.ten;
  console.log(`   Finding member: ${tenToFind}`);
  // Find member by exact name (case-sensitive, NO trim)
  const existingMembers = customer.family_members || [];
  const memberIndex = existingMembers.findIndex((m)=>m.ten === tenToFind);
  if (memberIndex === -1) {
    console.log(`❌ [UPDATE] Member not found: ${tenToFind}`);
    return {
      success: false,
      error: `Không tìm thấy người thân với tên "${tenToFind}"`
    };
  }
  console.log(`✓  [UPDATE] Found member at index ${memberIndex}`);
  // Get existing member
  const existingMember = existingMembers[memberIndex];
  // Validate new values if provided
  if (nguoiThan.moi_quan_he && !validateMoiQuanHe(nguoiThan.moi_quan_he)) {
    return {
      success: false,
      error: 'Invalid moi_quan_he. Must be: con_cai, vo_chong, anh_chi_em, ong_ba, khac'
    };
  }
  if (nguoiThan.gioi_tinh && !validateGioiTinh(nguoiThan.gioi_tinh)) {
    return {
      success: false,
      error: 'Invalid gioi_tinh. Must be: nam or nu'
    };
  }
  if (nguoiThan.ngay_sinh && !validateDateFormat(nguoiThan.ngay_sinh)) {
    return {
      success: false,
      error: 'Invalid ngay_sinh format. Must be YYYY-MM-DD'
    };
  }
  // MERGE fields (partial update)
  const updatedMember = {
    ...existingMember,
    // Update only provided fields
    moi_quan_he: nguoiThan.moi_quan_he || existingMember.moi_quan_he,
    gioi_tinh: nguoiThan.gioi_tinh || existingMember.gioi_tinh,
    ngay_sinh: nguoiThan.ngay_sinh !== undefined ? nguoiThan.ngay_sinh : existingMember.ngay_sinh,
    sdt: nguoiThan.sdt !== undefined ? nguoiThan.sdt : existingMember.sdt,
    ghi_chu: nguoiThan.ghi_chu !== undefined ? nguoiThan.ghi_chu : existingMember.ghi_chu,
    // Keep existing arrays
    hinh_anh: existingMember.hinh_anh,
    bills: existingMember.bills,
    // Update timestamp
    updated_at: getVietnamISOString()
  };
  console.log('   Updated fields:');
  if (nguoiThan.moi_quan_he) console.log(`   - moi_quan_he: ${updatedMember.moi_quan_he}`);
  if (nguoiThan.gioi_tinh) console.log(`   - gioi_tinh: ${updatedMember.gioi_tinh}`);
  if (nguoiThan.ngay_sinh !== undefined) console.log(`   - ngay_sinh: ${updatedMember.ngay_sinh}`);
  if (nguoiThan.sdt !== undefined) console.log(`   - sdt: ${updatedMember.sdt}`);
  if (nguoiThan.ghi_chu !== undefined) console.log(`   - ghi_chu: ${updatedMember.ghi_chu}`);
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
    console.error('❌ [UPDATE] Database update failed:', updateError);
    return {
      success: false,
      error: `Database update failed: ${updateError.message}`
    };
  }
  console.log('✅ [UPDATE] Family member updated successfully');
  return {
    success: true,
    data: updatedMember
  };
}
