import * as XLSX from 'xlsx';
import { LensProduct, LensBrand, LensFeature } from '../types/lens';
import { supabase } from '@/integrations/supabase/client';

export interface ExcelRow {
  'Mã SKU*': string;
  'Tên sản phẩm*': string;
  'Thương hiệu*': string;
  'Giá (VNĐ)*': number;
  'Chất liệu': string;
  'Chỉ số khúc xạ': string;
  'Xuất xứ': string;
  'Bảo hành (tháng)': number;
  'Đặc tính (code, phân cách bởi ,)': string;
  'Mô tả': string;
  'Khuyến mãi (true/false)': string;
  'Text khuyến mãi': string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  action: 'INSERT' | 'UPDATE';
  brandId?: string;
  featureCodes?: string[];
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
    features: LensFeature[],
    existingSKUs: Set<string>
  ): Promise<ParsedProduct> {
    const errors: string[] = [];
    const sku = row['Mã SKU*']?.toString().trim();
    const name = row['Tên sản phẩm*']?.toString().trim();
    const brandName = row['Thương hiệu*']?.toString().trim();
    const price = Number(row['Giá (VNĐ)*']);

    // Required fields
    if (!sku) errors.push('SKU là bắt buộc');
    if (!name) errors.push('Tên sản phẩm là bắt buộc');
    if (!brandName) errors.push('Thương hiệu là bắt buộc');
    if (!price || isNaN(price) || price <= 0) errors.push('Giá phải là số > 0');

    // SKU format
    if (sku && !/^[A-Za-z0-9-_]+$/.test(sku)) {
      errors.push('SKU chỉ chứa chữ, số, dấu gạch ngang và gạch dưới');
    }

    // Brand exists
    const brand = brands.find(b => b.name.toLowerCase() === brandName?.toLowerCase());
    if (!brand && brandName) {
      errors.push(`Thương hiệu "${brandName}" không tồn tại trong hệ thống`);
    }

    // Parse features
    const featureCodesStr = row['Đặc tính (code, phân cách bởi ,)']?.toString().trim();
    const featureCodes = featureCodesStr 
      ? featureCodesStr.split(',').map(f => f.trim()).filter(Boolean)
      : [];

    // Validate features
    const invalidFeatures = featureCodes.filter(
      code => !features.some(f => f.code === code)
    );
    if (invalidFeatures.length > 0) {
      errors.push(`Đặc tính không tồn tại: ${invalidFeatures.join(', ')}`);
    }

    // Check if SKU exists (for upsert indicator)
    const action = existingSKUs.has(sku) ? 'UPDATE' : 'INSERT';

    // Parse promotion
    const isPromotion = row['Khuyến mãi (true/false)']?.toString().toLowerCase() === 'true';

    const parsedProduct: ParsedProduct = {
      sku,
      name,
      brand_id: brand?.id,
      price,
      material: row['Chất liệu']?.toString().trim() || null,
      refractive_index: row['Chỉ số khúc xạ']?.toString().trim() || null,
      origin: row['Xuất xứ']?.toString().trim() || null,
      warranty_months: Number(row['Bảo hành (tháng)']) || null,
      description: row['Mô tả']?.toString().trim() || null,
      is_promotion: isPromotion,
      promotion_text: row['Text khuyến mãi']?.toString().trim() || null,
      _validation: {
        valid: errors.length === 0,
        errors,
        action,
        brandId: brand?.id,
        featureCodes
      },
      _originalRow: rowIndex + 2 // +2 because Excel is 1-indexed and has header row
    };

    return parsedProduct;
  }

  // Validate all rows
  static async validateData(
    rows: ExcelRow[],
    brands: LensBrand[],
    features: LensFeature[]
  ): Promise<ParsedProduct[]> {
    // Get existing SKUs from database
    const { data: existingProducts } = await supabase
      .from('lens_products')
      .select('sku');
    
    const existingSKUs = new Set(existingProducts?.map(p => p.sku) || []);

    // Validate each row
    const validatedProducts = await Promise.all(
      rows.map((row, index) => 
        this.validateRow(row, index, brands, features, existingSKUs)
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
          brand_id: p.brand_id,
          price: p.price,
          material: p.material,
          refractive_index: p.refractive_index,
          origin: p.origin,
          warranty_months: p.warranty_months,
          description: p.description,
          is_promotion: p.is_promotion,
          promotion_text: p.promotion_text,
          is_active: true
        }));

        const { data: upsertedProducts, error } = await supabase
          .from('lens_products')
          .upsert(productsToUpsert, {
            onConflict: 'sku',
            ignoreDuplicates: false
          })
          .select('id, sku, created_at, updated_at');

        if (error) throw error;

        // Link features for each product
        for (let j = 0; j < batch.length; j++) {
          const product = batch[j];
          const upsertedProduct = upsertedProducts.find(up => up.sku === product.sku);
          
          if (upsertedProduct && product._validation?.featureCodes?.length) {
            // Get feature IDs
            const { data: featureData } = await supabase
              .from('lens_features')
              .select('id, code')
              .in('code', product._validation.featureCodes);

            const featureIds = featureData?.map(f => f.id) || [];

            if (featureIds.length > 0) {
              // Delete existing links
              await supabase
                .from('lens_product_features')
                .delete()
                .eq('product_id', upsertedProduct.id);

              // Insert new links
              const links = featureIds.map(featureId => ({
                product_id: upsertedProduct.id,
                feature_id: featureId
              }));

              await supabase.from('lens_product_features').insert(links);
            }
          }

          // Count inserts vs updates
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
  static downloadTemplate() {
    const template: ExcelRow[] = [{
      'Mã SKU*': 'EXAMPLE-SKU',
      'Tên sản phẩm*': 'Tên sản phẩm mẫu',
      'Thương hiệu*': 'Essilor',
      'Giá (VNĐ)*': 500000,
      'Chất liệu': 'Resin',
      'Chỉ số khúc xạ': '1.56',
      'Xuất xứ': 'Pháp',
      'Bảo hành (tháng)': 12,
      'Đặc tính (code, phân cách bởi ,)': 'blue_light,anti_scratch',
      'Mô tả': 'Mô tả sản phẩm',
      'Khuyến mãi (true/false)': 'false',
      'Text khuyến mãi': ''
    }];

    this.downloadExcel(template, `lens-template-${Date.now()}.xlsx`);
  }
}

export const lensExcelService = LensExcelService;
