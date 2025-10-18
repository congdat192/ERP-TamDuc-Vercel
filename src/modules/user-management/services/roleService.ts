// Single-Tenant Role Service with Supabase
import { supabase } from '@/integrations/supabase/client';
import { CustomRole, RoleCreationData } from '../types/role-management';

export class RoleService {
  static async getRoles(): Promise<CustomRole[]> {
    const { data, error } = await supabase
      .from('roles')
      .select(`
        id,
        name,
        description,
        is_system,
        created_at,
        updated_at,
        role_permissions (
          features (
            code
          )
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Count users for each role from user_roles table
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role');
    
    const countMap: Record<string, number> = {};
    (userRoles || []).forEach((ur: any) => {
      countMap[ur.role] = (countMap[ur.role] || 0) + 1;
    });
    
    return (data || []).map(role => ({
      id: role.id,
      name: role.name,
      description: role.description || '',
      permissions: (role.role_permissions as any[] || []).map((rp: any) => rp.features.code),
      userCount: countMap[role.name.toLowerCase()] || 0,
      isSystem: role.is_system,
      created_at: role.created_at,
      updated_at: role.updated_at
    }));
  }

  static async getRoleById(roleId: number): Promise<CustomRole> {
    const { data, error } = await supabase
      .from('roles')
      .select(`
        id,
        name,
        description,
        is_system,
        created_at,
        updated_at,
        role_permissions (
          features (
            code
          )
        )
      `)
      .eq('id', roleId)
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      permissions: (data.role_permissions as any[] || []).map((rp: any) => rp.features.code),
      userCount: 0,
      isSystem: data.is_system,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  static async createRole(roleData: RoleCreationData): Promise<CustomRole> {
    // 1. Create role
    const { data: role, error: roleError } = await supabase
      .from('roles')
      .insert({
        name: roleData.name,
        description: roleData.description
      })
      .select()
      .single();
    
    if (roleError) throw roleError;
    
    // 2. Get feature IDs from codes
    const { data: features, error: featuresError } = await supabase
      .from('features')
      .select('id, code')
      .in('code', roleData.permissions);
    
    if (featuresError) throw featuresError;
    
    // 3. Create role_permissions
    if (features && features.length > 0) {
      const { error: permError } = await supabase
        .from('role_permissions')
        .insert(features.map(f => ({
          role_id: role.id,
          feature_id: f.id
        })));
      
      if (permError) throw permError;
    }
    
    return {
      id: role.id,
      name: role.name,
      description: role.description || '',
      permissions: roleData.permissions,
      userCount: 0,
      isSystem: false,
      created_at: role.created_at,
      updated_at: role.updated_at
    };
  }

  static async updateRole(roleId: number, roleData: Partial<RoleCreationData>): Promise<CustomRole> {
    // Update basic info
    const { data: role, error: roleError } = await supabase
      .from('roles')
      .update({
        name: roleData.name,
        description: roleData.description
      })
      .eq('id', roleId)
      .select()
      .single();
    
    if (roleError) throw roleError;
    
    // Update permissions if provided
    if (roleData.permissions) {
      // Delete existing permissions
      await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', roleId);
      
      // Insert new permissions
      const { data: features } = await supabase
        .from('features')
        .select('id, code')
        .in('code', roleData.permissions);
      
      if (features && features.length > 0) {
        await supabase
          .from('role_permissions')
          .insert(features.map(f => ({
            role_id: roleId,
            feature_id: f.id
          })));
      }
    }
    
    return {
      id: role.id,
      name: role.name,
      description: role.description || '',
      permissions: roleData.permissions || [],
      userCount: 0,
      isSystem: role.is_system,
      created_at: role.created_at,
      updated_at: role.updated_at
    };
  }

  static async deleteRole(roleId: number): Promise<void> {
    // Check if role has users assigned via user_roles table
    const { data: role } = await supabase
      .from('roles')
      .select('name')
      .eq('id', roleId)
      .single();
    
    if (role) {
      const roleName = role.name.toLowerCase();
      // Only check for valid role types
      if (roleName === 'admin' || roleName === 'user') {
        const { data: users } = await supabase
          .from('user_roles')
          .select('id')
          .eq('role', roleName as 'admin' | 'user')
          .limit(1);
        
        if (users && users.length > 0) {
          throw new Error('Không thể xóa vai trò đang được sử dụng');
        }
      }
    }
    
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', roleId);
    
    if (error) throw error;
  }
}
