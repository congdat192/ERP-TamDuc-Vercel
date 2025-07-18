
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { UserInvitationService } from '@/modules/user-management/services/userInvitationService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, Mail, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function InvitationAcceptPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get additional info from URL if provided
  const businessName = searchParams.get('business') || 'doanh nghiệp';
  const inviterName = searchParams.get('inviter') || 'người mời';
  const action = searchParams.get('action'); // accept, reject, or null

  const handleAcceptInvitation = async () => {
    if (!id) {
      setError('ID lời mời không hợp lệ');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await UserInvitationService.acceptInvitation(id);
      setSuccess(true);
      setProcessed(true);
      
      toast({
        title: "Thành công!",
        description: "Bạn đã chấp nhận lời mời thành công. Bạn có thể đăng nhập để truy cập hệ thống.",
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
      setProcessed(true);
      
      toast({
        title: "Lỗi",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectInvitation = async () => {
    if (!id) {
      setError('ID lời mời không hợp lệ');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await UserInvitationService.rejectInvitation(id);
      setSuccess(true);
      setProcessed(true);
      
      toast({
        title: "Đã từ chối",
        description: "Bạn đã từ chối lời mời.",
      });

      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
      setProcessed(true);
      
      toast({
        title: "Lỗi",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-execute action based on URL parameter
  useEffect(() => {
    if (!id) {
      setError('Liên kết lời mời không hợp lệ');
      setProcessed(true);
      return;
    }

    // Auto-execute if action parameter is present
    if (action === 'accept' && !processed && !loading) {
      console.log('🎯 Auto-accepting invitation from URL parameter');
      handleAcceptInvitation();
    } else if (action === 'reject' && !processed && !loading) {
      console.log('🎯 Auto-rejecting invitation from URL parameter');  
      handleRejectInvitation();
    }
  }, [id, action, processed, loading]);

  if (!id || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <CardTitle className="text-red-600">Lỗi lời mời</CardTitle>
            <CardDescription>
              {error || 'Liên kết lời mời không hợp lệ hoặc đã hết hạn'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/login')} variant="outline" className="w-full">
              Đăng nhập
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (processed && success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <CardTitle className="text-green-600">Thành công!</CardTitle>
            <CardDescription>
              Lời mời đã được xử lý thành công. Bạn sẽ được chuyển hướng trong giây lát...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm text-gray-600">Đang chuyển hướng...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state if auto-executing action
  if (loading || (action && !processed)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Loader2 className="w-16 h-16 mx-auto text-blue-500 mb-4 animate-spin" />
            <CardTitle>Đang xử lý lời mời...</CardTitle>
            <CardDescription>
              {action === 'accept' ? 'Đang chấp nhận lời mời' : 'Đang từ chối lời mời'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Show manual selection UI if no action parameter
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Mail className="w-16 h-16 mx-auto text-blue-500 mb-4" />
          <CardTitle>Lời mời tham gia</CardTitle>
          <CardDescription>
            Bạn đã được mời tham gia vào hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Doanh nghiệp:</span>
              <span className="text-sm font-medium">{businessName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Người mời:</span>
              <span className="text-sm font-medium">{inviterName}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleAcceptInvitation}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Chấp nhận lời mời
                </>
              )}
            </Button>

            <Button 
              onClick={handleRejectInvitation}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Từ chối lời mời
                </>
              )}
            </Button>
          </div>

          <div className="text-center pt-4">
            <Button 
              onClick={() => navigate('/login')}
              variant="ghost"
              size="sm"
            >
              Đăng nhập với tài khoản khác
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
