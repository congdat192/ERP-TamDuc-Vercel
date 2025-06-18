
import type { VoucherTemplate } from '../types';

// Content templates storage key (separate from campaigns)
const CONTENT_TEMPLATES_KEY = 'voucher_content_templates';

export const templateService = {
  getTemplates: (): VoucherTemplate[] => {
    try {
      const stored = localStorage.getItem(CONTENT_TEMPLATES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading content templates from localStorage:', error);
    }
    
    // Return empty array - VoucherContentTemplateManager will load defaults
    return [];
  },

  saveTemplates: (templates: VoucherTemplate[]): void => {
    try {
      localStorage.setItem(CONTENT_TEMPLATES_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error('Error saving content templates to localStorage:', error);
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
