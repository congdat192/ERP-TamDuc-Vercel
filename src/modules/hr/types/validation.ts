import { z } from 'zod';

export const employeeSchema = z.object({
  employee_code: z.string()
    .trim()
    .min(1, 'Mã nhân viên không được để trống')
    .max(20, 'Mã nhân viên tối đa 20 ký tự')
    .regex(/^[A-Z0-9]+$/, 'Mã nhân viên chỉ chứa chữ in hoa và số'),
  
  full_name: z.string()
    .trim()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ tên tối đa 100 ký tự'),
  
  email: z.string()
    .trim()
    .email('Email không hợp lệ')
    .max(255, 'Email tối đa 255 ký tự'),
  
  phone: z.string()
    .trim()
    .regex(/^0\d{9}$/, 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0')
    .optional()
    .or(z.literal('')),
  
  position: z.string()
    .trim()
    .min(1, 'Chức vụ không được để trống')
    .max(100, 'Chức vụ tối đa 100 ký tự'),
  
  department: z.string()
    .trim()
    .min(1, 'Phòng ban không được để trống')
    .max(100, 'Phòng ban tối đa 100 ký tự'),
  
  join_date: z.string()
    .min(1, 'Ngày vào làm không được để trống'),
  
  team: z.string()
    .trim()
    .max(100, 'Tên nhóm tối đa 100 ký tự')
    .optional()
    .or(z.literal('')),
  
  employment_type: z.enum(['Full-time', 'Part-time', 'CTV', 'Thử việc', 'Thực tập'], {
    required_error: 'Loại hình làm việc không được để trống'
  }),
  
  status: z.enum(['active', 'inactive', 'probation', 'terminated']).optional(),
  
  salary_p1: z.number()
    .min(0, 'Lương cơ bản không được âm')
    .optional(),
  
  allowance_meal: z.number()
    .min(0, 'Phụ cấp ăn trưa không được âm')
    .optional(),
  
  allowance_fuel: z.number()
    .min(0, 'Phụ cấp xăng xe không được âm')
    .optional(),
  
  allowance_phone: z.number()
    .min(0, 'Phụ cấp điện thoại không được âm')
    .optional(),
  
  allowance_other: z.number()
    .min(0, 'Phụ cấp khác không được âm')
    .optional(),
  
  kpi_score: z.number()
    .min(0, 'Điểm KPI không được âm')
    .max(100, 'Điểm KPI tối đa 100')
    .optional(),
  
  last_review_date: z.string().optional(),
  
  avatar_path: z.string().optional(),
  
  current_address: z.string()
    .trim()
    .max(500, 'Địa chỉ tối đa 500 ký tự')
    .optional()
    .or(z.literal('')),
  
  emergency_contact_relationship: z.enum([
    'Cha', 'Mẹ', 'Vợ', 'Chồng', 'Anh', 'Chị', 'Em', 'Khác'
  ]).optional(),
  
  emergency_contact_name: z.string()
    .trim()
    .max(100, 'Tên người liên hệ tối đa 100 ký tự')
    .optional()
    .or(z.literal('')),
  
  emergency_contact_phone: z.string()
    .trim()
    .regex(/^0\d{9}$/, 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0')
    .optional()
    .or(z.literal('')),
  
  notes: z.string()
    .trim()
    .max(1000, 'Ghi chú tối đa 1000 ký tự')
    .optional()
    .or(z.literal(''))
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
