
import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomerFiltersProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

export function CustomerFilters({ sidebarOpen, setSidebarOpen }: CustomerFiltersProps) {
  return (
    <div className={`
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      sm:translate-x-0 
      fixed sm:relative 
      z-50 sm:z-auto
      w-64 sm:w-64 lg:w-72
      bg-white border-r border-gray-200 
      min-h-screen 
      transition-transform duration-300 ease-in-out
    `}>
      <div className="p-4">
        {/* Mobile close button */}
        <div className="flex justify-between items-center mb-4 sm:hidden">
          <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Overview */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Tổng bán</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Giá trị</span>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                  <input type="text" placeholder="Từ" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                  <input type="text" placeholder="Nhập giá trị" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                </div>
                <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                  <input type="text" placeholder="Tới" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                  <input type="text" placeholder="Nhập giá trị" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Time Period */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Thời gian</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Toàn thời gian</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                <span className="text-sm">Tùy chỉnh</span>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Debt Status */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Nợ hiện tại</h3>
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <input type="text" placeholder="Từ" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                <input type="text" placeholder="Nhập giá trị" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <input type="text" placeholder="Tới" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                <input type="text" placeholder="Nhập giá trị" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
              </div>
            </div>
          </div>

          {/* Days Overdue */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Số ngày nợ</h3>
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <input type="text" placeholder="Từ" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                <input type="text" placeholder="Nhập giá trị" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <input type="text" placeholder="Tới" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                <input type="text" placeholder="Nhập giá trị" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
              </div>
            </div>
          </div>

          {/* Transaction Area */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Điểm hiện tại</h3>
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <input type="text" placeholder="Từ" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                <input type="text" placeholder="Nhập giá trị" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <input type="text" placeholder="Tới" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
                <input type="text" placeholder="Nhập giá trị" className="w-full sm:flex-1 px-2 py-1 text-xs border rounded" />
              </div>
            </div>
          </div>

          {/* Transaction Zone */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Khu vực giao hàng</h3>
            <select className="w-full px-2 py-1 text-xs border rounded">
              <option>Chọn Tỉnh/TP - Quận/Huyện</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Trạng thái</h3>
            <div className="space-y-2">
              <Button variant="default" size="sm" className="w-full justify-start bg-blue-500 text-white">
                Tất cả
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Đang hoạt động
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Ngưng hoạt động
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
