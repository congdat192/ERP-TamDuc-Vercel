
import { useState } from 'react';
import { VoucherSettingsConfig } from '../components/VoucherSettingsConfig';
import { VoucherBatchManager } from '../components/VoucherBatchManager';

export default function VoucherSettings() {
  const [activeTab, setActiveTab] = useState<'condition-templates' | 'voucher-config'>('condition-templates');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài Đặt Voucher</h1>
          <p className="text-gray-600 mt-1">
            Quản lý cấu hình và quy tắc phát hành voucher
          </p>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('condition-templates')}
              className={`flex-1 text-center py-4 px-4 border-b-2 transition-colors ${
                activeTab === 'condition-templates'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">📋</span>
                <span className="text-xs text-center leading-tight">Cấu hình đợt phát hành voucher</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('voucher-config')}
              className={`flex-1 text-center py-4 px-4 border-b-2 transition-colors ${
                activeTab === 'voucher-config'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">⚙️</span>
                <span className="text-xs text-center leading-tight">Cấu Hình Hệ Thống</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'condition-templates' && <VoucherBatchManager />}
          {activeTab === 'voucher-config' && <VoucherSettingsConfig />}
        </div>
      </div>
    </div>
  );
}
