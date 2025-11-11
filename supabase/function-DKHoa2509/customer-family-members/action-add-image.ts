// ================================================================
// ACTION: ADD IMAGE
// Operation: update (requires can_update permission)
// Appends new image URLs to hinh_anh array
// ================================================================
import { getVietnamISOString } from './vietnam-time.ts';
import { isValidImageUrl } from './storage.ts';
export async function handleAddImage(supabase, payload, customer) {
  console.log('🖼️  [ADD_IMAGE] Starting add image action');
  const nguoiThan = payload.nguoi_than;
  const tenToFind = nguoiThan.ten;
  const newImages = nguoiThan.hinh_anh_moi || [];
  if (!newImages || newImages.length === 0) {
    return {
      success: false,
      error: 'Missing or empty field: nguoi_than.hinh_anh_moi'
    };
  }
  console.log(`   Finding member: ${tenToFind}`);
  console.log(`   New images to add: ${newImages.length}`);
  // Validate image URLs
  for (const url of newImages){
    if (!isValidImageUrl(url)) {
      console.log(`❌ [ADD_IMAGE] Invalid image URL: ${url}`);
      return {
        success: false,
        error: `Invalid image URL: ${url}`
      };
    }
  }
  // Find member by exact name
  const existingMembers = customer.family_members || [];
  const memberIndex = existingMembers.findIndex((m)=>m.ten === tenToFind);
  if (memberIndex === -1) {
    console.log(`❌ [ADD_IMAGE] Member not found: ${tenToFind}`);
    return {
      success: false,
      error: `Không tìm thấy người thân với tên "${tenToFind}"`
    };
  }
  console.log(`✓  [ADD_IMAGE] Found member at index ${memberIndex}`);
  const existingMember = existingMembers[memberIndex];
  // APPEND new images to existing array
  const updatedImages = [
    ...existingMember.hinh_anh || [],
    ...newImages
  ];
  console.log(`   Previous images: ${existingMember.hinh_anh?.length || 0}`);
  console.log(`   Total images after add: ${updatedImages.length}`);
  const updatedMember = {
    ...existingMember,
    hinh_anh: updatedImages,
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
    console.error('❌ [ADD_IMAGE] Database update failed:', updateError);
    return {
      success: false,
      error: `Database update failed: ${updateError.message}`
    };
  }
  console.log('✅ [ADD_IMAGE] Images added successfully');
  return {
    success: true,
    data: updatedMember
  };
}
