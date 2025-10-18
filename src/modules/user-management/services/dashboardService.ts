import { supabase } from '@/integrations/supabase/client';

export interface UserManagementCounts {
  members: number;
  departments: number;
  roles: number;
  groups: number;
  invitations: number;
}

export class DashboardService {
  static async getCounts(): Promise<UserManagementCounts> {
    console.log('🔍 [DashboardService] Fetching counts (single-tenant)');

    try {
      // Count all users (profiles) in the system
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      if (usersError) {
        console.error('❌ [DashboardService] Users error:', usersError);
        throw new Error(`Users: ${usersError.message}`);
      }

      // Count all roles in the system
      const { count: rolesCount, error: rolesError } = await supabase
        .from('roles')
        .select('id', { count: 'exact', head: true });

      if (rolesError) {
        console.error('❌ [DashboardService] Roles error:', rolesError);
        throw new Error(`Roles: ${rolesError.message}`);
      }

      const counts = {
        members: usersCount || 0,
        departments: 0,
        roles: rolesCount || 0,
        groups: 0,
        invitations: 0
      };

      console.log('✅ [DashboardService] Counts loaded:', counts);
      return counts;
    } catch (error) {
      console.error('❌ [DashboardService] Error:', error);
      throw error;
    }
  }
}
