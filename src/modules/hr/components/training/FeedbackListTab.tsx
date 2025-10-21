import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Star, MessageSquare } from 'lucide-react';
import { TrainingFeedbackService } from '../../services/trainingFeedbackService';

type TrainingFeedback = {
  id: string;
  program_id?: string;
  session_id?: string;
  employee_id: string;
  trainer_rating?: number;
  content_rating?: number;
  facility_rating?: number;
  overall_rating?: number;
  comments?: string;
  suggestions?: string;
  created_at: string;
  training_programs?: {
    title: string;
  };
  training_sessions?: {
    session_name: string;
  };
};
import { useAuth } from '@/components/auth/AuthContext';

export function FeedbackListTab() {
  const [feedbacks, setFeedbacks] = useState<TrainingFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      // Load my feedback if employee, all feedback if admin
      const data = await TrainingFeedbackService.getMyFeedback(currentUser?.id || '');
      setFeedbacks(data);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const renderStars = (rating?: number) => {
    if (!rating) return <span className="text-muted-foreground">Chưa đánh giá</span>;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating}/5</span>
      </div>
    );
  };

  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Đánh Giá Khóa Học</h2>
      </div>

      <div className="grid gap-4">
        {feedbacks.map((feedback) => (
          <Card key={feedback.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {feedback.training_programs?.title || 'Khóa học'}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Buổi: {feedback.training_sessions?.session_name || 'N/A'}
                  </p>
                </div>
                <Badge variant="outline">
                  {new Date(feedback.created_at).toLocaleDateString('vi-VN')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Giảng viên</p>
                  {renderStars(feedback.trainer_rating)}
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Nội dung</p>
                  {renderStars(feedback.content_rating)}
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Cơ sở vật chất</p>
                  {renderStars(feedback.facility_rating)}
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Tổng thể</p>
                  {renderStars(feedback.overall_rating)}
                </div>
              </div>

              {feedback.comments && (
                <div className="pt-4 border-t">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Nhận xét</p>
                      <p className="text-sm text-muted-foreground">{feedback.comments}</p>
                    </div>
                  </div>
                </div>
              )}

              {feedback.suggestions && (
                <div className="pt-2">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Đề xuất cải thiện</p>
                      <p className="text-sm text-muted-foreground">{feedback.suggestions}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {feedbacks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Chưa có đánh giá nào.
        </div>
      )}
    </div>
  );
}
