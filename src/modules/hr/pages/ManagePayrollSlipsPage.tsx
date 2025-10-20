import { useState } from 'react';
import { FileText } from 'lucide-react';
import { PayrollUploadSection } from '../components/payroll/PayrollUploadSection';
import { PayrollListTable } from '../components/payroll/PayrollListTable';
import { usePermissions } from '@/hooks/usePermissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

export function ManagePayrollSlipsPage() {
  const { hasPermission } = usePermissions();
  const [refreshKey, setRefreshKey] = useState(0);

  if (!hasPermission('manage_payroll') && !hasPermission('full_access')) {
    return (
      <Alert variant="destructive" className="my-4">
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription>
          Bạn không có quyền truy cập tính năng này.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold theme-text flex items-center gap-2">
          <FileText className="w-8 h-8" />
          Quản Lý Phiếu Lương
        </h1>
        <p className="theme-text-secondary mt-1">
          Import và quản lý phiếu lương nhân viên theo tháng
        </p>
      </div>

      <PayrollUploadSection onImportSuccess={() => setRefreshKey((k) => k + 1)} />
      
      <PayrollListTable key={refreshKey} />
    </div>
  );
}
