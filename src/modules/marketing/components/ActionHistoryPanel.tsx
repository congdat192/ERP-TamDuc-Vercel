
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock,
  Users,
  Save,
  Download,
  MessageSquare,
  Mail,
  Smartphone,
  Trash,
  RefreshCw
} from 'lucide-react';
import { ActionHistoryItem } from '../types/filter';
import { ActionHistoryManager } from '../utils/actionHistoryManager';

interface ActionHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ActionHistoryPanel({ isOpen, onClose }: ActionHistoryPanelProps) {
  const [actions, setActions] = useState<ActionHistoryItem[]>(
    ActionHistoryManager.getActionHistory()
  );

  const refreshHistory = () => {
    setActions(ActionHistoryManager.getActionHistory());
  };

  const handleClearHistory = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử thao tác?')) {
      ActionHistoryManager.clearHistory();
      refreshHistory();
    }
  };

  const getActionIcon = (type: ActionHistoryItem['type']) => {
    const iconProps = { className: "w-4 h-4" };
    
    switch (type) {
      case 'save_filter': return <Save {...iconProps} className="w-4 h-4 text-blue-600" />;
      case 'export_excel': return <Download {...iconProps} className="w-4 h-4 text-green-600" />;
      case 'send_zalo': return <MessageSquare {...iconProps} className="w-4 h-4 text-green-600" />;
      case 'send_email': return <Mail {...iconProps} className="w-4 h-4 text-blue-600" />;
      case 'send_sms': return <Smartphone {...iconProps} className="w-4 h-4 text-orange-600" />;
      default: return <Clock {...iconProps} />;
    }
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <Card className="theme-card mt-6">
      <CardHeader className="border-b theme-border-primary/20">
        <div className="flex items-center justify-between">
          <CardTitle className="theme-text flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Lịch Sử Thao Tác</span>
          </CardTitle>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={refreshHistory}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Làm mới
            </Button>
            {actions.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleClearHistory}>
                <Trash className="w-4 h-4 mr-2" />
                Xóa tất cả
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {actions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 theme-text-muted mx-auto mb-3" />
            <div className="theme-text-muted mb-2">Chưa có thao tác nào</div>
            <p className="text-sm theme-text-muted">
              Lịch sử các thao tác sẽ hiển thị tại đây
            </p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <div className="divide-y theme-border-primary/10">
              {actions.map((action) => (
                <div key={action.id} className="p-4 hover:theme-bg-primary/5">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActionIcon(action.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium theme-text">
                          {ActionHistoryManager.getActionLabel(action.type)}
                        </p>
                        <time className="text-xs theme-text-muted">
                          {formatDateTime(action.timestamp)}
                        </time>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-xs theme-text-muted">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{action.customerCount.toLocaleString()} khách hàng</span>
                        </div>
                        
                        {action.filterName && (
                          <Badge variant="outline" className="text-xs">
                            {action.filterName}
                          </Badge>
                        )}
                      </div>

                      {action.details && (
                        <div className="mt-2 text-xs theme-text-muted">
                          {action.details.messageContent && (
                            <div className="bg-gray-50 rounded p-2 max-w-xs truncate">
                              "{action.details.messageContent}"
                            </div>
                          )}
                          {action.details.exportFormat && (
                            <span>Định dạng: {action.details.exportFormat}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
