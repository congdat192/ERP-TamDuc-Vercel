import * as XLSX from 'xlsx';
import { LensProduct, LensBrand } from '../types/lens';
import { supabase } from '@/integrations/supabase/client';

export interface ExcelRow {
  'Mã SKU*': string;
  'Tên sản phẩm*': string;
  'Thương hiệu*': string;
  'Giá niêm yết (VNĐ)*': number;
  'Giá giảm (VNĐ)': number | '';
  'Mô tả': string;
  'Khuyến mãi (true/false)': string;
  'Text khuyến mãi': string;
  // Supply tier columns
  'Độ cầu Min (SPH)': number | '';
  'Độ cầu Max (SPH)': number | '';
  'Độ loạn Min (CYL)': number | '';
  'Độ loạn Max (CYL)': number | '';
  'Tầng cung ứng': string;
  // Dynamic columns for select and multiselect attributes
  [key: string]: any;
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
  _supply_tier_data?: {
    sph_min: number;
    sph_max: number;
    cyl_min: number;
    cyl_max: number;
    tier_type: string;
  } | null;
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

    // Parse supply tier data (optional)
    let supplyTierData: ParsedProduct['_supply_tier_data'] = null;
    const sphMin = row['Độ cầu Min (SPH)'];
    const sphMax = row['Độ cầu Max (SPH)'];
    const cylMin = row['Độ loạn Min (CYL)'];
    const cylMax = row['Độ loạn Max (CYL)'];
    const tierType = row['Tầng cung ứng']?.toString().trim();

    // If any supply tier data is provided, validate and parse it
    if (sphMin !== '' && sphMin !== undefined || sphMax !== '' && sphMax !== undefined || 
        cylMin !== '' && cylMin !== undefined || cylMax !== '' && cylMax !== undefined || tierType) {
      const parsedSphMin = Number(sphMin);
      const parsedSphMax = Number(sphMax);
      const parsedCylMin = Number(cylMin);
      const parsedCylMax = Number(cylMax);

      // Validate supply tier data
      if (isNaN(parsedSphMin) || isNaN(parsedSphMax) || isNaN(parsedCylMin) || isNaN(parsedCylMax)) {
        errors.push('Dữ liệu tầng cung ứng phải là số hợp lệ');
      } else if (parsedSphMin > parsedSphMax) {
        errors.push('Độ cầu Min phải <= Độ cầu Max');
      } else if (parsedCylMin > parsedCylMax) {
        errors.push('Độ loạn Min phải <= Độ loạn Max');
      } else {
        const validTierTypes = ['IN_STORE', 'NEXT_DAY', 'CUSTOM_ORDER', 'FACTORY_ORDER'];
        const finalTierType = tierType && validTierTypes.includes(tierType) ? tierType : 'IN_STORE';
        
        supplyTierData = {
          sph_min: parsedSphMin,
          sph_max: parsedSphMax,
          cyl_min: parsedCylMin,
          cyl_max: parsedCylMax,
          tier_type: finalTierType
        };
      }
    }

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
      _supply_tier_data: supplyTierData,
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

        // Process supply tier data for upserted products
        const supplyTierOps = [];
        for (let j = 0; j < batch.length; j++) {
          const product = batch[j];
          const upsertedProduct = upsertedProducts?.find(up => up.sku === product.sku);
          
          if (upsertedProduct) {
            // Count inserts vs updates
            if (upsertedProduct.created_at === upsertedProduct.updated_at) {
              results.inserted++;
            } else {
              results.updated++;
            }

            // Handle supply tier data if present
            if (product._supply_tier_data) {
              supplyTierOps.push({
                productId: upsertedProduct.id,
                tierData: product._supply_tier_data
              });
            }
          }
        }

        // Upsert supply tiers if any
        if (supplyTierOps.length > 0) {
          // Fetch existing tiers for these products
          const productIds = supplyTierOps.map(op => op.productId);
          const { data: existingTiers } = await supabase
            .from('lens_supply_tiers')
            .select('id, product_id')
            .in('product_id', productIds)
            .order('display_order')
            .limit(productIds.length);

          const existingTierMap = new Map(
            (existingTiers || []).map(tier => [tier.product_id, tier.id])
          );

          // Prepare tier inserts and updates
          const tiersToInsert = [];
          const tiersToUpdate = [];

          for (const { productId, tierData } of supplyTierOps) {
            const tierRecord = {
              product_id: productId,
              sph_min: tierData.sph_min,
              sph_max: tierData.sph_max,
              cyl_min: tierData.cyl_min,
              cyl_max: tierData.cyl_max,
              tier_type: tierData.tier_type,
              tier_name: tierData.tier_type.replace(/_/g, ' ').toLowerCase(),
              lead_time_days: 0,
              price_adjustment: 0,
              is_active: true,
              display_order: 0
            };

            const existingTierId = existingTierMap.get(productId);
            if (existingTierId) {
              tiersToUpdate.push({ ...tierRecord, id: existingTierId });
            } else {
              tiersToInsert.push(tierRecord);
            }
          }

          // Bulk insert new tiers
          if (tiersToInsert.length > 0) {
            await supabase.from('lens_supply_tiers').insert(tiersToInsert);
          }

          // Bulk update existing tiers
          for (const tier of tiersToUpdate) {
            await supabase
              .from('lens_supply_tiers')
              .update(tier)
              .eq('id', tier.id);
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
      template[attr.name] = attr.options[0]?.label || attr.options[0] || '';
    });

    // Add multiselect columns dynamically
    multiselectAttrs.forEach(attr => {
      attr.options.forEach((option: any) => {
        const optLabel = typeof option === 'string' ? option : option.label;
        template[optLabel] = 'Không'; // Default value
      });
    });

    // Add 1 example with "Có"
    if (multiselectAttrs.length > 0 && multiselectAttrs[0].options.length > 0) {
      const firstOption = multiselectAttrs[0].options[0];
      const firstOptionLabel = typeof firstOption === 'string' ? firstOption : firstOption.label;
      template[firstOptionLabel] = 'Có';
    }

    // Add supply tier columns at the end (matching export format)
    template['Độ cầu Min (SPH)'] = -6.00;
    template['Độ cầu Max (SPH)'] = 6.00;
    template['Độ loạn Min (CYL)'] = -2.00;
    template['Độ loạn Max (CYL)'] = 0;
    template['Tầng cung ứng'] = 'IN_STORE';

    this.downloadExcel([template], `lens-template-${Date.now()}.xlsx`);
  }
}

export const lensExcelService = LensExcelService;
