// ================================================================
// ACTION: DELETE IMAGE
// Operation: update (requires can_update permission)
// Removes image URL from array and deletes file from Storage
// ================================================================
import { getVietnamISOString } from './vietnam-time.ts';
import { deleteFileFromStorage } from './storage.ts';
export async function handleDeleteImage(supabase, payload, customer) {
  console.log('🗑️  [DELETE_IMAGE] Starting delete image action');
  const nguoiThan = payload.nguoi_than;
  const tenToFind = nguoiThan.ten;
  const imageUrlToDelete = nguoiThan.image_url;
  if (!imageUrlToDelete) {
    return {
      success: false,
      error: 'Missing required field: nguoi_than.image_url'
    };
  }
  console.log(`   Finding member: ${tenToFind}`);
  console.log(`   Image to delete: ${imageUrlToDelete}`);
  // Find member by exact name
  const existingMembers = customer.family_members || [];
  const memberIndex = existingMembers.findIndex((m)=>m.ten === tenToFind);
  if (memberIndex === -1) {
    console.log(`❌ [DELETE_IMAGE] Member not found: ${tenToFind}`);
    return {
      success: false,
      error: `Không tìm thấy người thân với tên "${tenToFind}"`
    };
  }
  console.log(`✓  [DELETE_IMAGE] Found member at index ${memberIndex}`);
  const existingMember = existingMembers[memberIndex];
  // Check if image exists in array
  if (!existingMember.hinh_anh || !existingMember.hinh_anh.includes(imageUrlToDelete)) {
    console.log(`❌ [DELETE_IMAGE] Image not found in member's images`);
    return {
      success: false,
      error: 'Image URL not found in member\'s images'
    };
  }
  // Delete file from Storage
  console.log('🗑️  [DELETE_IMAGE] Deleting file from Storage...');
  const deleteResult = await deleteFileFromStorage(supabase, imageUrlToDelete);
  if (!deleteResult.success) {
    console.warn(`⚠️  [DELETE_IMAGE] Failed to delete from Storage: ${deleteResult.error}`);
  // Continue anyway - remove from database even if Storage delete fails
  }
  // Remove URL from array
  const updatedImages = existingMember.hinh_anh.filter((url)=>url !== imageUrlToDelete);
  console.log(`   Previous images: ${existingMember.hinh_anh.length}`);
  console.log(`   Images after delete: ${updatedImages.length}`);
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
    console.error('❌ [DELETE_IMAGE] Database update failed:', updateError);
    return {
      success: false,
      error: `Database update failed: ${updateError.message}`
    };
  }
  console.log('✅ [DELETE_IMAGE] Image deleted successfully');
  return {
    success: true,
    data: updatedMember
  };
}
