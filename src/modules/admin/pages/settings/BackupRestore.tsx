
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Save, Download, Upload, Database, Clock, FileText } from 'lucide-react';

export function BackupRestore() {
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');

  const handleExportData = () => {
    toast({
      title: "Xuất Dữ Liệu Thành Công",
      description: "File backup đã được tải xuống.",
    });
  };

  const handleImportData = () => {
    toast({
      title: "Nhập Dữ Liệu Thành Công",
      description: "Dữ liệu đã được khôi phục từ file backup.",
    });
  };

  const mockBackupHistory = [
    { id: 1, date: '2024-01-15 02:00:00', size: '25.6 MB', type: 'Tự động', status: 'Thành công' },
    { id: 2, date: '2024-01-14 02:00:00', size: '24.8 MB', type: 'Tự động', status: 'Thành công' },
    { id: 3, date: '2024-01-13 15:30:00', size: '23.2 MB', type: 'Thủ công', status: 'Thành công' },
    { id: 4, date: '2024-01-13 02:00:00', size: '22.9 MB', type: 'Tự động', status: 'Lỗi' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Sao Lưu & Khôi Phục</h2>
        <p className="text-gray-600">Quản lý backup dữ liệu và khôi phục hệ thống</p>
      </div>

      {/* Manual Backup/Restore */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Sao Lưu & Khôi Phục Thủ Công</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Xuất Dữ Liệu</h4>
              <p className="text-sm text-gray-600">
                Tạo file backup chứa tất cả dữ liệu hệ thống
              </p>
              <Button onClick={handleExportData} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Xuất Dữ Liệu
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Nhập Dữ Liệu</h4>
              <p className="text-sm text-gray-600">
                Khôi phục dữ liệu từ file backup
              </p>
              <div className="space-y-2">
                <Input type="file" accept=".sql,.json,.zip" />
                <Button onClick={handleImportData} variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Nhập Dữ Liệu
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Sao Lưu Tự Động</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Kích Hoạt Sao Lưu Tự Động</h4>
              <p className="text-sm text-gray-600">Tự động sao lưu dữ liệu theo lịch</p>
            </div>
            <Switch
              checked={autoBackup}
              onCheckedChange={setAutoBackup}
            />
          </div>

          {autoBackup && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="frequency">Tần Suất Sao Lưu</Label>
                <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Mỗi giờ</SelectItem>
                    <SelectItem value="daily">Hàng ngày</SelectItem>
                    <SelectItem value="weekly">Hàng tuần</SelectItem>
                    <SelectItem value="monthly">Hàng tháng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backupTime">Thời Gian Sao Lưu</Label>
                <Input
                  id="backupTime"
                  type="time"
                  defaultValue="02:00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retentionDays">Lưu Trữ (ngày)</Label>
                <Input
                  id="retentionDays"
                  type="number"
                  defaultValue="30"
                  placeholder="30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxBackups">Số Backup Tối Đa</Label>
                <Input
                  id="maxBackups"
                  type="number"
                  defaultValue="10"
                  placeholder="10"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Lịch Sử Sao Lưu</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockBackupHistory.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{backup.date}</p>
                    <p className="text-sm text-gray-600">
                      {backup.size} • {backup.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge 
                    variant={backup.status === 'Thành công' ? 'default' : 'destructive'}
                    className={backup.status === 'Thành công' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {backup.status}
                  </Badge>
                  {backup.status === 'Thành công' && (
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Tải Về
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Lưu Cài Đặt
        </Button>
      </div>
    </div>
  );
}
