
import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface CustomerFiltersProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

export function CustomerFilters({ sidebarOpen, setSidebarOpen }: CustomerFiltersProps) {
  const [timeFilter, setTimeFilter] = useState('all');

  return (
    <div className={`
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      sm:translate-x-0 
      fixed sm:relative 
      z-50 sm:z-auto
      w-64 sm:w-64 lg:w-72
      theme-card border-r theme-border-primary 
      min-h-screen 
      transition-transform duration-300 ease-in-out
    `}>
      <div className="p-4">
        {/* Mobile close button */}
        <div className="flex justify-between items-center mb-4 sm:hidden">
          <h3 className="font-semibold theme-text">Bộ lọc</h3>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4 theme-text-primary" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Overview */}
          <div>
            <h3 className="font-semibold theme-text mb-3 pb-2 border-b theme-border-primary/20">
              Tổng bán
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="theme-text-muted">Giá trị</span>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <input 
                    type="text" 
                    placeholder="Từ" 
                    className="w-full sm:flex-1 px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors min-h-[36px]" 
                  />
                  <input 
                    type="text" 
                    placeholder="Nhập giá trị" 
                    className="w-full sm:flex-1 px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors min-h-[36px]" 
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <input 
                    type="text" 
                    placeholder="Tới" 
                    className="w-full sm:flex-1 px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors min-h-[36px]" 
                  />
                  <input 
                    type="text" 
                    placeholder="Nhập giá trị" 
                    className="w-full sm:flex-1 px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors min-h-[36px]" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Time Period */}
          <div>
            <h3 className="font-semibold theme-text mb-3 pb-2 border-b theme-border-primary/20">
              Thời gian
            </h3>
            <RadioGroup value={timeFilter} onValueChange={setTimeFilter} className="space-y-3">
              <div className="flex items-center space-x-3 min-h-[36px]">
                <RadioGroupItem value="all" id="time-all" />
                <Label htmlFor="time-all" className="text-sm theme-text cursor-pointer flex-1">
                  Toàn thời gian
                </Label>
              </div>
              <div className="flex items-center space-x-3 min-h-[36px]">
                <RadioGroupItem value="custom" id="time-custom" />
                <Label htmlFor="time-custom" className="text-sm theme-text cursor-pointer flex-1 flex items-center">
                  Tùy chỉnh
                  <Calendar className="w-4 h-4 theme-text-muted ml-2" />
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Debt Status */}
          <div>
            <h3 className="font-semibold theme-text mb-3 pb-2 border-b theme-border-primary/20">
              Nợ hiện tại
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <input 
                  type="text" 
                  placeholder="Từ" 
                  className="w-full sm:flex-1 px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors min-h-[36px]" 
                />
                <input 
                  type="text" 
                  placeholder="Nhập giá trị" 
                  className="w-full sm:flex-1 px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors min-h-[36px]" 
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <input 
                  type="text" 
                  placeholder="Tới" 
                  className="w-full sm:flex-1 px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors min-h-[36px]" 
                />
                <input 
                  type="text" 
                  placeholder="Nhập giá trị" 
                  className="w-full sm:flex-1 px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors min-h-[36px]" 
                />
              </div>
            </div>
          </div>

          {/* Days Overdue */}
          <div>
            <h3 className="font-semibold theme-text mb-3 pb-2 border-b theme-border-primary/20">
              Số ngày nợ
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <input 
                  type="text" 
                  placeholder="Từ" 
                  className="w-full sm:flex-1 px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors min-h-[36px]" 
                />
                <input 
                  type="text" 
                  placeholder="Nhập giá trị" 
                  className="w-full sm:flex-1 px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors min-h-[36px]" 
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <input 
                  type="text" 
                  placeholder="Tới" 
                  className="w-full sm:flex-1 px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors min-h-[36px]" 
                />
                <input 
                  type="text" 
                  placeholder="Nhập giá trị" 
                  className="w-full sm:flex-1 px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors min-h-[36px]" 
                />
              </div>
            </div>
          </div>

          {/* Transaction Area */}
          <div>
            <h3 className="font-semibold theme-text mb-3 pb-2 border-b theme-border-primary/20">
              Điểm hiện tại
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <input 
                  type="text" 
                  placeholder="Từ" 
                  className="w-full sm:flex-1 px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors min-h-[36px]" 
                />
                <input 
                  type="text" 
                  placeholder="Nhập giá trị" 
                  className="w-full sm:flex-1 px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors min-h-[36px]" 
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <input 
                  type="text" 
                  placeholder="Tới" 
                  className="w-full sm:flex-1 px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors min-h-[36px]" 
                />
                <input 
                  type="text" 
                  placeholder="Nhập giá trị" 
                  className="w-full sm:flex-1 px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors min-h-[36px]" 
                />
              </div>
            </div>
          </div>

          {/* Transaction Zone */}
          <div>
            <h3 className="font-semibold theme-text mb-3 pb-2 border-b theme-border-primary/20">
              Khu vực giao hàng
            </h3>
            <select className="w-full px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors min-h-[36px] theme-text">
              <option>Chọn Tỉnh/TP - Quận/Huyện</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <h3 className="font-semibold theme-text mb-3 pb-2 border-b theme-border-primary/20">
              Trạng thái
            </h3>
            <div className="space-y-2">
              <Button 
                variant="default" 
                size="sm" 
                className="w-full justify-start voucher-button-primary min-h-[36px]"
              >
                Tất cả
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start theme-border-primary hover:theme-bg-primary/10 hover:theme-text-primary min-h-[36px]"
              >
                Đang hoạt động
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start theme-border-primary hover:theme-bg-primary/10 hover:theme-text-primary min-h-[36px]"
              >
                Ngưng hoạt động
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
