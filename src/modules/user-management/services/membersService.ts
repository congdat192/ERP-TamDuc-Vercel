import { supabase } from '@/integrations/supabase/client';

export interface SupabaseMember {
  id: string;
  user_id: string;
  business_id: string;
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
  businesses: {
    owner_id: string;
  };
}

export interface MembersResponse {
  data: SupabaseMember[];
  total: number;
  per_page: number;
  current_page: number;
}

export class MembersService {
  static async getMembers(businessId: string): Promise<MembersResponse> {
    console.log('🔍 [MembersService] Fetching members for business:', businessId);

    const { data, error } = await supabase
      .from('business_members')
      .select(`
        id,
        user_id,
        business_id,
        role_id,
        status,
        joined_at,
        profiles!inner (
          id,
          full_name,
          phone,
          avatar_path
        ),
        roles!inner (
          id,
          name,
          description
        ),
        businesses!inner (
          owner_id
        )
      `)
      .eq('business_id', businessId)
      .eq('status', 'ACTIVE')
      .order('joined_at', { ascending: false });

    if (error) {
      console.error('❌ [MembersService] Error:', error);
      throw new Error(error.message);
    }

    console.log('✅ [MembersService] Members loaded:', data?.length);

    return {
      data: (data || []) as unknown as SupabaseMember[],
      total: data?.length || 0,
      per_page: 100,
      current_page: 1
    };
  }

  static async updateMember(memberId: string, updates: { status?: 'ACTIVE' | 'INACTIVE'; role_id?: number }): Promise<void> {
    console.log('🔧 [MembersService] Updating member:', memberId, updates);
    
    const { error } = await supabase
      .from('business_members')
      .update(updates)
      .eq('id', memberId);

    if (error) {
      console.error('❌ [MembersService] Update error:', error);
      throw new Error(error.message);
    }
    
    console.log('✅ [MembersService] Member updated successfully');
  }

  static async deleteMember(memberId: string): Promise<void> {
    console.log('🗑️ [MembersService] Deleting member:', memberId);
    
    const { error } = await supabase
      .from('business_members')
      .delete()
      .eq('id', memberId);

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
  const businessId = localStorage.getItem('cbi') || '';
  if (!businessId) {
    throw new Error('Business context not found');
  }

  const { data, error } = await supabase
    .from('business_members')
    .select(`
      id,
      status,
      user_id,
      businesses!inner (
        owner_id
      ),
      roles!inner (
        id,
        name,
        description
      )
    `)
    .eq('business_id', businessId);

  if (error) {
    console.error('❌ [getMembersWithRoles] Error:', error);
    throw new Error(error.message);
  }

  return (data || []).map((member: any) => ({
    id: member.id,
    status: member.status,
    is_owner: member.businesses.owner_id === member.user_id,
    roles: [member.roles]
  }));
}
