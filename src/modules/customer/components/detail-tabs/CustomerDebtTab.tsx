
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CustomerDebtTabProps {
  customerId: string;
  customerDebt?: number;
}

interface DebtRecord {
  id: string;
  invoiceCode: string;
  date: string;
  originalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: 'overdue' | 'due_soon' | 'normal';
}

export function CustomerDebtTab({ customerId, customerDebt = 0 }: CustomerDebtTabProps) {
  // Mock debt data
  const debtRecords: DebtRecord[] = [
    {
      id: '1',
      invoiceCode: 'HD-2024-001',
      date: '15/01/2024',
      originalAmount: 5000000,
      paidAmount: 2000000,
      remainingAmount: 3000000,
      dueDate: '15/02/2024',
      status: 'overdue'
    },
    {
      id: '2',
      invoiceCode: 'HD-2024-002',
      date: '20/01/2024',
      originalAmount: 2500000,
      paidAmount: 0,
      remainingAmount: 2500000,
      dueDate: '20/02/2024',
      status: 'due_soon'
    },
    {
      id: '3',
      invoiceCode: 'HD-2024-003',
      date: '25/01/2024',
      originalAmount: 1800000,
      paidAmount: 1800000,
      remainingAmount: 0,
      dueDate: '25/02/2024',
      status: 'normal'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'overdue':
        return <Badge className="berry-error-light">Quá hạn</Badge>;
      case 'due_soon':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Sắp đến hạn</Badge>;
      case 'normal':
        return <Badge className="theme-badge-success">Bình thường</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalDebt = debtRecords.reduce((sum, record) => sum + record.remainingAmount, 0);
  const overdueDebt = debtRecords
    .filter(record => record.status === 'overdue')
    .reduce((sum, record) => sum + record.remainingAmount, 0);

  return (
    <div className="space-y-6">
      {/* Tổng quan nợ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="theme-card rounded-lg border theme-border-primary p-4">
          <div className="text-sm theme-text-muted mb-1">Tổng nợ hiện tại (từ API)</div>
          <div className="text-2xl font-bold theme-text-primary">{formatCurrency(customerDebt)}</div>
        </div>
        <div className="theme-card rounded-lg border theme-border-primary p-4">
          <div className="text-sm theme-text-muted mb-1">Nợ quá hạn</div>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(overdueDebt)}</div>
        </div>
        <div className="theme-card rounded-lg border theme-border-primary p-4">
          <div className="text-sm theme-text-muted mb-1">Số ngày nợ TB</div>
          <div className="text-2xl font-bold theme-text">25 ngày</div>
        </div>
      </div>

      {/* Chi tiết nợ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold theme-text">Chi tiết công nợ</h4>
          <Button 
            size="sm" 
            className="theme-bg-primary hover:theme-bg-secondary text-white"
          >
            Thu nợ
          </Button>
        </div>

        <div className="theme-card rounded-lg border theme-border-primary overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b theme-border-primary/20">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                    Mã hóa đơn
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                    Ngày bán
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                    Đã trả
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                    Còn nợ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                    Hạn trả
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border-primary/10">
                {debtRecords.map((record) => (
                  <tr key={record.id} className="hover:theme-bg-primary/5">
                    <td className="px-4 py-3 text-sm theme-text-primary font-medium">
                      {record.invoiceCode}
                    </td>
                    <td className="px-4 py-3 text-sm theme-text-muted">
                      {record.date}
                    </td>
                    <td className="px-4 py-3 text-sm theme-text">
                      {formatCurrency(record.originalAmount)}
                    </td>
                    <td className="px-4 py-3 text-sm theme-text">
                      {formatCurrency(record.paidAmount)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium theme-text">
                      {formatCurrency(record.remainingAmount)}
                    </td>
                    <td className="px-4 py-3 text-sm theme-text-muted">
                      {record.dueDate}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="theme-border-primary hover:theme-bg-primary/10"
                      >
                        Thu nợ
                      </Button>
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
