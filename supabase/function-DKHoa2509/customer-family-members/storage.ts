// ================================================================
// STORAGE HELPERS - Supabase Storage Operations
// Bucket: avatar_customers
// Path: YYYY/MM/DD/{customer_code}_{ten_normalized}_{random30}.{ext}
// ================================================================
const BUCKET_NAME = 'avatar_customers';
const ALLOWED_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'webp'
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
/**
 * Generate random 30-character string (a-z0-9)
 */ export function generateRandomString() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for(let i = 0; i < 30; i++){
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
/**
 * Normalize Vietnamese name to URL-safe format
 * "Đỗ Khánh Hòa" → "Do-Khanh-Hoa"
 */ export function normalizeVietnameseName(name) {
  const map = {
    'à': 'a',
    'á': 'a',
    'ả': 'a',
    'ã': 'a',
    'ạ': 'a',
    'ă': 'a',
    'ằ': 'a',
    'ắ': 'a',
    'ẳ': 'a',
    'ẵ': 'a',
    'ặ': 'a',
    'â': 'a',
    'ầ': 'a',
    'ấ': 'a',
    'ẩ': 'a',
    'ẫ': 'a',
    'ậ': 'a',
    'đ': 'd',
    'è': 'e',
    'é': 'e',
    'ẻ': 'e',
    'ẽ': 'e',
    'ẹ': 'e',
    'ê': 'e',
    'ề': 'e',
    'ế': 'e',
    'ể': 'e',
    'ễ': 'e',
    'ệ': 'e',
    'ì': 'i',
    'í': 'i',
    'ỉ': 'i',
    'ĩ': 'i',
    'ị': 'i',
    'ò': 'o',
    'ó': 'o',
    'ỏ': 'o',
    'õ': 'o',
    'ọ': 'o',
    'ô': 'o',
    'ồ': 'o',
    'ố': 'o',
    'ổ': 'o',
    'ỗ': 'o',
    'ộ': 'o',
    'ơ': 'o',
    'ờ': 'o',
    'ớ': 'o',
    'ở': 'o',
    'ỡ': 'o',
    'ợ': 'o',
    'ù': 'u',
    'ú': 'u',
    'ủ': 'u',
    'ũ': 'u',
    'ụ': 'u',
    'ư': 'u',
    'ừ': 'u',
    'ứ': 'u',
    'ử': 'u',
    'ữ': 'u',
    'ự': 'u',
    'ỳ': 'y',
    'ý': 'y',
    'ỷ': 'y',
    'ỹ': 'y',
    'ỵ': 'y',
    'À': 'A',
    'Á': 'A',
    'Ả': 'A',
    'Ã': 'A',
    'Ạ': 'A',
    'Ă': 'A',
    'Ằ': 'A',
    'Ắ': 'A',
    'Ẳ': 'A',
    'Ẵ': 'A',
    'Ặ': 'A',
    'Â': 'A',
    'Ầ': 'A',
    'Ấ': 'A',
    'Ẩ': 'A',
    'Ẫ': 'A',
    'Ậ': 'A',
    'Đ': 'D',
    'È': 'E',
    'É': 'E',
    'Ẻ': 'E',
    'Ẽ': 'E',
    'Ẹ': 'E',
    'Ê': 'E',
    'Ề': 'E',
    'Ế': 'E',
    'Ể': 'E',
    'Ễ': 'E',
    'Ệ': 'E',
    'Ì': 'I',
    'Í': 'I',
    'Ỉ': 'I',
    'Ĩ': 'I',
    'Ị': 'I',
    'Ò': 'O',
    'Ó': 'O',
    'Ỏ': 'O',
    'Õ': 'O',
    'Ọ': 'O',
    'Ô': 'O',
    'Ồ': 'O',
    'Ố': 'O',
    'Ổ': 'O',
    'Ỗ': 'O',
    'Ộ': 'O',
    'Ơ': 'O',
    'Ờ': 'O',
    'Ớ': 'O',
    'Ở': 'O',
    'Ỡ': 'O',
    'Ợ': 'O',
    'Ù': 'U',
    'Ú': 'U',
    'Ủ': 'U',
    'Ũ': 'U',
    'Ụ': 'U',
    'Ư': 'U',
    'Ừ': 'U',
    'Ứ': 'U',
    'Ử': 'U',
    'Ữ': 'U',
    'Ự': 'U',
    'Ỳ': 'Y',
    'Ý': 'Y',
    'Ỷ': 'Y',
    'Ỹ': 'Y',
    'Ỵ': 'Y'
  };
  let normalized = name;
  for (const [viet, latin] of Object.entries(map)){
    normalized = normalized.replace(new RegExp(viet, 'g'), latin);
  }
  // Replace spaces with hyphens, remove special chars
  normalized = normalized.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').replace(/-+/g, '-');
  return normalized;
}
/**
 * Get storage path for current date
 * Returns: "2025/11/06"
 */ export function getStoragePath() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
}
/**
 * Generate full storage file path
 * Pattern: YYYY/MM/DD/{customer_code}_{ten_normalized}_{random30}.{ext}
 */ export function generateStorageFilePath(customerCode, tenNguoiThan, extension) {
  const datePath = getStoragePath();
  const normalizedName = normalizeVietnameseName(tenNguoiThan);
  const randomString = generateRandomString();
  const ext = extension.toLowerCase().replace('.', '');
  return `${datePath}/${customerCode}_${normalizedName}_${randomString}.${ext}`;
}
/**
 * Validate file extension
 */ export function isValidExtension(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext ? ALLOWED_EXTENSIONS.includes(ext) : false;
}
/**
 * Delete file from Supabase Storage
 */ export async function deleteFileFromStorage(supabase, fileUrl) {
  try {
    console.log(`🗑️  [Storage] Deleting file: ${fileUrl}`);
    // Extract path from URL
    // URL format: https://.../storage/v1/object/public/avatar_customers/2025/11/06/file.jpg
    const urlParts = fileUrl.split('/');
    const bucketIndex = urlParts.indexOf(BUCKET_NAME);
    if (bucketIndex === -1) {
      console.error('❌ [Storage] Invalid file URL - bucket not found');
      return {
        success: false,
        error: 'Invalid file URL'
      };
    }
    // Get path after bucket name
    const filePath = urlParts.slice(bucketIndex + 1).join('/');
    console.log(`   Path: ${filePath}`);
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([
      filePath
    ]);
    if (error) {
      console.error('❌ [Storage] Delete failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
    console.log('✅ [Storage] File deleted successfully');
    return {
      success: true
    };
  } catch (error) {
    console.error('❌ [Storage] Unexpected error:', error);
    return {
      success: false,
      error: String(error)
    };
  }
}
/**
 * Validate image URL belongs to our bucket
 */ export function isValidImageUrl(url) {
  return url.includes(BUCKET_NAME) && url.includes('/storage/v1/object/');
}
