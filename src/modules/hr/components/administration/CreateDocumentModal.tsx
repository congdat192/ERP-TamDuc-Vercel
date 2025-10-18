import { useState, useEffect } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AdminDocumentService } from '../../services/adminDocumentService';
import { DocumentTemplateService } from '../../services/documentTemplateService';
import { EmployeeService } from '../../services/employeeService';
import type { DocType, DocumentTemplate } from '../../types/administration';
import { getDocTypeLabel } from '../../types/administration';
import { Combobox } from '@/components/ui/combobox';
import { z } from 'zod';

const documentSchema = z.object({
  doc_type: z.enum(['decision', 'notice', 'contract', 'form']),
  subject: z.string().trim().min(1, 'Tiêu đề không được để trống').max(500, 'Tiêu đề tối đa 500 ký tự'),
  content: z.string().trim().min(1, 'Nội dung không được để trống').max(50000, 'Nội dung tối đa 50000 ký tự'),
  issue_date: z.string().min(1, 'Ngày phát hành không được để trống'),
  effective_date: z.string().optional(),
  employee_id: z.string().optional(),
});

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateDocumentModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateDocumentModalProps) {
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState<DocType>('decision');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [effectiveDate, setEffectiveDate] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [employeeId, setEmployeeId] = useState<string>('');
  const [employees, setEmployees] = useState<Array<{ id: string; fullName: string; employeeCode: string; position: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Load employees on mount
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const empData = await EmployeeService.getEmployees();
        setEmployees(empData.map(emp => ({
          id: emp.id,
          fullName: emp.fullName,
          employeeCode: emp.employeeCode,
          position: emp.position
        })));
      } catch (err) {
        console.error('❌ Error loading employees:', err);
      }
    };
    
    if (isOpen) {
      loadEmployees();
    }
  }, [isOpen]);

  const handleDocTypeChange = async (type: DocType) => {
    setDocType(type);
    try {
      const data = await DocumentTemplateService.getTemplates(type);
      setTemplates(data);
    } catch (error: any) {
      console.error('Error loading templates:', error);
    }
  };

  const handleTemplateSelect = async (templateId: string) => {
    setSelectedTemplate(templateId);
    if (!templateId) return;

    try {
      const generatedContent = await DocumentTemplateService.generateDocument(templateId, employeeId || undefined);
      setContent(generatedContent);
      toast({
        title: 'Thành công',
        description: 'Đã áp dụng mẫu văn bản',
      });
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Lỗi',
          description: 'Chỉ hỗ trợ file PDF, Word, Excel',
          variant: 'destructive',
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'Lỗi',
          description: 'Kích thước file không được vượt quá 10MB',
          variant: 'destructive',
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const validateForm = () => {
    try {
      documentSchema.parse({
        doc_type: docType,
        subject: subject,
        content: content,
        issue_date: issueDate,
        effective_date: effectiveDate || undefined,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let fileData = undefined;
      if (selectedFile) {
        const tempId = crypto.randomUUID();
        fileData = await AdminDocumentService.uploadFile(selectedFile, tempId);
      }

      await AdminDocumentService.createDocument({
        doc_type: docType,
        subject: subject.trim(),
        content: content.trim(),
        issue_date: issueDate,
        effective_date: effectiveDate || undefined,
        employee_id: employeeId || undefined,
        ...fileData,
      });

      toast({
        title: 'Thành công',
        description: 'Đã lưu văn bản nháp',
      });
      
      onSuccess();
      handleClose();
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

  const handleSubmitForApproval = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let fileData = undefined;
      if (selectedFile) {
        const tempId = crypto.randomUUID();
        fileData = await AdminDocumentService.uploadFile(selectedFile, tempId);
      }

      const doc = await AdminDocumentService.createDocument({
        doc_type: docType,
        subject: subject.trim(),
        content: content.trim(),
        issue_date: issueDate,
        effective_date: effectiveDate || undefined,
        employee_id: employeeId || undefined,
        ...fileData,
      });

      // Submit for approval
      await AdminDocumentService.submitForApproval(doc.id);

      toast({
        title: 'Thành công',
        description: 'Đã gửi văn bản chờ phê duyệt',
      });
      
      onSuccess();
      handleClose();
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

  const handleClose = () => {
    setStep(1);
    setDocType('decision');
    setSubject('');
    setContent('');
    setIssueDate(new Date().toISOString().split('T')[0]);
    setEffectiveDate('');
    setEmployeeId('');
    setSelectedFile(null);
    setSelectedTemplate('');
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo Văn Bản Mới</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1: Document Type */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="doc_type">
                Loại Văn Bản <span className="text-destructive">*</span>
              </Label>
              <Select value={docType} onValueChange={(v) => handleDocTypeChange(v as DocType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="decision">{getDocTypeLabel('decision')}</SelectItem>
                  <SelectItem value="notice">{getDocTypeLabel('notice')}</SelectItem>
                  <SelectItem value="contract">{getDocTypeLabel('contract')}</SelectItem>
                  <SelectItem value="form">{getDocTypeLabel('form')}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Số văn bản sẽ tự động: {getDocTypeLabel(docType).split(' ')[0]}-XXX/{new Date().getFullYear()}
              </p>
            </div>

            {/* Employee Selection */}
            <div>
              <Label htmlFor="employee">Nhân viên liên quan (Tùy chọn)</Label>
              <Combobox
                options={employees.map(emp => ({
                  value: emp.id,
                  label: emp.fullName,
                  description: `${emp.employeeCode} - ${emp.position}`
                }))}
                value={employeeId}
                onValueChange={(value) => {
                  setEmployeeId(value);
                  // Re-apply template if selected
                  if (selectedTemplate && value) {
                    handleTemplateSelect(selectedTemplate);
                  }
                }}
                placeholder="Chọn nhân viên..."
                searchPlaceholder="Tìm nhân viên..."
                emptyMessage="Không tìm thấy nhân viên"
                className="w-full"
              />
            </div>

            {/* Template Selection */}
            {templates.length > 0 && (
              <div>
                <Label htmlFor="template">Chọn Mẫu (Tùy chọn)</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Không sử dụng mẫu --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">-- Không sử dụng mẫu --</SelectItem>
                    {templates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Step 2: Content */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">
                Tiêu Đề <span className="text-destructive">*</span>
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Nhập tiêu đề văn bản..."
                maxLength={500}
              />
              {errors.subject && (
                <p className="text-xs text-destructive mt-1">{errors.subject}</p>
              )}
            </div>

            <div>
              <Label htmlFor="content">
                Nội Dung <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung văn bản..."
                rows={12}
                maxLength={50000}
              />
              {errors.content && (
                <p className="text-xs text-destructive mt-1">{errors.content}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {content.length} / 50000 ký tự
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issue_date">
                  Ngày Phát Hành <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                />
                {errors.issue_date && (
                  <p className="text-xs text-destructive mt-1">{errors.issue_date}</p>
                )}
              </div>

              <div>
                <Label htmlFor="effective_date">Ngày Hiệu Lực</Label>
                <Input
                  id="effective_date"
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Step 3: File Upload */}
          <div>
            <Label htmlFor="file">File Đính Kèm (Tùy chọn)</Label>
            <div className="mt-2">
              <label
                htmlFor="file"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <div className="text-center">
                  {selectedFile ? (
                    <div className="flex items-center gap-2">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Nhấn để chọn file PDF, Word, Excel
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tối đa 10MB
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="file"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileChange}
                />
              </label>
              {selectedFile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="mt-2"
                >
                  <X className="h-4 w-4 mr-2" />
                  Xóa file
                </Button>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            variant="secondary"
            onClick={handleSaveDraft}
            disabled={isLoading}
          >
            Lưu Nháp
          </Button>
          <Button onClick={handleSubmitForApproval} disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Gửi Phê Duyệt'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
