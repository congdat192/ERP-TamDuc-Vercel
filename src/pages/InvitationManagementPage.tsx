import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Mail, CheckCircle, XCircle, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { UserInvitationService, UserInvitation } from '@/modules/user-management/services/userInvitationService';
import { useAuth } from '@/components/auth/AuthContext';
import { useBusiness } from '@/contexts/BusinessContext';
import { useToast } from '@/hooks/use-toast';
import { getBusinessLogoUrl } from '@/services/businessService';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export function InvitationManagementPage() {
  const [invitations, setInvitations] = useState<UserInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();
  const { refreshBusinesses } = useBusiness();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, currentUser, navigate]);

  const fetchInvitations = async () => {
    try {
      console.log('🔍 [InvitationManagementPage] Fetching user invitations');
      const response = await UserInvitationService.getUserInvitations({
        page: 1,
        perPage: 20,
        orderBy: 'created_at',
        orderDirection: 'desc'
      });
      
      console.log('📊 [InvitationManagementPage] Raw API response:', response);
      console.log('📋 [InvitationManagementPage] Invitations data:', response.data);
      
      setInvitations(response.data);
      console.log('✅ [InvitationManagementPage] Loaded invitations:', response.data.length);
      
      // Log chi tiết từng invitation để debug
      response.data.forEach((invitation, index) => {
        console.log(`📧 [Invitation ${index + 1}]:`, {
          id: invitation.id,
          businessName: invitation.businessName,
          businessLogoPath: invitation.businessLogoPath,
          inviterName: invitation.inviterName,
          created_at: invitation.created_at
        });
      });
    } catch (error: any) {
      console.error('❌ [InvitationManagementPage] Error fetching invitations:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tải danh sách lời mời",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetchInvitations();
    }
  }, [isAuthenticated, currentUser]);

  const handleAcceptInvitation = async (invitationId: string) => {
    if (processingId) return;
    
    setProcessingId(invitationId);
    try {
      console.log('✅ [InvitationManagementPage] Accepting invitation:', invitationId);
      await UserInvitationService.acceptInvitation(invitationId);
      
      // Remove processed invitation from list
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      
      // Refresh business list to get the new business
      console.log('🔄 [InvitationManagementPage] Refreshing business list after accepting invitation');
      await refreshBusinesses();
      
      toast({
        title: "Thành công!",
        description: "Bạn đã chấp nhận lời mời thành công. Danh sách doanh nghiệp đã được cập nhật.",
      });
      
      // Redirect to business selection after success
      setTimeout(() => {
        navigate('/business-selection');
      }, 1500);
    } catch (error: any) {
      console.error('❌ [InvitationManagementPage] Error accepting invitation:', error);
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectInvitation = async (invitationId: string) => {
    if (processingId) return;
    
    setProcessingId(invitationId);
    try {
      console.log('❌ [InvitationManagementPage] Rejecting invitation:', invitationId);
      await UserInvitationService.rejectInvitation(invitationId);
      toast({
        title: "Đã từ chối",
        description: "Bạn đã từ chối lời mời này.",
      });
      
      // Remove processed invitation from list
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    } catch (error: any) {
      console.error('❌ [InvitationManagementPage] Error rejecting invitation:', error);
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRefresh = async () => {
    if (refreshing || loading) return;
    setRefreshing(true);
    await fetchInvitations();
  };

  // Don't render if not authenticated
  if (!isAuthenticated || !currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/business-selection')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý Lời Mời</h1>
              <p className="text-gray-600 mt-1">
                Xem và phản hồi các lời mời tham gia doanh nghiệp
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing || loading}>
            {refreshing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Làm mới
          </Button>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{currentUser.fullName}</p>
              <p className="text-sm text-gray-500">{currentUser.email}</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải lời mời...</p>
          </div>
        )}

        {/* Invitations List */}
        {!loading && (
          <>
            {invitations.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Lời mời đang chờ ({invitations.length})
                  </h2>
                </div>
                
                {invitations.map((invitation) => {
                  const businessLogoUrl = getBusinessLogoUrl(invitation.businessLogoPath);
                  
                  return (
                    <Card key={invitation.id} className="border-2 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
                              {businessLogoUrl ? (
                                <img 
                                  src={businessLogoUrl} 
                                  alt={`${invitation.businessName} logo`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback to icon if image fails to load
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                              ) : null}
                              <Building2 className={`w-6 h-6 text-gray-600 ${businessLogoUrl ? 'hidden' : ''}`} />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-semibold text-gray-900">
                                {invitation.businessName || 'Doanh nghiệp chưa xác định'}
                              </CardTitle>
                              <CardDescription className="mt-1 text-gray-600">
                                Được mời bởi: <span className="font-medium text-gray-800">{invitation.inviterName || 'Người dùng không xác định'}</span>
                              </CardDescription>
                              <div className="flex items-center space-x-2 mt-3">
                                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                  Đang chờ phản hồi
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {formatDistanceToNow(new Date(invitation.created_at), {
                                    addSuffix: true,
                                    locale: vi
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex space-x-3">
                          <Button 
                            onClick={() => handleAcceptInvitation(invitation.id)}
                            disabled={processingId === invitation.id}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            {processingId === invitation.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang xử lý...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Chấp nhận
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleRejectInvitation(invitation.id)}
                            disabled={processingId === invitation.id}
                            className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                          >
                            {processingId === invitation.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang xử lý...
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 mr-2" />
                                Từ chối
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Không có lời mời nào
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Bạn chưa nhận được lời mời tham gia doanh nghiệp nào.
                  </p>
                  <Button variant="outline" onClick={() => navigate('/business-selection')}>
                    Quay về trang chọn doanh nghiệp
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
