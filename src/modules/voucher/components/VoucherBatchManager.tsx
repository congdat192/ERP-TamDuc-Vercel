
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit, 
  Copy, 
  Calendar,
  User,
  Info,
  Play,
  Settings,
  Star,
  StarOff
} from 'lucide-react';
import { VoucherBatch } from '../types/voucherBatch';
import { voucherBatchService } from '../services/voucherBatchService';
import { CreateVoucherBatchForm } from './CreateVoucherBatchForm';
import { EditVoucherBatchForm } from './EditVoucherBatchForm';
import { toast } from '@/hooks/use-toast';

interface VoucherBatchManagerProps {
  onApplyBatch?: (batch: VoucherBatch) => void;
  onCreateBatch?: (name: string, description: string) => void;
}

export function VoucherBatchManager({ 
  onApplyBatch,
  onCreateBatch 
}: VoucherBatchManagerProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteBatchId, setDeleteBatchId] = useState<string>('');
  const [editingBatch, setEditingBatch] = useState<VoucherBatch | null>(null);
  
  // Voucher batches state
  const [batches, setBatches] = useState<VoucherBatch[]>([]);

  // Load batches from localStorage on component mount
  useEffect(() => {
    const loadedBatches = voucherBatchService.getBatches();
    setBatches(loadedBatches);
  }, []);

  const handleCreateBatch = (batch: VoucherBatch, config: any) => {
    // Save to localStorage using voucherBatchService
    voucherBatchService.addBatch(batch);
    
    // Update local state
    setBatches([...batches, batch]);
    setIsCreateModalOpen(false);
    
    console.log('Created batch with config:', { batch, config });

    if (onCreateBatch) {
      onCreateBatch(batch.name, batch.description || '');
    }
  };

  const handleEditBatch = (updatedBatch: VoucherBatch) => {
    voucherBatchService.updateBatch(updatedBatch.id, updatedBatch);
    setBatches(batches.map(b => b.id === updatedBatch.id ? updatedBatch : b));
    setIsEditModalOpen(false);
    setEditingBatch(null);
    
    toast({
      title: "Cập nhật thành công",
      description: `Đợt "${updatedBatch.name}" đã được cập nhật.`,
    });
  };

  const handleApplyBatch = (batch: VoucherBatch) => {
    toast({
      title: "Áp dụng đợt phát hành",
      description: `Đợt "${batch.name}" đã được áp dụng thành công.`,
      duration: 3000
    });

    if (onApplyBatch) {
      onApplyBatch(batch);
    }
  };

  const handleDuplicateBatch = (batch: VoucherBatch) => {
    const duplicatedBatch: VoucherBatch = {
      ...batch,
      id: `batch-${Date.now()}`,
      name: `${batch.name} (Bản sao)`,
      isDefault: false,
      createdBy: 'Người dùng hiện tại',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to localStorage
    voucherBatchService.addBatch(duplicatedBatch);
    
    // Update local state
    setBatches([...batches, duplicatedBatch]);
    
    toast({
      title: "Sao chép thành công",
      description: `Đợt "${batch.name}" đã được sao chép.`
    });
  };

  const handleDeleteBatch = () => {
    const batchToDelete = batches.find(b => b.id === deleteBatchId);
    
    // Remove from localStorage
    voucherBatchService.deleteBatch(deleteBatchId);
    
    // Update local state
    setBatches(batches.filter(b => b.id !== deleteBatchId));
    setIsDeleteDialogOpen(false);
    setDeleteBatchId('');
    
    toast({
      title: "Xóa thành công",
      description: `Đợt "${batchToDelete?.name}" đã được xóa.`
    });
  };

  const handleSetDefault = (batchId: string) => {
    const updatedBatches = voucherBatchService.setDefaultBatch(batchId);
    setBatches(updatedBatches);
    
    const batchName = batches.find(b => b.id === batchId)?.name;
    toast({
      title: "Đặt làm mặc định",
      description: `Đợt "${batchName}" đã được đặt làm mặc định.`
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <Card className="voucher-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 theme-text-primary" />
              <span className="theme-text">Quản Lý Đợt Phát Hành Voucher</span>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)} 
              size="sm"
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Đợt Mới</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Batches List */}
          <div className="space-y-3">
            <h4 className="font-medium theme-text text-sm">Đợt Phát Hành Đã Lưu</h4>
            
            {batches.length === 0 ? (
              <div className="text-center py-8 theme-text-muted">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Chưa có đợt phát hành nào được tạo</p>
                <p className="text-xs mt-1">Tạo đợt phát hành đầu tiên để cấu hình quy tắc tạo mã voucher</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {batches.map((batch) => (
                  <Card key={batch.id} className="voucher-card border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h5 className="font-medium theme-text">{batch.name}</h5>
                            <Badge 
                              variant={batch.isActive ? "default" : "secondary"} 
                              className={batch.isActive ? "theme-badge-primary" : "theme-badge-secondary"}
                            >
                              {batch.isActive ? 'Hoạt động' : 'Tạm dừng'}
                            </Badge>
                            {batch.isDefault && (
                              <Badge variant="outline" className="theme-badge-warning">
                                <Star className="w-3 h-3 mr-1" />
                                Mặc định
                              </Badge>
                            )}
                          </div>
                          
                          {batch.description && (
                            <p className="text-sm theme-text-muted mb-2">{batch.description}</p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-xs theme-text-muted mb-2">
                            <div>
                              <span className="font-medium">Prefix:</span> {batch.codePrefix}
                            </div>
                            <div>
                              <span className="font-medium">Suffix:</span> {batch.codeSuffix || '(không có)'}
                            </div>
                            <div>
                              <span className="font-medium">Độ dài:</span> {batch.codeLength}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-xs theme-text-muted">
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{batch.createdBy}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(batch.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-1 ml-4">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApplyBatch(batch)}
                            className="berry-success text-white hover:opacity-90"
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Áp Dụng
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(batch.id)}
                            disabled={batch.isDefault}
                            className={batch.isDefault ? 'opacity-50' : ''}
                          >
                            {batch.isDefault ? <Star className="w-3 h-3 text-yellow-500" /> : <StarOff className="w-3 h-3" />}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingBatch(batch);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDuplicateBatch(batch)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                            onClick={() => {
                              setDeleteBatchId(batch.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Usage Instructions */}
          <Alert className="voucher-alert-info">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="text-sm">
                <div className="font-medium theme-text mb-1">Hướng Dẫn Sử Dụng</div>
                <ul className="list-disc list-inside space-y-1 theme-text-muted">
                  <li>Tạo đợt phát hành để cấu hình quy tắc tạo mã voucher với mapping phức tạp</li>
                  <li>Liên kết với đợt phát hành từ KiotViet để đồng bộ dữ liệu</li>
                  <li>Áp dụng đợt phát hành để sử dụng cấu hình đã lưu khi tạo voucher</li>
                  <li>Đặt đợt phát hành làm mặc định để tự động chọn khi cấp voucher</li>
                  <li>Có thể sao chép và chỉnh sửa đợt phát hành để tạo biến thể mới</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Create Batch Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 theme-text-primary" />
              <span className="theme-text">Tạo Đợt Phát Hành Mới</span>
            </DialogTitle>
          </DialogHeader>
          <CreateVoucherBatchForm
            onSave={handleCreateBatch}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Batch Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="w-5 h-5 theme-text-primary" />
              <span className="theme-text">Chỉnh Sửa Đợt Phát Hành</span>
            </DialogTitle>
          </DialogHeader>
          {editingBatch && (
            <EditVoucherBatchForm
              batch={editingBatch}
              onSave={handleEditBatch}
              onCancel={() => {
                setIsEditModalOpen(false);
                setEditingBatch(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="voucher-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="theme-text">Xác Nhận Xóa</AlertDialogTitle>
            <AlertDialogDescription className="theme-text-muted">
              Bạn có chắc chắn muốn xóa đợt phát hành này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteBatch} 
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
