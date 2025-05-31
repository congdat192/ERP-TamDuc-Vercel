
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import type { 
  VoucherDenomination, 
  CustomerSource, 
  CustomerType
} from '../types';
import { TemplateManager } from './TemplateManager';

// Mock data
const mockDenominations: VoucherDenomination[] = [
  { id: '1', value: 100000, label: '100.000đ', isActive: true, order: 1 },
  { id: '2', value: 250000, label: '250.000đ', isActive: true, order: 2 },
  { id: '3', value: 500000, label: '500.000đ', isActive: true, order: 3 },
  { id: '4', value: 1000000, label: '1.000.000đ', isActive: true, order: 4 },
];

const mockSources: CustomerSource[] = [
  { id: '1', name: 'Website', description: 'Khách hàng đăng ký từ website', isActive: true, order: 1 },
  { id: '2', name: 'Facebook', description: 'Khách hàng từ Facebook', isActive: true, order: 2 },
  { id: '3', name: 'Giới thiệu', description: 'Khách hàng được giới thiệu', isActive: true, order: 3 },
  { id: '4', name: 'Hotline', description: 'Khách hàng gọi hotline', isActive: false, order: 4 },
];

const mockTypes: CustomerType[] = [
  { id: '1', name: 'Khách hàng mới', description: 'Lần đầu sử dụng dịch vụ', isActive: true, order: 1 },
  { id: '2', name: 'Khách hàng thân thiết', description: 'Đã sử dụng dịch vụ > 5 lần', isActive: true, order: 2 },
  { id: '3', name: 'Khách hàng VIP', description: 'Khách hàng cao cấp', isActive: true, order: 3 },
];

export function VoucherSettingsConfig() {
  const [activeTab, setActiveTab] = useState<'denominations' | 'sources' | 'types' | 'templates'>('denominations');
  const [allowCustomValue, setAllowCustomValue] = useState(false);

  const renderDenominations = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Mệnh Giá Voucher</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="custom-value">Cho phép nhập giá trị tùy chỉnh</Label>
            <Switch
              id="custom-value"
              checked={allowCustomValue}
              onCheckedChange={setAllowCustomValue}
            />
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Thêm Mệnh Giá
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thứ Tự</TableHead>
              <TableHead>Giá Trị</TableHead>
              <TableHead>Nhãn Hiển Thị</TableHead>
              <TableHead>Trạng Thái</TableHead>
              <TableHead className="text-right">Thao Tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDenominations.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <span className="font-medium">{item.order}</span>
                    <Button variant="ghost" size="sm">
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {item.value.toLocaleString('vi-VN')} VNĐ
                </TableCell>
                <TableCell>{item.label}</TableCell>
                <TableCell>
                  <Switch checked={item.isActive} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderSources = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Nguồn Khách Hàng</CardTitle>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Thêm Nguồn
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thứ Tự</TableHead>
              <TableHead>Tên Nguồn</TableHead>
              <TableHead>Mô Tả</TableHead>
              <TableHead>Trạng Thái</TableHead>
              <TableHead className="text-right">Thao Tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockSources.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <span className="font-medium">{item.order}</span>
                    <Button variant="ghost" size="sm">
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <Switch checked={item.isActive} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderTypes = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Loại Khách Hàng</CardTitle>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Thêm Loại
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thứ Tự</TableHead>
              <TableHead>Tên Loại</TableHead>
              <TableHead>Mô Tả</TableHead>
              <TableHead>Trạng Thái</TableHead>
              <TableHead className="text-right">Thao Tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTypes.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <span className="font-medium">{item.order}</span>
                    <Button variant="ghost" size="sm">
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <Switch checked={item.isActive} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Cấu Hình Voucher</h3>
          <p className="text-gray-600">Quản lý mệnh giá, nguồn khách hàng và mẫu nội dung voucher</p>
        </div>
        <Button>
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
      {activeTab === 'denominations' && renderDenominations()}
      {activeTab === 'sources' && renderSources()}
      {activeTab === 'types' && renderTypes()}
      {activeTab === 'templates' && <TemplateManager />}
    </div>
  );
}
