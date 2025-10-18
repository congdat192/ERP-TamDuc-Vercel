import { useState, useEffect } from 'react';
import { Plus, FileText, Eye, Edit, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/usePermissions';
import { DocumentTemplateService } from '../services/documentTemplateService';
import { CreateTemplateModal } from '../components/administration/CreateTemplateModal';
import { EditTemplateModal } from '../components/administration/EditTemplateModal';
import { PreviewTemplateModal } from '../components/administration/PreviewTemplateModal';
import type { DocumentTemplate, DocType } from '../types/administration';
import { getDocTypeLabel } from '../types/administration';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function TemplateManagementPage() {
  const [activeTab, setActiveTab] = useState<DocType | 'all'>('all');
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<DocumentTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const { toast } = useToast();
  const { hasFeatureAccess } = usePermissions();

  const canManage = hasFeatureAccess('create_admin_documents');

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, activeTab, searchQuery]);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const data = await DocumentTemplateService.getTemplates();
      setTemplates(data);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = [...templates];

    if (activeTab !== 'all') {
      filtered = filtered.filter((t) => t.doc_type === activeTab);
    }

    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      filtered = filtered.filter((t) => t.name.toLowerCase().includes(search));
    }

    setFilteredTemplates(filtered);
  };

  const handleDuplicate = async (template: DocumentTemplate) => {
    try {
      await DocumentTemplateService.createTemplate({
        name: `Copy of ${template.name}`,
        doc_type: template.doc_type,
        template_content: template.template_content,
        variables: template.variables,
      });
      toast({
        title: 'Thành công',
        description: 'Đã nhân bản mẫu',
      });
      loadTemplates();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (template: DocumentTemplate) => {
    if (!confirm(`Bạn có chắc muốn xóa mẫu "${template.name}"?`)) return;

    try {
      await DocumentTemplateService.deleteTemplate(template.id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa mẫu',
      });
      loadTemplates();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getStatsByType = () => {
    return {
      all: templates.length,
      decision: templates.filter((t) => t.doc_type === 'decision').length,
      notice: templates.filter((t) => t.doc_type === 'notice').length,
      contract: templates.filter((t) => t.doc_type === 'contract').length,
      form: templates.filter((t) => t.doc_type === 'form').length,
    };
  };

  const stats = getStatsByType();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản Lý Mẫu Văn Bản</h2>
          <p className="text-muted-foreground mt-2">
            Tạo và quản lý các mẫu văn bản để sử dụng lại
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo Mẫu Mới
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Mẫu</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.all}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quyết Định</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.decision}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thông Báo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.notice}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hợp Đồng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contract}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Biểu Mẫu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.form}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <Input
          placeholder="Tìm kiếm mẫu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as DocType | 'all')}
          >
            <TabsList>
              <TabsTrigger value="all">Tất Cả ({stats.all})</TabsTrigger>
              <TabsTrigger value="decision">
                {getDocTypeLabel('decision')} ({stats.decision})
              </TabsTrigger>
              <TabsTrigger value="notice">
                {getDocTypeLabel('notice')} ({stats.notice})
              </TabsTrigger>
              <TabsTrigger value="contract">
                {getDocTypeLabel('contract')} ({stats.contract})
              </TabsTrigger>
              <TabsTrigger value="form">
                {getDocTypeLabel('form')} ({stats.form})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Đang tải...
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Không có mẫu nào
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên Mẫu</TableHead>
                  <TableHead>Loại Văn Bản</TableHead>
                  <TableHead>Ngày Tạo</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>{getDocTypeLabel(template.doc_type)}</TableCell>
                    <TableCell>
                      {new Date(template.created_at).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedTemplate(template);
                                  setShowPreviewModal(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Xem trước</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {canManage && (
                          <>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setSelectedTemplate(template);
                                      setShowEditModal(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Chỉnh sửa</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDuplicate(template)}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Nhân bản</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(template)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Xóa mẫu</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateTemplateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadTemplates}
      />

      {showEditModal && selectedTemplate && (
        <EditTemplateModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTemplate(null);
          }}
          template={selectedTemplate}
          onSuccess={loadTemplates}
        />
      )}

      {showPreviewModal && selectedTemplate && (
        <PreviewTemplateModal
          isOpen={showPreviewModal}
          onClose={() => {
            setShowPreviewModal(false);
            setSelectedTemplate(null);
          }}
          template={selectedTemplate}
        />
      )}
    </div>
  );
}
