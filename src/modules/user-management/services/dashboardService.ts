
import { api } from '../../../services/apiService';

export interface UserManagementCounts {
  members: number;
  departments: number;
  roles: number;
  groups: number;
  invitations: number;
}

// API Response interfaces theo specification
interface RolesApiResponse {
  total: number;
  per_page: number;
  current_page: number;
  data: any[];
}

interface MembersApiResponse {
  total: number;
  per_page: number;
  current_page: number;
  data: any[];
}

interface InvitationsApiResponse {
  total: number;
  per_page: number;
  current_page: number;
  data: any[];
}

export class DashboardService {
  static async getCounts(): Promise<UserManagementCounts> {
    console.log('🔍 [DashboardService] Fetching user management counts...');
    
    try {
      // Fetch counts từ các API endpoints theo specification mới
      const [rolesResponse, membersResponse, invitationsResponse] = await Promise.allSettled([
        // Roles API - có pagination
        api.get<RolesApiResponse>('/roles?perPage=1'), // Chỉ cần count, không cần data
        
        // Members API - có pagination  
        api.get<MembersApiResponse>('/members?perPage=1'), // Chỉ cần count, không cần data
        
        // Business Invitations API - có pagination
        api.get<InvitationsApiResponse>('/invitations?perPage=1') // Chỉ cần count, không cần data
      ]);

      // Parse roles count
      let rolesCount = 0;
      if (rolesResponse.status === 'fulfilled') {
        rolesCount = rolesResponse.value.total || 0;
        console.log('✅ [DashboardService] Roles count:', rolesCount);
      } else {
        console.error('❌ [DashboardService] Failed to fetch roles:', rolesResponse.reason);
      }

      // Parse members count
      let membersCount = 0;
      if (membersResponse.status === 'fulfilled') {
        membersCount = membersResponse.value.total || 0;
        console.log('✅ [DashboardService] Members count:', membersCount);
      } else {
        console.error('❌ [DashboardService] Failed to fetch members:', membersResponse.reason);
      }

      // Parse invitations count
      let invitationsCount = 0;
      if (invitationsResponse.status === 'fulfilled') {
        invitationsCount = invitationsResponse.value.total || 0;
        console.log('✅ [DashboardService] Invitations count:', invitationsCount);
      } else {
        console.error('❌ [DashboardService] Failed to fetch invitations:', invitationsResponse.reason);
      }

      const counts = {
        members: membersCount,
        departments: 0, // TODO: Implement when departments API is ready
        roles: rolesCount,
        groups: 0, // TODO: Implement when groups API is ready
        invitations: invitationsCount
      };

      console.log('✅ [DashboardService] Final counts:', counts);
      return counts;

    } catch (error) {
      console.error('❌ [DashboardService] Error fetching counts:', error);
      
      // Return zeros on error but log the issue
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
