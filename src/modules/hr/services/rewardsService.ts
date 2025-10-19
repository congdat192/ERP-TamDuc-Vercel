import { supabase } from '@/integrations/supabase/client';
import type {
  Reward,
  CreateRewardData,
  UpdateRewardData,
  RewardStats,
  RewardFilters,
} from '../types/benefits';

export class RewardsService {
  /**
   * Get all rewards
   */
  static async getRewards(filters?: RewardFilters): Promise<Reward[]> {
    try {
      let query = supabase
        .from('hr_rewards')
        .select(`
          *,
          employee:employees(id, full_name, employee_code, position, department)
        `)
        .order('awarded_date', { ascending: false });

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.type) {
        query = query.eq('reward_type', filters.type);
      }
      if (filters?.employee_id) {
        query = query.eq('employee_id', filters.employee_id);
      }
      if (filters?.date_from) {
        query = query.gte('awarded_date', filters.date_from);
      }
      if (filters?.date_to) {
        query = query.lte('awarded_date', filters.date_to);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching rewards:', error);
        throw new Error(`Không thể tải danh sách khen thưởng: ${error.message}`);
      }

      return (data || []) as Reward[];
    } catch (error: any) {
      console.error('❌ Error in getRewards:', error);
      throw error;
    }
  }

  /**
   * Get reward by ID
   */
  static async getRewardById(id: string): Promise<Reward> {
    try {
      const { data, error } = await supabase
        .from('hr_rewards')
        .select(`
          *,
          employee:employees(id, full_name, employee_code, position, department)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Error fetching reward:', error);
        throw new Error(`Không thể tải khen thưởng: ${error.message}`);
      }

      return data as Reward;
    } catch (error: any) {
      console.error('❌ Error in getRewardById:', error);
      throw error;
    }
  }

  /**
   * Create new reward (supports batch insert for multiple employees)
   */
  static async createReward(data: CreateRewardData): Promise<Reward> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Không tìm thấy thông tin người dùng');

      // Validate all employees exist
      const { data: employees, error: empError } = await supabase
        .from('employees')
        .select('id')
        .in('id', data.employee_ids);
      
      if (empError) throw empError;
      if (!employees || employees.length !== data.employee_ids.length) {
        throw new Error('Một hoặc nhiều nhân viên không tồn tại');
      }

      // Generate unique code for this batch
      const timestamp = Date.now();
      
      // Create array of inserts (one per employee)
      const inserts = data.employee_ids.map((employee_id, index) => ({
        employee_id,
        reward_title: data.reward_title,
        reward_type: data.reward_type,
        awarded_date: data.awarded_date,
        reason: data.reason,
        amount: data.amount,
        reward_code: `KT-${timestamp}-${String(index + 1).padStart(3, '0')}`,
        status: 'pending',
        created_by: user.id,
      }));

      const { data: rewards, error } = await supabase
        .from('hr_rewards')
        .insert(inserts)
        .select(`
          *,
          employee:employees(id, full_name, employee_code, position, department)
        `);

      if (error) {
        console.error('❌ Error creating rewards:', error);
        throw new Error(`Không thể tạo khen thưởng: ${error.message}`);
      }

      console.log(`✅ ${rewards.length} Rewards created`);
      return rewards[0] as Reward; // Return first for compatibility
    } catch (error: any) {
      console.error('❌ Error in createReward:', error);
      throw error;
    }
  }

  /**
   * Update reward
   */
  static async updateReward(
    id: string,
    updates: UpdateRewardData
  ): Promise<Reward> {
    try {
      const { data: reward, error } = await supabase
        .from('hr_rewards')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          employee:employees(id, full_name, employee_code, position, department)
        `)
        .single();

      if (error) {
        console.error('❌ Error updating reward:', error);
        throw new Error(`Không thể cập nhật khen thưởng: ${error.message}`);
      }

      console.log('✅ Reward updated:', reward);
      return reward as Reward;
    } catch (error: any) {
      console.error('❌ Error in updateReward:', error);
      throw error;
    }
  }

  /**
   * Delete reward
   */
  static async deleteReward(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('hr_rewards')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting reward:', error);
        throw new Error(`Không thể xóa khen thưởng: ${error.message}`);
      }

      console.log('✅ Reward deleted:', id);
    } catch (error: any) {
      console.error('❌ Error in deleteReward:', error);
      throw error;
    }
  }

  /**
   * Approve reward
   */
  static async approveReward(id: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Không tìm thấy thông tin người dùng');

      const { error } = await supabase
        .from('hr_rewards')
        .update({
          status: 'approved',
          approved_by: user.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('❌ Error approving reward:', error);
        throw new Error(`Không thể phê duyệt khen thưởng: ${error.message}`);
      }

      console.log('✅ Reward approved:', id);
    } catch (error: any) {
      console.error('❌ Error in approveReward:', error);
      throw error;
    }
  }

  /**
   * Reject reward
   */
  static async rejectReward(id: string, rejectionNote: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Không tìm thấy thông tin người dùng');

      const { error } = await supabase
        .from('hr_rewards')
        .update({
          status: 'rejected',
          approved_by: user.id,
          approved_at: new Date().toISOString(),
          rejection_note: rejectionNote,
        })
        .eq('id', id);

      if (error) {
        console.error('❌ Error rejecting reward:', error);
        throw new Error(`Không thể từ chối khen thưởng: ${error.message}`);
      }

      console.log('✅ Reward rejected:', id);
    } catch (error: any) {
      console.error('❌ Error in rejectReward:', error);
      throw error;
    }
  }

  /**
   * Get reward statistics
   */
  static async getRewardStats(): Promise<RewardStats> {
    try {
      const { data, error } = await supabase
        .from('hr_rewards')
        .select('status, reward_type, amount');

      if (error) throw error;

      const stats: RewardStats = {
        total: data?.length || 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        paid: 0,
        total_amount: 0,
        by_type: {
          bonus: 0,
          recognition: 0,
          gift: 0,
          promotion: 0,
          other: 0,
        },
      };

      data?.forEach((reward) => {
        // Count by status
        if (reward.status === 'pending') stats.pending++;
        else if (reward.status === 'approved') stats.approved++;
        else if (reward.status === 'rejected') stats.rejected++;
        else if (reward.status === 'paid') stats.paid++;

        // Sum amounts
        if (reward.amount) {
          stats.total_amount += parseFloat(reward.amount.toString());
        }

        // Count by type
        if (reward.reward_type in stats.by_type) {
          stats.by_type[reward.reward_type as keyof typeof stats.by_type]++;
        }
      });

      return stats;
    } catch (error: any) {
      console.error('❌ Error in getRewardStats:', error);
      throw error;
    }
  }

  /**
   * Generate reward code
   */
  private static async generateRewardCode(): Promise<string> {
    try {
      const year = new Date().getFullYear();
      const { data, error } = await supabase
        .from('hr_rewards')
        .select('reward_code')
        .like('reward_code', `KT-%/${year}`)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (!data || data.length === 0) {
        return `KT-001/${year}`;
      }

      const lastCode = data[0].reward_code;
      const match = lastCode.match(/KT-(\d+)/);
      if (!match) return `KT-001/${year}`;

      const nextNum = parseInt(match[1]) + 1;
      return `KT-${nextNum.toString().padStart(3, '0')}/${year}`;
    } catch (error: any) {
      console.error('❌ Error generating reward code:', error);
      const year = new Date().getFullYear();
      return `KT-001/${year}`;
    }
  }
}
