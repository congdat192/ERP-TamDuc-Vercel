export interface Employee {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  position: string;
  department: string;
  team?: string;
  joinDate: string;
  employmentType: 'Full-time' | 'Part-time' | 'CTV' | 'Thử việc' | 'Thực tập';
  seniorityMonths?: number;
  status: 'active' | 'inactive' | 'probation' | 'terminated';
  salary: {
    basic: number;
    allowanceMeal: number;
    allowanceFuel: number;
    allowancePhone: number;
    allowanceOther: number;
    totalFixed: number;
  };
  performance: {
    kpi: number;
    lastReview: string;
  };
  currentAddress?: string;
  emergencyContact?: {
    relationship: 'Cha' | 'Mẹ' | 'Vợ' | 'Chồng' | 'Anh' | 'Chị' | 'Em' | 'Khác';
    name: string;
    phone: string;
  };
  notes?: string;
}

export interface MonthlyAttendance {
  id: string;
  employeeId: string;
  month: string; // YYYY-MM-01 format
  standardDays: number;
  actualDays: number;
  paidLeave: number;
  unpaidLeave: number;
  otHours: number;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  shift: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'late' | 'absent' | 'leave';
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  p1: number;
  p2: number;
  p3: number;
  totalSalary: number;
  deductions: number;
  netSalary: number;
}

export interface Candidate {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  appliedDate: string;
  status: 'applied' | 'screening' | 'interview1' | 'interview2' | 'offer' | 'onboarding' | 'rejected';
  avatar: string;
}

export interface TrainingCourse {
  id: string;
  courseName: string;
  instructor: string;
  duration: string;
  startDate: string;
  participants: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface PerformanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  objective: string;
  keyResults: string[];
  progress: number;
  quarter: string;
  kpiScore: number;
}

export interface Benefit {
  id: string;
  benefitName: string;
  type: 'insurance' | 'allowance' | 'bonus' | 'other';
  eligibility: string;
  value: number;
  status: 'active' | 'inactive';
}

export interface Document {
  id: string;
  docType: 'decision' | 'contract' | 'notice' | 'form';
  docNo: string;
  subject: string;
  issueDate: string;
  status: 'draft' | 'published' | 'archived';
}
