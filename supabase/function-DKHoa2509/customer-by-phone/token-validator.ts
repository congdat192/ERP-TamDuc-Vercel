/**
 * Token Validator
 * Validate OAuth token with cache support
 */ import { getCached, setCache } from './cache-helper.ts';
export async function validateToken(supabase, token) {
  // Check cache first
  const cached = getCached(`token:${token}`);
  if (cached) {
    console.log('✅ Token validated from cache');
    return cached;
  }
  console.log('Validating token from database...');
  // Query from database
  const { data } = await supabase.from('oauth_tokens').select('*, oauth_clients!inner(*)').eq('access_token', token).eq('revoked', false).gt('expires_at_vn', new Date().toISOString()).single();
  if (data) {
    // Cache for 60 seconds
    setCache(`token:${token}`, data, 60000);
    console.log('✅ Token validated from database');
  } else {
    console.log('❌ Invalid token');
  }
  return data;
}
