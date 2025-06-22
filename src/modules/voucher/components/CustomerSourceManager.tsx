
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CustomerSource {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

// Consistent mock data for customer sources
const mockCustomerSources: CustomerSource[] = [
  {
    id: '1',
    name: 'Website',
    description: 'Khách hàng từ website chính thức',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2', 
    name: 'Facebook',
    description: 'Khách hàng từ Facebook fanpage',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Zalo',
    description: 'Khách hàng từ Zalo OA',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Giới thiệu',
    description: 'Khách hàng được giới thiệu',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Tại cửa hàng',
    description: 'Khách hàng đến trực tiếp cửa hàng',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

export function CustomerSourceManager() {
  const [sources, setSources] = useState<CustomerSource[]>(mockCustomerSources);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<CustomerSource | null>(null);
  const [deleteSourceId, setDeleteSourceId] = useState<string>('');

  // Form states
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const handleCreateSource = () => {
    if (!formName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên nguồn khách hàng",
        variant: "destructive"
      });
      return;
    }

    const newSource: CustomerSource = {
      id: Date.now().toString(),
      name: formName.trim(),
      description: formDescription.trim(),
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setSources([...sources, newSource]);
    setFormName('');
    setFormDescription('');
    setIsCreateDialogOpen(false);

    toast({
      title: "Thành công",
      description: `Đã thêm nguồn khách hàng "${newSource.name}"`,
    });
  };

  const handleEditSource = () => {
    if (!selectedSource || !formName.trim()) return;

    const updatedSource = {
      ...selectedSource,
      name: formName.trim(),
      description: formDescription.trim()
    };

    setSources(sources.map(source => 
      source.id === selectedSource.id ? updatedSource : source
    ));

    setIsEditDialogOpen(false);
    setSelectedSource(null);
    setFormName('');
    setFormDescription('');

    toast({
      title: "Thành công",
      description: `Đã cập nhật nguồn khách hàng "${updatedSource.name}"`,
    });
  };

  const handleDeleteSource = () => {
    const sourceToDelete = sources.find(s => s.id === deleteSourceId);
    setSources(sources.filter(s => s.id !== deleteSourceId));
    setIsDeleteDialogOpen(false);
    setDeleteSourceId('');

    toast({
      title: "Thành công",
      description: `Đã xóa nguồn khách hàng "${sourceToDelete?.name}"`,
    });
  };

  const toggleSourceStatus = (sourceId: string) => {
    setSources(sources.map(source => 
      source.id === sourceId ? { ...source, isActive: !source.isActive } : source
    ));
  };

  const openEditDialog = (source: CustomerSource) => {
    setSelectedSource(source);
    setFormName(source.name);
    setFormDescription(source.description || '');
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    setFormName('');
    setFormDescription('');
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card className="voucher-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 theme-text-primary" />
            <span className="theme-text">Nguồn Khách Hàng</span>
          </CardTitle>
          <Button onClick={openCreateDialog} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Thêm Nguồn
          </Button>
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
              {sources.map((source) => (
                <TableRow key={source.id}>
                  <TableCell className="font-medium theme-text">{source.name}</TableCell>
                  <TableCell className="theme-text-muted text-sm">
                    {source.description || '-'}
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={source.isActive}
                      onCheckedChange={() => toggleSourceStatus(source.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(source)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          setDeleteSourceId(source.id);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {sources.length === 0 && (
            <div className="text-center py-8 theme-text-muted">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Chưa có nguồn khách hàng nào được thêm</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="voucher-card">
          <DialogHeader>
            <DialogTitle className="theme-text">Thêm Nguồn Khách Hàng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="source-name">Tên nguồn</Label>
              <Input
                id="source-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="VD: Website, Facebook, Zalo..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source-description">Mô tả</Label>
              <Input
                id="source-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Mô tả về nguồn khách hàng này..."
              />
            </div>
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleCreateSource} className="flex-1">
                Thêm Nguồn
              </Button>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="voucher-card">
          <DialogHeader>
            <DialogTitle className="theme-text">Chỉnh Sửa Nguồn Khách Hàng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-source-name">Tên nguồn</Label>
              <Input
                id="edit-source-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="VD: Website, Facebook, Zalo..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-source-description">Mô tả</Label>
              <Input
                id="edit-source-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Mô tả về nguồn khách hàng này..."
              />
            </div>
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleEditSource} className="flex-1">
                Cập Nhật
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="voucher-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="theme-text">Xác Nhận Xóa</AlertDialogTitle>
            <AlertDialogDescription className="theme-text-muted">
              Bạn có chắc chắn muốn xóa nguồn khách hàng này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSource}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
