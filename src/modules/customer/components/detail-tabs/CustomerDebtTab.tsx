
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
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
      <div className={`grid gap-4 ${isMobile ? "grid-cols-2 min-[400px]:grid-cols-3" : "grid-cols-3"}`}>
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
        </div>

        {isMobile ? (
          <div className="space-y-3">
            {debtRecords.map((record) => (
              <div key={record.id} className="theme-card rounded-lg border theme-border-primary overflow-hidden">
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-base">{record.invoiceCode}</div>
                      <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <span className="text-base">📅</span> {record.date}
                      </div>
                    </div>
                    {getStatusBadge(record.status)}
                  </div>
                  
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <span className="text-base">💳</span> Số tiền nợ
                      </span>
                      <span className="font-medium">{formatCurrency(record.originalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <span className="text-base">✅</span> Đã trả
                      </span>
                      <span className="font-medium">{formatCurrency(record.paidAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <span className="text-base">⏳</span> Còn lại
                      </span>
                      <span className="font-semibold text-destructive">{formatCurrency(record.remainingAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <span className="text-base">📆</span> Hạn thanh toán
                      </span>
                      <span>{record.dueDate}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full min-h-[44px] touch-manipulation"
                  >
                    Thu nợ
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="theme-card rounded-lg border theme-border-primary overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b theme-border-primary/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                      Mã HĐ
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                      Ngày
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium theme-text uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium theme-text uppercase tracking-wider">
                      Đã trả
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium theme-text uppercase tracking-wider">
                      Còn lại
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                      Hạn TT
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium theme-text uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {debtRecords.map((record) => (
                    <tr key={record.id} className="border-b theme-border-primary/10 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="font-medium theme-text">{record.invoiceCode}</span>
                      </td>
                      <td className="px-4 py-3 theme-text-muted">
                        {record.date}
                      </td>
                      <td className="px-4 py-3 text-right theme-text">
                        {formatCurrency(record.originalAmount)}
                      </td>
                      <td className="px-4 py-3 text-right theme-text">
                        {formatCurrency(record.paidAmount)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-red-600">
                          {formatCurrency(record.remainingAmount)}
                        </span>
                      </td>
                      <td className="px-4 py-3 theme-text-muted">
                        {record.dueDate}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(record.status)}
                      </td>
                      <td className="px-4 py-3">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="theme-border-primary hover:theme-bg-primary hover:text-white"
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
        )}
      </div>
    </div>
  );
}
