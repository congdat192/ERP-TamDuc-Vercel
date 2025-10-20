import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface InvoiceCommissionTableProps {
  commissions: any[];
}

export function InvoiceCommissionTable({ commissions }: InvoiceCommissionTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const grouped = commissions.reduce((acc, item) => {
    acc[item.commission_type] = item;
    return acc;
  }, {} as Record<string, any>);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Loại</TableHead>
          <TableHead className="text-right">Số Lượng</TableHead>
          <TableHead className="text-right">Giá Trị</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Hóa Đơn 500K</TableCell>
          <TableCell className="text-right">{grouped.invoice_500k?.quantity || 0}</TableCell>
          <TableCell className="text-right">{formatCurrency(grouped.invoice_500k?.commission_amount || 0)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Hóa Đơn 1tr</TableCell>
          <TableCell className="text-right">{grouped.invoice_1m?.quantity || 0}</TableCell>
          <TableCell className="text-right">{formatCurrency(grouped.invoice_1m?.commission_amount || 0)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Đơn Hoàn 500K</TableCell>
          <TableCell className="text-right">{grouped.return_500k?.quantity || 0}</TableCell>
          <TableCell className="text-right">{formatCurrency(grouped.return_500k?.commission_amount || 0)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Đơn Hoàn 1tr</TableCell>
          <TableCell className="text-right">{grouped.return_1m?.quantity || 0}</TableCell>
          <TableCell className="text-right">{formatCurrency(grouped.return_1m?.commission_amount || 0)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
