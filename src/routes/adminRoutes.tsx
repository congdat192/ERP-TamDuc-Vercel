
import { Routes, Route } from 'react-router-dom';
import { Settings } from '@/modules/admin/pages/Settings';
import { AuditLog } from '@/modules/admin/pages/AuditLog';
import { RolePermissions } from '@/modules/admin/pages/RolePermissions';
import { SystemSettings } from '@/modules/admin/pages/SystemSettings';
import { UserManagement } from '@/modules/admin/pages/UserManagement';

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin/settings" element={<Settings />} />
      <Route path="/admin/settings/*" element={<Settings />} />
      <Route path="/system-settings" element={<Settings />} />
      <Route path="/system-settings/*" element={<Settings />} />
      <Route path="/admin/audit-log" element={<AuditLog />} />
      <Route path="/admin/roles" element={<RolePermissions />} />
      <Route path="/admin/system" element={<SystemSettings />} />
      <Route path="/admin/users" element={<UserManagement />} />
    </Routes>
  );
}
