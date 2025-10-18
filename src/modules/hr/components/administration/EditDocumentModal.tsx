import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AdminDocumentService } from '../../services/adminDocumentService';
import { DocumentTemplateService } from '../../services/documentTemplateService';
import { AdministrativeDocument, DocType, DocumentTemplate } from '../../types/administration';
import { EmployeeService } from '../../services/employeeService';
import { supabase } from '@/integrations/supabase/client';
import { Combobox } from '@/components/ui/combobox';

// Schema for edit validation
const editDocumentSchema = z.object({
  subject: z.string().min(1, "Trích yếu không được để trống"),
  content: z.string().min(1, "Nội dung không được để trống"),
  issue_date: z.string(),
  change_note: z.string().min(1, "Lý do chỉnh sửa không được để trống"),
});

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  document: AdministrativeDocument;
}

export function EditDocumentModal({ isOpen, onClose, onSuccess, document }: EditDocumentModalProps) {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [issueDate, setIssueDate] = useState<Date>(new Date());
  const [effectiveDate, setEffectiveDate] = useState<Date | undefined>();
  const [changeNote, setChangeNote] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentTemplates, setDocumentTemplates] = useState<DocumentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [employeeId, setEmployeeId] = useState<string>('');
  const [employees, setEmployees] = useState<Array<{ id: string; fullName: string; employeeCode: string; position: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Load document data when modal opens
  useEffect(() => {
    if (isOpen && document) {
      setSubject(document.subject);
      setContent(document.content);
      setIssueDate(new Date(document.issue_date));
      setEffectiveDate(document.effective_date ? new Date(document.effective_date) : undefined);
      setEmployeeId(document.employee_id || '');
      setChangeNote('');
      
      // Load templates for this doc type
      loadTemplates(document.doc_type);
    }
  }, [isOpen, document]);

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

  const loadTemplates = async (docType: DocType) => {
    try {
      const templates = await DocumentTemplateService.getTemplates(docType);
      setDocumentTemplates(templates);
    } catch (err: any) {
      console.error('❌ Error loading templates:', err);
    }
  };

  // Handle template selection
  const handleTemplateSelect = async (templateId: string) => {
    setSelectedTemplate(templateId);
    
    if (!templateId) return;
    
    try {
      const template = documentTemplates.find(t => t.id === templateId);
      if (!template) return;
      
      // Auto-fill content with template (with employee data if selected)
      const filledContent = await DocumentTemplateService.generateDocument(templateId, employeeId || undefined);
      setContent(filledContent);
      
      toast({
        title: "Thành công",
        description: "Đã áp dụng mẫu văn bản",
      });
    } catch (err: any) {
      console.error('❌ Error applying template:', err);
      toast({
        title: "Lỗi",
        description: "Không thể áp dụng mẫu văn bản",
        variant: "destructive",
      });
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Lỗi",
        description: "Chỉ chấp nhận file PDF, Word, hoặc ảnh (JPG, PNG)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "File không được vượt quá 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  // Validate form
  const validateForm = (): boolean => {
    try {
      editDocumentSchema.parse({
        subject,
        content,
        issue_date: issueDate.toISOString().split('T')[0],
        change_note: changeNote,
      });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0].toString()] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Handle update
  const handleUpdate = async () => {
    if (!validateForm()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng kiểm tra lại thông tin",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Upload new file if selected
      let fileName: string | undefined;
      let filePath: string | undefined;
      let fileSize: number | undefined;
      let mimeType: string | undefined;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        fileName = `${crypto.randomUUID()}.${fileExt}`;
        filePath = `admin-documents/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('employee-documents')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        fileSize = selectedFile.size;
        mimeType = selectedFile.type;
      }

      // Update document
      const updates = {
        subject,
        content,
        issue_date: issueDate.toISOString().split('T')[0],
        effective_date: effectiveDate ? effectiveDate.toISOString().split('T')[0] : undefined,
        employee_id: employeeId || undefined,
        ...(fileName && { file_name: fileName }),
        ...(filePath && { file_path: filePath }),
        ...(fileSize && { file_size: fileSize }),
        ...(mimeType && { mime_type: mimeType }),
      };

      await AdminDocumentService.updateDocument(document.id, updates, changeNote);

      toast({
        title: "Thành công",
        description: "Đã cập nhật văn bản",
      });

      handleClose();
      onSuccess();
    } catch (err: any) {
      console.error('❌ Error updating document:', err);
      toast({
        title: "Lỗi",
        description: err.message || "Không thể cập nhật văn bản",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle close
  const handleClose = () => {
    setSubject('');
    setContent('');
    setIssueDate(new Date());
    setEffectiveDate(undefined);
    setEmployeeId('');
    setChangeNote('');
    setSelectedFile(null);
    setSelectedTemplate('');
    setErrors({});
    onClose();
  };

  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa Văn bản</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Readonly: Doc Type & Doc Number */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <Label>Loại văn bản</Label>
              <Input 
                value={document.doc_type === 'decision' ? 'Quyết định' : 
                       document.doc_type === 'notice' ? 'Thông báo' :
                       document.doc_type === 'contract' ? 'Hợp đồng' : 'Biểu mẫu'}
                disabled
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>Số văn bản</Label>
              <Input 
                value={document.doc_no || 'Chưa có'}
                disabled
                className="bg-background"
              />
            </div>
          </div>

          {/* Employee Selection */}
          <div className="space-y-2">
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
          <div className="space-y-2">
            <Label htmlFor="template">Chọn mẫu văn bản (Tùy chọn)</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn mẫu..." />
              </SelectTrigger>
              <SelectContent>
                {documentTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Trích yếu <span className="text-destructive">*</span></Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ví dụ: Quyết định về việc bổ nhiệm..."
            />
            {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Nội dung <span className="text-destructive">*</span></Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung văn bản..."
              rows={8}
            />
            {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ngày ban hành <span className="text-destructive">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {issueDate ? format(issueDate, 'dd/MM/yyyy', { locale: vi }) : <span>Chọn ngày</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={issueDate}
                    onSelect={(date) => date && setIssueDate(date)}
                    locale={vi}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Ngày hiệu lực</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {effectiveDate ? format(effectiveDate, 'dd/MM/yyyy', { locale: vi }) : <span>Chọn ngày</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={effectiveDate}
                    onSelect={setEffectiveDate}
                    locale={vi}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">Tệp đính kèm (Thay thế file cũ nếu upload)</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.document.getElementById('file-upload-edit')?.click()}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                {selectedFile ? selectedFile.name : 'Chọn file mới...'}
              </Button>
              <input
                id="file-upload-edit"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </div>
            {document.file_name && !selectedFile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>File hiện tại: {document.file_name}</span>
              </div>
            )}
          </div>

          {/* Change Note - REQUIRED */}
          <div className="space-y-2">
            <Label htmlFor="change_note">Lý do chỉnh sửa <span className="text-destructive">*</span></Label>
            <Textarea
              id="change_note"
              value={changeNote}
              onChange={(e) => setChangeNote(e.target.value)}
              placeholder="Ví dụ: Cập nhật thông tin nhân viên, sửa lỗi chính tả..."
              rows={3}
            />
            {errors.change_note && <p className="text-sm text-destructive">{errors.change_note}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
