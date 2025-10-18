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
  
  contract_type: z.enum(['Chính Thức', 'Thử Việc', 'Hợp Đồng'], {
    required_error: 'Loại hợp đồng không được để trống'
  }),
  
  status: z.enum(['active', 'inactive', 'probation', 'terminated']).optional(),
  
  salary_p1: z.number()
    .min(0, 'Lương cơ bản không được âm')
    .optional(),
  
  salary_p2: z.number()
    .min(0, 'Hệ số lương không được âm')
    .max(10, 'Hệ số lương tối đa 10')
    .optional(),
  
  salary_p3: z.number()
    .min(0, 'Phụ cấp không được âm')
    .optional(),
  
  kpi_score: z.number()
    .min(0, 'Điểm KPI không được âm')
    .max(100, 'Điểm KPI tối đa 100')
    .optional(),
  
  last_review_date: z.string().optional()
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
