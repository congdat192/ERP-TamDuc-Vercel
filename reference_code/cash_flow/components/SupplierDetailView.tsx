
import React, { useMemo } from 'react';
import { Download, Phone, MapPin, Edit2, ArrowLeft, FileText, Trash2 } from 'lucide-react';
import { Supplier, Transaction } from '../types';

interface SupplierDetailViewProps {
  supplierId: string;
  suppliers: Supplier[];
  transactions: Transaction[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export const SupplierDetailView: React.FC<SupplierDetailViewProps> = ({
  supplierId,
  suppliers,
  transactions,
  onEdit,
  onDelete,
  onBack
}) => {
  const supplier = suppliers.find(s => s.id === supplierId);

  // --- Ledger Logic ---
  const supplierLedger = useMemo(() => {
    if (!supplier) return null;

    // Filter transactions for this supplier
    const txs = transactions
      .filter(t => t.supplierId === supplierId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let balance = supplier.initialDebt;
    const rows = txs.map(t => {
      const increase = t.isDebt ? t.amount : 0;
      const decrease = t.isDebtRepayment ? t.amount : 0;
      
      balance = balance + increase - decrease;

      return {
        ...t,
        increase,
        decrease,
        balance
      };
    });

    return { rows, currentBalance: balance };
  }, [supplierId, transactions, supplier]);

  if (!supplier || !supplierLedger) return <div>Không tìm thấy nhà cung cấp</div>;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleExportLedger = () => {
    const headers = ['Ngày', 'Mã GD', 'Diễn giải', 'Ghi nợ (Tăng)', 'Thanh toán (Giảm)', 'Dư nợ'];
    const csvRows = [
      headers.join(','),
      `"---", "---", "Dư nợ đầu kỳ", "${supplier.initialDebt}", "0", "${supplier.initialDebt}"`,
      ...supplierLedger.rows.map(row => [
        row.date,
        row.id,
        `"${row.description.replace(/"/g, '""')}"`,
        row.increase,
        row.decrease,
        row.balance
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `CongNo_${supplier.code}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
               <button onClick={onBack} className="hover:text-indigo-600 flex items-center gap-1">
                 <ArrowLeft size={16}/> Quay lại Dashboard
               </button>
               <span>/</span>
               <span>Chi tiết đối tác</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              {supplier.name}
              <span className="text-sm font-mono font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {supplier.code}
              </span>
            </h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleExportLedger} 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <Download size={16} /> Xuất Excel
            </button>
            <button 
              onClick={() => onEdit(supplier)} 
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
            >
              <Edit2 size={16} /> Sửa
            </button>
             <button 
              onClick={() => onDelete(supplier.id)} 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-400 hover:text-rose-600 hover:border-rose-200 rounded-lg transition-colors text-sm font-medium"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Info Column */}
           <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400"/>
                <span>{supplier.phone || 'Chưa có SĐT'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-400"/>
                <span>{supplier.address || 'Chưa có địa chỉ'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-gray-400"/>
                <span>Nợ đầu kỳ: <strong>{formatCurrency(supplier.initialDebt)}</strong></span>
              </div>
           </div>

           {/* Stats Column */}
           <div className="md:col-span-2 flex gap-4">
              <div className="flex-1 bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                 <p className="text-xs text-indigo-600 uppercase font-semibold mb-1">Dư nợ hiện tại</p>
                 <p className="text-2xl font-bold text-indigo-900">{formatCurrency(supplierLedger.currentBalance)}</p>
                 <p className="text-xs text-indigo-400 mt-1">Số tiền bạn đang nợ đối tác này</p>
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-100">
                 <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Tổng nhập hàng</p>
                 <p className="text-xl font-bold text-gray-700">
                    {formatCurrency(supplierLedger.rows.reduce((acc, row) => acc + row.increase, 0))}
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
           <h3 className="font-bold text-gray-800">Sổ Chi Tiết Công Nợ</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-gray-600 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-semibold">Ngày</th>
                <th className="px-6 py-3 font-semibold">Diễn giải</th>
                <th className="px-6 py-3 font-semibold text-right text-rose-600">Ghi nợ (Mua) (+)</th>
                <th className="px-6 py-3 font-semibold text-right text-emerald-600">Thanh toán (Trả) (-)</th>
                <th className="px-6 py-3 font-semibold text-right text-gray-800">Dư nợ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Initial Balance Row */}
              <tr className="bg-gray-50/50 font-medium">
                <td className="px-6 py-4 text-gray-400 italic">---</td>
                <td className="px-6 py-4 text-gray-800">Số dư đầu kỳ</td>
                <td className="px-6 py-4 text-right">-</td>
                <td className="px-6 py-4 text-right">-</td>
                <td className="px-6 py-4 text-right font-bold">{formatCurrency(supplier.initialDebt)}</td>
              </tr>
              {supplierLedger.rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{row.date}</td>
                  <td className="px-6 py-4 text-gray-800">{row.description}</td>
                  <td className="px-6 py-4 text-right text-rose-600 font-medium">
                    {row.increase > 0 ? formatCurrency(row.increase) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right text-emerald-600 font-medium">
                    {row.decrease > 0 ? formatCurrency(row.decrease) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-800">
                    {formatCurrency(row.balance)}
                  </td>
                </tr>
              ))}
              {supplierLedger.rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">Chưa có giao dịch phát sinh với nhà cung cấp này.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
