// ==========================================
// AES-256-GCM ENCRYPTION UTILITIES
// ==========================================

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits for GCM
const TAG_LENGTH = 128; // 128 bits authentication tag

/**
 * Get encryption key from environment variable
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  const keyString = Deno.env.get('KIOTVIET_ENCRYPTION_KEY');
  if (!keyString) {
    throw new Error('KIOTVIET_ENCRYPTION_KEY not found in environment');
  }

  // Decode base64 key
  const keyData = Uint8Array.from(atob(keyString), c => c.charCodeAt(0));
  
  // Import key for AES-GCM
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt plaintext string using AES-256-GCM
 * Returns: base64 encoded string in format "iv:ciphertext:tag"
 */
export async function encrypt(plaintext: string): Promise<string> {
  const key = await getEncryptionKey();
  
  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  
  // Convert plaintext to bytes
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  
  // Encrypt
  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv, tagLength: TAG_LENGTH },
    key,
    data
  );
  
  // Combine IV + ciphertext for storage
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  // Encode to base64
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt encrypted string using AES-256-GCM
 * Input: base64 encoded string in format "iv:ciphertext:tag"
 * Returns: plaintext string
 */
export async function decrypt(encryptedData: string): Promise<string> {
  const key = await getEncryptionKey();
  
  // Decode base64
  const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
  
  // Extract IV and ciphertext
  const iv = combined.slice(0, IV_LENGTH);
  const ciphertext = combined.slice(IV_LENGTH);
  
  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv, tagLength: TAG_LENGTH },
    key,
    ciphertext
  );
  
  // Convert bytes to string
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}
