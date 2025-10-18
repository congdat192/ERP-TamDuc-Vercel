import { supabase } from '@/integrations/supabase/client';

export interface SupabaseMember {
  id: string;
  user_id: string;
  role_id: number;
  status: 'ACTIVE' | 'INACTIVE';
  joined_at: string;
  profiles: {
    id: string;
    full_name: string;
    phone: string | null;
    avatar_path: string | null;
  };
  roles: {
    id: number;
    name: string;
    description: string | null;
  };
  is_owner: boolean;
}

export interface MembersResponse {
  data: SupabaseMember[];
  total: number;
  per_page: number;
  current_page: number;
}

export class MembersService {
  static async getMembers(): Promise<MembersResponse> {
    console.log('🔍 [MembersService] Fetching all users (single-tenant)');

    // Get all users from profiles with their roles
    const { data: usersData, error: usersError } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        phone,
        avatar_path,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('❌ [MembersService] Error:', usersError);
      throw new Error(usersError.message);
    }

    // Get roles for all users
    const { data: userRolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');

    if (rolesError) {
      console.error('❌ [MembersService] Roles error:', rolesError);
      throw new Error(rolesError.message);
    }

    // Get all roles definitions
    const { data: rolesDefinitions, error: rolesDefError } = await supabase
      .from('roles')
      .select('id, name, description');

    if (rolesDefError) {
      console.error('❌ [MembersService] Roles definitions error:', rolesDefError);
    }

    // Map users data to SupabaseMember format
    const members: SupabaseMember[] = (usersData || []).map((user: any) => {
      const userRole = userRolesData?.find(r => r.user_id === user.id);
      const roleInfo = rolesDefinitions?.find(r => r.name.toLowerCase() === userRole?.role) || {
        id: 1,
        name: userRole?.role || 'user',
        description: null
      };

      return {
        id: user.id,
        user_id: user.id,
        role_id: roleInfo.id,
        status: 'ACTIVE' as const,
        joined_at: user.created_at,
        profiles: {
          id: user.id,
          full_name: user.full_name,
          phone: user.phone,
          avatar_path: user.avatar_path
        },
        roles: {
          id: roleInfo.id,
          name: roleInfo.name,
          description: roleInfo.description
        },
        is_owner: userRole?.role === 'admin'
      };
    });

    console.log('✅ [MembersService] Members loaded:', members.length);

    return {
      data: members,
      total: members.length,
      per_page: 100,
      current_page: 1
    };
  }

  static async updateMember(userId: string, updates: { status?: 'ACTIVE' | 'INACTIVE'; role_id?: number }): Promise<void> {
    console.log('🔧 [MembersService] Updating member:', userId, updates);
    
    // In single-tenant mode, we only update user_roles table
    if (updates.role_id) {
      // Get role name from roles table
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('name')
        .eq('id', updates.role_id)
        .single();

      if (roleError) {
        console.error('❌ [MembersService] Role lookup error:', roleError);
        throw new Error(roleError.message);
      }

      // Update user_roles (ensure valid role type)
      const roleName = roleData.name.toLowerCase();
      if (roleName !== 'admin' && roleName !== 'user') {
        throw new Error('Invalid role name');
      }
      
      const { error } = await supabase
        .from('user_roles')
        .update({ role: roleName as 'admin' | 'user' })
        .eq('user_id', userId);

      if (error) {
        console.error('❌ [MembersService] Update error:', error);
        throw new Error(error.message);
      }
    }
    
    console.log('✅ [MembersService] Member updated successfully');
  }

  static async deleteMember(userId: string): Promise<void> {
    console.log('🗑️ [MembersService] Deleting member:', userId);
    
    // Delete from user_roles first
    const { error: rolesError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (rolesError) {
      console.error('❌ [MembersService] Delete roles error:', rolesError);
      throw new Error(rolesError.message);
    }

    // Delete from profiles
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('❌ [MembersService] Delete error:', error);
      throw new Error(error.message);
    }
    
    console.log('✅ [MembersService] Member deleted successfully');
  }
}

// Helper function for RolesTab to count members by role
export interface MemberWithRoles {
  id: string;
  status: 'ACTIVE' | 'INACTIVE';
  is_owner: boolean;
  roles: Array<{ id: number; name: string; description: string | null }>;
}

export async function getMembersWithRoles(): Promise<MemberWithRoles[]> {
  const { data: usersData, error: usersError } = await supabase
    .from('profiles')
    .select('id, created_at');

  if (usersError) {
    console.error('❌ [getMembersWithRoles] Error:', usersError);
    throw new Error(usersError.message);
  }

  const { data: userRolesData, error: rolesError } = await supabase
    .from('user_roles')
    .select('user_id, role');

  if (rolesError) {
    console.error('❌ [getMembersWithRoles] Roles error:', rolesError);
    throw new Error(rolesError.message);
  }

  const { data: rolesDefinitions, error: rolesDefError } = await supabase
    .from('roles')
    .select('id, name, description');

  if (rolesDefError) {
    console.error('❌ [getMembersWithRoles] Roles definitions error:', rolesDefError);
  }

  return (usersData || []).map((user: any) => {
    const userRole = userRolesData?.find(r => r.user_id === user.id);
    const roleInfo = rolesDefinitions?.find(r => r.name.toLowerCase() === userRole?.role) || {
      id: 1,
      name: userRole?.role || 'user',
      description: null
    };

    return {
      id: user.id,
      status: 'ACTIVE' as const,
      is_owner: userRole?.role === 'admin',
      roles: [roleInfo]
    };
  });
}
