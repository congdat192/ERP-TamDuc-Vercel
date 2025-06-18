
import type { VoucherTemplate } from '../types';

const STORAGE_KEY = 'voucher_templates';

export const templateService = {
  getTemplates: (): VoucherTemplate[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading templates from localStorage:', error);
    }
    
    // Return default templates if nothing in storage
    return getDefaultTemplates();
  },

  saveTemplates: (templates: VoucherTemplate[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error('Error saving templates to localStorage:', error);
    }
  },

  addTemplate: (template: VoucherTemplate): VoucherTemplate[] => {
    const templates = templateService.getTemplates();
    const updated = [...templates, template];
    templateService.saveTemplates(updated);
    return updated;
  },

  updateTemplate: (templateId: string, updatedTemplate: VoucherTemplate): VoucherTemplate[] => {
    const templates = templateService.getTemplates();
    const updated = templates.map(t => t.id === templateId ? updatedTemplate : t);
    templateService.saveTemplates(updated);
    return updated;
  },

  deleteTemplate: (templateId: string): VoucherTemplate[] => {
    const templates = templateService.getTemplates();
    const updated = templates.filter(t => t.id !== templateId);
    templateService.saveTemplates(updated);
    return updated;
  }
};

const getDefaultTemplates = (): VoucherTemplate[] => [
  {
    id: '1',
    name: 'Mẫu Mặc Định',
    content: `Mắt kính Tâm Đức thân tặng $tenKH - SĐT: $sdt
- Voucher đặt hẹn 50K cho hóa đơn từ 300k: $mavoucher
Voucher được áp dụng 1 trong các CTKM sau : 
- Thu cũ đổi mới ( theo danh sách tròng qui định , nếu quý khách không có kính cũ có thể áp dụng đánh giá 5 sao ở fanpage hoặc google maps )
- Mua  kính mát giá gốc từ 1tr  tặng tròng  chemi tint giá 830k 
- Gọng kính giảm từ 10% đến 50% ( thương hiệu Seeson không giảm)
- Tròng kính giảm từ 10% đến 20%
- Voucher không áp dụng cùng: sinh nhật, các chương trình khuyến mãi khác,...
- Hạn sử dụng: $hansudung

$tenKH ĐƯA TIN NHẮN CÓ MÃ VOUCHER NÀY cho nhân viên trước khi làm hóa đơn để được GIÁ TỐT NHẤT.
Ngoài ra anh/chị cần em hỗ trợ vấn đề nào gọi số hotline 1900 9999 37 em hỗ trợ nhanh nhất đến anh/chị.
$nhanvien`,
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Mẫu VIP',
    content: 'Kính chào Quý khách $tenKH,\n\nChúng tôi xin gửi tặng Quý khách voucher $mavoucher với giá trị $giatri.\nThông tin liên hệ: $sdt\nVoucher có hiệu lực đến: $hansudung\nĐược xử lý bởi: $nhanvien\n\nChân thành cảm ơn sự tin tưởng của Quý khách!',
    isDefault: false,
    isActive: true,
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16'
  }
];
