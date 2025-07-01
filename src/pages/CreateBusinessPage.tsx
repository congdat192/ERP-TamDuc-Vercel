
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useBusiness } from '@/contexts/BusinessContext';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { FormError, FormLoadingState } from '@/components/ui/form-errors';

export function CreateBusinessPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { createBusiness, hasOwnBusiness } = useBusiness();
  const { currentUser, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!name.trim()) {
      setError('Vui lòng nhập tên doanh nghiệp');
      return;
    }

    if (!isAuthenticated || !currentUser) {
      setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    console.log('🏗️ [CreateBusinessPage] Starting business creation process');
    console.log('🔍 [CreateBusinessPage] Current user:', currentUser?.email);
    console.log('🔍 [CreateBusinessPage] Auth status:', isAuthenticated);
    
    setIsSubmitting(true);
    try {
      console.log('📝 [CreateBusinessPage] Creating business with data:', {
        name: name.trim(),
        description: description.trim()
      });
      
      const newBusiness = await createBusiness({
        name: name.trim(),
        description: description.trim()
      });
      
      console.log('✅ [CreateBusinessPage] Business created successfully:', newBusiness);
      
      toast({
        title: "Thành công!",
        description: `Doanh nghiệp "${newBusiness.name}" đã được tạo thành công!`,
      });
      
      // Wait a bit for the toast to show, then navigate
      setTimeout(() => {
        navigate(`/ERP/${newBusiness.id}/Dashboard`);
      }, 1000);
      
    } catch (error) {
      console.error('❌ [CreateBusinessPage] Failed to create business:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo doanh nghiệp';
      setError(errorMessage);
      
      // If authentication error, redirect to login
      if (errorMessage.includes('xác thực') || errorMessage.includes('đăng nhập')) {
        setTimeout(() => navigate('/login'), 3000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    console.log('🔙 [CreateBusinessPage] Navigating back to business selection');
    navigate('/business-selection');
  };

  // If user already has own business, redirect to selection
  React.useEffect(() => {
    if (hasOwnBusiness) {
      console.log('⚠️ [CreateBusinessPage] User already has own business, redirecting');
      navigate('/business-selection');
    }
  }, [hasOwnBusiness, navigate]);

  // Check authentication on mount
  React.useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      console.log('❌ [CreateBusinessPage] User not authenticated, redirecting to login');
      navigate('/login');
    }
  }, [isAuthenticated, currentUser, navigate]);

  if (hasOwnBusiness) {
    return null; // Will redirect
  }

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Tạo Doanh Nghiệp</h1>
          </div>
          <p className="text-gray-600 mb-2">
            Chào mừng {currentUser?.fullName}! Hãy tạo doanh nghiệp đầu tiên của bạn.
          </p>
          <p className="text-sm text-gray-500">
            Mỗi tài khoản chỉ được tạo tối đa 1 doanh nghiệp riêng
          </p>
        </div>

        {/* Error Display */}
        {error && <FormError message={error} className="mb-6" />}

        {/* Form Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="p-1"
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <CardTitle>Thông Tin Doanh Nghiệp</CardTitle>
                <CardDescription>
                  Điển thông tin cơ bản về doanh nghiệp của bạn
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <FormLoadingState isLoading={isSubmitting} loadingText="Đang tạo doanh nghiệp...">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="business-name">
                    Tên Doanh Nghiệp <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="business-name"
                    type="text"
                    placeholder="Ví dụ: Công ty TNHH ABC"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    required
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500">
                    Tên doanh nghiệp sẽ hiển thị trong hệ thống ERP
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-description">Mô Tả (Tùy chọn)</Label>
                  <Textarea
                    id="business-description"
                    placeholder="Mô tả ngắn gọn về lĩnh vực hoạt động, sản phẩm/dịch vụ chính..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSubmitting}
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500">
                    Mô tả giúp phân biệt doanh nghiệp khi bạn tham gia nhiều tổ chức
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Quay Lại
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !name.trim()}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        Đang Tạo...
                      </>
                    ) : (
                      <>
                        <Building2 className="w-4 h-4 mr-2" />
                        Tạo Doanh Nghiệp
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </FormLoadingState>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Lưu ý quan trọng:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Mỗi tài khoản chỉ được tạo tối đa 1 doanh nghiệp riêng</li>
                  <li>• Bạn có thể được mời tham gia doanh nghiệp khác với vai trò thành viên</li>
                  <li>• Sau khi tạo, bạn sẽ là chủ sở hữu và có toàn quyền quản lý</li>
                  <li>• Thông tin doanh nghiệp có thể chỉnh sửa sau trong phần cài đặt</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
