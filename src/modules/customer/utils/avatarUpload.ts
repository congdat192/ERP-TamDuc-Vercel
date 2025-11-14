/**
 * Convert Vietnamese name to safe filename format
 * Example: "Đỗ Ngọc Tuyết Nhi" → "do-ngoc-tuyet-nhi"
 */
export function toSafeName(name: string): string {
  return name
    .normalize('NFD')                  // Tách dấu (ở → o + ̀)
    .replace(/[\u0300-\u036f]/g, '')   // Bỏ dấu thanh
    .replace(/[^a-zA-Z0-9 ]/g, '')     // Bỏ ký tự đặc biệt
    .trim()
    .replace(/\s+/g, '-')              // Khoảng trắng → gạch nối
    .toLowerCase();
}

/**
 * Build file path for family member avatar
 * Format: family/{year}/{month}/{day}/{customerPhone}_{safeRelatedName}_{timestamp}.{ext}
 * Example: family/2025/11/14/0933430866_do-ngoc-tuyet-nhi_1763103435019.jpg
 */
export function buildFamilyAvatarFilePath(
  customerPhone: string,
  relatedName: string,
  file: File
): string {
  // Extract real file extension (not hardcoded .jpg)
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  
  // Date components
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const timestamp = now.getTime();

  // Safe name (no Unicode)
  const safeName = toSafeName(relatedName);
  
  // Build path
  const filePath = `family/${year}/${month}/${day}/${customerPhone}_${safeName}_${timestamp}.${ext}`;

  return filePath;
}
