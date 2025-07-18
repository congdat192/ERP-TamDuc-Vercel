import { api } from '@/services/apiService';

// API Response structures cho User Invitations (lời mời nhận được)
interface UserInvitationApiResponse {
  id: number;
  created_at: string;
  from_business: {
    id: string;
    name: string;
    logo_path: string | null;
  };
  from_user: {
    name: string;
    avatar_path: string | null;
  };
}

interface UserInvitationsListResponse {
  total: number;
  per_page: number;
  current_page: number;
  data: UserInvitationApiResponse[];
}

export interface UserInvitation {
  id: string;
  businessName: string;
  businessLogoPath: string | null;
  inviterName: string;
  inviterAvatarPath: string | null;
  created_at: string;
}

export interface UserInvitationFilters {
  page?: number;
  perPage?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface UserInvitationResponse {
  data: UserInvitation[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export class UserInvitationService {
  /**
   * Lấy danh sách lời mời mà user hiện tại nhận được
   */
  static async getUserInvitations(filters: UserInvitationFilters = {}): Promise<UserInvitationResponse> {
    try {
      console.log('🔍 [UserInvitationService] Fetching user invitations...');
      
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.perPage) params.append('perPage', filters.perPage.toString());
      if (filters.orderBy) params.append('orderBy', filters.orderBy);
      if (filters.orderDirection) params.append('orderDirection', filters.orderDirection);

      const queryString = params.toString();
      const endpoint = `/me/invitations${queryString ? `?${queryString}` : ''}`;
      
      // API này không cần business ID
      const response = await api.get<UserInvitationsListResponse>(endpoint, {
        requiresBusinessId: false
      });
      console.log('✅ [UserInvitationService] Raw response:', response);
      
      // Transform API response to UI format
      const transformedData: UserInvitation[] = response.data.map(item => ({
        id: item.id.toString(),
        businessName: item.from_business.name,
        businessLogoPath: item.from_business.logo_path,
        inviterName: item.from_user.name,
        inviterAvatarPath: item.from_user.avatar_path,
        created_at: item.created_at
      }));

      return {
        data: transformedData,
        total: response.total,
        page: response.current_page,
        perPage: response.per_page,
        totalPages: Math.ceil(response.total / response.per_page)
      };
    } catch (error: any) {
      console.error('❌ [UserInvitationService] Error fetching user invitations:', error);
      throw new Error(error.response?.data?.message || 'Không thể tải danh sách lời mời');
    }
  }

  /**
   * Phản hồi lời mời (chấp nhận hoặc từ chối)
   * API: POST /api/v1/me/invitations/{id}
   */
  static async respondToInvitation(invitationId: string, status: 'accept' | 'reject'): Promise<void> {
    try {
      console.log('🔧 [UserInvitationService] Responding to invitation:', invitationId, status);
      
      const payload = { status };
      
      // Correct endpoint according to API documentation
      await api.post(`/me/invitations/${invitationId}`, payload, {
        requiresBusinessId: false
      });
      console.log('✅ [UserInvitationService] Invitation response sent');
    } catch (error: any) {
      console.error('❌ [UserInvitationService] Error responding to invitation:', error);
      
      let errorMessage = 'Không thể xử lý lời mời';
      
      if (error.response?.status === 404) {
        errorMessage = 'Lời mời không tồn tại hoặc đã được xử lý';
      } else if (error.response?.status === 422) {
        errorMessage = 'Dữ liệu không hợp lệ';
        if (error.response.data?.errors?.status) {
          errorMessage = error.response.data.errors.status[0];
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'Bạn cần đăng nhập để thực hiện thao tác này';
      } else if (error.response?.status === 403) {
        errorMessage = 'Email của bạn chưa được xác thực';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Chấp nhận lời mời
   */
  static async acceptInvitation(invitationId: string): Promise<void> {
    return this.respondToInvitation(invitationId, 'accept');
  }

  /**
   * Từ chối lời mời
   */
  static async rejectInvitation(invitationId: string): Promise<void> {
    return this.respondToInvitation(invitationId, 'reject');
  }
}
