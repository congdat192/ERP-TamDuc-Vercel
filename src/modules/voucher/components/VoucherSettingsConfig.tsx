
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Save,
  ArrowUp,
  ArrowDown,
  Copy,
  HelpCircle
} from 'lucide-react';
import type { 
  VoucherDenomination, 
  CustomerSource, 
  CustomerType, 
  VoucherTemplate,
  TemplateVariable
} from '../types';
import { TEMPLATE_VARIABLES } from '../types';

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

const mockTemplates: VoucherTemplate[] = [
  {
    id: '1',
    name: 'Mẫu Mặc Định',
    content: 'Xin chào $tenKH,\n\nBạn đã nhận được voucher $mavoucher trị giá $giatri.\nSố điện thoại: $sdt\nHạn sử dụng: $hansudung\nNhân viên phát hành: $nhanvien\n\nCảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!',
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  }
];

export function VoucherSettingsConfig() {
  const [activeTab, setActiveTab] = useState<'denominations' | 'sources' | 'types' | 'templates'>('denominations');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [allowCustomValue, setAllowCustomValue] = useState(false);
  const [templateContent, setTemplateContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const insertVariable = (variable: TemplateVariable) => {
    const textarea = document.getElementById('template-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = templateContent.substring(0, start) + variable.key + templateContent.substring(end);
      setTemplateContent(newContent);
      // Reset cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.key.length, start + variable.key.length);
      }, 0);
    }
  };

  const previewTemplate = (content: string) => {
    return content
      .replace(/\$tenKH/g, 'Nguyễn Văn An')
      .replace(/\$mavoucher/g, 'VCH-2024-001234')
      .replace(/\$sdt/g, '0901234567')
      .replace(/\$hansudung/g, '31/12/2024')
      .replace(/\$nhanvien/g, 'Trần Thị Lan');
  };

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
          <Button size="sm" onClick={() => {
            setEditingItem(null);
            setIsDialogOpen(true);
          }}>
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
        <Button size="sm" onClick={() => {
          setEditingItem(null);
          setIsDialogOpen(true);
        }}>
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
        <Button size="sm" onClick={() => {
          setEditingItem(null);
          setIsDialogOpen(true);
        }}>
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

  const renderTemplates = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Mẫu Nội Dung Voucher</CardTitle>
        <Button size="sm" onClick={() => {
          setEditingItem(null);
          setTemplateContent('');
          setIsDialogOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm Mẫu
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTemplates.map((template) => (
            <Card key={template.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium">{template.name}</h4>
                    {template.isDefault && (
                      <Badge variant="default">Mặc Định</Badge>
                    )}
                    <Badge variant={template.isActive ? 'default' : 'secondary'}>
                      {template.isActive ? 'Hoạt Động' : 'Tạm Dừng'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border max-h-32 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-mono text-xs">
                      {template.content}
                    </pre>
                  </div>
                </div>
                <div className="flex space-x-1 ml-4">
                  <Button variant="ghost" size="sm" onClick={() => setShowPreview(true)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
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
      {activeTab === 'templates' && renderTemplates()}

      {/* Template Variables Helper */}
      {activeTab === 'templates' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5" />
              <span>Biến Có Thể Sử Dụng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEMPLATE_VARIABLES.map((variable) => (
                <div key={variable.key} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {variable.key}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertVariable(variable)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{variable.label}</div>
                    <div className="text-gray-600 text-xs">{variable.description}</div>
                    <div className="text-gray-500 text-xs italic">VD: {variable.placeholder}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Xem Trước Mẫu Voucher</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Nội Dung Voucher (Với Dữ Liệu Mẫu)</h4>
              <div className="text-sm bg-white p-3 rounded border">
                <pre className="whitespace-pre-wrap">
                  {previewTemplate(mockTemplates[0]?.content || '')}
                </pre>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
