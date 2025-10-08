// Mock Module Service - No real API calls
import { ModuleInfo } from '../types/role-management';

const mockModules: ModuleInfo[] = [
  {
    id: '1',
    code: 'customer_management',
    name: 'Quản lý khách hàng',
    label: 'Quản lý khách hàng',
    description: 'Quản lý thông tin khách hàng',
    icon: 'Users',
    features: [
      {
        id: 1,
        code: 'view_customers',
        name: 'Xem khách hàng',
        description: 'Xem danh sách khách hàng',
        type: 'view'
      },
      {
        id: 2,
        code: 'create_customers',
        name: 'Tạo khách hàng',
        description: 'Tạo khách hàng mới',
        type: 'create'
      }
    ],
    status: 'active'
  },
  {
    id: '2',
    code: 'member_management',
    name: 'Quản lý thành viên',
    label: 'Quản lý thành viên',
    description: 'Quản lý thành viên trong doanh nghiệp',
    icon: 'UserCheck',
    features: [
      {
        id: 3,
        code: 'view_members',
        name: 'Xem thành viên',
        description: 'Xem danh sách thành viên',
        type: 'view'
      }
    ],
    status: 'active'
  }
];

export class ModuleService {
  static async getActiveModules(): Promise<ModuleInfo[]> {
    console.log('🚀 [mockModuleService] Getting active modules');
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockModules];
  }
}
