/**
 * Permission Checker
 * Check RBAC permissions with cache support
 */ import { getCached, setCache } from './cache-helper.ts';
export async function checkPermission(supabase, clientId, resource = 'kiotviet.customers') {
  const permKey = `perm:${clientId}:${resource}`;
  // Check cache first
  let hasAccess = getCached(permKey);
  if (hasAccess !== null) {
    console.log(`✅ Permission check from cache: ${hasAccess}`);
    return hasAccess;
  }
  console.log(`Checking permission for ${clientId} on ${resource}...`);
  // Query from database
  const { data } = await supabase.from('oauth_role_permissions').select('can_read').eq('can_read', true).or('resource.eq.kiotviet.customers_backup,resource.eq.kiotviet.*,resource.eq.*').limit(1).single();
  hasAccess = !!data;
  // Cache for 5 minutes
  setCache(permKey, hasAccess, 300000);
  console.log(`✅ Permission check result: ${hasAccess}`);
  return hasAccess;
}
