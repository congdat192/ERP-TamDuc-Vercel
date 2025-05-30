
import { 
  FileText, 
  Users, 
  Search, 
  Database, 
  Settings, 
  Activity,
  Bell,
  Inbox,
  BarChart3,
  Shield,
  Calendar,
  FolderOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState = ({ icon, title, description, action, className }: EmptyStateProps) => {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 p-4 bg-gray-100 rounded-full">
          {icon || <FileText className="w-8 h-8 text-gray-400" />}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 max-w-md">{description}</p>
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export const EmptyTableState = ({ 
  entityName, 
  onAdd 
}: { 
  entityName: string; 
  onAdd?: () => void; 
}) => {
  return (
    <EmptyState
      icon={<Database className="w-8 h-8 text-gray-400" />}
      title={`Chưa có ${entityName} nào`}
      description={`Bạn chưa có ${entityName} nào trong hệ thống. Hãy tạo ${entityName} đầu tiên để bắt đầu.`}
      action={onAdd ? {
        label: `Thêm ${entityName}`,
        onClick: onAdd
      } : undefined}
    />
  );
};

export const EmptySearchState = ({ searchTerm }: { searchTerm: string }) => {
  return (
    <EmptyState
      icon={<Search className="w-8 h-8 text-gray-400" />}
      title="Không tìm thấy kết quả"
      description={`Không có kết quả nào cho "${searchTerm}". Hãy thử tìm kiếm với từ khóa khác.`}
    />
  );
};

export const EmptyUserListState = ({ onAddUser }: { onAddUser?: () => void }) => {
  return (
    <EmptyState
      icon={<Users className="w-8 h-8 text-gray-400" />}
      title="Chưa có người dùng nào"
      description="Hệ thống chưa có người dùng nào. Hãy thêm người dùng đầu tiên để bắt đầu quản lý."
      action={onAddUser ? {
        label: "Thêm Người Dùng",
        onClick: onAddUser
      } : undefined}
    />
  );
};

export const EmptyAuditLogState = () => {
  return (
    <EmptyState
      icon={<Activity className="w-8 h-8 text-gray-400" />}
      title="Chưa có hoạt động nào"
      description="Chưa có hoạt động nào được ghi lại trong hệ thống. Các hoạt động của người dùng sẽ xuất hiện ở đây."
    />
  );
};

export const EmptyNotificationState = () => {
  return (
    <EmptyState
      icon={<Bell className="w-8 h-8 text-gray-400" />}
      title="Không có thông báo mới"
      description="Bạn đã xem hết tất cả thông báo. Các thông báo mới sẽ xuất hiện ở đây."
    />
  );
};

export const EmptyVoucherListState = ({ onCreateVoucher }: { onCreateVoucher?: () => void }) => {
  return (
    <EmptyState
      icon={<Inbox className="w-8 h-8 text-gray-400" />}
      title="Chưa có voucher nào"
      description="Bạn chưa tạo voucher nào. Hãy tạo voucher đầu tiên để bắt đầu chương trình khuyến mãi."
      action={onCreateVoucher ? {
        label: "Tạo Voucher",
        onClick: onCreateVoucher
      } : undefined}
    />
  );
};

export const EmptyAnalyticsState = () => {
  return (
    <EmptyState
      icon={<BarChart3 className="w-8 h-8 text-gray-400" />}
      title="Chưa có dữ liệu phân tích"
      description="Chưa có đủ dữ liệu để hiển thị báo cáo phân tích. Dữ liệu sẽ xuất hiện khi có hoạt động trong hệ thống."
    />
  );
};

export const EmptyPermissionState = () => {
  return (
    <EmptyState
      icon={<Shield className="w-8 h-8 text-gray-400" />}
      title="Chưa có quyền hạn nào"
      description="Vai trò này chưa được cấp quyền hạn nào. Hãy cấp quyền hạn để người dùng có thể truy cập các tính năng."
    />
  );
};

export const EmptySettingsState = () => {
  return (
    <EmptyState
      icon={<Settings className="w-8 h-8 text-gray-400" />}
      title="Chưa có cài đặt nào"
      description="Chưa có cài đặt nào được cấu hình. Hãy thiết lập các cài đặt hệ thống để tùy chỉnh ứng dụng."
    />
  );
};

export const EmptyCalendarState = () => {
  return (
    <EmptyState
      icon={<Calendar className="w-8 h-8 text-gray-400" />}
      title="Không có sự kiện nào"
      description="Không có sự kiện nào trong khoảng thời gian này. Hãy tạo sự kiện mới hoặc chọn khoảng thời gian khác."
    />
  );
};

export const EmptyFolderState = ({ folderName }: { folderName: string }) => {
  return (
    <EmptyState
      icon={<FolderOpen className="w-8 h-8 text-gray-400" />}
      title={`Thư mục "${folderName}" trống`}
      description="Thư mục này chưa có nội dung nào. Hãy thêm tệp tin hoặc tạo thư mục con."
    />
  );
};
