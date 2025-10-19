import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileText, Download, Trash2, Eye, Loader2, CreditCard, GraduationCap, Award, FileCheck, FileUp } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface EmployeeDocument {
  id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  notes: string | null;
  uploaded_at: string;
}

interface DocumentChangeRequest {
  id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  notes: string | null;
  status: string;
  requested_at: string;
  review_note: string | null;
}

interface Props {
  employeeId: string;
}

const DOCUMENT_TYPES = [
  { value: 'id_card_front', label: 'CCCD Mặt Trước', icon: CreditCard },
  { value: 'id_card_back', label: 'CCCD Mặt Sau', icon: CreditCard },
  { value: 'degree', label: 'Bằng Cấp', icon: GraduationCap },
  { value: 'certificate', label: 'Chứng Chỉ', icon: Award },
  { value: 'health_record', label: 'Hồ Sơ Sức Khỏe', icon: FileCheck },
  { value: 'other', label: 'Khác', icon: FileText },
];

export function EmployeePersonalDocumentsTab({ employeeId }: Props) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [pendingRequests, setPendingRequests] = useState<DocumentChangeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);
  const [deleteRequestId, setDeleteRequestId] = useState<string | null>(null);
  const [loadingDocIds, setLoadingDocIds] = useState<string[]>([]);

  useEffect(() => {
    fetchDocuments();
  }, [employeeId]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      // Fetch approved documents
      const { data: docs, error: docsError } = await supabase
        .from('employee_documents')
        .select('*')
        .eq('employee_id', employeeId)
        .order('uploaded_at', { ascending: false });

      if (docsError) throw docsError;

      // Fetch pending change requests
      const { data: requests, error: reqError } = await supabase
        .from('document_change_requests')
        .select('*')
        .eq('employee_id', employeeId)
        .in('status', ['pending', 'rejected'])
        .order('requested_at', { ascending: false });

      if (reqError) throw reqError;

      setDocuments(docs || []);
      setPendingRequests(requests || []);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách chứng từ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = () => {
    if (!selectedType) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn loại chứng từ",
        variant: "destructive",
      });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Lỗi",
        description: "Chỉ hỗ trợ file PDF, JPG, PNG, DOCX",
        variant: "destructive",
      });
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "Lỗi",
        description: "Kích thước file không được vượt quá 10MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload file to PENDING folder (awaiting HR approval)
      const fileExt = file.name.split('.').pop();
      const fileName = `${employeeId}_${selectedType}_${Date.now()}.${fileExt}`;
      const tempPath = `documents/pending/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('employee-documents')
        .upload(tempPath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Create change request (NOT directly to employee_documents)
      const { error: requestError } = await supabase
        .from('document_change_requests')
        .insert({
          employee_id: employeeId,
          request_type: 'document_upload',
          document_type: selectedType,
          file_name: file.name,
          file_path: tempPath,
          file_size: file.size,
          mime_type: file.type,
          notes: notes || null,
          status: 'pending'
        });

      if (requestError) {
        // If request insert fails, cleanup uploaded file
        await supabase.storage.from('employee-documents').remove([tempPath]);
        throw requestError;
      }

      toast({
        title: "Gửi yêu cầu thành công",
        description: "HR sẽ xem xét yêu cầu của bạn trong thời gian sớm nhất.",
      });

      // Reset form
      setSelectedType('');
      setNotes('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Refresh list
      await fetchDocuments();
    } catch (error: any) {
      console.error('Error submitting document request:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể gửi yêu cầu",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!deleteRequestId) return;

    try {
      const request = pendingRequests.find(r => r.id === deleteRequestId);
      if (!request) return;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('employee-documents')
        .remove([request.file_path]);

      if (storageError) console.warn('Storage delete warning:', storageError);

      // Delete request from database
      const { error: dbError } = await supabase
        .from('document_change_requests')
        .delete()
        .eq('id', deleteRequestId);

      if (dbError) throw dbError;

      toast({
        title: "Thành công",
        description: "Hủy yêu cầu thành công",
      });

      await fetchDocuments();
    } catch (error: any) {
      console.error('Error deleting request:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể hủy yêu cầu",
        variant: "destructive",
      });
    } finally {
      setDeleteRequestId(null);
    }
  };

  const handleDownload = async (doc: EmployeeDocument | DocumentChangeRequest) => {
    // Prevent duplicate requests
    if (loadingDocIds.includes(doc.id)) {
      return;
    }

    setLoadingDocIds(prev => [...prev, doc.id]);
    
    try {
      const { data, error } = await supabase.storage
        .from('employee-documents')
        .createSignedUrl(doc.file_path, 60);

      if (error) throw error;

      window.open(data.signedUrl, '_blank');
    } catch (error: any) {
      console.error('Error downloading document:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải xuống chứng từ",
        variant: "destructive",
      });
    } finally {
      // Remove from loading list immediately
      setLoadingDocIds(prev => prev.filter(id => id !== doc.id));
    }
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getDocumentTypeLabel = (type: string): string => {
    return DOCUMENT_TYPES.find(t => t.value === type)?.label || type;
  };

  const getDocumentIcon = (type: string) => {
    const Icon = DOCUMENT_TYPES.find(t => t.value === type)?.icon || FileText;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileUp className="w-5 h-5" />
            Upload Chứng Từ
          </CardTitle>
          <CardDescription>
            Upload CCCD, bằng cấp, chứng chỉ và các chứng từ cá nhân khác
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Loại Chứng Từ *</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại chứng từ" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map(type => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Ghi Chú (Tùy chọn)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="VD: CCCD cấp ngày 01/01/2020"
                rows={2}
              />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.docx"
              onChange={handleFileChange}
              className="hidden"
            />

            <Button
              onClick={handleFileSelect}
              disabled={isUploading || !selectedType}
              className="w-full gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang upload...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Chọn File Upload
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground">
              Hỗ trợ: PDF, JPG, PNG, DOCX. Tối đa 10MB.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 text-yellow-500" />
              Yêu Cầu Chờ Duyệt
            </CardTitle>
            <CardDescription>
              Các yêu cầu upload đang chờ HR xem xét
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingRequests.map(request => (
                <div
                  key={request.id}
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    request.status === 'rejected' ? 'border-red-300 bg-red-50 dark:bg-red-950/20' : 'border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={request.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'}>
                      {getDocumentIcon(request.document_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{request.file_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {getDocumentTypeLabel(request.document_type)} • {formatFileSize(request.file_size)} • {new Date(request.requested_at).toLocaleDateString('vi-VN')}
                      </div>
                      {request.notes && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {request.notes}
                        </div>
                      )}
                      {request.status === 'rejected' && request.review_note && (
                        <div className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
                          ❌ Lý do từ chối: {request.review_note}
                        </div>
                      )}
                      <div className={`text-xs font-medium mt-1 ${
                        request.status === 'rejected' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {request.status === 'pending' ? '⏳ Chờ duyệt' : '❌ Đã từ chối'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(request as any)}
                      disabled={loadingDocIds.includes(request.id)}
                      title="Xem file"
                    >
                      {loadingDocIds.includes(request.id) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteRequestId(request.id)}
                      title="Hủy yêu cầu"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approved Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Chứng Từ Đã Duyệt</CardTitle>
          <CardDescription>
            Danh sách các chứng từ đã được HR phê duyệt
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chưa có chứng từ đã duyệt</p>
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-primary">
                      {getDocumentIcon(doc.document_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{doc.file_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {getDocumentTypeLabel(doc.document_type)} • {formatFileSize(doc.file_size)} • {new Date(doc.uploaded_at).toLocaleDateString('vi-VN')}
                      </div>
                      {doc.notes && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {doc.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(doc)}
                      disabled={loadingDocIds.includes(doc.id)}
                      title="Xem/Tải xuống"
                    >
                      {loadingDocIds.includes(doc.id) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Request Confirmation Dialog */}
      <AlertDialog open={!!deleteRequestId} onOpenChange={() => setDeleteRequestId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác Nhận Hủy Yêu Cầu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy yêu cầu upload này? File tạm thời sẽ bị xóa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Không</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRequest} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hủy Yêu Cầu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
