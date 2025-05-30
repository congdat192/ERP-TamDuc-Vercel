
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Upload,
  Database,
  Mail,
  Palette
} from 'lucide-react';

const mockCustomerSources = [
  { id: 1, name: 'Website', description: 'Khách hàng đăng ký từ website', active: true },
  { id: 2, name: 'Facebook', description: 'Khách hàng từ Facebook', active: true },
  { id: 3, name: 'Giới thiệu', description: 'Khách hàng được giới thiệu', active: true },
  { id: 4, name: 'Hotline', description: 'Khách hàng gọi hotline', active: false },
];

const mockCustomerTypes = [
  { id: 1, name: 'Khách hàng mới', description: 'Lần đầu sử dụng dịch vụ', active: true },
  { id: 2, name: 'Khách hàng thân thiết', description: 'Đã sử dụng dịch vụ > 5 lần', active: true },
  { id: 3, name: 'Khách hàng VIP', description: 'Khách hàng cao cấp', active: true },
];

const mockVoucherValues = [
  { id: 1, value: 50000, description: 'Voucher 50K', active: true },
  { id: 2, value: 100000, description: 'Voucher 100K', active: true },
  { id: 3, value: 200000, description: 'Voucher 200K', active: true },
  { id: 4, value: 500000, description: 'Voucher 500K', active: false },
];

export function SystemSettings() {
  const [isSourceDialogOpen, setIsSourceDialogOpen] = useState(false);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [isValueDialogOpen, setIsValueDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cài Đặt Hệ Thống</h2>
          <p className="text-gray-600">Quản lý cấu hình và tham số hệ thống voucher</p>
        </div>
        
        <Button className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          Lưu Tất Cả
        </Button>
      </div>

      <Tabs defaultValue="voucher-config" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="voucher-config">Cấu Hình Voucher</TabsTrigger>
          <TabsTrigger value="system-settings">Cài Đặt Chung</TabsTrigger>
          <TabsTrigger value="email-templates">Mẫu Email</TabsTrigger>
          <TabsTrigger value="ui-settings">Giao Diện</TabsTrigger>
        </TabsList>

        <TabsContent value="voucher-config" className="space-y-6">
          {/* Customer Sources */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Nguồn Khách Hàng</span>
              </CardTitle>
              <Dialog open={isSourceDialogOpen} onOpenChange={setIsSourceDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm Nguồn
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Thêm Nguồn Khách Hàng</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tên nguồn</Label>
                      <Input placeholder="VD: TikTok, Zalo..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Mô tả</Label>
                      <Input placeholder="Mô tả chi tiết nguồn khách hàng" />
                    </div>
                    <div className="flex space-x-2 pt-4">
                      <Button className="flex-1">Thêm Nguồn</Button>
                      <Button variant="outline" onClick={() => setIsSourceDialogOpen(false)}>
                        Hủy
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên Nguồn</TableHead>
                    <TableHead>Mô Tả</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead className="text-right">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCustomerSources.map((source) => (
                    <TableRow key={source.id}>
                      <TableCell className="font-medium">{source.name}</TableCell>
                      <TableCell>{source.description}</TableCell>
                      <TableCell>
                        <Switch checked={source.active} />
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

          {/* Customer Types */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Loại Khách Hàng</CardTitle>
              <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm Loại
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Thêm Loại Khách Hàng</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tên loại khách hàng</Label>
                      <Input placeholder="VD: Khách hàng doanh nghiệp..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Mô tả</Label>
                      <Input placeholder="Mô tả chi tiết loại khách hàng" />
                    </div>
                    <div className="flex space-x-2 pt-4">
                      <Button className="flex-1">Thêm Loại</Button>
                      <Button variant="outline" onClick={() => setIsTypeDialogOpen(false)}>
                        Hủy
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên Loại</TableHead>
                    <TableHead>Mô Tả</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead className="text-right">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCustomerTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell>{type.description}</TableCell>
                      <TableCell>
                        <Switch checked={type.active} />
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

          {/* Voucher Values */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Mệnh Giá Voucher</CardTitle>
              <Dialog open={isValueDialogOpen} onOpenChange={setIsValueDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm Mệnh Giá
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Thêm Mệnh Giá Voucher</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Giá trị (VNĐ)</Label>
                      <Input type="number" placeholder="300000" />
                    </div>
                    <div className="space-y-2">
                      <Label>Mô tả</Label>
                      <Input placeholder="VD: Voucher 300K" />
                    </div>
                    <div className="flex space-x-2 pt-4">
                      <Button className="flex-1">Thêm Mệnh Giá</Button>
                      <Button variant="outline" onClick={() => setIsValueDialogOpen(false)}>
                        Hủy
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Giá Trị</TableHead>
                    <TableHead>Mô Tả</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead className="text-right">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVoucherValues.map((value) => (
                    <TableRow key={value.id}>
                      <TableCell className="font-medium">
                        {value.value.toLocaleString('vi-VN')} VNĐ
                      </TableCell>
                      <TableCell>{value.description}</TableCell>
                      <TableCell>
                        <Switch checked={value.active} />
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
        </TabsContent>

        <TabsContent value="system-settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chính Sách Voucher</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Thời hạn voucher mặc định (ngày)</Label>
                  <Input type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label>Số lượng voucher tối đa/ngày</Label>
                  <Input type="number" defaultValue="100" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Cho phép phát hành lại voucher</h4>
                    <p className="text-sm text-gray-600">Khách hàng có thể nhận nhiều voucher</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Cảnh báo voucher sắp hết hạn</h4>
                    <p className="text-sm text-gray-600">Hiển thị thông báo trước 3 ngày</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Tự động gia hạn voucher</h4>
                    <p className="text-sm text-gray-600">Gia hạn voucher chưa sử dụng</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email-templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Mẫu Email Thông Báo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tiêu đề email phát hành voucher</Label>
                  <Input defaultValue="🎉 Bạn đã nhận được voucher từ [COMPANY_NAME]" />
                </div>
                
                <div className="space-y-2">
                  <Label>Nội dung email phát hành voucher</Label>
                  <textarea 
                    className="w-full h-32 p-3 border border-gray-300 rounded-md"
                    defaultValue="Chào [CUSTOMER_NAME],&#10;&#10;Bạn đã nhận được voucher trị giá [VOUCHER_VALUE] VNĐ.&#10;Mã voucher: [VOUCHER_CODE]&#10;Hạn sử dụng: [EXPIRY_DATE]&#10;&#10;Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Tiêu đề email cảnh báo hết hạn</Label>
                  <Input defaultValue="⚠️ Voucher của bạn sắp hết hạn" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ui-settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Tùy Chỉnh Giao Diện</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Tên công ty</Label>
                  <Input defaultValue="VoucherCRM Pro" />
                </div>
                <div className="space-y-2">
                  <Label>Slogan công ty</Label>
                  <Input defaultValue="Giải pháp quản lý voucher chuyên nghiệp" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Logo công ty</Label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Tải lên logo
                      </Button>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG tối đa 2MB</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Màu chủ đạo</Label>
                  <div className="flex space-x-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg border-2 border-blue-600"></div>
                    <div className="w-10 h-10 bg-green-600 rounded-lg border-2 border-gray-300"></div>
                    <div className="w-10 h-10 bg-purple-600 rounded-lg border-2 border-gray-300"></div>
                    <div className="w-10 h-10 bg-red-600 rounded-lg border-2 border-gray-300"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
