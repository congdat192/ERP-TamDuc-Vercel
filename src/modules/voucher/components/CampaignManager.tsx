
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2,
  Copy,
  Zap,
  Eye,
  Settings
} from 'lucide-react';
import { 
  mockStaff, 
  mockCustomerSources, 
  mockCustomerTypes, 
  mockVoucherDenominations,
  getStaffById,
  getCustomerSourceById,
  getCustomerTypeById,
  getDenominationById
} from '../data/mockData';

interface CampaignBatch {
  id: string;
  name: string;
  description: string;
  staffId: string;
  customerSourceId: string;
  customerTypeId: string;
  denominationId: string;
  notes?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'voucher_campaign_batches';

export function CampaignManager() {
  const [campaigns, setCampaigns] = useState<CampaignBatch[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignBatch | null>(null);
  const [deleteCampaignId, setDeleteCampaignId] = useState<string>('');
  const [previewContent, setPreviewContent] = useState<string>('');
  const [newCampaign, setNewCampaign] = useState<Partial<CampaignBatch>>({
    name: '', 
    description: '',
    staffId: '',
    customerSourceId: '',
    customerTypeId: '',
    denominationId: '',
    notes: ''
  });

  // Load campaigns from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCampaigns(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
    }
  }, []);

  const saveCampaigns = (updatedCampaigns: CampaignBatch[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCampaigns));
    } catch (error) {
      console.error('Error saving campaigns:', error);
    }
  };

  const validateCampaign = (campaign: Partial<CampaignBatch>, excludeId?: string) => {
    if (!campaign.name?.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên đợt phát hành.",
        variant: "destructive"
      });
      return false;
    }

    if (!campaign.staffId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn nhân viên phụ trách.",
        variant: "destructive"
      });
      return false;
    }

    if (!campaign.customerSourceId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn nguồn khách hàng.",
        variant: "destructive"
      });
      return false;
    }

    if (!campaign.customerTypeId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn loại khách hàng.",
        variant: "destructive"
      });
      return false;
    }

    if (!campaign.denominationId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn mệnh giá voucher.",
        variant: "destructive"
      });
      return false;
    }

    if (campaigns.some(c => c.name.toLowerCase() === campaign.name?.trim().toLowerCase() && c.id !== excludeId)) {
      toast({
        title: "Lỗi",
        description: "Tên đợt phát hành đã tồn tại.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleCreateCampaign = () => {
    if (!validateCampaign(newCampaign)) return;

    const campaign: CampaignBatch = {
      id: Date.now().toString(),
      name: newCampaign.name!.trim(),
      description: newCampaign.description || '',
      staffId: newCampaign.staffId!,
      customerSourceId: newCampaign.customerSourceId!,
      customerTypeId: newCampaign.customerTypeId!,
      denominationId: newCampaign.denominationId!,
      notes: newCampaign.notes || '',
      isDefault: campaigns.length === 0,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const updatedCampaigns = [...campaigns, campaign];
    setCampaigns(updatedCampaigns);
    saveCampaigns(updatedCampaigns);
    
    setNewCampaign({
      name: '', 
      description: '',
      staffId: '',
      customerSourceId: '',
      customerTypeId: '',
      denominationId: '',
      notes: ''
    });
    setIsCreateModalOpen(false);
    
    toast({
      title: "Thành công",
      description: "Đợt phát hành voucher mới đã được tạo thành công."
    });
  };

  const handleEditCampaign = () => {
    if (!editingCampaign) return;
    
    if (!validateCampaign(editingCampaign, editingCampaign.id)) return;

    const updatedCampaign = {
      ...editingCampaign,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const updatedCampaigns = campaigns.map(c => 
      c.id === editingCampaign.id ? updatedCampaign : c
    );
    
    setCampaigns(updatedCampaigns);
    saveCampaigns(updatedCampaigns);
    setIsEditModalOpen(false);
    setEditingCampaign(null);
    
    toast({
      title: "Thành công",
      description: "Đợt phát hành đã được cập nhật thành công."
    });
  };

  const handleDeleteCampaign = () => {
    const updatedCampaigns = campaigns.filter(c => c.id !== deleteCampaignId);
    setCampaigns(updatedCampaigns);
    saveCampaigns(updatedCampaigns);
    setIsDeleteDialogOpen(false);
    setDeleteCampaignId('');
    
    toast({
      title: "Thành công",
      description: "Đợt phát hành đã được xóa thành công."
    });
  };

  const handleDuplicateCampaign = (campaign: CampaignBatch) => {
    const duplicated: CampaignBatch = {
      id: Date.now().toString(),
      name: `${campaign.name} (Copy)`,
      description: campaign.description,
      staffId: campaign.staffId,
      customerSourceId: campaign.customerSourceId,
      customerTypeId: campaign.customerTypeId,
      denominationId: campaign.denominationId,
      notes: campaign.notes,
      isDefault: false,
      isActive: campaign.isActive,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const updatedCampaigns = [...campaigns, duplicated];
    setCampaigns(updatedCampaigns);
    saveCampaigns(updatedCampaigns);
    
    toast({
      title: "Thành công",
      description: "Đợt phát hành đã được sao chép thành công."
    });
  };

  const handleToggleStatus = (id: string) => {
    const updatedCampaigns = campaigns.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    );
    setCampaigns(updatedCampaigns);
    saveCampaigns(updatedCampaigns);
    
    toast({
      title: "Thành công",
      description: "Trạng thái đã được cập nhật."
    });
  };

  const handleSetDefault = (id: string) => {
    const updatedCampaigns = campaigns.map(c => ({
      ...c,
      isDefault: c.id === id
    }));
    setCampaigns(updatedCampaigns);
    saveCampaigns(updatedCampaigns);
    
    toast({
      title: "Thành công",
      description: "Đợt phát hành mặc định đã được thay đổi."
    });
  };

  const handlePreview = (campaign: CampaignBatch) => {
    const staff = getStaffById(campaign.staffId);
    const source = getCustomerSourceById(campaign.customerSourceId);
    const type = getCustomerTypeById(campaign.customerTypeId);
    const denomination = getDenominationById(campaign.denominationId);
    
    const previewData = `Thông tin đợt phát hành:

Tên đợt: ${campaign.name}
Mô tả: ${campaign.description}

Cấu hình:
- Nhân viên: ${staff?.name || 'N/A'} (${staff?.type === 'telesale' ? 'Telesales' : 'CSKH'})
- Nguồn KH: ${source?.name || 'N/A'}
- Loại KH: ${type?.name || 'N/A'}  
- Mệnh giá: ${denomination?.label || 'N/A'}

Ghi chú: ${campaign.notes || 'Không có'}
    `;
    
    setPreviewContent(previewData);
    setIsPreviewModalOpen(true);
  };

  const getCampaignDisplayInfo = (campaign: CampaignBatch) => {
    const staff = getStaffById(campaign.staffId);
    const source = getCustomerSourceById(campaign.customerSourceId);
    const type = getCustomerTypeById(campaign.customerTypeId);
    const denomination = getDenominationById(campaign.denominationId);
    
    return {
      staffName: staff?.name || 'N/A',
      sourceName: source?.name || 'N/A', 
      typeName: type?.name || 'N/A',
      denominationLabel: denomination?.label || 'N/A'
    };
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Quản lý Đợt Phát Hành Voucher</span>
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Tạo và quản lý các đợt phát hành voucher với cấu hình nhân viên, nguồn khách hàng và mệnh giá.
            </p>
          </div>
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo Đợt Mới
          </Button>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đợt phát hành nào</h3>
              <p className="text-gray-600 mb-4">
                Bắt đầu bằng cách tạo đợt phát hành voucher đầu tiên.
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo Đợt Đầu Tiên
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên Đợt</TableHead>
                  <TableHead>Nhân Viên</TableHead>
                  <TableHead>Nguồn KH</TableHead>
                  <TableHead>Mệnh Giá</TableHead>
                  <TableHead>Mặc Định</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => {
                  const displayInfo = getCampaignDisplayInfo(campaign);
                  return (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>{displayInfo.staffName}</TableCell>
                      <TableCell>{displayInfo.sourceName}</TableCell>
                      <TableCell>{displayInfo.denominationLabel}</TableCell>
                      <TableCell>
                        {campaign.isDefault ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Mặc định
                          </span>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetDefault(campaign.id)}
                            className="text-gray-500 hover:text-blue-600"
                          >
                            <Settings className="w-3 h-3 mr-1" />
                            Đặt mặc định
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={campaign.isActive} 
                          onCheckedChange={() => handleToggleStatus(campaign.id)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handlePreview(campaign)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDuplicateCampaign(campaign)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setEditingCampaign(campaign);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600"
                            onClick={() => {
                              setDeleteCampaignId(campaign.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo Đợt Phát Hành Mới</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="new-name">Tên Đợt Phát Hành</Label>
              <Input
                id="new-name"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                placeholder="Nhập tên đợt..."
                className="mt-1"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="new-description">Mô Tả</Label>
              <Input
                id="new-description"
                value={newCampaign.description}
                onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                placeholder="Mô tả ngắn về đợt phát hành..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-staff">Nhân Viên</Label>
              <select
                id="new-staff"
                value={newCampaign.staffId}
                onChange={(e) => setNewCampaign({...newCampaign, staffId: e.target.value})}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn nhân viên...</option>
                {mockStaff.filter(s => s.isActive).map(staff => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name} ({staff.type === 'telesale' ? 'Telesales' : 'CSKH'})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="new-source">Nguồn Khách Hàng</Label>
              <select
                id="new-source"
                value={newCampaign.customerSourceId}
                onChange={(e) => setNewCampaign({...newCampaign, customerSourceId: e.target.value})}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn nguồn...</option>
                {mockCustomerSources.filter(s => s.isActive).map(source => (
                  <option key={source.id} value={source.id}>{source.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="new-type">Loại Khách Hàng</Label>
              <select
                id="new-type"
                value={newCampaign.customerTypeId}
                onChange={(e) => setNewCampaign({...newCampaign, customerTypeId: e.target.value})}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn loại...</option>
                {mockCustomerTypes.filter(t => t.isActive).map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="new-denomination">Mệnh Giá</Label>
              <select
                id="new-denomination" 
                value={newCampaign.denominationId}
                onChange={(e) => setNewCampaign({...newCampaign, denominationId: e.target.value})}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn mệnh giá...</option>
                {mockVoucherDenominations.filter(d => d.isActive).map(denom => (
                  <option key={denom.id} value={denom.id}>{denom.label}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="new-notes">Ghi Chú</Label>
              <Textarea
                id="new-notes"
                value={newCampaign.notes}
                onChange={(e) => setNewCampaign({...newCampaign, notes: e.target.value})}
                placeholder="Ghi chú thêm..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateCampaign}>
              Tạo Đợt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Đợt Phát Hành</DialogTitle>
          </DialogHeader>
          {editingCampaign && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="edit-name">Tên Đợt Phát Hành</Label>
                <Input
                  id="edit-name"
                  value={editingCampaign.name}
                  onChange={(e) => setEditingCampaign({...editingCampaign, name: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-description">Mô Tả</Label>
                <Input
                  id="edit-description"
                  value={editingCampaign.description}
                  onChange={(e) => setEditingCampaign({...editingCampaign, description: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-staff">Nhân Viên</Label>
                <select
                  id="edit-staff"
                  value={editingCampaign.staffId}
                  onChange={(e) => setEditingCampaign({...editingCampaign, staffId: e.target.value})}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn nhân viên...</option>
                  {mockStaff.filter(s => s.isActive).map(staff => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} ({staff.type === 'telesale' ? 'Telesales' : 'CSKH'})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="edit-source">Nguồn Khách Hàng</Label>
                <select
                  id="edit-source"
                  value={editingCampaign.customerSourceId}
                  onChange={(e) => setEditingCampaign({...editingCampaign, customerSourceId: e.target.value})}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn nguồn...</option>
                  {mockCustomerSources.filter(s => s.isActive).map(source => (
                    <option key={source.id} value={source.id}>{source.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="edit-type">Loại Khách Hàng</Label>
                <select
                  id="edit-type"
                  value={editingCampaign.customerTypeId}
                  onChange={(e) => setEditingCampaign({...editingCampaign, customerTypeId: e.target.value})}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn loại...</option>
                  {mockCustomerTypes.filter(t => t.isActive).map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="edit-denomination">Mệnh Giá</Label>
                <select
                  id="edit-denomination"
                  value={editingCampaign.denominationId}
                  onChange={(e) => setEditingCampaign({...editingCampaign, denominationId: e.target.value})}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn mệnh giá...</option>
                  {mockVoucherDenominations.filter(d => d.isActive).map(denom => (
                    <option key={denom.id} value={denom.id}>{denom.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-notes">Ghi Chú</Label>
                <Textarea
                  id="edit-notes"
                  value={editingCampaign.notes}
                  onChange={(e) => setEditingCampaign({...editingCampaign, notes: e.target.value})}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditCampaign}>
              Lưu Thay Đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Xem Trước Đợt Phát Hành</DialogTitle>
          </DialogHeader>
          <div className="bg-gray-50 border rounded-lg p-4">
            <div className="text-sm bg-white p-4 rounded border max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {previewContent}
              </pre>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPreviewModalOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
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
            <AlertDialogAction onClick={handleDeleteCampaign} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
