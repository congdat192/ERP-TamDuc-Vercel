
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
    
    // Return empty array to start fresh - no default templates
    return [];
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
