
import { MessageTemplate, MessageVariable, MessageType } from '../types/filter';

export const MESSAGE_VARIABLES: MessageVariable[] = [
  { key: '[Tên khách hàng]', label: 'Tên khách hàng', example: 'Nguyễn Văn A' },
  { key: '[Số điện thoại]', label: 'Số điện thoại', example: '0901234567' },
  { key: '[Tổng chi tiêu]', label: 'Tổng chi tiêu', example: '2.500.000 ₫' },
  { key: '[Điểm tích lũy]', label: 'Điểm tích lũy', example: '1.250 điểm' },
  { key: '[Nhóm khách hàng]', label: 'Nhóm khách hàng', example: 'VIP' },
  { key: '[Khu vực]', label: 'Khu vực', example: 'Hà Nội' }
];

export const DEFAULT_TEMPLATES: Record<MessageType, MessageTemplate> = {
  zalo: {
    id: 'zalo_default',
    type: 'zalo',
    name: 'Tin nhắn Zalo mặc định',
    content: 'Xin chào [Tên khách hàng],\n\nCảm ơn bạn đã tin tưởng và đồng hành cùng chúng tôi với tổng chi tiêu [Tổng chi tiêu].\n\nChúc bạn một ngày tốt lành!',
    variables: ['[Tên khách hàng]', '[Tổng chi tiêu]'],
    isDefault: true
  },
  email: {
    id: 'email_default',
    type: 'email',
    name: 'Email marketing mặc định',
    content: 'Kính gửi [Tên khách hàng],\n\nCảm ơn bạn đã là khách hàng thân thiết với tổng chi tiêu [Tổng chi tiêu] và [Điểm tích lũy].\n\nTrân trọng,\nĐội ngũ chăm sóc khách hàng',
    variables: ['[Tên khách hàng]', '[Tổng chi tiêu]', '[Điểm tích lũy]'],
    isDefault: true
  },
  sms: {
    id: 'sms_default',
    type: 'sms',
    name: 'SMS ngắn gọn',
    content: 'Xin chào [Tên khách hàng]! Cảm ơn bạn đã đồng hành cùng chúng tôi. Tổng chi tiêu: [Tổng chi tiêu].',
    variables: ['[Tên khách hàng]', '[Tổng chi tiêu]'],
    isDefault: true
  }
};

export class MessageTemplateManager {
  static replaceVariables(content: string, customerData: Record<string, string>): string {
    let result = content;
    
    Object.entries(customerData).forEach(([key, value]) => {
      result = result.replace(new RegExp(key, 'g'), value);
    });
    
    return result;
  }

  static extractVariables(content: string): string[] {
    const variableRegex = /\[([^\]]+)\]/g;
    const matches = content.match(variableRegex) || [];
    return Array.from(new Set(matches));
  }

  static validateTemplate(content: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!content.trim()) {
      errors.push('Nội dung không được để trống');
    }
    
    if (content.length > 1000) {
      errors.push('Nội dung không được vượt quá 1000 ký tự');
    }

    const variables = this.extractVariables(content);
    const validVariables = MESSAGE_VARIABLES.map(v => v.key);
    
    variables.forEach(variable => {
      if (!validVariables.includes(variable)) {
        errors.push(`Biến không hợp lệ: ${variable}`);
      }
    });

    return { isValid: errors.length === 0, errors };
  }
}
