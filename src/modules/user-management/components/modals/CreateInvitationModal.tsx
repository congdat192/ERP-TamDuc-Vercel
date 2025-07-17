
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { InvitationService, CreateInvitationRequest } from '../../services/invitationService';

interface CreateInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvitationSent?: (invitation: any) => void;
}

export function CreateInvitationModal({ isOpen, onClose, onInvitationSent }: CreateInvitationModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateInvitationRequest>({
    email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập địa chỉ email",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const invitation = await InvitationService.createInvitation(formData);
      
      toast({
        title: "Thành công",
        description: "Lời mời đã được gửi thành công",
      });
      
      onInvitationSent?.(invitation);
      handleClose();
    } catch (error: any) {
      console.error('Error creating invitation:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể gửi lời mời",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ email: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gửi Lời Mời Thành Viên</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Địa chỉ Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ email: e.target.value })}
              required
            />
            <p className="text-sm text-gray-500">
              Người nhận sẽ được gửi email mời tham gia doanh nghiệp
            </p>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Đang gửi..." : "Gửi lời mời"}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
