import { Download, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { lensExcelService } from '../../services/lensExcelService';
import { lensApi } from '../../services/lensApi';

export function ExportExcelButton() {
  const { toast } = useToast();

  const handleExportAll = async () => {
    try {
      toast({
        title: 'Đang xuất dữ liệu...',
        description: 'Vui lòng đợi trong giây lát'
      });

      // Fetch all products
      const { products } = await lensApi.getProducts({}, 1, 10000);
      
      // Fetch all attributes to dynamically build columns
      const allAttributes = await lensApi.getAttributes();
      const selectAttrs = allAttributes.filter(a => a.type === 'select');
      const multiselectAttrs = allAttributes.filter(a => a.type === 'multiselect');

      if (products.length === 0) {
        toast({
          title: 'Cảnh báo',
          description: 'Không có sản phẩm nào để xuất',
          variant: 'destructive'
        });
        return;
      }

      // Format data for Excel
      const excelData = products.map(p => {
        const row: any = {
          'Mã SKU*': p.sku,
          'Tên sản phẩm*': p.name,
          'Thương hiệu*': p.attributes?.lens_brand?.[0] || '',
          'Giá niêm yết (VNĐ)*': p.price,
          'Giá giảm (VNĐ)': p.sale_price || '',
          'Mô tả': p.description || '',
          'Khuyến mãi (true/false)': p.is_promotion ? 'true' : 'false',
          'Text khuyến mãi': p.promotion_text || ''
        };

        // Add all select attribute columns dynamically (exclude lens_brand as it's already added)
        selectAttrs.forEach(attr => {
          if (attr.slug !== 'lens_brand') {
            row[attr.name] = p.attributes?.[attr.slug]?.[0] || '';
          }
        });

        // Add multiselect columns dynamically
        multiselectAttrs.forEach(attr => {
          const selectedValues = p.attributes?.[attr.slug] || [];
          
          // Create column for each option: "Chống UV" = "Có" or "Không"
          attr.options.forEach((option: string) => {
            row[option] = selectedValues.includes(option) ? 'Có' : 'Không';
          });
        });

        return row;
      });

      // Download Excel
      const timestamp = new Date().toISOString().split('T')[0];
      lensExcelService.downloadExcel(excelData, `lens-products-${timestamp}.xlsx`);

      toast({
        title: 'Thành công',
        description: `Đã xuất ${products.length} sản phẩm ra file Excel`
      });
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDownloadTemplate = () => {
    lensExcelService.downloadTemplate();
    toast({
      title: 'Thành công',
      description: 'Đã tải template Excel'
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Xuất Excel
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportAll}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Xuất toàn bộ sản phẩm
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadTemplate}>
          <Download className="w-4 h-4 mr-2" />
          Tải template trống
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
