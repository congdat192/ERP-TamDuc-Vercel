import { useState, useEffect } from 'react';
import { X, FileText, Download, History, CheckCircle, XCircle, Archive } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { AdminDocumentService } from '../../services/adminDocumentService';
import type { AdministrativeDocument } from '../../types/administration';
import {
  getDocTypeLabel,
  getStatusLabel,
  getStatusColor,
} from '../../types/administration';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { VersionHistoryDialog } from './VersionHistoryDialog';
import { ApprovalDialog } from './ApprovalDialog';

interface ViewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: AdministrativeDocument | null;
  onSuccess: () => void;
  canApprove: boolean;
}

export function ViewDocumentModal({
  isOpen,
  onClose,
  document,
  onSuccess,
  canApprove,
}: ViewDocumentModalProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (document?.file_path) {
      loadFileUrl();
    }
  }, [document?.file_path]);

  const loadFileUrl = async () => {
    if (!document?.file_path) return;

    try {
      const url = await AdminDocumentService.getFileUrl(document.file_path);
      setFileUrl(url);
    } catch (error: any) {
      console.error('Error loading file URL:', error);
    }
  };

  const handleDownload = async () => {
    if (!fileUrl || !document?.file_name) return;

    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.file_name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Thành công',
        description: 'Đã tải file xuống',
      });
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải file',
        variant: 'destructive',
      });
    }
  };

  const handleApprove = () => {
    setApprovalAction('approve');
    setShowApprovalDialog(true);
  };

  const handleReject = () => {
    setApprovalAction('reject');
    setShowApprovalDialog(true);
  };

  const handleApprovalSubmit = async (note: string) => {
    if (!document) return;

    setIsLoading(true);
    try {
      if (approvalAction === 'approve') {
        await AdminDocumentService.approveDocument(document.id, note);
        toast({
          title: 'Thành công',
          description: 'Đã phê duyệt văn bản',
        });
      } else {
        await AdminDocumentService.rejectDocument(document.id, note);
        toast({
          title: 'Thành công',
          description: 'Đã từ chối văn bản',
        });
      }

      setShowApprovalDialog(false);
      onSuccess();
      onClose();
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

  const handlePublish = async () => {
    if (!document) return;
    if (!confirm('Bạn có chắc muốn xuất bản văn bản này?')) return;

    setIsLoading(true);
    try {
      await AdminDocumentService.publishDocument(document.id);
      toast({
        title: 'Thành công',
        description: 'Đã xuất bản văn bản',
      });
      onSuccess();
      onClose();
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

  const handleArchive = async () => {
    if (!document) return;
    if (!confirm('Bạn có chắc muốn lưu trữ văn bản này?')) return;

    setIsLoading(true);
    try {
      await AdminDocumentService.archiveDocument(document.id);
      toast({
        title: 'Thành công',
        description: 'Đã lưu trữ văn bản',
      });
      onSuccess();
      onClose();
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

  if (!document) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl">{document.doc_no}</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {document.subject}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{getDocTypeLabel(document.doc_type)}</Badge>
                <Badge className={getStatusColor(document.status)}>
                  {getStatusLabel(document.status)}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Document Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ngày Phát Hành</p>
                <p className="text-sm mt-1">
                  {format(new Date(document.issue_date), 'dd/MM/yyyy', { locale: vi })}
                </p>
              </div>
              {document.effective_date && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ngày Hiệu Lực</p>
                  <p className="text-sm mt-1">
                    {format(new Date(document.effective_date), 'dd/MM/yyyy', { locale: vi })}
                  </p>
                </div>
              )}
              {document.employee && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nhân Viên</p>
                  <p className="text-sm mt-1">
                    {document.employee.full_name} ({document.employee.employee_code})
                  </p>
                </div>
              )}
              {document.approved_at && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ngày Phê Duyệt</p>
                  <p className="text-sm mt-1">
                    {format(new Date(document.approved_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Content */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Nội Dung</p>
              <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-sans">{document.content}</pre>
              </div>
            </div>

            {/* File Attachment */}
            {document.file_path && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">File Đính Kèm</p>
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{document.file_name}</p>
                    {document.file_size && (
                      <p className="text-xs text-muted-foreground">
                        {(document.file_size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Tải xuống
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowVersionHistory(true)}
            >
              <History className="h-4 w-4 mr-2" />
              Lịch Sử Phiên Bản
            </Button>

            <div className="flex gap-2">
              {document.status === 'pending' && canApprove && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleReject}
                    disabled={isLoading}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Từ Chối
                  </Button>
                  <Button onClick={handleApprove} disabled={isLoading}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Phê Duyệt
                  </Button>
                </>
              )}
              {document.status === 'approved' && canApprove && (
                <Button onClick={handlePublish} disabled={isLoading}>
                  Xuất Bản
                </Button>
              )}
              {document.status === 'published' && canApprove && (
                <Button variant="outline" onClick={handleArchive} disabled={isLoading}>
                  <Archive className="h-4 w-4 mr-2" />
                  Lưu Trữ
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {document && (
        <>
          <VersionHistoryDialog
            isOpen={showVersionHistory}
            onClose={() => setShowVersionHistory(false)}
            documentId={document.id}
            onSuccess={onSuccess}
          />
          <ApprovalDialog
            isOpen={showApprovalDialog}
            onClose={() => setShowApprovalDialog(false)}
            onSubmit={handleApprovalSubmit}
            action={approvalAction}
            isLoading={isLoading}
          />
        </>
      )}
    </>
  );
}
