import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { RewardsService } from '../../services/rewardsService';
import type { Reward } from '../../types/benefits';

interface EmployeeRewardsTabProps {
  employeeId: string;
}

export function EmployeeRewardsTab({ employeeId }: EmployeeRewardsTabProps) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRewards();
  }, [employeeId]);

  const loadRewards = async () => {
    try {
      setIsLoading(true);
      const data = await RewardsService.getRewards({ employee_id: employeeId });
      setRewards(data);
    } catch (err) {
      console.error('❌ Error loading rewards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      pending: { variant: 'outline', label: 'Chờ Duyệt' },
      approved: { variant: 'default', label: 'Đã Duyệt' },
      rejected: { variant: 'destructive', label: 'Từ Chối' },
      paid: { variant: 'secondary', label: 'Đã Chi Trả' },
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

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Đang tải...</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">Lịch Sử Khen Thưởng</h3>

      {rewards.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nhân viên chưa có khen thưởng nào
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã KT</TableHead>
                <TableHead>Tiêu Đề</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Ngày Trao</TableHead>
                <TableHead>Giá Trị</TableHead>
                <TableHead>Trạng Thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewards.map((reward) => (
                <TableRow key={reward.id}>
                  <TableCell className="font-mono text-sm">
                    {reward.reward_code}
                  </TableCell>
                  <TableCell className="font-medium">
                    {reward.reward_title}
                  </TableCell>
                  <TableCell className="capitalize">
                    {reward.reward_type}
                  </TableCell>
                  <TableCell>
                    {format(new Date(reward.awarded_date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>{formatCurrency(reward.amount)}</TableCell>
                  <TableCell>{getStatusBadge(reward.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
