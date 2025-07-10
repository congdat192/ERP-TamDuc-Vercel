import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User } from '@/types/auth';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function UserDetailModal({ isOpen, onClose, user }: UserDetailModalProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thông Tin Chi Tiết Người Dùng</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông Tin Cơ Bản</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-500">Họ và tên:</span>
                <p>{user.fullName}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Tên đăng nhập:</span>
                <p>{user.username}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Email:</span>
                <p>{user.email}</p>
              </div>
              {user.phone && (
                <div>
                  <span className="font-medium text-gray-500">Số điện thoại:</span>
                  <p>{user.phone}</p>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-500">Vai trò:</span>
                <p>{user.role}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Trạng thái:</span>
                <p>{user.status}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Hoạt động:</span>
                <p>{user.isActive ? 'Có' : 'Không'}</p>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quyền</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-500">Modules:</span>
                <p>{user.permissions.modules.join(', ')}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Voucher Features:</span>
                <p>{user.permissions.voucherFeatures.join(', ')}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Quản lý người dùng:</span>
                <p>{user.permissions.canManageUsers ? 'Có' : 'Không'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Xem tất cả voucher:</span>
                <p>{user.permissions.canViewAllVouchers ? 'Có' : 'Không'}</p>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Bảo Mật</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-500">2FA:</span>
                  <p>{user.securitySettings.twoFactorEnabled ? 'Đã bật' : 'Chưa bật'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Giới hạn đăng nhập:</span>
                  <p>{user.securitySettings.loginAttemptLimit} lần</p>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-500">Yêu cầu đổi mật khẩu:</span>
                <p>{user.securitySettings.passwordChangeRequired ? 'Có' : 'Không'}</p>
              </div>
              {user.securitySettings.lastPasswordChange && (
                <div>
                  <span className="font-medium text-gray-500">Lần đổi mật khẩu cuối:</span>
                  <p>{new Date(user.securitySettings.lastPasswordChange).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông Tin Thêm</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-500">Ngày tạo:</span>
                <p>{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              {user.lastLogin && (
                <div>
                  <span className="font-medium text-gray-500">Lần đăng nhập cuối:</span>
                  <p>{new Date(user.lastLogin).toLocaleString()}</p>
                </div>
              )}
              {user.notes && (
                <div>
                  <span className="font-medium text-gray-500">Ghi chú:</span>
                  <p>{user.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
