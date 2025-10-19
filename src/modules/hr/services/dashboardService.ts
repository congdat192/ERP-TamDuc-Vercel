import { supabase } from '@/integrations/supabase/client';

export interface HRDashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  probationEmployees: number;
  avgKpi: number;
  todayAttendance: number;
  todayAttendanceRate: number;
  openRecruitment: number;
  contractExpiringSoon: number;
  lowKpiCount: number;
  probationReviewDue: number;
  pendingLeaveRequests: number;
}

export interface DepartmentStats {
  department: string;
  employeeCount: number;
}

export interface MonthlyEmployeeMovement {
  month: string; // YYYY-MM
  newHires: number;
  terminations: number;
}

export interface MonthlySalaryCost {
  month: string; // YYYY-MM
  totalCost: number;
  averageSalary: number;
}

export class DashboardService {
  /**
   * Get overall HR statistics
   */
  static async getStats(): Promise<HRDashboardStats> {
    console.log('📊 [DashboardService] Fetching HR stats...');

    const { data: employees, error } = await supabase
      .from('employees')
      .select('id, status, employment_type, kpi_score, join_date')
      .is('deleted_at', null);

    if (error) {
      console.error('❌ [DashboardService] Error fetching employees:', error);
      throw error;
    }

    const total = employees.length;
    const active = employees.filter(e => e.status === 'active').length;
    const probation = employees.filter(e => e.employment_type === 'Thử việc').length;

    // Calculate average KPI (only count non-zero scores)
    const kpiScores = employees
      .map(e => Number(e.kpi_score) || 0)
      .filter(score => score > 0);
    const avgKpi = kpiScores.length > 0 
      ? kpiScores.reduce((a, b) => a + b, 0) / kpiScores.length 
      : 0;

    // Count employees with low KPI (< 60%)
    const lowKpiCount = employees.filter(e => 
      Number(e.kpi_score) > 0 && Number(e.kpi_score) < 60
    ).length;

    // Count probation employees who joined > 3 months ago (need review)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const probationReviewDue = employees.filter(e => 
      e.employment_type === 'Thử việc' && 
      new Date(e.join_date) <= threeMonthsAgo
    ).length;

    const stats = {
      totalEmployees: total,
      activeEmployees: active,
      probationEmployees: probation,
      avgKpi: Math.round(avgKpi * 10) / 10,
      todayAttendance: 0, // TODO: Implement when attendance module is ready
      todayAttendanceRate: 0,
      openRecruitment: 0, // TODO: Implement recruitment tracking
      contractExpiringSoon: 0, // TODO: Implement contract expiry tracking
      lowKpiCount,
      probationReviewDue,
      pendingLeaveRequests: 0 // TODO: Implement leave request tracking
    };

    console.log('✅ [DashboardService] Stats loaded:', stats);
    return stats;
  }

  /**
   * Get employee distribution by department
   */
  static async getDepartmentStats(): Promise<DepartmentStats[]> {
    console.log('📊 [DashboardService] Fetching department stats...');

    const { data, error } = await supabase
      .from('employees')
      .select('department')
      .is('deleted_at', null);

    if (error) {
      console.error('❌ [DashboardService] Error fetching departments:', error);
      throw error;
    }

    // Group by department
    const grouped = data.reduce((acc, emp) => {
      const dept = emp.department || 'Chưa phân bổ';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const result = Object.entries(grouped)
      .map(([department, employeeCount]) => ({ department, employeeCount }))
      .sort((a, b) => b.employeeCount - a.employeeCount);

    console.log('✅ [DashboardService] Department stats:', result);
    return result;
  }

  /**
   * Get employee movement (new hires vs terminations) for last 6 months
   */
  static async getEmployeeMovement(): Promise<MonthlyEmployeeMovement[]> {
    console.log('📊 [DashboardService] Fetching employee movement...');

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setDate(1); // Start of month

    // Fetch all employees
    const { data: employees, error } = await supabase
      .from('employees')
      .select('join_date, deleted_at');

    if (error) {
      console.error('❌ [DashboardService] Error fetching employee movement:', error);
      throw error;
    }

    // Initialize last 6 months
    const movements: Record<string, MonthlyEmployeeMovement> = {};
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toISOString().slice(0, 7); // YYYY-MM
      movements[month] = { month, newHires: 0, terminations: 0 };
    }

    // Count new hires
    employees.forEach(emp => {
      if (emp.join_date) {
        const joinMonth = emp.join_date.slice(0, 7);
        if (movements[joinMonth]) {
          movements[joinMonth].newHires++;
        }
      }
    });

    // Count terminations (deleted_at within last 6 months)
    employees.forEach(emp => {
      if (emp.deleted_at) {
        const termDate = new Date(emp.deleted_at);
        if (termDate >= sixMonthsAgo) {
          const termMonth = emp.deleted_at.slice(0, 7);
          if (movements[termMonth]) {
            movements[termMonth].terminations++;
          }
        }
      }
    });

    const result = Object.values(movements).sort((a, b) => 
      a.month.localeCompare(b.month)
    );

    console.log('✅ [DashboardService] Employee movement:', result);
    return result;
  }

  /**
   * Get monthly salary cost estimation
   * TODO: Replace with real payroll data when payroll module is implemented
   */
  static async getMonthlySalaryCost(): Promise<MonthlySalaryCost[]> {
    console.log('📊 [DashboardService] Fetching salary cost (estimated)...');

    const { data, error } = await supabase
      .from('employees')
      .select('total_fixed_salary')
      .is('deleted_at', null);

    if (error) {
      console.error('❌ [DashboardService] Error fetching salary cost:', error);
      throw error;
    }

    const totalSalary = data.reduce((sum, emp) => 
      sum + (Number(emp.total_fixed_salary) || 0), 0
    );

    // Generate last 6 months with same total (approximation)
    const result: MonthlySalaryCost[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toISOString().slice(0, 7);
      result.push({
        month,
        totalCost: totalSalary,
        averageSalary: data.length > 0 ? totalSalary / data.length : 0
      });
    }

    console.log('✅ [DashboardService] Salary cost (estimated):', {
      monthlyTotal: totalSalary,
      employeeCount: data.length
    });
    return result;
  }
}
