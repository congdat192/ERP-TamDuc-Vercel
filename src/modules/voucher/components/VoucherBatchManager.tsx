
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit, 
  Copy, 
  Calendar,
  User,
  Info,
  CheckCircle,
  Play,
  Eye,
  Save,
  Settings
} from 'lucide-react';
import { VoucherBatch } from '../types/voucherBatch';
import { VoucherBatchSelector } from './VoucherBatchSelector';
import { voucherBatchService } from '../services/voucherBatchService';
import { toast } from '@/hooks/use-toast';

interface VoucherBatchManagerProps {
  onApplyBatch?: (batch: VoucherBatch) => void;
  onCreateBatch?: (name: string, description: string) => void;
}

type CodeGenerationMethod = 'manual' | 'preset';

export function VoucherBatchManager({ 
  onApplyBatch,
  onCreateBatch 
}: VoucherBatchManagerProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<VoucherBatch | null>(null);
  const [deleteBatchId, setDeleteBatchId] = useState<string>('');
  
  // Batch basic info
  const [batchName, setBatchName] = useState('');
  const [batchDescription, setBatchDescription] = useState('');
  
  // Voucher code configuration state
  const [selectedBatch, setSelectedBatch] = useState('');
  const [generationMethod, setGenerationMethod] = useState<CodeGenerationMethod>('manual');
  const [codeLength, setCodeLength] = useState(8);
  const [codePrefix, setCodePrefix] = useState('');
  const [codeSuffix, setCodeSuffix] = useState('');
  const [autoIssue, setAutoIssue] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Voucher batches state
  const [batches, setBatches] = useState<VoucherBatch[]>([]);

  // Load batches from localStorage on component mount
  useEffect(() => {
    const loadedBatches = voucherBatchService.getBatches();
    setBatches(loadedBatches);
  }, []);

  const generateCodePreview = () => {
    const remainingLength = Math.max(1, codeLength - codePrefix.length - (codeSuffix?.length || 0));
    const randomPart = 'X'.repeat(remainingLength);
    
    return `${codePrefix}${randomPart}${codeSuffix || ''}`;
  };

  const resetBatchForm = () => {
    setBatchName('');
    setBatchDescription('');
    setSelectedBatch('');
    setGenerationMethod('manual');
    setCodeLength(8);
    setCodePrefix('');
    setCodeSuffix('');
    setAutoIssue(false);
    setShowPreview(true);
  };

  const handleCreateBatch = () => {
    if (batchName.trim() && codePrefix.trim()) {
      const newBatch: VoucherBatch = {
        id: `batch-${Date.now()}`,
        name: batchName.trim(),
        description: batchDescription.trim(),
        codePrefix: codePrefix.trim().toUpperCase(),
        codeSuffix: codeSuffix?.trim().toUpperCase() || '',
        codeLength: codeLength,
        isActive: true,
        createdBy: 'Người dùng hiện tại',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to localStorage using voucherBatchService
      voucherBatchService.addBatch(newBatch);
      
      // Update local state
      setBatches([...batches, newBatch]);
      resetBatchForm();
      setIsCreateModalOpen(false);
      
      toast({
        title: "Tạo thành công",
        description: `Đợt phát hành "${batchName}" đã được tạo thành công.`
      });

      if (onCreateBatch) {
        onCreateBatch(batchName.trim(), batchDescription.trim());
      }
    }
  };

  const handleEditBatch = () => {
    if (editingBatch && editingBatch.name.trim() && editingBatch.codePrefix.trim()) {
      const updatedBatch = { 
        ...editingBatch, 
        codePrefix: editingBatch.codePrefix.trim().toUpperCase(),
        codeSuffix: editingBatch.codeSuffix?.trim().toUpperCase() || '',
        updatedAt: new Date().toISOString() 
      };
      
      // Update in localStorage
      voucherBatchService.updateBatch(updatedBatch.id, updatedBatch);
      
      // Update local state
      setBatches(batches.map(b => 
        b.id === editingBatch.id ? updatedBatch : b
      ));
      setIsEditModalOpen(false);
      setEditingBatch(null);
      
      toast({
        title: "Cập nhật thành công",
        description: `Đợt phát hành "${editingBatch.name}" đã được cập nhật.`
      });
    }
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

  const openEditModal = (batch: VoucherBatch) => {
    setEditingBatch({ ...batch });
    setIsEditModalOpen(true);
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

  const isFormValid = () => {
    return batchName.trim() && codePrefix.trim() && codeLength >= 4;
  };

  const renderVoucherCodeConfiguration = () => (
    <div className="space-y-6">
      {/* Bước 1: Thông tin cơ bản */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Bước 1
          </Badge>
          <h3 className="font-medium">Thông Tin Đợt Phát Hành</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="batch-name">Tên đợt phát hành *</Label>
            <Input
              id="batch-name"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              placeholder="VD: Đợt Tết 2024, Đợt VIP..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="batch-description">Mô tả</Label>
            <Textarea
              id="batch-description"
              value={batchDescription}
              onChange={(e) => setBatchDescription(e.target.value)}
              placeholder="Mô tả về đợt phát hành này..."
              className="mt-1"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Bước 2: Cấu hình mã voucher */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Bước 2
          </Badge>
          <h3 className="font-medium">Cấu Hình Mã Voucher</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="code-prefix">Ký tự đầu (Prefix) *</Label>
            <Input
              id="code-prefix"
              value={codePrefix}
              onChange={(e) => setCodePrefix(e.target.value.toUpperCase())}
              placeholder="VD: VCH, TET24"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="code-suffix">Ký tự cuối (Suffix)</Label>
            <Input
              id="code-suffix"
              value={codeSuffix}
              onChange={(e) => setCodeSuffix(e.target.value.toUpperCase())}
              placeholder="VD: X, END"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="code-length">Độ dài tổng</Label>
            <Input
              id="code-length"
              type="number"
              min="4"
              max="20"
              value={codeLength}
              onChange={(e) => setCodeLength(Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Tự động phát hành */}
      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="auto-issue" className="font-medium">Tự động phát hành voucher khi khởi tạo</Label>
            <p className="text-sm text-gray-600 mt-1">
              Tự động phát hành voucher ngay khi tạo mới, không cần duyệt thủ công.
            </p>
          </div>
          <Switch 
            id="auto-issue" 
            checked={autoIssue}
            onCheckedChange={setAutoIssue}
          />
        </div>
      </div>

      {/* Xem trước */}
      {showPreview && batchName && codePrefix && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-green-800">Xem Trước Cấu Hình</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {showPreview ? 'Ẩn' : 'Hiện'}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Tên đợt:</span>
                  <Badge variant="secondary" className="ml-2">{batchName}</Badge>
                </div>
                <div>
                  <span className="text-gray-600">Mã voucher mẫu:</span>
                  <code className="ml-2 bg-white px-2 py-1 rounded font-mono text-green-600 font-bold">
                    {generateCodePreview()}
                  </code>
                </div>
                <div>
                  <span className="text-gray-600">Prefix:</span>
                  <span className="ml-2 font-medium">{codePrefix || '(chưa nhập)'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Suffix:</span>
                  <span className="ml-2 font-medium">{codeSuffix || '(không có)'}</span>
                </div>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Form Validation Notice */}
      {!isFormValid() && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Info className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="text-sm">
              <div className="font-medium mb-1">Vui lòng hoàn thành các thông tin bắt buộc:</div>
              <ul className="list-disc list-inside space-y-1">
                {!batchName.trim() && <li>Nhập tên đợt phát hành</li>}
                {!codePrefix.trim() && <li>Nhập ký tự đầu (prefix)</li>}
                {codeLength < 4 && <li>Độ dài mã tối thiểu 4 ký tự</li>}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Quản Lý Đợt Phát Hành Voucher</span>
            </div>
            <Button onClick={() => {
              resetBatchForm();
              setIsCreateModalOpen(true);
            }} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Tạo mới
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Batches List */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 text-sm">Đợt Phát Hành Đã Lưu</h4>
            
            {batches.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Chưa có đợt phát hành nào được tạo</p>
                <p className="text-xs">Tạo đợt phát hành đầu tiên để cấu hình quy tắc tạo mã voucher</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {batches.map((batch) => (
                  <Card key={batch.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h5 className="font-medium text-gray-900">{batch.name}</h5>
                            <Badge variant="secondary" className="text-xs">
                              {batch.isActive ? 'Hoạt động' : 'Tạm dừng'}
                            </Badge>
                          </div>
                          
                          {batch.description && (
                            <p className="text-sm text-gray-600 mb-2">{batch.description}</p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-600 mb-2">
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
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
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
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Áp Dụng
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openEditModal(batch)}
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
                            className="text-red-600 hover:text-red-700"
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
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-1">Hướng Dẫn Sử Dụng</div>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Tạo đợt phát hành để cấu hình quy tắc tạo mã voucher (prefix, suffix, độ dài)</li>
                  <li>Áp dụng đợt phát hành để sử dụng cấu hình đã lưu khi tạo voucher</li>
                  <li>Mỗi đợt có quy tắc riêng về cách tạo mã voucher</li>
                  <li>Có thể sao chép và chỉnh sửa đợt phát hành để tạo biến thể mới</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Create Batch Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Tạo Đợt Phát Hành Mới</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {renderVoucherCodeConfiguration()}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateBatch} disabled={!isFormValid()}>
              <Save className="w-4 h-4 mr-2" />
              Tạo Đợt Phát Hành
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Batch Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="w-5 h-5" />
              <span>Chỉnh Sửa Đợt Phát Hành</span>
            </DialogTitle>
          </DialogHeader>
          {editingBatch && (
            <div className="space-y-6">
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">Thông Tin Đợt Phát Hành</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="edit-batch-name">Tên đợt phát hành *</Label>
                    <Input
                      id="edit-batch-name"
                      value={editingBatch.name}
                      onChange={(e) => setEditingBatch({ ...editingBatch, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-batch-description">Mô tả</Label>
                    <Textarea
                      id="edit-batch-description"
                      value={editingBatch.description || ''}
                      onChange={(e) => setEditingBatch({ ...editingBatch, description: e.target.value })}
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-gray-900">Cấu Hình Mã Voucher</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edit-code-prefix">Ký tự đầu (Prefix) *</Label>
                    <Input
                      id="edit-code-prefix"
                      value={editingBatch.codePrefix}
                      onChange={(e) => setEditingBatch({ ...editingBatch, codePrefix: e.target.value.toUpperCase() })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-code-suffix">Ký tự cuối (Suffix)</Label>
                    <Input
                      id="edit-code-suffix"
                      value={editingBatch.codeSuffix || ''}
                      onChange={(e) => setEditingBatch({ ...editingBatch, codeSuffix: e.target.value.toUpperCase() })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-code-length">Độ dài tổng</Label>
                    <Input
                      id="edit-code-length"
                      type="number"
                      min="4"
                      max="20"
                      value={editingBatch.codeLength}
                      onChange={(e) => setEditingBatch({ ...editingBatch, codeLength: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditBatch}>
              <Save className="w-4 h-4 mr-2" />
              Lưu Thay Đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác Nhận Xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đợt phát hành này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBatch} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
