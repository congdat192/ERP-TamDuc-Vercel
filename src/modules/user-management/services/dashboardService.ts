// Mock Dashboard Service - No real API calls

export interface UserManagementCounts {
  members: number;
  departments: number;
  roles: number;
  groups: number;
  invitations: number;
}

export class DashboardService {
  static async getCounts(): Promise<UserManagementCounts> {
    console.log('🔍 [mockDashboardService] Fetching counts');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      members: 25,
      departments: 5,
      roles: 8,
      groups: 3,
      invitations: 4
    };
  }
}
