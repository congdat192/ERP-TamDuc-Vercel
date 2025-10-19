import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function AccessDenied() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="text-center space-y-4">
        <ShieldAlert className="h-16 w-16 mx-auto text-destructive" />
        <h2 className="text-2xl font-bold">Truy Cập Bị Từ Chối</h2>
        <p className="text-muted-foreground max-w-md">
          Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Quay Lại
          </Button>
          <Button onClick={() => navigate('/ERP/Dashboard')}>
            Về Trang Chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
