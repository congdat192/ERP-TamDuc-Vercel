import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  type: 'neutral' | 'success' | 'danger';
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, amount, icon: Icon, type, trend }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const colorClasses = {
    neutral: 'text-blue-600 bg-blue-50',
    success: 'text-emerald-600 bg-emerald-50',
    danger: 'text-rose-600 bg-rose-50',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses[type]}`}>
          <Icon size={20} />
        </div>
      </div>
      <div>
        <p className={`text-2xl font-bold ${
            type === 'success' ? 'text-gray-900' : 
            type === 'danger' ? 'text-gray-900' : 'text-gray-900'
        }`}>
          {formatCurrency(amount)}
        </p>
        {trend && (
          <p className="text-xs text-gray-400 mt-1">{trend}</p>
        )}
      </div>
    </div>
  );
};
