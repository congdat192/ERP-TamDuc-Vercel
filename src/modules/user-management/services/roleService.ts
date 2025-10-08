// Mock Role Service - No real API calls
import { CustomRole, RoleCreationData } from '../types/role-management';

const mockRoles: CustomRole[] = [
  {
    id: 1,
    name: 'Admin',
    description: 'Quản trị viên hệ thống',
    permissions: ['view_customers', 'create_customers', 'view_members'],
    userCount: 5,
    isSystem: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Manager',
    description: 'Quản lý',
    permissions: ['view_customers', 'view_members'],
    userCount: 10,
    isSystem: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export class RoleService {
  static async getRoles(): Promise<CustomRole[]> {
    console.log('🔍 [mockRoleService] Fetching roles');
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockRoles];
  }

  static async getRoleById(roleId: string): Promise<CustomRole> {
    console.log('🔍 [mockRoleService] Fetching role by ID:', roleId);
    await new Promise(resolve => setTimeout(resolve, 500));
    const role = mockRoles.find(r => r.id.toString() === roleId);
    if (!role) throw new Error('Role not found');
    return role;
  }

  static async createRole(roleData: RoleCreationData): Promise<CustomRole> {
    console.log('🔧 [mockRoleService] Creating role');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newRole: CustomRole = {
      id: mockRoles.length + 1,
      name: roleData.name,
      description: roleData.description || '',
      permissions: roleData.permissions,
      userCount: 0,
      isSystem: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockRoles.push(newRole);
    return newRole;
  }

  static async updateRole(roleId: string, roleData: Partial<RoleCreationData>): Promise<CustomRole> {
    console.log('🔧 [mockRoleService] Updating role:', roleId);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const role = mockRoles.find(r => r.id.toString() === roleId);
    if (!role) throw new Error('Role not found');
    
    if (roleData.name) role.name = roleData.name;
    if (roleData.description !== undefined) role.description = roleData.description;
    if (roleData.permissions) role.permissions = roleData.permissions;
    role.updated_at = new Date().toISOString();
    
    return role;
  }

  static async deleteRole(roleId: string): Promise<void> {
    console.log('🗑️ [mockRoleService] Deleting role:', roleId);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockRoles.findIndex(r => r.id.toString() === roleId);
    if (index > -1) {
      mockRoles.splice(index, 1);
    }
  }
}
