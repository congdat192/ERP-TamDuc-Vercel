import { useState } from 'react';
import { Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PayrollTemplateService } from '@/modules/hr/services/payrollTemplateService';
import { PayrollImportService } from '@/modules/hr/services/payrollImportService';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export function PayrollUploadSection({ onImportSuccess }: { onImportSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleDownloadTemplate = () => {
    PayrollTemplateService.generateTemplate();
    toast({
      title: 'Tải template thành công',
      description: 'File Template_Phieu_Luong đã được tải xuống',
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.xlsx')) {
        toast({
          variant: 'destructive',
          title: 'File không hợp lệ',
          description: 'Chỉ chấp nhận file .xlsx',
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsImporting(true);
    setProgress(0);

    try {
      const result = await PayrollImportService.importFromExcel(
        file,
        (current, total) => {
          setProgress(Math.round((current / total) * 100));
        }
      );

      if (result.errors.length > 0) {
        toast({
          variant: 'destructive',
          title: 'Import hoàn tất với lỗi',
          description: `Thành công: ${result.successCount} | Lỗi: ${result.failedCount}`,
        });
      } else {
        toast({
          title: 'Import thành công',
          description: `Đã import ${result.successCount} phiếu lương`,
        });
      }

      setFile(null);
      onImportSuccess();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Import thất bại',
        description: error.message,
      });
    } finally {
      setIsImporting(false);
      setProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Import Phiếu Lương Từ Excel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleDownloadTemplate} variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Tải Template Excel Mẫu
        </Button>

        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileSelect}
            className="hidden"
            id="payroll-upload"
          />
          <label
            htmlFor="payroll-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload className="w-12 h-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {file ? file.name : 'Kéo thả file .xlsx vào đây hoặc click để chọn'}
            </p>
          </label>
        </div>

        {isImporting && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-center text-muted-foreground">
              Đang import... {progress}%
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setFile(null)}
            disabled={!file || isImporting}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || isImporting}
            className="flex-1"
          >
            Xác Nhận Import
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
