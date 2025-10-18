import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ForceChangePasswordDialogProps {
  isOpen: boolean;
  onPasswordChanged: () => void;
}

export function ForceChangePasswordDialog({ 
  isOpen, 
  onPasswordChanged 
}: ForceChangePasswordDialogProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (newPassword.length < 8) {
      toast({ 
        title: "Lỗi", 
        description: "Mật khẩu phải có ít nhất 8 ký tự",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({ 
        title: "Lỗi", 
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update password in Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) throw updateError;
      
      // Update flags in profiles table
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            password_change_required: false,
            last_password_change: new Date().toISOString()
          })
          .eq('id', user.id);
        
        if (profileError) {
          console.error('⚠️ Warning: Could not update profile:', profileError);
        }
      }
      
      toast({ 
        title: "Thành công", 
        description: "Mật khẩu đã được thay đổi thành công" 
      });
      
      // Close dialog and reload user
      onPasswordChanged();
    } catch (error: any) {
      console.error('❌ Error changing password:', error);
      toast({ 
        title: "Lỗi", 
        description: error.message || "Không thể đổi mật khẩu",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-md" 
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            <DialogTitle>Đổi Mật Khẩu Bắt Buộc</DialogTitle>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Warning Banner */}
          <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">
                Yêu cầu bảo mật
              </p>
              <p className="text-sm text-muted-foreground">
                Bạn cần đổi mật khẩu trước khi tiếp tục sử dụng hệ thống. 
                Đây là bước bảo mật bắt buộc cho tài khoản mới.
              </p>
            </div>
          </div>
          
          {/* New Password Field */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới *</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
              required
              minLength={8}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Sử dụng kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt
            </p>
          </div>
          
          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu *</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              required
              minLength={8}
            />
          </div>

          {/* Password Match Indicator */}
          {confirmPassword && (
            <div className="flex items-center gap-2 text-sm">
              {newPassword === confirmPassword ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-success">Mật khẩu khớp</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span className="text-destructive">Mật khẩu không khớp</span>
                </>
              )}
            </div>
          )}
          
          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !newPassword || !confirmPassword}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Đổi mật khẩu
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
