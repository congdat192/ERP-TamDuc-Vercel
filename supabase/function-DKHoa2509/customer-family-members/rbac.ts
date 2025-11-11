// ================================================================
// RBAC PERMISSION CHECKING
// ================================================================
import { getVietnamTime } from './vietnam-time.ts';
export async function checkRBACPermissions(supabase, client_id, resource, operation) {
  console.log('🔍 [RBAC] Starting permission check');
  console.log(`   Client: ${client_id}`);
  console.log(`   Resource: ${resource}`);
  console.log(`   Operation: ${operation}`);
  const { data: clientRoles, error: roleError } = await supabase.from('oauth_client_roles').select('*').eq('client_id', client_id);
  if (roleError || !clientRoles || clientRoles.length === 0) {
    console.log('⚠️  [RBAC] No roles found - falling back to legacy');
    return null;
  }
  console.log(`✓  [RBAC] Found ${clientRoles.length} role(s)`);
  for (const clientRole of clientRoles){
    if (clientRole.expires_at && new Date(clientRole.expires_at) < getVietnamTime()) {
      continue;
    }
    const { data: role } = await supabase.from('oauth_roles').select('*').eq('id', clientRole.role_id).eq('active', true).single();
    if (!role) continue;
    const { data: permissions } = await supabase.from('oauth_role_permissions').select('*').eq('role_id', clientRole.role_id);
    if (!permissions) continue;
    for (const perm of permissions){
      if (perm.resource === resource || perm.resource === '*') {
        const hasPermission = checkOperationPermission(perm, operation);
        if (hasPermission) {
          console.log(`✅ [RBAC] GRANTED via role: ${role.role_code}`);
          return true;
        }
      }
      if (perm.resource.includes('*')) {
        const pattern = perm.resource.replace(/\*/g, '.*');
        const regex = new RegExp(`^${pattern}$`);
        if (regex.test(resource)) {
          const hasPermission = checkOperationPermission(perm, operation);
          if (hasPermission) {
            console.log(`✅ [RBAC] GRANTED via wildcard: ${role.role_code}`);
            return true;
          }
        }
      }
    }
  }
  console.log('❌ [RBAC] DENIED');
  return false;
}
function checkOperationPermission(perm, operation) {
  switch(operation){
    case 'read':
      return perm.can_read === true;
    case 'create':
      return perm.can_create === true;
    case 'update':
      return perm.can_update === true;
    case 'delete':
      return perm.can_delete === true;
    default:
      return false;
  }
}
export function checkLegacyPermissions(allowed_resources, resource) {
  if (!allowed_resources) return false;
  console.log('🔍 [LEGACY] Checking allowed_resources');
  return allowed_resources.some((pattern)=>{
    let resourcePattern = pattern;
    if (pattern.includes(':')) {
      resourcePattern = pattern.split(':')[0];
    }
    if (resourcePattern === '*') return true;
    if (resourcePattern === resource) return true;
    const regex = new RegExp('^' + resourcePattern.replace('*', '.*') + '$');
    return regex.test(resource);
  });
}
