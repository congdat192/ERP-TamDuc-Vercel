
import { useState } from 'react';
import { X, Calendar, Filter } from 'lucide-react';
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
    <>
      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 
        fixed lg:relative 
        z-50 lg:z-auto
        w-64
        theme-card border-r theme-border-primary 
        h-screen lg:h-auto lg:min-h-[calc(100vh-200px)]
        transition-transform duration-300 ease-in-out
        overflow-y-auto
      `}>
        <div className="p-4">
          {/* Mobile Header */}
          <div className="flex justify-between items-center mb-4 lg:hidden">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 theme-text-primary" />
              <h3 className="font-semibold theme-text">Bộ lọc</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4 theme-text-primary" />
            </Button>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center space-x-2 mb-6 pb-2 border-b theme-border-primary/20">
            <Filter className="w-5 h-5 theme-text-primary" />
            <h3 className="font-semibold theme-text">Bộ lọc khách hàng</h3>
          </div>

          <div className="space-y-6">
            {/* Tổng bán */}
            <div>
              <h4 className="font-medium theme-text mb-3 pb-2 border-b theme-border-primary/20">
                Tổng bán
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Từ" 
                    className="px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors" 
                  />
                  <input 
                    type="text" 
                    placeholder="Đến" 
                    className="px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors" 
                  />
                </div>
              </div>
            </div>

            {/* Thời gian */}
            <div>
              <h4 className="font-medium theme-text mb-3 pb-2 border-b theme-border-primary/20">
                Thời gian
              </h4>
              <RadioGroup value={timeFilter} onValueChange={setTimeFilter} className="space-y-3">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="all" id="time-all" className="theme-border-primary data-[state=checked]:theme-bg-primary data-[state=checked]:text-white" />
                  <Label htmlFor="time-all" className="text-sm theme-text cursor-pointer flex-1">
                    Toàn thời gian
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="custom" id="time-custom" className="theme-border-primary data-[state=checked]:theme-bg-primary data-[state=checked]:text-white" />
                  <Label htmlFor="time-custom" className="text-sm theme-text cursor-pointer flex-1 flex items-center">
                    Tùy chỉnh
                    <Calendar className="w-4 h-4 theme-text-muted ml-2" />
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Nợ hiện tại */}
            <div>
              <h4 className="font-medium theme-text mb-3 pb-2 border-b theme-border-primary/20">
                Nợ hiện tại
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Từ" 
                    className="px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors" 
                  />
                  <input 
                    type="text" 
                    placeholder="Đến" 
                    className="px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors" 
                  />
                </div>
              </div>
            </div>

            {/* Số ngày nợ */}
            <div>
              <h4 className="font-medium theme-text mb-3 pb-2 border-b theme-border-primary/20">
                Số ngày nợ
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Từ" 
                    className="px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors" 
                  />
                  <input 
                    type="text" 
                    placeholder="Đến" 
                    className="px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors" 
                  />
                </div>
              </div>
            </div>

            {/* Điểm hiện tại */}
            <div>
              <h4 className="font-medium theme-text mb-3 pb-2 border-b theme-border-primary/20">
                Điểm hiện tại
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Từ" 
                    className="px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors" 
                  />
                  <input 
                    type="text" 
                    placeholder="Đến" 
                    className="px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors" 
                  />
                </div>
              </div>
            </div>

            {/* Khu vực giao hàng */}
            <div>
              <h4 className="font-medium theme-text mb-3 pb-2 border-b theme-border-primary/20">
                Khu vực giao hàng
              </h4>
              <select className="w-full px-3 py-2 text-sm border theme-border-primary rounded-md voucher-input focus:theme-border-primary transition-colors theme-text">
                <option>Chọn Tỉnh/TP - Quận/Huyện</option>
              </select>
            </div>

            {/* Trạng thái */}
            <div>
              <h4 className="font-medium theme-text mb-3 pb-2 border-b theme-border-primary/20">
                Trạng thái
              </h4>
              <div className="space-y-2">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full justify-start voucher-button-primary"
                >
                  Tất cả
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start theme-border-primary hover:theme-bg-primary/10 hover:theme-text-primary"
                >
                  Đang hoạt động
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start theme-border-primary hover:theme-bg-primary/10 hover:theme-text-primary"
                >
                  Ngưng hoạt động
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
