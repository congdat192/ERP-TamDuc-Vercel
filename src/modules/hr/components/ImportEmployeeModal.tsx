import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImportService, ImportError } from '../services/importService';
import { TemplateService } from '../services/templateService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ImportEmployeeModalProps {
  onSuccess: () => void;
}

export function ImportEmployeeModal({ onSuccess }: ImportEmployeeModalProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [importResult, setImportResult] = useState<{
    totalRows: number;
    successCount: number;
    errorCount: number;
  } | null>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file type
    if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn file Excel (.xlsx hoặc .xls)',
        variant: 'destructive',
      });
      return;
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: 'Lỗi',
        description: 'File không được vượt quá 5MB',
        variant: 'destructive',
      });
      return;
    }

    setFile(selectedFile);
    setErrors([]);
    setImportResult(null);

    // Parse and validate
    setIsValidating(true);
    try {
      const rows = await ImportService.parseExcelFile(selectedFile);
      
      // Show preview (first 10 rows)
      setPreviewData(rows.slice(0, 10));

      // Validate all rows
      const allErrors: ImportError[] = [];
      for (let i = 0; i < rows.length; i++) {
        const rowIndex = i + 2;
        const mappedRow = ImportService.mapColumnAliases(rows[i]);
        const validation = await ImportService.validateRow(mappedRow, rowIndex);
        if (!validation.isValid) {
          allErrors.push(...validation.errors);
        }
      }

      setErrors(allErrors);

      if (allErrors.length === 0) {
        toast({
          title: 'Validation thành công',
          description: `${rows.length} dòng dữ liệu hợp lệ`,
        });
      } else {
        toast({
          title: 'Phát hiện lỗi',
          description: `${allErrors.length} lỗi trong ${rows.length} dòng`,
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Lỗi',
        description: err.message || 'Không thể đọc file',
        variant: 'destructive',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleImport = async () => {
    if (!file || errors.length > 0) return;

    setIsImporting(true);
    try {
      const result = await ImportService.importFromExcel(file);
      setImportResult(result);

      if (result.successCount > 0) {
        toast({
          title: 'Import thành công',
          description: `Đã nhập ${result.successCount} nhân viên`,
        });
        onSuccess();
      }

      if (result.errorCount > 0) {
        setErrors(result.errors);
        toast({
          title: 'Import hoàn tất với lỗi',
          description: `${result.successCount} thành công, ${result.errorCount} lỗi`,
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Lỗi',
        description: err.message || 'Không thể import',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    TemplateService.generateEmployeeTemplate();
    toast({
      title: 'Thành công',
      description: 'Đã tải template Excel',
    });
  };

  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setPreviewData([]);
    setErrors([]);
    setImportResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Nhập Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Nhập danh sách nhân viên từ Excel</DialogTitle>
          <DialogDescription>
            Tải lên file Excel chứa thông tin nhân viên. Dữ liệu sẽ được validate trước khi import.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-auto">
          {/* Template Download */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Chưa có template?</p>
                <p className="text-sm text-muted-foreground">
                  Tải xuống file mẫu để điền thông tin
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleDownloadTemplate} className="gap-2">
              <Download className="h-4 w-4" />
              Tải Template
            </Button>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">
              {file ? file.name : 'Chọn file Excel để import'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Hỗ trợ .xlsx, .xls (Tối đa 5MB)
            </p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" asChild>
                <span>Chọn File</span>
              </Button>
            </label>
          </div>

          {/* Validation Progress */}
          {isValidating && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Đang validate dữ liệu...</p>
              <Progress value={undefined} />
            </div>
          )}

          {/* Validation Summary */}
          {file && !isValidating && (
            <div className="grid grid-cols-3 gap-4">
              <Alert>
                <FileSpreadsheet className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium">Tổng số dòng</div>
                  <div className="text-2xl">{previewData.length}</div>
                </AlertDescription>
              </Alert>
              <Alert variant={errors.length === 0 ? 'default' : 'destructive'}>
                {errors.length === 0 ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  <div className="font-medium">Lỗi</div>
                  <div className="text-2xl">{errors.length}</div>
                </AlertDescription>
              </Alert>
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium">Hợp lệ</div>
                  <div className="text-2xl">{Math.max(0, previewData.length - errors.length)}</div>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Error Table */}
          {errors.length > 0 && (
            <div className="border rounded-lg">
              <div className="p-4 border-b bg-muted">
                <h4 className="font-medium">Danh sách lỗi ({errors.length})</h4>
              </div>
              <ScrollArea className="h-[200px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dòng</TableHead>
                      <TableHead>Trường</TableHead>
                      <TableHead>Lỗi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {errors.map((error, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{error.row}</TableCell>
                        <TableCell>{error.field}</TableCell>
                        <TableCell className="text-destructive">{error.message}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}

          {/* Preview Table */}
          {previewData.length > 0 && errors.length === 0 && (
            <div className="border rounded-lg">
              <div className="p-4 border-b bg-muted">
                <h4 className="font-medium">Xem trước dữ liệu (10 dòng đầu)</h4>
              </div>
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã NV</TableHead>
                      <TableHead>Họ tên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phòng ban</TableHead>
                      <TableHead>Chức danh</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row, idx) => {
                      const mapped = ImportService.mapColumnAliases(row);
                      return (
                        <TableRow key={idx}>
                          <TableCell>{mapped.employee_code}</TableCell>
                          <TableCell>{mapped.full_name}</TableCell>
                          <TableCell>{mapped.email}</TableCell>
                          <TableCell>{mapped.department}</TableCell>
                          <TableCell>{mapped.position}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium">Kết quả import</div>
                <div>
                  Thành công: {importResult.successCount} / {importResult.totalRows}
                </div>
                {importResult.errorCount > 0 && (
                  <div className="text-destructive">Lỗi: {importResult.errorCount}</div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Đóng
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || errors.length > 0 || isImporting || isValidating}
          >
            {isImporting ? 'Đang import...' : 'Xác nhận import'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
