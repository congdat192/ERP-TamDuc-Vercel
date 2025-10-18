import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { Reward } from '../../types/benefits';

interface RewardsTableProps {
  rewards: Reward[];
  isLoading: boolean;
  onEdit: (reward: Reward) => void;
  onDelete: (reward: Reward) => void;
  onApprove: (reward: Reward) => void;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
}

const getRewardTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    bonus: 'Tiền Thưởng',
    recognition: 'Khen Ngợi',
    gift: 'Quà Tặng',
    promotion: 'Thăng Chức',
    other: 'Khác',
  };
  return labels[type] || type;
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
    pending: { variant: 'secondary', label: 'Chờ Duyệt' },
    approved: { variant: 'default', label: 'Đã Duyệt' },
    rejected: { variant: 'destructive', label: 'Từ Chối' },
    paid: { variant: 'outline', label: 'Đã Trả' },
  };
  const config = variants[status] || { variant: 'secondary' as const, label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const formatCurrency = (value?: number) => {
  if (!value) return '-';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

export function RewardsTable({
  rewards,
  isLoading,
  onEdit,
  onDelete,
  onApprove,
  canEdit,
  canDelete,
  canApprove,
}: RewardsTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  if (rewards.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Chưa có khen thưởng nào</p>
          <p className="text-sm text-muted-foreground">Tạo khen thưởng đầu tiên để bắt đầu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã KT</TableHead>
            <TableHead>Tiêu Đề</TableHead>
            <TableHead>Nhân Viên</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Giá Trị</TableHead>
            <TableHead>Ngày Trao</TableHead>
            <TableHead>Trạng Thái</TableHead>
            {(canEdit || canDelete || canApprove) && <TableHead className="text-right">Thao Tác</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rewards.map((reward) => (
            <TableRow key={reward.id}>
              <TableCell className="font-medium">{reward.reward_code}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{reward.reward_title}</div>
                  {reward.reason && (
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {reward.reason}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {reward.employee && (
                  <div>
                    <div className="font-medium">{reward.employee.full_name}</div>
                    <div className="text-sm text-muted-foreground">{reward.employee.employee_code}</div>
                  </div>
                )}
              </TableCell>
              <TableCell>{getRewardTypeLabel(reward.reward_type)}</TableCell>
              <TableCell>{formatCurrency(reward.amount)}</TableCell>
              <TableCell>{format(new Date(reward.awarded_date), 'dd/MM/yyyy')}</TableCell>
              <TableCell>{getStatusBadge(reward.status)}</TableCell>
              {(canEdit || canDelete || canApprove) && (
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {canApprove && reward.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onApprove(reward)}
                        title="Phê duyệt"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(reward)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(reward)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
