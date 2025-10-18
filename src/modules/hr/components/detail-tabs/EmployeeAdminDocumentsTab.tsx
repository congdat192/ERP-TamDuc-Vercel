import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/usePermissions';
import { FileText, Eye, ExternalLink, Loader2 } from 'lucide-react';
import { AdminDocumentService } from '@/modules/hr/services/adminDocumentService';
import { ViewDocumentModal } from '@/modules/hr/components/administration/ViewDocumentModal';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { AdministrativeDocument } from '@/modules/hr/types/administration';
import { getDocTypeLabel, getStatusLabel, getStatusColor } from '@/modules/hr/types/administration';

interface EmployeeAdminDocumentsTabProps {
  employeeId: string;
}

export function EmployeeAdminDocumentsTab({ employeeId }: EmployeeAdminDocumentsTabProps) {
  const [documents, setDocuments] = useState<AdministrativeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<AdministrativeDocument | null>(null);
  const { toast } = useToast();
  const { hasFeatureAccess } = usePermissions();

  // Permission check
  const canView = hasFeatureAccess('view_employees') || hasFeatureAccess('view_admin_documents');

  useEffect(() => {
    if (canView) {
      fetchDocuments();
    }
  }, [employeeId, canView]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await AdminDocumentService.getDocumentsByEmployee(employeeId);
      setDocuments(data);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tải văn bản hành chính',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = (doc: AdministrativeDocument) => {
    setSelectedDocument(doc);
    setViewModalOpen(true);
  };

  if (!canView) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Bạn không có quyền xem văn bản hành chính</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with quick link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Văn Bản Hành Chính ({documents.length})</h3>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/ERP/HR/Administration">
            <ExternalLink className="h-4 w-4 mr-2" />
            Mở trong Administration
          </Link>
        </Button>
      </div>

      {/* Documents Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Chưa có văn bản hành chính nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Số Văn Bản</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Tiêu Đề</TableHead>
                  <TableHead>Ngày Ban Hành</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-mono">{doc.doc_no || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getDocTypeLabel(doc.doc_type)}</Badge>
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">
                      {doc.subject}
                    </TableCell>
                    <TableCell>{format(new Date(doc.issue_date), 'dd/MM/yyyy', { locale: vi })}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(doc.status)}>
                        {getStatusLabel(doc.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDocument(doc)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Document Modal */}
      <ViewDocumentModal
        isOpen={viewModalOpen}
        document={selectedDocument}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedDocument(null);
        }}
        onSuccess={() => {}}
        canApprove={false}
      />
    </div>
  );
}
