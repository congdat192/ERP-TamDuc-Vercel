import { supabase } from '@/integrations/supabase/client';

export interface Competency {
  id: string;
  employee_id: string;
  competency_name: string;
  competency_category?: string;
  current_level: number;
  assessment_date: string;
  assessed_by?: string;
  assessment_note?: string;
  created_at: string;
  updated_at: string;
}

export interface CompetencyLevel {
  level: number;
  name: string;
  description?: string;
  color: string;
}

export interface CourseRecommendation {
  id: string;
  employee_id: string;
  program_id: string;
  current_competency_level?: number;
  target_competency_level?: number;
  competency_gap?: number;
  priority: 'high' | 'medium' | 'low';
  reason?: string;
  status: 'pending' | 'enrolled' | 'dismissed';
  recommended_at: string;
  training_programs?: any;
}

export class CompetencyService {
  static async getCompetencyLevels(): Promise<CompetencyLevel[]> {
    console.log('🔍 [CompetencyService] Fetching competency levels');

    const { data, error } = await supabase
      .from('training_competency_levels')
      .select('*')
      .order('level', { ascending: true });

    if (error) {
      console.error('❌ [CompetencyService] Error:', error);
      throw new Error(`Không thể tải danh sách level: ${error.message}`);
    }

    return data || [];
  }

  static async getEmployeeCompetencies(employeeId: string): Promise<Competency[]> {
    console.log('🔍 [CompetencyService] Fetching competencies for employee:', employeeId);

    const { data, error } = await supabase
      .from('training_competencies')
      .select('*')
      .eq('employee_id', employeeId)
      .order('competency_name', { ascending: true });

    if (error) {
      console.error('❌ [CompetencyService] Error:', error);
      throw new Error(`Không thể tải năng lực: ${error.message}`);
    }

    return data || [];
  }

  static async upsertCompetency(competency: Omit<Competency, 'id' | 'created_at' | 'updated_at'>): Promise<Competency> {
    console.log('🔍 [CompetencyService] Upserting competency:', competency.competency_name);

    const { data, error } = await supabase
      .from('training_competencies')
      .upsert(
        {
          ...competency,
          assessment_date: competency.assessment_date || new Date().toISOString()
        },
        {
          onConflict: 'employee_id,competency_name'
        }
      )
      .select()
      .single();

    if (error) {
      console.error('❌ [CompetencyService] Error:', error);
      throw new Error(`Không thể cập nhật năng lực: ${error.message}`);
    }

    console.log('✅ [CompetencyService] Competency upserted');
    return data;
  }

  static async getRecommendations(employeeId: string): Promise<CourseRecommendation[]> {
    console.log('🔍 [CompetencyService] Fetching recommendations for employee:', employeeId);

    const { data, error } = await supabase
      .from('training_course_recommendations')
      .select(`
        *,
        training_programs(
          title,
          description,
          course_category,
          duration_hours,
          competency_name,
          target_competency_level
        )
      `)
      .eq('employee_id', employeeId)
      .eq('status', 'pending')
      .order('priority', { ascending: true });

    if (error) {
      console.error('❌ [CompetencyService] Error:', error);
      throw new Error(`Không thể tải gợi ý khóa học: ${error.message}`);
    }

    return data || [];
  }

  static async dismissRecommendation(recommendationId: string): Promise<void> {
    console.log('🔍 [CompetencyService] Dismissing recommendation:', recommendationId);

    const { error } = await supabase
      .from('training_course_recommendations')
      .update({ status: 'dismissed' })
      .eq('id', recommendationId);

    if (error) {
      console.error('❌ [CompetencyService] Error:', error);
      throw new Error(`Không thể bỏ qua gợi ý: ${error.message}`);
    }

    console.log('✅ [CompetencyService] Recommendation dismissed');
  }

  static async markRecommendationEnrolled(recommendationId: string): Promise<void> {
    console.log('🔍 [CompetencyService] Marking recommendation as enrolled:', recommendationId);

    const { error } = await supabase
      .from('training_course_recommendations')
      .update({ status: 'enrolled' })
      .eq('id', recommendationId);

    if (error) {
      console.error('❌ [CompetencyService] Error:', error);
      throw new Error(`Không thể cập nhật trạng thái: ${error.message}`);
    }

    console.log('✅ [CompetencyService] Recommendation marked as enrolled');
  }

  static async getCompetencyMatrix(): Promise<any[]> {
    console.log('🔍 [CompetencyService] Fetching competency matrix');

    const { data, error } = await supabase
      .from('training_competencies')
      .select(`
        *,
        employees(full_name, employee_code, department, position)
      `)
      .order('employee_id', { ascending: true });

    if (error) {
      console.error('❌ [CompetencyService] Error:', error);
      throw new Error(`Không thể tải ma trận năng lực: ${error.message}`);
    }

    // Group by employee
    const matrix = data?.reduce((acc: any, comp: any) => {
      const empId = comp.employee_id;
      if (!acc[empId]) {
        acc[empId] = {
          employee: comp.employees,
          competencies: []
        };
      }
      acc[empId].competencies.push(comp);
      return acc;
    }, {});

    return Object.values(matrix || {});
  }
}
