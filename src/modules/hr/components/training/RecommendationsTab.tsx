import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CompetencyService } from '../../services/competencyService';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, X, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function RecommendationsTab() {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get employee record
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (employee) {
        setCurrentEmployee(employee);
        const data = await CompetencyService.getRecommendations(employee.id);
        setRecommendations(data);
      }
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

  const handleDismiss = async (recommendationId: string) => {
    try {
      await CompetencyService.dismissRecommendation(recommendationId);
      toast({
        title: 'Đã bỏ qua gợi ý'
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, any> = {
      high: { variant: 'destructive', label: 'Ưu tiên cao' },
      medium: { variant: 'default', label: 'Ưu tiên trung bình' },
      low: { variant: 'secondary', label: 'Ưu tiên thấp' }
    };
    const config = variants[priority] || variants.medium;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentEmployee) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Tài khoản của bạn chưa được liên kết với hồ sơ nhân viên
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Khóa Học Được Đề Xuất</CardTitle>
            <Button variant="outline" onClick={loadData}>
              Làm mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recommendations.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">
                Hiện chưa có khóa học được đề xuất cho bạn
              </p>
              <p className="text-sm text-muted-foreground">
                Hệ thống sẽ tự động gợi ý các khóa học phù hợp dựa trên năng lực hiện tại của bạn
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map(rec => (
                <Card key={rec.id} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {rec.training_programs?.title || 'N/A'}
                          </h3>
                          {getPriorityBadge(rec.priority)}
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {rec.training_programs?.description || 'Không có mô tả'}
                        </p>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <ArrowUp className="h-4 w-4 text-green-600" />
                            <span>
                              Level {rec.current_competency_level || 0} → Level {rec.target_competency_level}
                            </span>
                          </div>
                          <Badge variant="outline">
                            {rec.training_programs?.course_category}
                          </Badge>
                          <span className="text-muted-foreground">
                            {rec.training_programs?.duration_hours}h
                          </span>
                        </div>

                        {rec.reason && (
                          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm">{rec.reason}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button size="sm">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Xem Chi Tiết
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDismiss(rec.id)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Bỏ Qua
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
