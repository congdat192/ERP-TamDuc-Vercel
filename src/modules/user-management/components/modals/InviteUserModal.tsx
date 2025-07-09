
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, X, Plus } from 'lucide-react';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteSent?: (inviteData: any) => void;
}

export function InviteUserModal({ isOpen, onClose, onInviteSent }: InviteUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>(['']);
  const [formData, setFormData] = useState({
    roleId: '',
    departmentId: '',
    message: '',
    expiresInDays: 7
  });

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const removeEmailField = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validEmails = emails.filter(email => email.trim());
      
      // TODO: API call to send invitations
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onInviteSent?.({ emails: validEmails, ...formData });
      onClose();
      
      // Reset form
      setEmails(['']);
      setFormData({
        roleId: '',
        departmentId: '',
        message: '',
        expiresInDays: 7
      });
    } catch (error) {
      console.error('Error sending invitations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mời Thành Viên Tham Gia</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Addresses */}
          <div className="space-y-2">
            <Label>Địa Chỉ Email *</Label>
            {emails.map((email, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  placeholder="user@company.com"
                  className="flex-1"
                  required={index === 0}
                />
                {emails.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEmailField(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                {index === emails.length - 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addEmailField}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <p className="text-sm text-gray-500">
              Thêm nhiều email để mời nhiều người cùng lúc
            </p>
          </div>

          {/* Role and Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roleId">Vai Trò Mặc Định</Label>
              <Select value={formData.roleId} onValueChange={(value) => setFormData(prev => ({ ...prev, roleId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {/* TODO: Populate from roles */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="departmentId">Phòng Ban Mặc Định</Label>
              <Select value={formData.departmentId} onValueChange={(value) => setFormData(prev => ({ ...prev, departmentId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  {/* TODO: Populate from departments */}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Invitation Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Tin Nhắn Mời (Tùy chọn)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Tin nhắn chào mừng hoặc hướng dẫn cho thành viên mới..."
              rows={3}
            />
          </div>

          {/* Expiration */}
          <div className="space-y-2">
            <Label htmlFor="expiresInDays">Thời Hạn Lời Mời</Label>
            <Select 
              value={formData.expiresInDays.toString()} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, expiresInDays: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 ngày</SelectItem>
                <SelectItem value="3">3 ngày</SelectItem>
                <SelectItem value="7">7 ngày</SelectItem>
                <SelectItem value="14">14 ngày</SelectItem>
                <SelectItem value="30">30 ngày</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Gửi Lời Mời
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
