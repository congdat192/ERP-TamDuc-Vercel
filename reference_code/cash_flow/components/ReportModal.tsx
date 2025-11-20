import React, { useState, useMemo } from 'react';
import { X, FileText, Download, Calendar, Filter, PieChart as PieChartIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { BRANCHES, CATEGORIES } from '../constants';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

type ReportType = 'MONTHLY' | 'QUARTERLY';
type ViewType = 'EXPENSE' | 'INCOME';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, transactions }) => {
  const currentYear = new Date().getFullYear();
  const [reportType, setReportType] = useState<ReportType>('MONTHLY');
  const [viewType, setViewType] = useState<ViewType>('EXPENSE');
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedQuarter, setSelectedQuarter] = useState<number>(1);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');

  const filteredData = useMemo(() => {
    let startDate: string;
    let endDate: string;

    if (reportType === 'MONTHLY') {
      const start = new Date(selectedYear, selectedMonth - 1, 1);
      const end = new Date(selectedYear, selectedMonth, 0); // Last day of month
      startDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;
      endDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
    } else {
      const startMonth = (selectedQuarter - 1) * 3; // 0, 3, 6, 9
      const endMonth = startMonth + 2; // 2, 5, 8, 11
      const endDay = new Date(selectedYear, endMonth + 1, 0).getDate();
      
      startDate = `${selectedYear}-${String(startMonth + 1).padStart(2, '0')}-01`;
      endDate = `${selectedYear}-${String(endMonth + 1).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;
    }

    return transactions.filter(t => {
      // Filter by type based on ViewMode
      const targetType = viewType === 'EXPENSE' ? TransactionType.EXPENSE : TransactionType.INCOME;
      if (t.type !== targetType) return false;
      
      if (selectedBranchId !== 'all' && t.branchId !== selectedBranchId) return false;
      return t.date >= startDate && t.date <= endDate;
    });
  }, [transactions, reportType, selectedYear, selectedMonth, selectedQuarter, selectedBranchId, viewType]);

  const totalAmount = useMemo(() => {
    return filteredData.reduce((sum, t) => sum + t.amount, 0);
  }, [filteredData]);

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    filteredData.forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredData]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleExport = () => {
    if (filteredData.length === 0) return;

    const headers = ['Ngày', 'Chi nhánh', 'Danh mục', 'Mô tả', 'Loại', 'Số tiền'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(t => {
        const branchName = BRANCHES.find(b => b.id === t.branchId)?.name || t.branchId;
        return [
          t.date,
          `"${branchName}"`,
          `"${t.category}"`,
          `"${t.description.replace(/"/g, '""')}"`,
          t.type,
          t.amount
        ].join(',');
      })
    ].join('\n');

    // Add BOM for Excel compatibility with UTF-8
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const timeLabel = reportType === 'MONTHLY' ? `T${selectedMonth}-${selectedYear}` : `Q${selectedQuarter}-${selectedYear}`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', `BaoCao_${viewType}_${timeLabel}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  const isExpense = viewType === 'EXPENSE';
  const themeColor = isExpense ? 'rose' : 'emerald';
  const ThemeIcon = isExpense ? ArrowDown : ArrowUp;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isExpense ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
              <FileText size={24} />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Báo Cáo Tài Chính</h2>
          </div>
          <button onClick={onClose} title="Đóng cửa sổ" className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 bg-gray-50 p-5 border-r border-gray-100 overflow-y-auto shrink-0 space-y-5">
            
            {/* View Type Switcher */}
            <div>
               <label className="block text-xs font-semibold text-gray-500 uppercase mb-3">Loại báo cáo</label>
               <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setViewType('INCOME')}
                    title="Xem báo cáo doanh thu"
                    className={`flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-lg border transition-all ${
                      viewType === 'INCOME' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <ArrowUp size={14} /> Doanh thu
                  </button>
                  <button
                    onClick={() => setViewType('EXPENSE')}
                    title="Xem báo cáo chi phí"
                    className={`flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-lg border transition-all ${
                      viewType === 'EXPENSE' 
                        ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-sm' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <ArrowDown size={14} /> Chi phí
                  </button>
               </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                <Calendar size={14} /> Thời gian
              </label>
              <div className="flex bg-white p-1 rounded-lg border border-gray-200 mb-3">
                <button
                  onClick={() => setReportType('MONTHLY')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                    reportType === 'MONTHLY' 
                      ? `bg-${themeColor}-50 text-${themeColor}-700 shadow-sm` 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Hàng tháng
                </button>
                <button
                  onClick={() => setReportType('QUARTERLY')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                    reportType === 'QUARTERLY' 
                      ? `bg-${themeColor}-50 text-${themeColor}-700 shadow-sm` 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Hàng quý
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Năm</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className={`w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-${themeColor}-400`}
                  >
                    {[currentYear, currentYear - 1, currentYear - 2].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                {reportType === 'MONTHLY' ? (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Tháng</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      className={`w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-${themeColor}-400`}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <option key={m} value={m}>Tháng {m}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Quý</label>
                    <select
                      value={selectedQuarter}
                      onChange={(e) => setSelectedQuarter(Number(e.target.value))}
                      className={`w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-${themeColor}-400`}
                    >
                      <option value={1}>Quý 1 (T1-T3)</option>
                      <option value={2}>Quý 2 (T4-T6)</option>
                      <option value={3}>Quý 3 (T7-T9)</option>
                      <option value={4}>Quý 4 (T10-T12)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                <Filter size={14} /> Phạm vi
              </label>
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-${themeColor}-400`}
              >
                <option value="all">Toàn hệ thống</option>
                {BRANCHES.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button 
                onClick={handleExport}
                disabled={filteredData.length === 0}
                title="Tải xuống dữ liệu dưới dạng file CSV"
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filteredData.length === 0 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : `bg-${themeColor}-600 text-white hover:bg-${themeColor}-700`
                }`}
              >
                <Download size={16} />
                Xuất CSV
              </button>
            </div>
          </div>

          {/* Report Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Báo cáo {isExpense ? 'Chi Phí' : 'Doanh Thu'} {reportType === 'MONTHLY' ? `Tháng ${selectedMonth}` : `Quý ${selectedQuarter}`} / {selectedYear}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Phạm vi: {selectedBranchId === 'all' ? 'Toàn hệ thống' : BRANCHES.find(b => b.id === selectedBranchId)?.name}
              </p>
            </div>

            {/* Summary Card */}
            <div className={`bg-white border border-${themeColor}-100 rounded-xl p-6 shadow-sm mb-6 flex items-center justify-between bg-gradient-to-r from-${themeColor}-50 to-white`}>
              <div>
                <p className={`text-sm text-${themeColor}-600 font-medium mb-1`}>Tổng {isExpense ? 'Chi' : 'Thu'}</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
              </div>
              <div className={`h-12 w-12 bg-${themeColor}-100 rounded-full flex items-center justify-center text-${themeColor}-600`}>
                <PieChartIcon size={24} />
              </div>
            </div>

            {filteredData.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Phân bổ theo danh mục</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {categoryBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Detail Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <h4 className="px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-50 border-b border-gray-100">
                    Chi tiết danh mục
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white text-gray-500 border-b border-gray-100">
                        <tr>
                          <th className="px-4 py-2 font-medium">Danh mục</th>
                          <th className="px-4 py-2 font-medium text-right">Số tiền</th>
                          <th className="px-4 py-2 font-medium text-right">%</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {categoryBreakdown.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50">
                            <td className="px-4 py-3 text-gray-700 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                              {item.name}
                            </td>
                            <td className="px-4 py-3 text-gray-900 font-medium text-right">
                              {formatCurrency(item.value)}
                            </td>
                            <td className="px-4 py-3 text-gray-500 text-right">
                              {((item.value / totalAmount) * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500">Không có dữ liệu {isExpense ? 'chi phí' : 'doanh thu'} cho thời gian này.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};