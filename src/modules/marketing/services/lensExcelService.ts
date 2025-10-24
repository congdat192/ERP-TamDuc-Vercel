import * as XLSX from 'xlsx';
import { LensProduct, LensBrand } from '../types/lens';
import { supabase } from '@/integrations/supabase/client';

export interface ExcelRow {
  'Mã SKU*': string;
  'Tên sản phẩm*': string;
  'Thương hiệu*': string;
  'Giá niêm yết (VNĐ)*': number;
  'Giá giảm (VNĐ)': number | '';
  'Chất liệu': string;
  'Chỉ số khúc xạ': string;
  'Xuất xứ': string;
  'Mô tả': string;
  'Khuyến mãi (true/false)': string;
  'Text khuyến mãi': string;
  [key: string]: any; // Allow dynamic multiselect columns
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  action: 'INSERT' | 'UPDATE';
  brandName?: string;
}

export interface ParsedProduct extends Partial<LensProduct> {
  _validation?: ValidationResult;
  _originalRow?: number;
}

export class LensExcelService {
  // Parse Excel file to array of objects
  static parseExcel(file: File): Promise<ExcelRow[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json<ExcelRow>(firstSheet);
          resolve(jsonData);
        } catch (error) {
          reject(new Error('Không thể đọc file Excel. Vui lòng kiểm tra định dạng file.'));
        }
      };
      
      reader.onerror = () => reject(new Error('Lỗi khi đọc file'));
      reader.readAsArrayBuffer(file);
    });
  }

  // Validate a single row
  static async validateRow(
    row: ExcelRow,
    rowIndex: number,
    brands: LensBrand[],
    allAttributes: any[],
    existingSKUs: Set<string>
  ): Promise<ParsedProduct> {
    const errors: string[] = [];
    const sku = row['Mã SKU*']?.toString().trim();
    const name = row['Tên sản phẩm*']?.toString().trim();
    const brandName = row['Thương hiệu*']?.toString().trim();
    const price = Number(row['Giá niêm yết (VNĐ)*']);
    const salePrice = row['Giá giảm (VNĐ)'] ? Number(row['Giá giảm (VNĐ)']) : null;

    // Required fields
    if (!sku) errors.push('SKU là bắt buộc');
    if (!name) errors.push('Tên sản phẩm là bắt buộc');
    if (!brandName) errors.push('Thương hiệu là bắt buộc');
    if (!price || isNaN(price) || price <= 0) errors.push('Giá niêm yết phải là số > 0');
    
    // Validate sale price
    if (salePrice !== null && salePrice !== undefined) {
      if (isNaN(salePrice) || salePrice <= 0) {
        errors.push('Giá giảm phải là số > 0');
      } else if (salePrice >= price) {
        errors.push('Giá giảm phải nhỏ hơn giá niêm yết');
      }
    }

    // SKU format
    if (sku && !/^[A-Za-z0-9-_]+$/.test(sku)) {
      errors.push('SKU chỉ chứa chữ, số, dấu gạch ngang và gạch dưới');
    }

    // Brand exists
    const brand = brands.find(b => b.name.toLowerCase() === brandName?.toLowerCase());
    if (!brand && brandName) {
      errors.push(`Thương hiệu "${brandName}" không tồn tại trong hệ thống`);
    }

    // Build attributes object
    const attributesData: Record<string, string[]> = {};
    
    // Add lens_brand
    if (brandName) {
      attributesData.lens_brand = [brandName];
    }
    
    // Add select attributes
    const selectAttrs = allAttributes.filter(a => a.type === 'select');
    selectAttrs.forEach(attr => {
      const value = row[attr.name as keyof ExcelRow]?.toString().trim();
      if (value) {
        attributesData[attr.slug] = [value];
      }
    });
    
    // Parse multiselect attributes from columns
    const multiselectAttrs = allAttributes.filter(a => a.type === 'multiselect');
    multiselectAttrs.forEach(attr => {
      const selectedValues: string[] = [];
      
      // Check each option column (e.g., "Chống UV400" = "Có")
      attr.options.forEach((option: string) => {
        const columnValue = row[option as keyof ExcelRow]?.toString().trim().toLowerCase();
        if (columnValue === 'có' || columnValue === 'true') {
          selectedValues.push(option);
        }
      });
      
      if (selectedValues.length > 0) {
        attributesData[attr.slug] = selectedValues;
      }
    });

    // Check if SKU exists (for upsert indicator)
    const action = existingSKUs.has(sku) ? 'UPDATE' : 'INSERT';

    // Parse promotion
    const isPromotion = row['Khuyến mãi (true/false)']?.toString().toLowerCase() === 'true';

    // Calculate discount percent
    const discountPercent = salePrice && price ? Math.round((1 - salePrice / price) * 100) : null;

    const parsedProduct: ParsedProduct = {
      sku,
      name,
      price,
      sale_price: salePrice,
      discount_percent: discountPercent,
      description: row['Mô tả']?.toString().trim() || null,
      is_promotion: isPromotion,
      promotion_text: row['Text khuyến mãi']?.toString().trim() || null,
      attributes: attributesData,
      _validation: {
        valid: errors.length === 0,
        errors,
        action,
        brandName,
      },
      _originalRow: rowIndex + 2 // +2 because Excel is 1-indexed and has header row
    };

    return parsedProduct;
  }

  // Validate all rows
  static async validateData(
    rows: ExcelRow[],
    brands: LensBrand[]
  ): Promise<ParsedProduct[]> {
    // Get existing SKUs from database
    const { data: existingProducts } = await supabase
      .from('lens_products')
      .select('sku');
    
    const existingSKUs = new Set(existingProducts?.map(p => p.sku) || []);

    // Get all attributes for validation
    const { data: allAttributes } = await supabase
      .from('lens_product_attributes')
      .select('*')
      .eq('is_active', true);
    
    const attributesWithParsedOptions = (allAttributes || []).map(attr => ({
      ...attr,
      options: typeof attr.options === 'string' ? JSON.parse(attr.options) : attr.options
    }));

    // Validate each row
    const validatedProducts = await Promise.all(
      rows.map((row, index) => 
        this.validateRow(row, index, brands, attributesWithParsedOptions, existingSKUs)
      )
    );

    return validatedProducts;
  }

  // Upsert products with batch processing
  static async upsertProducts(
    products: ParsedProduct[]
  ): Promise<{
    inserted: number;
    updated: number;
    errors: Array<{ row: number; message: string }>;
  }> {
    const results = { inserted: 0, updated: 0, errors: [] as Array<{ row: number; message: string }> };
    const BATCH_SIZE = 50;

    // Filter only valid products
    const validProducts = products.filter(p => p._validation?.valid);

    // Process in batches
    for (let i = 0; i < validProducts.length; i += BATCH_SIZE) {
      const batch = validProducts.slice(i, i + BATCH_SIZE);
      
      try {
        // Prepare products for upsert (remove validation metadata)
        const productsToUpsert = batch.map(p => ({
          sku: p.sku,
          name: p.name,
          price: p.price,
          sale_price: p.sale_price,
          discount_percent: p.discount_percent,
          description: p.description,
          is_promotion: p.is_promotion,
          promotion_text: p.promotion_text,
          attributes: p.attributes || {},
          is_active: true,
          image_urls: p.image_urls || [],
          related_product_ids: p.related_product_ids || [],
          view_count: 0,
        }));

        const { data: upsertedProducts, error } = await supabase
          .from('lens_products')
          .upsert(productsToUpsert, {
            onConflict: 'sku',
            ignoreDuplicates: false
          })
          .select('id, sku, created_at, updated_at');

        if (error) throw error;

        // Count inserts vs updates
        for (let j = 0; j < batch.length; j++) {
          const product = batch[j];
          const upsertedProduct = upsertedProducts?.find(up => up.sku === product.sku);
          
          if (upsertedProduct) {
            if (upsertedProduct.created_at === upsertedProduct.updated_at) {
              results.inserted++;
            } else {
              results.updated++;
            }
          }
        }
      } catch (error: any) {
        batch.forEach(p => {
          results.errors.push({
            row: p._originalRow || 0,
            message: error.message
          });
        });
      }
    }

    return results;
  }

  // Generate Excel from products
  static generateExcel(products: any[]): XLSX.WorkBook {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lens Products');
    return workbook;
  }

  // Download Excel file
  static downloadExcel(data: any[], filename: string) {
    const workbook = this.generateExcel(data);
    XLSX.writeFile(workbook, filename);
  }

  // Get empty template
  static async downloadTemplate() {
    // Fetch all attributes from database
    const { data: allAttributes } = await supabase
      .from('lens_product_attributes')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    
    const parsedAttributes = (allAttributes || []).map(attr => ({
      ...attr,
      options: typeof attr.options === 'string' ? JSON.parse(attr.options) : attr.options
    }));
    
    const selectAttrs = parsedAttributes.filter(a => a.type === 'select');
    const multiselectAttrs = parsedAttributes.filter(a => a.type === 'multiselect');

    const template: any = {
      'Mã SKU*': 'EXAMPLE-SKU',
      'Tên sản phẩm*': 'Tên sản phẩm mẫu',
      'Thương hiệu*': 'Essilor',
      'Giá niêm yết (VNĐ)*': 1000000,
      'Giá giảm (VNĐ)': 800000,
      'Mô tả': 'Mô tả sản phẩm',
      'Khuyến mãi (true/false)': 'false',
      'Text khuyến mãi': ''
    };

    // Add select attribute columns
    selectAttrs.forEach(attr => {
      template[attr.name] = attr.options[0] || '';
    });

    // Add multiselect columns dynamically
    multiselectAttrs.forEach(attr => {
      attr.options.forEach((option: string) => {
        template[option] = 'Không'; // Default value
      });
    });

    // Add 1 example with "Có"
    if (multiselectAttrs.length > 0 && multiselectAttrs[0].options.length > 0) {
      template[multiselectAttrs[0].options[0]] = 'Có';
    }

    this.downloadExcel([template], `lens-template-${Date.now()}.xlsx`);
  }
}

export const lensExcelService = LensExcelService;
