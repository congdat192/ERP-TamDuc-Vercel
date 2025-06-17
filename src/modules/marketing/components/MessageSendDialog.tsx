
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare,
  Mail,
  Smartphone,
  Users,
  Eye,
  Send,
  Variable
} from 'lucide-react';
import { MessageType } from '../types/filter';
import { DEFAULT_TEMPLATES, MESSAGE_VARIABLES, MessageTemplateManager } from '../utils/messageTemplates';
import { MessagePreview } from './MessagePreview';
import { useToast } from '@/hooks/use-toast';

interface MessageSendDialogProps {
  isOpen: boolean;
  onClose: () => void;
  messageType: MessageType;
  customerIds: string[];
  customerCount: number;
  onMessageSent: (type: MessageType, content: string, count: number) => void;
}

export function MessageSendDialog({
  isOpen,
  onClose,
  messageType,
  customerIds,
  customerCount,
  onMessageSent
}: MessageSendDialogProps) {
  const { toast } = useToast();
  const [content, setContent] = useState(DEFAULT_TEMPLATES[messageType].content);
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const getTypeConfig = () => {
    const configs = {
      zalo: { 
        icon: MessageSquare, 
        label: 'Zalo', 
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      },
      email: { 
        icon: Mail, 
        label: 'Email', 
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      },
      sms: { 
        icon: Smartphone, 
        label: 'SMS', 
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      }
    };
    return configs[messageType];
  };

  const config = getTypeConfig();
  const IconComponent = config.icon;

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('message-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + variable + content.substring(end);
      setContent(newContent);
      
      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + variable.length;
        textarea.focus();
      }, 0);
    }
  };

  const handleSend = async () => {
    const validation = MessageTemplateManager.validateTemplate(content);
    
    if (!validation.isValid) {
      toast({
        title: "Lỗi nội dung",
        description: validation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onMessageSent(messageType, content, customerCount);
      
      toast({
        title: "Gửi thành công!",
        description: `Đã gửi ${config.label} tới ${customerCount.toLocaleString()} khách hàng`,
      });
      
      handleClose();
    } catch (error) {
      toast({
        title: "Lỗi gửi tin nhắn",
        description: "Vui lòng thử lại sau",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setContent(DEFAULT_TEMPLATES[messageType].content);
    setShowPreview(false);
    onClose();
  };

  const extractedVariables = MessageTemplateManager.extractVariables(content);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={`theme-text flex items-center space-x-2`}>
              <IconComponent className={`w-5 h-5 ${config.color}`} />
              <span>Gửi {config.label}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Customer Count Info */}
            <Card className={`${config.bgColor} ${config.borderColor} border`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className={`w-4 h-4 ${config.color}`} />
                  <span className={`font-medium ${config.color}`}>
                    Gửi tới {customerCount.toLocaleString()} khách hàng
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Message Content */}
            <div className="space-y-2">
              <Label htmlFor="message-content">Nội dung tin nhắn</Label>
              <Textarea
                id="message-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Nhập nội dung ${config.label.toLowerCase()}...`}
                rows={8}
                className="resize-none"
              />
              <div className="text-xs theme-text-muted">
                {content.length}/1000 ký tự
              </div>
            </div>

            {/* Variables */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Variable className="w-4 h-4" />
                <Label>Biến động có thể sử dụng</Label>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {MESSAGE_VARIABLES.map((variable) => (
                  <Button
                    key={variable.key}
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable(variable.key)}
                    className="justify-start text-xs"
                  >
                    {variable.key}
                  </Button>
                ))}
              </div>

              {extractedVariables.length > 0 && (
                <div>
                  <p className="text-sm theme-text-muted mb-2">Biến đang sử dụng:</p>
                  <div className="flex flex-wrap gap-1">
                    {extractedVariables.map((variable) => (
                      <Badge key={variable} variant="secondary" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button
                onClick={() => setShowPreview(true)}
                variant="outline"
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem Trước
              </Button>
              
              <Button
                onClick={handleSend}
                disabled={!content.trim() || isSending}
                className={`flex-1 ${config.color} ${config.bgColor} hover:${config.bgColor}`}
              >
                <Send className="w-4 h-4 mr-2" />
                {isSending ? 'Đang gửi...' : `Gửi ${config.label}`}
              </Button>
              
              <Button variant="outline" onClick={handleClose}>
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <MessagePreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        messageType={messageType}
        content={content}
        customerIds={customerIds}
        customerCount={customerCount}
      />
    </>
  );
}
