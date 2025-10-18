import { useState, useEffect } from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/usePermissions';
import { AdminDocumentService } from '../services/adminDocumentService';
import { DocumentFiltersComponent } from '../components/administration/DocumentFilters';
import { DocumentTable } from '../components/administration/DocumentTable';
import { CreateDocumentModal } from '../components/administration/CreateDocumentModal';
import { ViewDocumentModal } from '../components/administration/ViewDocumentModal';
import { EditDocumentModal } from '../components/administration/EditDocumentModal';
import type {
  AdministrativeDocument,
  DocumentFilters,
  DocumentStats,
  DocType,
} from '../types/administration';
import { getDocTypeLabel } from '../types/administration';

export function AdministrationPage() {
  const [activeTab, setActiveTab] = useState<DocType | 'all'>('all');
  const [documents, setDocuments] = useState<AdministrativeDocument[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<AdministrativeDocument[]>([]);
  const [filters, setFilters] = useState<DocumentFilters>({});
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<AdministrativeDocument | null>(null);
  const { toast } = useToast();
  const { hasFeatureAccess } = usePermissions();

  const canCreate = hasFeatureAccess('create_admin_documents');
  const canApprove = hasFeatureAccess('approve_admin_documents');
  const canDelete = hasFeatureAccess('delete_admin_documents');

  useEffect(() => {
    loadDocuments();
    loadStats();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, filters, activeTab]);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const data = await AdminDocumentService.getDocuments();
      setDocuments(data);
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

  const loadStats = async () => {
    try {
      const data = await AdminDocumentService.getStats();
      setStats(data);
    } catch (error: any) {
      console.error('Error loading stats:', error);
    }
  };

  const filterDocuments = () => {
    let filtered = [...documents];

    if (activeTab !== 'all') {
      filtered = filtered.filter((doc) => doc.doc_type === activeTab);
    }

    if (filters.status) {
      filtered = filtered.filter((doc) => doc.status === filters.status);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.doc_no?.toLowerCase().includes(search) ||
          doc.subject.toLowerCase().includes(search)
      );
    }

    setFilteredDocs(filtered);
  };

  const handleView = (doc: AdministrativeDocument) => {
    setSelectedDocument(doc);
    setShowViewModal(true);
  };

  const handleEdit = (doc: AdministrativeDocument) => {
    setSelectedDocument(doc);
    setShowEditModal(true);
  };

  const handleDelete = async (doc: AdministrativeDocument) => {
    if (!confirm(`Bạn có chắc muốn xóa văn bản ${doc.doc_no}?`)) return;

    try {
      await AdminDocumentService.deleteDocument(doc.id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa văn bản',
      });
      loadDocuments();
      loadStats();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSuccess = () => {
    loadDocuments();
    loadStats();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Hồ Sơ Hành Chính</h2>
          <p className="text-muted-foreground mt-2">
            Quản lý văn bản hành chính và tài liệu công ty
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo Văn Bản
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Văn Bản</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chờ Duyệt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã Xuất Bản</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.published}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lưu Trữ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.archived}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <DocumentFiltersComponent filters={filters} onFilterChange={setFilters} />

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as DocType | 'all')}
          >
            <TabsList>
              <TabsTrigger value="all">
                Tất Cả ({stats?.total || 0})
              </TabsTrigger>
              <TabsTrigger value="decision">
                {getDocTypeLabel('decision')} ({stats?.by_type.decision || 0})
              </TabsTrigger>
              <TabsTrigger value="notice">
                {getDocTypeLabel('notice')} ({stats?.by_type.notice || 0})
              </TabsTrigger>
              <TabsTrigger value="contract">
                {getDocTypeLabel('contract')} ({stats?.by_type.contract || 0})
              </TabsTrigger>
              <TabsTrigger value="form">
                {getDocTypeLabel('form')} ({stats?.by_type.form || 0})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Đang tải...
            </div>
          ) : (
            <DocumentTable
              documents={filteredDocs}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={canCreate}
              canDelete={canDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateDocumentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleSuccess}
      />

      <ViewDocumentModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument}
        onSuccess={handleSuccess}
        canApprove={canApprove}
      />

      {showEditModal && selectedDocument && (
        <EditDocumentModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedDocument(null);
          }}
          document={selectedDocument}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
