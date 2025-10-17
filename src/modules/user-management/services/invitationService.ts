import { supabase } from '@/integrations/supabase/client';

export interface CreateInvitationRequest {
  email: string;
  role_id: number;
}

export interface Invitation {
  id: string;
  business_id: string;
  email: string;
  role_id: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  invited_by: string;
  token: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  accepted_at?: string;
  roles?: {
    id: number;
    name: string;
    description: string;
  };
  profiles?: {
    full_name: string;
  };
}

export class InvitationService {
  static async getInvitations(businessId: string): Promise<Invitation[]> {
    const { data, error } = await supabase
      .from('business_invitations')
      .select(`
        *,
        roles!inner (
          id,
          name,
          description
        ),
        profiles!business_invitations_invited_by_fkey (
          full_name
        )
      `)
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invitations:', error);
      throw error;
    }
    
    return (data || []) as unknown as Invitation[];
  }

  static async createInvitation(businessId: string, data: CreateInvitationRequest): Promise<Invitation> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Create invitation record with unique token
    const token = crypto.randomUUID();
    
    const { data: invitation, error: invError } = await supabase
      .from('business_invitations')
      .insert({
        business_id: businessId,
        email: data.email,
        role_id: data.role_id,
        invited_by: user.id,
        token: token
      })
      .select()
      .single();

    if (invError) {
      console.error('Error creating invitation:', invError);
      throw invError;
    }

    const typedInvitation = invitation as unknown as Invitation;

    // Call edge function to send email
    try {
      const { error: emailError } = await supabase.functions.invoke('send-invitation-email', {
        body: { invitationId: invitation.id }
      });

      if (emailError) {
        console.error('Failed to send invitation email:', emailError);
        // Don't throw - invitation is created, just email failed
      }
    } catch (emailErr) {
      console.error('Email sending error:', emailErr);
    }

    return typedInvitation;
  }

  static async deleteInvitation(invitationId: string): Promise<void> {
    const { error } = await supabase
      .from('business_invitations')
      .delete()
      .eq('id', invitationId);

    if (error) {
      console.error('Error deleting invitation:', error);
      throw error;
    }
  }

  static async resendInvitation(invitationId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('send-invitation-email', {
      body: { invitationId }
    });

    if (error) {
      console.error('Error resending invitation:', error);
      throw error;
    }
  }

  static async getInvitationByToken(token: string): Promise<Invitation | null> {
    const { data, error } = await supabase
      .from('business_invitations')
      .select(`
        *,
        businesses!inner (
          name
        ),
        roles!inner (
          name,
          description
        )
      `)
      .eq('token', token)
      .single();

    if (error) {
      console.error('Error fetching invitation by token:', error);
      return null;
    }

    return data as unknown as Invitation;
  }

  static async processInvitation(token: string, action: 'accept' | 'reject'): Promise<{ success: boolean; business_id?: string; message: string }> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('process-invitation', {
      body: { token, action },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (error) {
      console.error('Error processing invitation:', error);
      throw error;
    }

    return data;
  }
}
