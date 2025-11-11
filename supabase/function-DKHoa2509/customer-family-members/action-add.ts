// ================================================================
// ACTION: ADD FAMILY MEMBER
// Operation: create (requires can_create permission)
// ================================================================
import { getVietnamISOString } from './vietnam-time.ts';
import { validateMoiQuanHe, validateGioiTinh, validateDateFormat } from './validators.ts';
export async function handleAdd(supabase, payload, customer) {
  console.log('➕ [ADD] Starting add family member action');
  const nguoiThan = payload.nguoi_than;
  // Validate required fields
  if (!nguoiThan.ten) {
    return {
      success: false,
      error: 'Missing required field: ten'
    };
  }
  if (!nguoiThan.moi_quan_he) {
    return {
      success: false,
      error: 'Missing required field: moi_quan_he'
    };
  }
  if (!nguoiThan.gioi_tinh) {
    return {
      success: false,
      error: 'Missing required field: gioi_tinh'
    };
  }
  // Validate field values
  if (!validateMoiQuanHe(nguoiThan.moi_quan_he)) {
    return {
      success: false,
      error: 'Invalid moi_quan_he. Must be: con_cai, vo_chong, anh_chi_em, ong_ba, khac'
    };
  }
  if (!validateGioiTinh(nguoiThan.gioi_tinh)) {
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
  // Check if name already exists (EXACT match, case-sensitive, NO trim)
  const existingMembers = customer.family_members || [];
  const nameExists = existingMembers.some((m)=>m.ten === nguoiThan.ten);
  if (nameExists) {
    console.log(`❌ [ADD] Name already exists: ${nguoiThan.ten}`);
    return {
      success: false,
      error: `Người thân với tên "${nguoiThan.ten}" đã tồn tại`
    };
  }
  // Create new family member object
  const nowVN = getVietnamISOString();
  const newMember = {
    ten: nguoiThan.ten,
    moi_quan_he: nguoiThan.moi_quan_he,
    gioi_tinh: nguoiThan.gioi_tinh,
    ngay_sinh: nguoiThan.ngay_sinh,
    sdt: nguoiThan.sdt,
    ghi_chu: nguoiThan.ghi_chu,
    hinh_anh: nguoiThan.hinh_anh || [],
    bills: [],
    created_at: nowVN,
    updated_at: nowVN
  };
  // Append to array
  const updatedMembers = [
    ...existingMembers,
    newMember
  ];
  console.log(`✓  [ADD] Adding new member: ${newMember.ten}`);
  console.log(`   Total members after add: ${updatedMembers.length}`);
  // Update database
  const { error: updateError } = await supabase.from('customers_backup').update({
    family_members: updatedMembers
  }).eq('id', customer.id);
  if (updateError) {
    console.error('❌ [ADD] Database update failed:', updateError);
    return {
      success: false,
      error: `Database update failed: ${updateError.message}`
    };
  }
  console.log('✅ [ADD] Family member added successfully');
  return {
    success: true,
    data: newMember
  };
}
