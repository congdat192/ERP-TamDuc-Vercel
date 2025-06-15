import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Key, Plus, Eye, EyeOff, Copy, RefreshCw, Trash2, Settings, Webhook } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function APISettings() {
  const { toast } = useToast();
  const [showKey, setShowKey] = useState<string | null>(null);
  
  const [apiKeys, setApiKeys] = useState([
    {
      id: '1',
      name: 'Mobile App API',
      key: 'erp_live_sk_1234567890abcdef',
      permissions: ['read:customers', 'write:orders'],
      lastUsed: '2024-05-29 14:30',
      status: 'active'
    },
    {
      id: '2',
      name: 'Website Integration',
      key: 'erp_live_sk_abcdef1234567890',
      permissions: ['read:products', 'read:inventory'],
      lastUsed: '2024-05-28 10:15',
      status: 'active'
    }
  ]);

  const handleCreateKey = () => {
    toast({
      title: 'API Key được tạo thành công',
      description: 'API key mới đã được thêm vào danh sách.'
    });
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: 'Đã sao chép',
      description: 'API key đã được sao chép vào clipboard.'
    });
  };

  const handleToggleVisibility = (keyId: string) => {
    setShowKey(showKey === keyId ? null : keyId);
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + '•'.repeat(20) + key.substring(key.length - 3);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">API Keys & Webhooks</h3>
          <p className="text-gray-600">Quản lý API keys để các ứng dụng bên ngoài kết nối với ERP của bạn</p>
        </div>
        <Button onClick={handleCreateKey} className="voucher-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          Tạo API Key
        </Button>
      </div>

      {/* API Keys Management */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-voucher-primary-600" />
            <span className="text-gray-900">Danh Sách API Keys ({apiKeys.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-900">Tên</TableHead>
                  <TableHead className="text-gray-900">API Key</TableHead>
                  <TableHead className="text-gray-900">Quyền</TableHead>
                  <TableHead className="text-gray-900">Lần Sử Dụng Cuối</TableHead>
                  <TableHead className="text-gray-900">Trạng Thái</TableHead>
                  <TableHead className="text-gray-900">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium text-gray-900">{apiKey.name}</TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span>
                          {showKey === apiKey.id ? apiKey.key : maskKey(apiKey.key)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleVisibility(apiKey.id)}
                          className="text-gray-700 hover:bg-gray-100"
                        >
                          {showKey === apiKey.id ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyKey(apiKey.key)}
                          className="text-gray-700 hover:bg-gray-100"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {apiKey.permissions.map((permission) => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{apiKey.lastUsed}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={apiKey.status === 'active' ? 'success' : 'destructive'}
                        className="capitalize"
                      >
                        {apiKey.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100">
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Configuration */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Webhook className="w-5 h-5 text-voucher-secondary-600" />
            <span className="text-gray-900">Webhook Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-voucher-primary-50 border border-voucher-primary-200">
            <h4 className="font-medium text-voucher-primary-700 mb-2">Webhook Endpoints</h4>
            <p className="text-sm text-gray-600 mb-4">
              Cấu hình webhook để nhận thông báo real-time khi có sự kiện trong hệ thống
            </p>
            <Button variant="outline" className="voucher-button-secondary">
              Cấu Hình Webhook
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
