
import { api } from '../../../services/apiService';

export interface UserManagementCounts {
  members: number;
  departments: number;
  roles: number;
  groups: number;
  invitations: number;
}

export class DashboardService {
  static async getCounts(): Promise<UserManagementCounts> {
    try {
      console.log('🔍 [DashboardService] Fetching user management counts...');
      
      // Fetch roles count from existing API
      const rolesResponse = await api.get<{ data: any[] }>('/roles');
      const rolesCount = rolesResponse.data?.length || 0;
      
      // Fetch members count 
      const membersResponse = await api.get<{ data: any[] }>('/members');
      const membersCount = membersResponse.data?.length || 0;
      
      // Fetch invitations count from API
      const invitationsResponse = await api.get<{ data: any[] }>('/invitations?perPage=1000');
      const invitationsCount = invitationsResponse.data?.length || 0;
      
      console.log('✅ [DashboardService] Counts:', { 
        members: membersCount, 
        roles: rolesCount,
        invitations: invitationsCount
      });
      
      return {
        members: membersCount,
        departments: 0, // TODO: Implement when departments API is ready
        roles: rolesCount,
        groups: 0, // TODO: Implement when groups API is ready
        invitations: invitationsCount
      };
    } catch (error) {
      console.error('❌ [DashboardService] Error fetching counts:', error);
      
      // Return default values on error
      return {
        members: 0,
        departments: 0,
        roles: 0,
        groups: 0,
        invitations: 0
      };
    }
  }
}
