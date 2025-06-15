
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Key, Plus, Copy, Eye, EyeOff, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed: string;
  createdDate: string;
  status: 'active' | 'disabled';
}

const mockAPIKeys: APIKey[] = [
  {
    id: '1',
    name: 'Mobile App API',
    key: 'erp_live_sk_123456789abcdef',
    permissions: ['read:customers', 'write:orders'],
    lastUsed: '2024-05-29 14:30',
    createdDate: '2024-03-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Website Integration',
    key: 'erp_live_sk_987654321fedcba',
    permissions: ['read:products', 'read:inventory'],
    lastUsed: '2024-05-28 10:15',
    createdDate: '2024-04-01',
    status: 'active'
  }
];

export function APISettings() {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<APIKey[]>(mockAPIKeys);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [newAPIKey, setNewAPIKey] = useState({
    name: '',
    permissions: [] as string[]
  });

  const availablePermissions = [
    'read:customers', 'write:customers',
    'read:products', 'write:products',
    'read:orders', 'write:orders',
    'read:inventory', 'write:inventory',
    'read:reports', 'admin:all'
  ];

  const handleCreateAPIKey = () => {
    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newAPIKey.name,
      key: `erp_live_sk_${Math.random().toString(36).substring(2, 15)}`,
      permissions: newAPIKey.permissions,
      lastUsed: 'Chưa sử dụng',
      createdDate: new Date().toLocaleDateString('vi-VN'),
      status: 'active'
    };

    setApiKeys(prev => [...prev, newKey]);
    setIsCreateModalOpen(false);
    setNewAPIKey({ name: '', permissions: [] });
    
    toast({
      title: 'Tạo API Key thành công',
      description: 'API Key mới đã được tạo và có thể sử dụng ngay.'
    });
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: 'Đã sao chép',
      description: 'API Key đã được sao chép vào clipboard.'
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const handleDeleteKey = (keyId: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== keyId));
    toast({
      title: 'Đã xóa API Key',
      description: 'API Key đã được xóa khỏi hệ thống.'
    });
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + '•'.repeat(20) + key.substring(key.length - 4);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">API Keys & Webhooks</h3>
          <p className="text-gray-600">Quản lý API keys để các ứng dụng bên ngoài kết nối với ERP của bạn</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Tạo API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tạo API Key Mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tên API Key</Label>
                <Input
                  placeholder="Ví dụ: Mobile App API"
                  value={newAPIKey.name}
                  onChange={(e) => setNewAPIKey(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Quyền Truy Cập</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {availablePermissions.map(permission => (
                    <label key={permission} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={newAPIKey.permissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewAPIKey(prev => ({
                              ...prev,
                              permissions: [...prev.permissions, permission]
                            }));
                          } else {
                            setNewAPIKey(prev => ({
                              ...prev,
                              permissions: prev.permissions.filter(p => p !== permission)
                            }));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span>{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button onClick={handleCreateAPIKey} className="flex-1">
                  Tạo API Key
                </Button>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Hủy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Keys Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-blue-600" />
            <span>Danh Sách API Keys ({apiKeys.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Quyền</TableHead>
                <TableHead>Lần Sử Dụng Cuối</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyKey(apiKey.key)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {apiKey.permissions.slice(0, 2).map(permission => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                      {apiKey.permissions.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{apiKey.permissions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{apiKey.lastUsed}</TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        apiKey.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {apiKey.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteKey(apiKey.id)}
                      >
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

      {/* Webhook Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Webhook Endpoints</h4>
              <p className="text-sm text-blue-700 mb-3">
                Cấu hình webhook để nhận thông báo real-time khi có sự kiện trong hệ thống
              </p>
              <Button variant="outline" size="sm">
                Cấu Hình Webhook
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
