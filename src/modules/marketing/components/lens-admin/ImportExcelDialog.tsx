import { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { lensExcelService, ParsedProduct } from '../../services/lensExcelService';

interface ImportExcelDialogProps {
  open: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

export function ImportExcelDialog({
  open,
  onClose,
  onImportSuccess
}: ImportExcelDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'results'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    inserted: number;
    updated: number;
    errors: Array<{ row: number; message: string }>;
  } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    if (!validTypes.includes(selectedFile.type)) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn file Excel (.xlsx, .xls) hoặc CSV',
        variant: 'destructive'
      });
      return;
    }

    setFile(selectedFile);
    
    try {
      // Parse Excel
      const rows = await lensExcelService.parseExcel(selectedFile);
      
      if (rows.length === 0) {
        toast({
          title: 'Cảnh báo',
          description: 'File Excel không có dữ liệu',
          variant: 'destructive'
        });
        return;
      }

      // Validate data
      const validated = await lensExcelService.validateData(rows);
      setParsedProducts(validated);
      setStep('preview');
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleConfirmImport = async () => {
    setStep('importing');
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const importResults = await lensExcelService.upsertProducts(parsedProducts);
      
      clearInterval(progressInterval);
      setProgress(100);
      setResults(importResults);
      setStep('results');

      if (importResults.errors.length === 0) {
        onImportSuccess();
        toast({
          title: 'Thành công',
          description: `Đã nhập ${importResults.inserted + importResults.updated} sản phẩm`,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
      setStep('preview');
    }
  };

  const handleReset = () => {
    setStep('upload');
    setFile(null);
    setParsedProducts([]);
    setProgress(0);
    setResults(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const validCount = parsedProducts.filter(p => p._validation?.valid).length;
  const invalidCount = parsedProducts.length - validCount;
  const insertCount = parsedProducts.filter(p => p._validation?.action === 'INSERT' && p._validation?.valid).length;
  const updateCount = parsedProducts.filter(p => p._validation?.action === 'UPDATE' && p._validation?.valid).length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nhập sản phẩm từ Excel</DialogTitle>
          <DialogDescription>
            {step === 'upload' && 'Tải file Excel lên để nhập sản phẩm'}
            {step === 'preview' && 'Xem trước dữ liệu trước khi nhập'}
            {step === 'importing' && 'Đang nhập sản phẩm...'}
            {step === 'results' && 'Kết quả nhập dữ liệu'}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Upload */}
        {step === 'upload' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Chọn file Excel</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Hỗ trợ: .xlsx, .xls, .csv
              </p>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
                id="excel-upload"
              />
              <label htmlFor="excel-upload">
                <Button asChild>
                  <span>Chọn file</span>
                </Button>
              </label>
            </div>

            <Button
              variant="outline"
              onClick={() => lensExcelService.downloadTemplate()}
              className="w-full"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Tải template mẫu
            </Button>
          </div>
        )}

        {/* Step 2: Preview */}
        {step === 'preview' && (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Tìm thấy <strong>{parsedProducts.length}</strong> sản phẩm • 
                <span className="text-green-600 ml-2">✓ {validCount} hợp lệ</span> • 
                <span className="text-red-600 ml-2">✗ {invalidCount} lỗi</span> • 
                <span className="text-blue-600 ml-2">🆕 {insertCount} mới</span> • 
                <span className="text-orange-600 ml-2">🔄 {updateCount} cập nhật</span>
              </AlertDescription>
            </Alert>

            <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="p-2 text-left">Row</th>
                    <th className="p-2 text-left">SKU</th>
                    <th className="p-2 text-left">Tên sản phẩm</th>
                    <th className="p-2 text-left">Giá</th>
                    <th className="p-2 text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedProducts.map((product, index) => (
                    <tr
                      key={index}
                      className={
                        product._validation?.valid
                          ? 'bg-green-50 dark:bg-green-950/20'
                          : 'bg-red-50 dark:bg-red-950/20'
                      }
                    >
                      <td className="p-2">{product._originalRow}</td>
                      <td className="p-2 font-mono text-xs">{product.sku}</td>
                      <td className="p-2">{product.name}</td>
                      <td className="p-2">{product.price?.toLocaleString()}đ</td>
                      <td className="p-2">
                        {product._validation?.valid ? (
                          <span className="flex items-center gap-1 text-xs">
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                            {product._validation.action === 'INSERT' ? (
                              <span className="text-blue-600">Mới</span>
                            ) : (
                              <span className="text-orange-600">Cập nhật</span>
                            )}
                          </span>
                        ) : (
                          <div className="text-xs text-red-600">
                            {product._validation?.errors.map((err, i) => (
                              <div key={i}>• {err}</div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {invalidCount > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Có {invalidCount} sản phẩm lỗi sẽ bị bỏ qua. Chỉ {validCount} sản phẩm hợp lệ sẽ được nhập.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Step 3: Importing */}
        {step === 'importing' && (
          <div className="space-y-4 py-8">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg font-semibold">Đang nhập dữ liệu...</p>
              <p className="text-sm text-muted-foreground">Vui lòng không đóng cửa sổ</p>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Step 4: Results */}
        {step === 'results' && results && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{results.inserted}</div>
                <div className="text-sm text-muted-foreground">Thêm mới</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{results.updated}</div>
                <div className="text-sm text-muted-foreground">Cập nhật</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{results.errors.length}</div>
                <div className="text-sm text-muted-foreground">Lỗi</div>
              </div>
            </div>

            {results.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-2">Chi tiết lỗi:</div>
                  <div className="space-y-1 text-xs max-h-32 overflow-y-auto">
                    {results.errors.map((err, i) => (
                      <div key={i}>• Row {err.row}: {err.message}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {results.errors.length === 0 && (
              <Alert>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">
                  Nhập dữ liệu thành công! Tất cả sản phẩm đã được xử lý.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter>
          {step === 'upload' && (
            <Button variant="outline" onClick={handleClose}>
              Đóng
            </Button>
          )}

          {step === 'preview' && (
            <>
              <Button variant="outline" onClick={handleReset}>
                Chọn file khác
              </Button>
              <Button
                onClick={handleConfirmImport}
                disabled={validCount === 0}
              >
                Xác nhận nhập ({validCount} sản phẩm)
              </Button>
            </>
          )}

          {step === 'results' && (
            <>
              <Button variant="outline" onClick={handleReset}>
                Nhập file khác
              </Button>
              <Button onClick={handleClose}>
                Hoàn thành
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
