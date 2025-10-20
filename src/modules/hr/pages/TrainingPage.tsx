import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  GraduationCap,
  FileText,
  ClipboardCheck,
  Lightbulb,
  Target,
  MessageSquare
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { TrainingDashboardTab } from '../components/training/TrainingDashboardTab';
import { CourseListTab } from '../components/training/CourseListTab';
import { SessionListTab } from '../components/training/SessionListTab';
import { EnrollmentListTab } from '../components/training/EnrollmentListTab';
import { CompetencyMatrixTab } from '../components/training/CompetencyMatrixTab';
import { RecommendationsTab } from '../components/training/RecommendationsTab';

export function TrainingPage() {
  const { hasFeatureAccess } = usePermissions();
  const canManageTraining = hasFeatureAccess('manage_training') || hasFeatureAccess('full_access');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Đào Tạo & Phát Triển</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý chương trình đào tạo, phát triển năng lực nhân viên
          </p>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 gap-2">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Tổng Quan</span>
          </TabsTrigger>
          
          {canManageTraining && (
            <>
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Khóa Học</span>
              </TabsTrigger>
              
              <TabsTrigger value="sessions" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Lớp Học</span>
              </TabsTrigger>
            </>
          )}
          
          <TabsTrigger value="enrollments" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Học Viên</span>
          </TabsTrigger>

          {canManageTraining && (
            <>
              <TabsTrigger value="quizzes" className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Kiểm Tra</span>
              </TabsTrigger>
              
              <TabsTrigger value="materials" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Tài Liệu</span>
              </TabsTrigger>
            </>
          )}
          
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Đề Xuất</span>
          </TabsTrigger>
          
          <TabsTrigger value="competency" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Năng Lực</span>
          </TabsTrigger>
          
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Đánh Giá</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <TrainingDashboardTab />
        </TabsContent>

        {canManageTraining && (
          <>
            <TabsContent value="courses" className="space-y-4">
              <CourseListTab />
            </TabsContent>

            <TabsContent value="sessions" className="space-y-4">
              <SessionListTab />
            </TabsContent>
          </>
        )}

        <TabsContent value="enrollments" className="space-y-4">
          <EnrollmentListTab />
        </TabsContent>

        {canManageTraining && (
          <>
            <TabsContent value="quizzes" className="space-y-4">
              <Card className="p-6">
                <p className="text-muted-foreground">Quiz Management - Coming soon</p>
              </Card>
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              <Card className="p-6">
                <p className="text-muted-foreground">Learning Materials - Coming soon</p>
              </Card>
            </TabsContent>
          </>
        )}

        <TabsContent value="recommendations" className="space-y-4">
          <RecommendationsTab />
        </TabsContent>

        <TabsContent value="competency" className="space-y-4">
          <CompetencyMatrixTab />
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card className="p-6">
            <p className="text-muted-foreground">Training Feedback - Coming soon</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
