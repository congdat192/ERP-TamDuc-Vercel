// ================================================================
// ACTION: DELETE FAMILY MEMBER
// Operation: delete (requires can_delete permission)
// Also deletes all images from Storage
// ================================================================
import { deleteFileFromStorage } from './storage.ts';
export async function handleDelete(supabase, payload, customer) {
  console.log('🗑️  [DELETE] Starting delete family member action');
  const tenToDelete = payload.nguoi_than.ten;
  console.log(`   Deleting member: ${tenToDelete}`);
  // Find member by exact name
  const existingMembers = customer.family_members || [];
  const memberIndex = existingMembers.findIndex((m)=>m.ten === tenToDelete);
  if (memberIndex === -1) {
    console.log(`❌ [DELETE] Member not found: ${tenToDelete}`);
    return {
      success: false,
      error: `Không tìm thấy người thân với tên "${tenToDelete}"`
    };
  }
  const memberToDelete = existingMembers[memberIndex];
  console.log(`✓  [DELETE] Found member at index ${memberIndex}`);
  console.log(`   Images to delete: ${memberToDelete.hinh_anh.length}`);
  // Delete all images from Storage
  if (memberToDelete.hinh_anh && memberToDelete.hinh_anh.length > 0) {
    console.log('🗑️  [DELETE] Deleting images from Storage...');
    for (const imageUrl of memberToDelete.hinh_anh){
      const result = await deleteFileFromStorage(supabase, imageUrl);
      if (!result.success) {
        console.warn(`⚠️  [DELETE] Failed to delete image: ${imageUrl}`);
      // Continue anyway - don't fail the whole operation
      }
    }
    console.log('✅ [DELETE] All images deleted');
  }
  // Remove from array
  const updatedMembers = existingMembers.filter((_, index)=>index !== memberIndex);
  console.log(`   Members remaining: ${updatedMembers.length}`);
  // Update database
  const { error: updateError } = await supabase.from('customers_backup').update({
    family_members: updatedMembers
  }).eq('id', customer.id);
  if (updateError) {
    console.error('❌ [DELETE] Database update failed:', updateError);
    return {
      success: false,
      error: `Database update failed: ${updateError.message}`
    };
  }
  console.log('✅ [DELETE] Family member deleted successfully');
  return {
    success: true,
    data: memberToDelete
  };
}
