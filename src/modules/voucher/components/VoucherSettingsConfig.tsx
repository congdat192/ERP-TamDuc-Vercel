
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import { DenominationManager } from './DenominationManager';
import { CustomerSourceManager } from './CustomerSourceManager';
import { CustomerTypeManager } from './CustomerTypeManager';
import { TemplateManager } from './TemplateManager';
import { StaffManager } from './StaffManager';

export function VoucherSettingsConfig() {
  const [activeTab, setActiveTab] = useState<'denominations' | 'sources' | 'types' | 'staff' | 'templates'>('denominations');
  const [allowCustomValue, setAllowCustomValue] = useState(false);

  const handleSaveSettings = () => {
    // This would save to backend/API when integrated
    toast({
      title: "Thành công",
      description: "Cài đặt đã được lưu thành công."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Cấu Hình Voucher</h3>
          <p className="text-gray-600">Quản lý mệnh giá, nguồn khách hàng, nhân viên và mẫu nội dung voucher</p>
        </div>
        <Button onClick={handleSaveSettings}>
          <Save className="w-4 h-4 mr-2" />
          Lưu Cài Đặt
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'denominations', label: 'Mệnh Giá' },
            { key: 'sources', label: 'Nguồn KH' },
            { key: 'types', label: 'Loại KH' },
            { key: 'staff', label: 'Nhân Viên' },
            { key: 'templates', label: 'Mẫu Nội Dung' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'denominations' && (
        <DenominationManager 
          allowCustomValue={allowCustomValue}
          onAllowCustomValueChange={setAllowCustomValue}
        />
      )}
      {activeTab === 'sources' && <CustomerSourceManager />}
      {activeTab === 'types' && <CustomerTypeManager />}
      {activeTab === 'staff' && <StaffManager />}
      {activeTab === 'templates' && <TemplateManager />}
    </div>
  );
}
