
import { Badge } from '@/components/ui/badge';

interface CustomerPointsHistoryTabProps {
  customerId: string;
  currentPoints?: number;
  totalPoints?: number;
}

interface PointsRecord {
  id: string;
  date: string;
  type: 'earn' | 'redeem' | 'expire' | 'adjust';
  description: string;
  points: number;
  balance: number;
  invoiceCode?: string;
}

export function CustomerPointsHistoryTab({ customerId, currentPoints = 0, totalPoints = 0 }: CustomerPointsHistoryTabProps) {
  // Mock points history data
  const pointsHistory: PointsRecord[] = [
    {
      id: '1',
      date: '25/01/2024',
      type: 'earn',
      description: 'Tích điểm từ đơn hàng HD-2024-003',
      points: 180,
      balance: 1200,
      invoiceCode: 'HD-2024-003'
    },
    {
      id: '2',
      date: '20/01/2024',
      type: 'redeem',
      description: 'Đổi điểm mua hàng HD-2024-002',
      points: -250,
      balance: 1020,
      invoiceCode: 'HD-2024-002'
    },
    {
      id: '3',
      date: '15/01/2024',
      type: 'earn',
      description: 'Tích điểm từ đơn hàng HD-2024-001',
      points: 500,
      balance: 1270,
      invoiceCode: 'HD-2024-001'
    },
    {
      id: '4',
      date: '10/01/2024',
      type: 'adjust',
      description: 'Điều chỉnh điểm thưởng sinh nhật',
      points: 100,
      balance: 770
    },
    {
      id: '5',
      date: '01/01/2024',
      type: 'expire',
      description: 'Điểm hết hạn từ tháng 01/2023',
      points: -120,
      balance: 670
    }
  ];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'earn':
        return <Badge className="theme-badge-success">Tích điểm</Badge>;
      case 'redeem':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Đổi điểm</Badge>;
      case 'expire':
        return <Badge className="berry-error-light">Hết hạn</Badge>;
      case 'adjust':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Điều chỉnh</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const formatPoints = (points: number) => {
    return points > 0 ? `+${points.toLocaleString('vi-VN')}` : points.toLocaleString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {/* Tổng quan điểm */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="theme-card rounded-lg border theme-border-primary p-4">
          <div className="text-sm theme-text-muted mb-1">Tổng điểm tích lũy</div>
          <div className="text-2xl font-bold theme-text-primary">
            {(totalPoints || 0).toLocaleString('vi-VN')}
          </div>
          <div className="text-xs theme-text-muted mt-1">Tổng số điểm đã tích từ đầu</div>
        </div>
        <div className="theme-card rounded-lg border theme-border-primary p-4">
          <div className="text-sm theme-text-muted mb-1">Điểm hiện tại</div>
          <div className="text-2xl font-bold text-blue-600">
            {(currentPoints || 0).toLocaleString('vi-VN')}
          </div>
          <div className="text-xs theme-text-muted mt-1">Điểm có thể sử dụng</div>
        </div>
      </div>

      {/* Lịch sử điểm */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold theme-text">Lịch sử tích điểm</h4>

        <div className="theme-card rounded-lg border theme-border-primary overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b theme-border-primary/20">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                    Ngày
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                    Loại giao dịch
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                    Điểm thay đổi
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                    Số dư
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border-primary/10">
                {pointsHistory.map((record) => (
                  <tr key={record.id} className="hover:theme-bg-primary/5">
                    <td className="px-4 py-3 text-sm theme-text-muted">
                      {record.date}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {getTypeBadge(record.type)}
                    </td>
                    <td className="px-4 py-3 text-sm theme-text">
                      {record.description}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      <span className={record.points > 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatPoints(record.points)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm theme-text font-medium">
                      {record.balance.toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
