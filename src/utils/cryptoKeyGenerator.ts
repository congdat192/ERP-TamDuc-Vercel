/**
 * Generate AES-256 encryption key (32 bytes) in base64 format
 * Used for KIOTVIET_ENCRYPTION_KEY secret
 */
export function generateAES256Key(): string {
  // Generate 32 random bytes
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  
  // Convert to base64
  const base64 = btoa(String.fromCharCode(...array));
  
  return base64;
}

/**
 * Validate if a base64 string decodes to exactly 32 bytes
 */
export function validateAES256Key(base64Key: string): { valid: boolean; length: number; error?: string } {
  try {
    const decoded = atob(base64Key);
    const length = decoded.length;
    
    if (length !== 32) {
      return {
        valid: false,
        length,
        error: `Invalid key length: ${length} bytes (expected 32 bytes)`
      };
    }
    
    return { valid: true, length };
  } catch (error) {
    return {
      valid: false,
      length: 0,
      error: 'Invalid base64 format'
    };
  }
}
