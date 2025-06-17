import { ActionHistoryItem, ActionType, AdvancedFilter } from '../types/filter';

const STORAGE_KEY = 'marketing_action_history';
const MAX_HISTORY_ITEMS = 50;

export class ActionHistoryManager {
  static getActionHistory(): ActionHistoryItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading action history:', error);
      return [];
    }
  }

  static addAction(
    type: ActionType,
    customerCount: number,
    filterName?: string,
    filterSnapshot?: AdvancedFilter,
    details?: ActionHistoryItem['details']
  ): ActionHistoryItem {
    const action: ActionHistoryItem = {
      id: Date.now().toString(),
      type,
      timestamp: new Date().toISOString(),
      customerCount,
      filterName,
      filterSnapshot,
      details
    };

    const history = this.getActionHistory();
    history.unshift(action); // Add to beginning

    // Keep only the latest items
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    return action;
  }

  static clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  static getActionLabel(type: ActionType): string {
    const labels: Record<ActionType, string> = {
      save_filter: 'Lưu bộ lọc',
      export_excel: 'Xuất Excel',
      send_zalo: 'Gửi Zalo',
      send_email: 'Gửi Email',
      send_sms: 'Gửi SMS'
    };
    return labels[type];
  }

  static getActionIcon(type: ActionType): string {
    const icons: Record<ActionType, string> = {
      save_filter: 'Save',
      export_excel: 'Download',
      send_zalo: 'MessageSquare',
      send_email: 'Mail',
      send_sms: 'Smartphone'
    };
    return icons[type];
  }
}
