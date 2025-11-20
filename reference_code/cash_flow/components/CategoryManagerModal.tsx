import React, { useState } from 'react';
import { X, Plus, Trash2, Tag } from 'lucide-react';
import { TransactionType, CategoryMap } from '../types';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryMap;
  onUpdateCategories: (newCategories: CategoryMap) => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({ 
  isOpen, 
  onClose, 
  categories, 
  onUpdateCategories 
}) => {
  const [activeTab, setActiveTab] = useState<TransactionType>(TransactionType.INCOME);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    
    if (!trimmed) {
      setError('Tên danh mục không được để trống');
      return;
    }

    if (categories[activeTab].includes(trimmed)) {
      setError('Danh mục này đã tồn tại');
      return;
    }

    const updated = {
      ...categories,
      [activeTab]: [...categories[activeTab], trimmed]
    };

    onUpdateCategories(updated);
    setNewCategory('');
    setError('');
  };

  const handleDelete = (categoryToDelete: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${categoryToDelete}"? Các giao dịch cũ thuộc danh mục này vẫn sẽ được giữ nguyên.`)) {
      const updated = {
        ...categories,
        [activeTab]: categories[activeTab].filter(c => c !== categoryToDelete)
      };
      onUpdateCategories(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Tag size={20} className="text-indigo-600" />
            Quản lý danh mục
          </h2>
          <button onClick={onClose} title="Đóng" className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => { setActiveTab(TransactionType.INCOME); setError(''); }}
            title="Quản lý danh mục thu"
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === TransactionType.INCOME ? 'text-emerald-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Thu (Income)
            {activeTab === TransactionType.INCOME && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500"></span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab(TransactionType.EXPENSE); setError(''); }}
            title="Quản lý danh mục chi"
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === TransactionType.EXPENSE ? 'text-rose-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Chi (Expense)
            {activeTab === TransactionType.EXPENSE && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-500"></span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Add Form */}
          <form onSubmit={handleAdd} className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Thêm mới</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => { setNewCategory(e.target.value); setError(''); }}
                placeholder="Nhập tên danh mục..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="submit"
                title="Thêm danh mục mới"
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  activeTab === TransactionType.INCOME ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                <Plus size={20} />
              </button>
            </div>
            {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
          </form>

          {/* List */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Danh sách hiện tại</label>
            <div className="space-y-2">
              {categories[activeTab].map((cat) => (
                <div key={cat} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 group hover:border-indigo-100 transition-colors">
                  <span className="text-sm text-gray-700">{cat}</span>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="text-gray-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                    title="Xóa danh mục này"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {categories[activeTab].length === 0 && (
                <p className="text-sm text-gray-400 italic text-center py-2">Chưa có danh mục nào.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};