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
      // Fetch all counts in parallel
      const [membersResult, rolesResult, invitationsResult] = await Promise.all([
        supabase
          .from('business_members')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', businessId)
          .eq('status', 'ACTIVE'),
        supabase
          .from('roles')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', businessId),
        supabase
          .from('business_invitations')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', businessId)
          .eq('status', 'pending')
      ]);

      console.log('✅ [DashboardService] Counts fetched:', {
        members: membersResult.count,
        roles: rolesResult.count,
        invitations: invitationsResult.count
      });

      if (membersResult.error) {
        console.error('❌ [DashboardService] Members error:', membersResult.error);
        throw membersResult.error;
      }
      if (rolesResult.error) {
        console.error('❌ [DashboardService] Roles error:', rolesResult.error);
        throw rolesResult.error;
      }
      if (invitationsResult.error) {
        console.error('❌ [DashboardService] Invitations error:', invitationsResult.error);
        throw invitationsResult.error;
      }

      return {
        members: membersResult.count || 0,
        departments: 0, // Not implemented yet
        roles: rolesResult.count || 0,
        groups: 0, // Not implemented yet
        invitations: invitationsResult.count || 0
      };
    } catch (error) {
      console.error('❌ [DashboardService] Error fetching counts:', error);
      throw error;
    }
  }
}
