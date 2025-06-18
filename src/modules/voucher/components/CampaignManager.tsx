
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Copy,
  Calendar,
  Users,
  Target
} from 'lucide-react';

interface VoucherCampaign {
  id: string;
  name: string;
  description: string;
  customerSource: string;
  customerType: string;
  staffAssigned: string;
  startDate: string;
  endDate: string;
  targetQuantity: number;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Mock data for customer sources - synchronized with CustomerSourceManager
const customerSources = [
  { id: '1', name: 'Facebook', description: 'Khách hàng từ Facebook' },
  { id: '2', name: 'Zalo', description: 'Khách hàng từ Zalo' },
  { id: '3', name: 'Tại cửa hàng', description: 'Khách hàng đến trực tiếp' },
  { id: '4', name: 'Giới thiệu', description: 'Khách hàng được giới thiệu' }
];

// Mock data for customer types - synchronized with CustomerTypeManager
const customerTypes = [
  { id: '1', name: 'Khách hàng mới', description: 'Lần đầu sử dụng dịch vụ' },
  { id: '2', name: 'Khách hàng cũ', description: 'Đã sử dụng dịch vụ' },
  { id: '3', name: 'Khách hàng thân thiết', description: 'Đã sử dụng dịch vụ > 5 lần' }
];

// Mock data for staff
const staffMembers = [
  { id: '1', name: 'Nguyễn Văn An', role: 'CSKH' },
  { id: '2', name: 'Trần Thị Lan', role: 'Telesale' },
  { id: '3', name: 'Lê Minh Tuấn', role: 'CSKH' },
  { id: '4', name: 'Phạm Thu Hương', role: 'Telesale' }
];

export function CampaignManager() {
  const [campaigns, setCampaigns] = useState<VoucherCampaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<VoucherCampaign | null>(null);
  const [deleteCampaignId, setDeleteCampaignId] = useState<string>('');
  
  // Form states
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignDescription, setNewCampaignDescription] = useState('');
  const [newCustomerSource, setNewCustomerSource] = useState('');
  const [newCustomerType, setNewCustomerType] = useState('');
  const [newStaffAssigned, setNewStaffAssigned] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newTargetQuantity, setNewTargetQuantity] = useState<number>(0);

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);

  const resetForm = () => {
    setNewCampaignName('');
    setNewCampaignDescription('');
    setNewCustomerSource('');
    setNewCustomerType('');
    setNewStaffAssigned('');
    setNewStartDate('');
    setNewEndDate('');
    setNewTargetQuantity(0);
  };

  const handleCreateCampaign = () => {
    if (!newCampaignName.trim() || !newCustomerSource || !newCustomerType || !newStaffAssigned) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc.",
        variant: "destructive"
      });
      return;
    }

    if (campaigns.some(c => c.name === newCampaignName.trim())) {
      toast({
        title: "Lỗi",
        description: "Tên đợt phát hành đã tồn tại. Vui lòng chọn tên khác.",
        variant: "destructive"
      });
      return;
    }

    const newCampaign: VoucherCampaign = {
      id: Date.now().toString(),
      name: newCampaignName.trim(),
      description: newCampaignDescription.trim(),
      customerSource: newCustomerSource,
      customerType: newCustomerType,
      staffAssigned: newStaffAssigned,
      startDate: newStartDate,
      endDate: newEndDate,
      targetQuantity: newTargetQuantity,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCampaigns([...campaigns, newCampaign]);
    setSelectedCampaignId(newCampaign.id);
    resetForm();
    setIsCreateModalOpen(false);
    
    toast({
      title: "Thành công",
      description: "Đợt phát hành voucher mới đã được tạo thành công."
    });
  };

  const handleEditCampaign = () => {
    if (!editingCampaign?.name.trim() || !editingCampaign?.customerSource || !editingCampaign?.customerType) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc.",
        variant: "destructive"
      });
      return;
    }

    if (campaigns.some(c => c.name === editingCampaign.name.trim() && c.id !== editingCampaign.id)) {
      toast({
        title: "Lỗi",
        description: "Tên đợt phát hành đã tồn tại. Vui lòng chọn tên khác.",
        variant: "destructive"
      });
      return;
    }

    const updatedCampaign = { ...editingCampaign, updatedAt: new Date().toISOString() };
    setCampaigns(campaigns.map(c => c.id === editingCampaign.id ? updatedCampaign : c));
    setIsEditModalOpen(false);
    setEditingCampaign(null);
    
    toast({
      title: "Thành công",
      description: "Đợt phát hành đã được cập nhật thành công."
    });
  };

  const handleDeleteCampaign = () => {
    setCampaigns(campaigns.filter(c => c.id !== deleteCampaignId));
    
    if (selectedCampaignId === deleteCampaignId) {
      setSelectedCampaignId(campaigns[0]?.id || '');
    }
    
    setIsDeleteDialogOpen(false);
    setDeleteCampaignId('');
    
    toast({
      title: "Thành công",
      description: "Đợt phát hành đã được xóa thành công."
    });
  };

  const handleDuplicateCampaign = (campaign: VoucherCampaign) => {
    const duplicatedCampaign: VoucherCampaign = {
      ...campaign,
      id: Date.now().toString(),
      name: `${campaign.name} (Copy)`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCampaigns([...campaigns, duplicatedCampaign]);
    setSelectedCampaignId(duplicatedCampaign.id);
    
    toast({
      title: "Thành công",
      description: "Đợt phát hành đã được sao chép thành công."
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Đang hoạt động';
      case 'pending': return 'Chờ triển khai';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Quản Lý Đợt Phát Hành Voucher</span>
            <Button onClick={() => setIsCreateModalOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Tạo đợt phát hành voucher
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">Chưa có đợt phát hành voucher nào</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo đợt phát hành đầu tiên
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên Đợt</TableHead>
                  <TableHead>Nguồn KH</TableHead>
                  <TableHead>Loại KH</TableHead>
                  <TableHead>Nhân Viên</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead>Thời Gian</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      {customerSources.find(s => s.id === campaign.customerSource)?.name || campaign.customerSource}
                    </TableCell>
                    <TableCell>
                      {customerTypes.find(t => t.id === campaign.customerType)?.name || campaign.customerType}
                    </TableCell>
                    <TableCell>
                      {staffMembers.find(s => s.id === campaign.staffAssigned)?.name || campaign.staffAssigned}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(campaign.status)}>
                        {getStatusLabel(campaign.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {campaign.startDate && campaign.endDate 
                        ? `${campaign.startDate} - ${campaign.endDate}`
                        : 'Chưa xác định'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedCampaignId(campaign.id);
                            setIsViewModalOpen(true);
                          }}
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
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Campaign Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo Đợt Phát Hành Voucher Mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="campaign-name">Tên Đợt Phát Hành *</Label>
                <Input
                  id="campaign-name"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  placeholder="Nhập tên đợt phát hành..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="target-quantity">Số Lượng Dự Kiến</Label>
                <Input
                  id="target-quantity"
                  type="number"
                  value={newTargetQuantity}
                  onChange={(e) => setNewTargetQuantity(Number(e.target.value))}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="campaign-description">Mô Tả</Label>
              <Textarea
                id="campaign-description"
                value={newCampaignDescription}
                onChange={(e) => setNewCampaignDescription(e.target.value)}
                placeholder="Nhập mô tả đợt phát hành..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer-source">Nguồn Khách Hàng *</Label>
                <Select value={newCustomerSource} onValueChange={setNewCustomerSource}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn nguồn khách hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {customerSources.map((source) => (
                      <SelectItem key={source.id} value={source.id}>
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="customer-type">Loại Khách Hàng *</Label>
                <Select value={newCustomerType} onValueChange={setNewCustomerType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn loại khách hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {customerTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="staff-assigned">Nhân Viên Phụ Trách *</Label>
              <Select value={newStaffAssigned} onValueChange={setNewStaffAssigned}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn nhân viên phụ trách" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name} ({staff.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Ngày Bắt Đầu</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="end-date">Ngày Kết Thúc</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateCampaign}>
              Tạo Đợt Phát Hành
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Đợt Phát Hành</DialogTitle>
          </DialogHeader>
          {editingCampaign && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-campaign-name">Tên Đợt Phát Hành *</Label>
                  <Input
                    id="edit-campaign-name"
                    value={editingCampaign.name}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-target-quantity">Số Lượng Dự Kiến</Label>
                  <Input
                    id="edit-target-quantity"
                    type="number"
                    value={editingCampaign.targetQuantity}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, targetQuantity: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-campaign-description">Mô Tả</Label>
                <Textarea
                  id="edit-campaign-description"
                  value={editingCampaign.description}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, description: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-customer-source">Nguồn Khách Hàng *</Label>
                  <Select 
                    value={editingCampaign.customerSource} 
                    onValueChange={(value) => setEditingCampaign({ ...editingCampaign, customerSource: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {customerSources.map((source) => (
                        <SelectItem key={source.id} value={source.id}>
                          {source.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-customer-type">Loại Khách Hàng *</Label>
                  <Select 
                    value={editingCampaign.customerType} 
                    onValueChange={(value) => setEditingCampaign({ ...editingCampaign, customerType: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {customerTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-staff-assigned">Nhân Viên Phụ Trách *</Label>
                <Select 
                  value={editingCampaign.staffAssigned} 
                  onValueChange={(value) => setEditingCampaign({ ...editingCampaign, staffAssigned: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {staffMembers.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name} ({staff.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-start-date">Ngày Bắt Đầu</Label>
                  <Input
                    id="edit-start-date"
                    type="date"
                    value={editingCampaign.startDate}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, startDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-end-date">Ngày Kết Thúc</Label>
                  <Input
                    id="edit-end-date"
                    type="date"
                    value={editingCampaign.endDate}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, endDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
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

      {/* View Campaign Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi Tiết Đợt Phát Hành</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Tên Đợt:</Label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCampaign.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Trạng Thái:</Label>
                  <div className="mt-1">
                    <Badge variant={getStatusBadgeVariant(selectedCampaign.status)}>
                      {getStatusLabel(selectedCampaign.status)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Mô Tả:</Label>
                <p className="mt-1 text-sm text-gray-900">{selectedCampaign.description || 'Không có mô tả'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Nguồn Khách Hàng:</Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {customerSources.find(s => s.id === selectedCampaign.customerSource)?.name || selectedCampaign.customerSource}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Loại Khách Hàng:</Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {customerTypes.find(t => t.id === selectedCampaign.customerType)?.name || selectedCampaign.customerType}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Nhân Viên Phụ Trách:</Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {staffMembers.find(s => s.id === selectedCampaign.staffAssigned)?.name || selectedCampaign.staffAssigned}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Số Lượng Dự Kiến:</Label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCampaign.targetQuantity} voucher</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Ngày Bắt Đầu:</Label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCampaign.startDate || 'Chưa xác định'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Ngày Kết Thúc:</Label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCampaign.endDate || 'Chưa xác định'}</p>
                </div>
              </div>
            </div>
          )}
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
            <AlertDialogAction onClick={handleDeleteCampaign} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
