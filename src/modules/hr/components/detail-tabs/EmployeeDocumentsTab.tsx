import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Trash2, FileText, Loader2, Eye } from 'lucide-react';
import { DocumentService, type EmployeeDocument, type DocumentType } from '@/modules/hr/services/documentService';
import { DocumentPreviewDialog } from './DocumentPreviewDialog';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EmployeeDocumentsTabProps {
  employeeId: string;
}

export function EmployeeDocumentsTab({ employeeId }: EmployeeDocumentsTabProps) {
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>('contract');
  const [notes, setNotes] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [documentToPreview, setDocumentToPreview] = useState<EmployeeDocument | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, [employeeId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await DocumentService.getDocumentsByEmployee(employeeId);
      setDocuments(data);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tải danh sách chứng từ',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = DocumentService.validateFile(file);
      if (!validation.isValid) {
        toast({
          title: 'Lỗi',
          description: validation.error,
          variant: 'destructive',
        });
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn file để upload',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);
      await DocumentService.uploadDocument(employeeId, selectedFile, documentType, notes);
      
      toast({
        title: 'Thành công',
        description: 'Upload chứng từ thành công',
      });

      // Reset form
      setSelectedFile(null);
      setDocumentType('contract');
      setNotes('');
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Refresh list
      await fetchDocuments();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể upload chứng từ',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc: EmployeeDocument) => {
    try {
      const url = await DocumentService.getDocumentUrl(doc.file_path);
      window.open(url, '_blank');
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tải file',
        variant: 'destructive',
      });
    }
  };

  const handlePreview = (doc: EmployeeDocument) => {
    if (!DocumentService.canPreview(doc.mime_type)) {
      toast({
        title: 'Không thể preview',
        description: 'Loại file này không hỗ trợ preview. Vui lòng tải xuống để xem.',
        variant: 'destructive',
      });
      return;
    }
    setDocumentToPreview(doc);
    setPreviewDialogOpen(true);
  };

  const confirmDelete = (documentId: string) => {
    setDocumentToDelete(documentId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;

    try {
      await DocumentService.deleteDocument(documentToDelete);
      
      toast({
        title: 'Thành công',
        description: 'Xóa chứng từ thành công',
      });

      await fetchDocuments();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể xóa chứng từ',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const getDocumentTypeBadge = (type: DocumentType) => {
    const colors: Record<DocumentType, string> = {
      contract: 'bg-blue-500',
      id_card: 'bg-green-500',
      degree: 'bg-purple-500',
      certificate: 'bg-orange-500',
      health_record: 'bg-pink-500',
      other: 'bg-gray-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Chứng Từ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Loại Chứng Từ</Label>
                <Select value={documentType} onValueChange={(value) => setDocumentType(value as DocumentType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contract">Hợp đồng lao động</SelectItem>
                    <SelectItem value="id_card">CCCD/CMND</SelectItem>
                    <SelectItem value="degree">Bằng cấp</SelectItem>
                    <SelectItem value="certificate">Chứng chỉ</SelectItem>
                    <SelectItem value="health_record">Hồ sơ sức khỏe</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Chọn File</Label>
                <Input 
                  type="file" 
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <p className="text-xs text-muted-foreground">
                  Hỗ trợ: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ghi Chú (Tùy chọn)</Label>
              <Textarea 
                placeholder="Nhập ghi chú về chứng từ..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={uploading}
              />
            </div>

            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang Upload...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Chứng Từ
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Danh Sách Chứng Từ ({documents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Chưa có chứng từ nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loại</TableHead>
                  <TableHead>Tên File</TableHead>
                  <TableHead>Kích Thước</TableHead>
                  <TableHead>Ngày Upload</TableHead>
                  <TableHead>Ghi Chú</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <Badge className={getDocumentTypeBadge(doc.document_type)}>
                        {DocumentService.getDocumentTypeLabel(doc.document_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{doc.file_name}</TableCell>
                    <TableCell>{DocumentService.formatFileSize(doc.file_size)}</TableCell>
                    <TableCell>{format(new Date(doc.uploaded_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                    <TableCell className="max-w-xs truncate">{doc.notes || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreview(doc)}
                      disabled={!DocumentService.canPreview(doc.mime_type)}
                      title={DocumentService.canPreview(doc.mime_type) ? 'Xem preview' : 'Không hỗ trợ preview'}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => confirmDelete(doc.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa chứng từ này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Dialog */}
      <DocumentPreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        document={documentToPreview}
      />
    </div>
  );
}
