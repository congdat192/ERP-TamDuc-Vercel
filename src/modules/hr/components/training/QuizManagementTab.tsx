import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, BookOpen, Clock, Award } from 'lucide-react';
import { TrainingQuizService } from '../../services/trainingQuizService';

type TrainingQuiz = {
  id: string;
  program_id?: string;
  title: string;
  quiz_type: string;
  total_questions: number;
  time_limit_minutes?: number;
  passing_score?: number;
};
import { CreateQuizModal } from './CreateQuizModal';

export function QuizManagementTab() {
  const [quizzes, setQuizzes] = useState<TrainingQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toast } = useToast();

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      // For now, load quizzes for all programs (you may want to filter by program)
      const data = await TrainingQuizService.getQuizzesByProgram('all');
      setQuizzes(data);
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
    loadQuizzes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa bài kiểm tra này?')) return;
    
    try {
      await TrainingQuizService.deleteQuiz(id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa bài kiểm tra',
      });
      loadQuizzes();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản Lý Bài Kiểm Tra</h2>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo Bài Kiểm Tra
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{quiz.title}</CardTitle>
                <Badge variant={quiz.quiz_type === 'post_test' ? 'default' : 'secondary'}>
                  {quiz.quiz_type === 'post_test' ? 'Sau khóa' : quiz.quiz_type === 'pre_test' ? 'Trước khóa' : 'Giữa khóa'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{quiz.total_questions} câu hỏi</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{quiz.time_limit_minutes} phút</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="h-4 w-4" />
                <span>Điểm đạt: {quiz.passing_score}%</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => window.open(`/quiz/${quiz.id}`, '_blank')}
                >
                  Xem Chi Tiết
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(quiz.id)}
                >
                  Xóa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {quizzes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Chưa có bài kiểm tra nào. Nhấn "Tạo Bài Kiểm Tra" để bắt đầu.
        </div>
      )}

      <CreateQuizModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          loadQuizzes();
          setShowCreateModal(false);
        }}
      />
    </div>
  );
}
