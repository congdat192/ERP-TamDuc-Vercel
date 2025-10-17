import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react';
import { InvitationService, Invitation } from '@/modules/user-management/services/invitationService';
import { useToast } from '@/hooks/use-toast';
import { InvitationAuthForm } from '@/components/invitation/InvitationAuthForm';

export function InvitationAcceptPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      loadInvitation();
    } else {
      setError('Token không hợp lệ');
      setIsLoading(false);
    }
  }, [token, currentUser]);

  const loadInvitation = async () => {
    try {
      // Fetch invitation details (no auth required for pending invitations)
      const data = await InvitationService.getInvitationByToken(token!);

      if (!data) {
        setError('Lời mời không hợp lệ hoặc đã hết hạn');
        return;
      }

      // Check if already expired
      if (new Date(data.expires_at) < new Date()) {
        setError('Lời mời đã hết hạn');
        return;
      }

      // Check if already processed
      if (data.status !== 'pending') {
        setError(`Lời mời đã được ${data.status === 'accepted' ? 'chấp nhận' : 'từ chối'} trước đó`);
        return;
      }

      setInvitation(data);

      // If user is logged in, check if email matches
      if (currentUser) {
        if (data.email !== currentUser.email) {
          setError('Lời mời này không dành cho tài khoản của bạn');
          return;
        }
      }
    } catch (err: any) {
      console.error('Error loading invitation:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải lời mời');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      const result = await InvitationService.processInvitation(token!, 'accept');

      toast({
        title: "Thành công",
        description: "Bạn đã tham gia doanh nghiệp thành công",
      });

      // Redirect to business selection or directly to business
      setTimeout(() => {
        navigate('/business-selection');
      }, 1000);
    } catch (err: any) {
      console.error('Error accepting invitation:', err);
      toast({
        title: "Lỗi",
        description: err.message || 'Có lỗi xảy ra khi chấp nhận lời mời',
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await InvitationService.processInvitation(token!, 'reject');

      toast({
        title: "Đã từ chối",
        description: "Bạn đã từ chối lời mời",
      });

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      console.error('Error rejecting invitation:', err);
      toast({
        title: "Lỗi",
        description: err.message || 'Có lỗi xảy ra khi từ chối lời mời',
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-background">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <XCircle className="w-5 h-5 mr-2" />
              Lỗi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error}</p>
            <Button onClick={() => navigate('/')} className="w-full">
              Về Trang Chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is not logged in, show auth form
  if (!currentUser && invitation) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-background">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2 text-primary" />
              Lời Mời Tham Gia Doanh Nghiệp
            </CardTitle>
            <CardDescription>
              Vui lòng đăng ký hoặc đăng nhập để chấp nhận lời mời
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InvitationAuthForm
              invitationEmail={invitation.email}
              businessName={(invitation as any).businesses?.name || 'Doanh nghiệp'}
              roleName={(invitation as any).roles?.name || 'Thành viên'}
              onAuthSuccess={handleAccept}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is logged in, show invitation details and accept/reject buttons
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2 text-primary" />
            Lời Mời Tham Gia Doanh Nghiệp
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Doanh nghiệp:</p>
            <p className="font-semibold text-lg">{(invitation as any).businesses?.name}</p>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Vai trò:</p>
            <p className="font-semibold">{(invitation as any).roles?.name}</p>
            {(invitation as any).roles?.description && (
              <p className="text-sm text-muted-foreground mt-1">{(invitation as any).roles.description}</p>
            )}
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Email:</p>
            <p className="font-medium">{invitation.email}</p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Hết hạn vào:</p>
            <p className="font-medium">{new Date(invitation.expires_at).toLocaleDateString('vi-VN')}</p>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button 
              onClick={handleAccept} 
              className="flex-1"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Chấp Nhận
            </Button>
            <Button 
              onClick={handleReject} 
              variant="outline"
              className="flex-1"
              disabled={isProcessing}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Từ Chối
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
