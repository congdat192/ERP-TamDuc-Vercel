import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface CreatePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isRequired: boolean; // TRUE = bắt buộc (có ERP), FALSE = tùy chọn
}

export function CreatePasswordDialog({ isOpen, onClose, isRequired }: CreatePasswordDialogProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (newPassword.length < 8) {
      toast({ 
        title: 'Lỗi', 
        description: 'Mật khẩu phải có ít nhất 8 ký tự', 
        variant: 'destructive' 
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({ 
        title: 'Lỗi', 
        description: 'Mật khẩu xác nhận không khớp', 
        variant: 'destructive' 
      });
      return;
    }

    setLoading(true);
    try {
      // Step 1: Update password
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      // Step 2: Update profiles.password_change_required = false
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ password_change_required: false })
          .eq('id', user.id);
      }

      toast({ 
        title: 'Thành công', 
        description: 'Đã tạo mật khẩu. Bạn có thể dùng mật khẩu này để đăng nhập lần sau.' 
      });
      
      // Reset form
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (error: any) {
      toast({ 
        title: 'Lỗi', 
        description: error.message, 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isRequired ? onClose : undefined}>
      <DialogContent className={isRequired ? '[&>button]:hidden' : ''}>
        <DialogHeader>
          <DialogTitle>
            {isRequired ? '🔒 Tạo mật khẩu bắt buộc' : '💡 Tạo mật khẩu cho lần sau?'}
          </DialogTitle>
          <DialogDescription>
            {isRequired 
              ? 'Bạn đã được cấp quyền ERP. Vui lòng tạo mật khẩu để đăng nhập hệ thống.'
              : 'Tạo mật khẩu để đăng nhập nhanh hơn mà không cần OTP.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="new-password">Mật khẩu mới *</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Tối thiểu 8 ký tự"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="confirm-password">Xác nhận mật khẩu *</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <DialogFooter>
            {!isRequired && (
              <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                Bỏ qua
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                'Tạo mật khẩu'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
