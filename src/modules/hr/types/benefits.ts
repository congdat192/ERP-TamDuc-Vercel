// ===================================================
// HR BENEFITS MODULE - TYPE DEFINITIONS
// ===================================================

export interface Benefit {
  id: string;
  benefit_code: string;
  benefit_name: string;
  benefit_type: 'insurance' | 'allowance' | 'bonus' | 'leave' | 'other';
  description?: string;
  eligibility_criteria?: string;
  value?: number;
  frequency?: 'one-time' | 'monthly' | 'quarterly' | 'yearly' | 'as-needed';
  effective_from?: string;
  effective_to?: string;
  status: 'active' | 'inactive' | 'expired';
  created_by?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  deleted_by?: string;
}

export interface BenefitAssignment {
  id: string;
  employee_id: string;
  benefit_id: string;
  assigned_date: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'expired' | 'cancelled';
  notes?: string;
  assigned_by?: string;
  created_at: string;
  employee?: {
    id: string;
    full_name: string;
    employee_code: string;
    position: string;
    department: string;
  };
  benefit?: Benefit;
}

export interface Reward {
  id: string;
  reward_code: string;
  reward_title: string;
  reward_type: 'bonus' | 'recognition' | 'gift' | 'promotion' | 'other';
  employee_id: string;
  awarded_date: string;
  reason: string;
  amount?: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  approved_by?: string;
  approved_at?: string;
  rejection_note?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  employee?: {
    id: string;
    full_name: string;
    employee_code: string;
    position: string;
    department: string;
  };
}

export interface DisciplineRecord {
  id: string;
  record_code: string;
  employee_id: string;
  violation_type: 'late' | 'absent' | 'policy-violation' | 'misconduct' | 'other';
  violation_date: string;
  description: string;
  severity: 'warning' | 'minor' | 'major' | 'critical';
  penalty?: string;
  penalty_amount?: number;
  status: 'pending' | 'reviewed' | 'resolved' | 'appealed';
  issued_by: string;
  issued_at: string;
  resolved_at?: string;
  resolution_note?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  employee?: {
    id: string;
    full_name: string;
    employee_code: string;
    position: string;
    department: string;
  };
}

// Create/Update interfaces
export interface CreateBenefitData {
  benefit_name: string;
  benefit_type: 'insurance' | 'allowance' | 'bonus' | 'leave' | 'other';
  description?: string;
  eligibility_criteria?: string;
  value?: number;
  frequency?: 'one-time' | 'monthly' | 'quarterly' | 'yearly' | 'as-needed';
  effective_from?: string;
  effective_to?: string;
  status?: 'active' | 'inactive' | 'expired';
}

export interface UpdateBenefitData extends Partial<CreateBenefitData> {}

export interface CreateRewardData {
  reward_title: string;
  reward_type: 'bonus' | 'recognition' | 'gift' | 'promotion' | 'other';
  employee_id: string;
  awarded_date: string;
  reason: string;
  amount?: number;
}

export interface UpdateRewardData extends Partial<CreateRewardData> {
  status?: 'pending' | 'approved' | 'rejected' | 'paid';
  rejection_note?: string;
}

export interface CreateDisciplineData {
  employee_id: string;
  violation_type: 'late' | 'absent' | 'policy-violation' | 'misconduct' | 'other';
  violation_date: string;
  description: string;
  severity: 'warning' | 'minor' | 'major' | 'critical';
  penalty?: string;
  penalty_amount?: number;
  notes?: string;
}

export interface UpdateDisciplineData extends Partial<CreateDisciplineData> {
  status?: 'pending' | 'reviewed' | 'resolved' | 'appealed';
  resolution_note?: string;
}

// Stats interfaces
export interface BenefitStats {
  total: number;
  active: number;
  inactive: number;
  expired: number;
  by_type: {
    insurance: number;
    allowance: number;
    bonus: number;
    leave: number;
    other: number;
  };
}

export interface RewardStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  paid: number;
  total_amount: number;
  by_type: {
    bonus: number;
    recognition: number;
    gift: number;
    promotion: number;
    other: number;
  };
}

export interface DisciplineStats {
  total: number;
  pending: number;
  reviewed: number;
  resolved: number;
  appealed: number;
  by_severity: {
    warning: number;
    minor: number;
    major: number;
    critical: number;
  };
  by_type: {
    late: number;
    absent: number;
    'policy-violation': number;
    misconduct: number;
    other: number;
  };
}

// Filter interfaces
export interface BenefitFilters {
  search?: string;
  type?: string;
  status?: string;
}

export interface RewardFilters {
  search?: string;
  type?: string;
  status?: string;
  employee_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface DisciplineFilters {
  search?: string;
  type?: string;
  severity?: string;
  status?: string;
  employee_id?: string;
  date_from?: string;
  date_to?: string;
}
