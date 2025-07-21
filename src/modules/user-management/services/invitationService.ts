
import { api } from '@/services/apiService';

// API Response structures theo documentation mới
interface BusinessInvitationApiResponse {
  id: number;
  email: string;
  status: 'INVITED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  created_by_user_name: string;
  created_at: string;
}

interface BusinessInvitationsListResponse {
  total: number;
  per_page: number;
  current_page: number;
  data: BusinessInvitationApiResponse[];
}

export interface CreateInvitationRequest {
  email: string;
  role_id?: number; // Changed from string to number to match API
}

export interface InvitationFilters {
  page?: number;
  perPage?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  search?: string;
  status?: string[];
}

// Transform API response to UI format
export interface Invitation {
  id: string;
  email: string;
  name: string; // Sẽ lấy từ email hoặc để trống
  role?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  created_at: string;
  updated_at?: string;
  expires_at?: string;
  invited_by?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface InvitationResponse {
  data: Invitation[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export class InvitationService {
  static async getInvitations(filters: InvitationFilters = {}): Promise<InvitationResponse> {
    try {
      console.log('🔍 [InvitationService] Fetching business invitations...');
      
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.perPage) params.append('perPage', filters.perPage.toString());
      if (filters.orderBy) params.append('orderBy', filters.orderBy);
      if (filters.orderDirection) params.append('orderDirection', filters.orderDirection);
      if (filters.search) params.append('search', filters.search);
      
      // Handle status filter - send as comma-separated string
      if (filters.status && filters.status.length > 0) {
        const statusMap: Record<string, string> = {
          'pending': 'INVITED',
          'accepted': 'ACCEPTED', 
          'rejected': 'REJECTED',
          'expired': 'EXPIRED'
        };
        
        const apiStatuses = filters.status.map(s => statusMap[s] || s).join(',');
        params.append('status', apiStatuses);
      }

      const queryString = params.toString();
      const endpoint = `/invitations${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get<BusinessInvitationsListResponse>(endpoint);
      console.log('✅ [InvitationService] Raw response:', response);
      
      // Transform API response to UI format
      const transformedData: Invitation[] = response.data.map(item => ({
        id: item.id.toString(),
        email: item.email,
        name: '', // API không có name field
        status: this.transformStatus(item.status),
        created_at: item.created_at,
        invited_by: {
          id: '', // API không có ID
          name: item.created_by_user_name,
          email: '' // API không có email người mời
        }
      }));

      return {
        data: transformedData,
        total: response.total,
        page: response.current_page,
        perPage: response.per_page,
        totalPages: Math.ceil(response.total / response.per_page)
      };
    } catch (error: any) {
      console.error('❌ [InvitationService] Error fetching invitations:', error);
      throw new Error(error.response?.data?.message || 'Không thể tải danh sách lời mời');
    }
  }

  static async createInvitation(data: CreateInvitationRequest): Promise<Invitation> {
    try {
      console.log('🔧 [InvitationService] Creating invitation:', data);
      
      // Prepare payload - chỉ gửi role_id nếu có
      const payload: any = { email: data.email };
      if (data.role_id) {
        payload.role_id = data.role_id; // Keep as number, no need to convert
      }
      
      const response = await api.post('/invitations', payload);
      console.log('✅ [InvitationService] Invitation created:', response);
      
      // API trả về { "message": "Lời mời đã được gửi" } theo spec
      // Tạo mock response cho UI
      return {
        id: Date.now().toString(), // Temporary ID
        email: data.email,
        name: '',
        status: 'pending',
        created_at: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('❌ [InvitationService] Error creating invitation:', error);
      
      let errorMessage = 'Không thể gửi lời mời';
      
      // Handle specific error cases từ API spec
      if (error.response?.status === 400 && error.response.data?.message) {
        // Business logic errors: member exists, invitation exists
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 422) {
        // Validation errors
        errorMessage = 'Dữ liệu không hợp lệ';
        if (error.response.data?.errors?.email) {
          errorMessage = error.response.data.errors.email[0];
        } else if (error.response.data?.errors?.role_id) {
          errorMessage = error.response.data.errors.role_id[0];
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  static async deleteInvitation(invitationId: string): Promise<void> {
    try {
      console.log('🗑️ [InvitationService] Deleting invitation:', invitationId);
      
      await api.delete(`/invitations/${invitationId}`);
      console.log('✅ [InvitationService] Invitation deleted');
    } catch (error: any) {
      console.error('❌ [InvitationService] Error deleting invitation:', error);
      
      let errorMessage = 'Không thể xóa lời mời';
      
      if (error.response?.status === 404) {
        errorMessage = 'Lời mời không tồn tại';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  // Helper method to transform API status to UI status
  private static transformStatus(apiStatus: string): 'pending' | 'accepted' | 'rejected' | 'expired' {
    switch (apiStatus) {
      case 'INVITED':
        return 'pending';
      case 'ACCEPTED':
        return 'accepted';
      case 'REJECTED':
        return 'rejected';
      case 'EXPIRED':
        return 'expired';
      default:
        return 'pending';
    }
  }
}
