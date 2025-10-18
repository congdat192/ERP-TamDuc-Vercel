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
    email: string;
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
        email,
        phone,
        avatar_path,
        status,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('❌ [MembersService] Error:', usersError);
      throw new Error(usersError.message);
    }

    // Get roles for all users with role details
    const { data: userRolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select(`
        user_id,
        role_id,
        roles (
          id,
          name,
          description
        )
      `);

    if (rolesError) {
      console.error('❌ [MembersService] Roles error:', rolesError);
      throw new Error(rolesError.message);
    }

    // Map users data to SupabaseMember format
    console.log('👥 [MembersService] Mapping members...');
    console.log('   - Total users from profiles:', usersData?.length);
    console.log('   - Total user_roles:', userRolesData?.length);
    
    const members: SupabaseMember[] = (usersData || []).map((user: any) => {
      const userRole = userRolesData?.find((r: any) => r.user_id === user.id);
      const roleInfo = (userRole as any)?.roles || {
        id: 1,
        name: 'User',
        description: null
      };
      
      console.log(`   - User ${user.full_name}: role =`, roleInfo.name);

      return {
        id: user.id,
        user_id: user.id,
        role_id: roleInfo.id,
        status: (user.status || 'ACTIVE') as 'ACTIVE' | 'INACTIVE',
        joined_at: user.created_at,
        profiles: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          avatar_path: user.avatar_path
        },
        roles: {
          id: roleInfo.id,
          name: roleInfo.name,
          description: roleInfo.description
        },
        is_owner: roleInfo.name.toLowerCase() === 'admin'
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
    
    // Update role_id in user_roles table
    if (updates.role_id) {
      const { error } = await supabase
        .from('user_roles')
        .update({ role_id: updates.role_id })
        .eq('user_id', userId);

      if (error) {
        console.error('❌ [MembersService] Update role error:', error);
        console.error('   - Error code:', error.code);
        console.error('   - Error details:', error.details);
        
        // Check if it's RLS error
        if (error.code === '42501' || error.message.toLowerCase().includes('policy')) {
          throw new Error('Bạn không có quyền cập nhật vai trò. Vui lòng liên hệ admin.');
        }
        throw new Error(error.message);
      }
    }
    
    // Update status in profiles table
    if (updates.status) {
      const { error } = await supabase
        .from('profiles')
        .update({ status: updates.status })
        .eq('id', userId);

      if (error) {
        console.error('❌ [MembersService] Update status error:', error);
        console.error('   - Error code:', error.code);
        console.error('   - Error details:', error.details);
        
        // Check if it's RLS error
        if (error.code === '42501' || error.message.toLowerCase().includes('policy')) {
          throw new Error('Bạn không có quyền cập nhật trạng thái. Vui lòng liên hệ admin.');
        }
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
    .select('id, status, created_at');

  if (usersError) {
    console.error('❌ [getMembersWithRoles] Error:', usersError);
    throw new Error(usersError.message);
  }

  const { data: userRolesData, error: rolesError } = await supabase
    .from('user_roles')
    .select(`
      user_id,
      role_id,
      roles (
        id,
        name,
        description
      )
    `);

  if (rolesError) {
    console.error('❌ [getMembersWithRoles] Roles error:', rolesError);
    throw new Error(rolesError.message);
  }

  return (usersData || []).map((user: any) => {
    const userRole = userRolesData?.find((r: any) => r.user_id === user.id);
    const roleInfo = (userRole as any)?.roles || {
      id: 1,
      name: 'User',
      description: null
    };

    return {
      id: user.id,
      status: (user.status || 'ACTIVE') as 'ACTIVE' | 'INACTIVE',
      is_owner: roleInfo.name.toLowerCase() === 'admin',
      roles: [roleInfo]
    };
  });
}
