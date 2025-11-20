
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2, Phone, Users, Save, AlertCircle } from 'lucide-react';
import { Supplier, Transaction } from '../types';

interface SupplierManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers: Supplier[];
  transactions: Transaction[];
  onUpdateSuppliers: (newSuppliers: Supplier[]) => void;
  initialEditId?: string | null; // Changed from DetailId to EditId
}

export const SupplierManagerModal: React.FC<SupplierManagerModalProps> = ({ 
  isOpen, 
  onClose, 
  suppliers, 
  transactions,
  onUpdateSuppliers,
  initialEditId
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Open in edit mode if ID provided
  useEffect(() => {
    if (isOpen && initialEditId) {
      const s = suppliers.find(sup => sup.id === initialEditId);
      if (s) handleEdit(s);
    } else if (isOpen) {
       // Reset if just opening manager
       resetForm();
    }
  }, [isOpen, initialEditId, suppliers]);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [initialDebt, setInitialDebt] = useState('');

  // Calculated Debt Logic (For list view)
  const calculateCurrentDebt = (supplierId: string, initial: number) => {
    let debt = initial;
    transactions.forEach(t => {
      if (t.supplierId === supplierId) {
        if (t.isDebt) debt += t.amount;
        if (t.isDebtRepayment) debt -= t.amount;
      }
    });
    return debt;
  };

  const resetForm = () => {
    setName('');
    setCode('');
    setPhone('');
    setAddress('');
    setInitialDebt('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newSupplier: Supplier = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      name,
      code: code || `NCC${suppliers.length + 1}`,
      phone,
      address,
      initialDebt: Number(initialDebt) || 0
    };

    if (editingId) {
      onUpdateSuppliers(suppliers.map(s => s.id === editingId ? newSupplier : s));
    } else {
      onUpdateSuppliers([...suppliers, newSupplier]);
    }
    
    // If we were editing, maybe close the modal, or just reset
    if (editingId && initialEditId) {
        onClose();
    } else {
        resetForm();
    }
  };

  const handleEdit = (s: Supplier) => {
    setEditingId(s.id);
    setName(s.name);
    setCode(s.code);
    setPhone(s.phone || '');
    setAddress(s.address || '');
    setInitialDebt(s.initialDebt.toString());
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa nhà cung cấp này?')) {
      onUpdateSuppliers(suppliers.filter(s => s.id !== id));
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-indigo-50 shrink-0">
          <div className="flex items-center gap-2">
            <Users className="text-indigo-600" size={24} />
            <div>
              <h2 className="text-lg font-bold text-indigo-900">Quản Lý Nhà Cung Cấp</h2>
              <p className="text-xs text-indigo-600">Thêm mới và chỉnh sửa thông tin đối tác</p>
            </div>
          </div>
          <button onClick={onClose} title="Đóng" className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          {/* Left: Form */}
          {(isAdding || suppliers.length === 0) && (
            <div className="w-full md:w-1/3 bg-gray-50 p-6 border-r border-gray-100 overflow-y-auto shrink-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">
                  {editingId ? 'Cập nhật thông tin' : 'Thêm nhà cung cấp'}
                </h3>
                {suppliers.length > 0 && (
                   <button onClick={resetForm} className="text-xs text-gray-500 underline">Hủy</button>
                )}
              </div>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tên NCC <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Ví dụ: Cty TNHH ABC"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Mã NCC</label>
                    <input 
                      value={code} 
                      onChange={e => setCode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                      placeholder="Auto"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Điện thoại</label>
                    <input 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Địa chỉ</label>
                  <input 
                    value={address} 
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                  />
                </div>
                
                <div className="pt-2 border-t border-gray-200">
                  <label className="block text-xs font-bold text-indigo-900 mb-1 flex items-center gap-1">
                    <AlertCircle size={12}/> Nợ đầu kỳ (VND)
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    value={initialDebt} 
                    onChange={e => setInitialDebt(e.target.value)}
                    className="w-full px-3 py-2 border border-indigo-200 bg-indigo-50 rounded-lg text-sm font-medium text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="0"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Số tiền bạn đang nợ NCC này trước khi dùng phần mềm.</p>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  <Save size={18} /> {editingId ? 'Lưu thay đổi' : 'Thêm mới'}
                </button>
              </form>
            </div>
          )}

          {/* Right: List */}
          <div className={`flex-1 p-6 overflow-y-auto ${isAdding ? 'hidden md:block' : ''}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 text-lg">Danh Sách ({suppliers.length})</h3>
              {!isAdding && (
                <button 
                  onClick={() => setIsAdding(true)}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  <Plus size={16} /> Thêm NCC
                </button>
              )}
            </div>

            <div className="overflow-hidden border border-gray-200 rounded-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-medium">Mã</th>
                    <th className="px-4 py-3 font-medium">Nhà Cung Cấp</th>
                    <th className="px-4 py-3 font-medium">Liên hệ</th>
                    <th className="px-4 py-3 font-medium text-right">Nợ hiện tại</th>
                    <th className="px-4 py-3 font-medium text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {suppliers.map(s => {
                    const currentDebt = calculateCurrentDebt(s.id, s.initialDebt);
                    return (
                      <tr key={s.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{s.code}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{s.name}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[150px]">{s.address}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {s.phone && (
                            <div className="flex items-center gap-1 text-xs">
                              <Phone size={12} /> {s.phone}
                            </div>
                          )}
                        </td>
                        <td className={`px-4 py-3 font-bold text-right ${currentDebt > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {formatCurrency(currentDebt)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleEdit(s)}
                              title="Chỉnh sửa thông tin"
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(s.id)}
                              title="Xóa"
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {suppliers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                        Chưa có nhà cung cấp nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
