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
    // Get businessId from localStorage
    const businessId = localStorage.getItem('cbi');
    if (!businessId) {
      throw new Error('Business context not found');
    }

    console.log('🔍 [DashboardService] Fetching counts for business:', businessId);

    try {
      // Fetch members count
      const { count: membersCount, error: membersError } = await supabase
        .from('business_members')
        .select('id', { count: 'exact', head: true })
        .eq('business_id', businessId)
        .eq('status', 'ACTIVE');

      if (membersError) {
        console.error('❌ [DashboardService] Members error:', membersError);
        throw new Error(`Members: ${membersError.message}`);
      }

      // Fetch roles count
      const { count: rolesCount, error: rolesError } = await supabase
        .from('roles')
        .select('id', { count: 'exact', head: true })
        .eq('business_id', businessId);

      if (rolesError) {
        console.error('❌ [DashboardService] Roles error:', rolesError);
        throw new Error(`Roles: ${rolesError.message}`);
      }

      // Fetch invitations count
      const { count: invitationsCount, error: invitationsError } = await supabase
        .from('business_invitations')
        .select('id', { count: 'exact', head: true })
        .eq('business_id', businessId)
        .eq('status', 'pending');

      if (invitationsError) {
        console.error('❌ [DashboardService] Invitations error:', invitationsError);
        throw new Error(`Invitations: ${invitationsError.message}`);
      }

      const counts = {
        members: membersCount || 0,
        departments: 0,
        roles: rolesCount || 0,
        groups: 0,
        invitations: invitationsCount || 0
      };

      console.log('✅ [DashboardService] Counts loaded:', counts);
      return counts;
    } catch (error) {
      console.error('❌ [DashboardService] Error:', error);
      throw error;
    }
  }
}
